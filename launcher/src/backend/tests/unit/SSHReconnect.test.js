// A 100ms setInterval used to grow the pool while it held fewer than six connections. In a
// blackhole nothing reached "ready", so it dialled ~10x/s until sshd's MaxStartups and fail2ban
// refused the client at the TCP layer - the next login was rejected instantly, not timed out.

const mockCtl = { built: [], readyMode: "ready" };

jest.mock("ssh2", () => {
  const { EventEmitter } = require("events");
  class FakeClient extends EventEmitter {
    constructor() {
      super();
      this._chanMgr = { _count: 0 };
      this.ended = false;
      global.__sshMock.built.push(this);
    }
    connect() {
      if (global.__sshMock.readyMode === "ready") {
        setTimeout(() => this.emit("ready"), 0);
        return;
      }
      if (global.__sshMock.readyMode === "manual") return; // the test drives "ready" by hand
      // blackhole: nothing answers, ssh2 only gives up on readyTimeout (shortened here)
      setTimeout(() => this.emit("error", new Error("Timed out while waiting for handshake")), 10);
    }
    exec(cmd, cb) {
      const { EventEmitter: EE } = require("events");
      const stream = new EE();
      stream.stderr = new EE();
      this.lastStream = stream;
      cb(null, stream);
      if (!cmd.includes("HANG") && !global.__sshMock.hangEverything) setTimeout(() => stream.emit("close", 0), 0);
    }
    end() {
      this.ended = true;
      this.emit("close");
    }
  }
  return { Client: FakeClient, utils: { generateKeyPairSync: () => ({}) } };
});

global.__sshMock = mockCtl;

const mockPing = { alive: true };
jest.mock("ping", () => ({
  promise: { probe: async () => ({ alive: global.__pingMock.alive, time: global.__pingMock.alive ? 12 : "unknown" }) },
}));
global.__pingMock = mockPing;

const { SSHService } = require("../../SSHService.js");

const INFO = { host: "10.0.0.1", port: 22, user: "root", password: "x" };
const REAL_DELAYS = SSHService.RECONNECT_DELAYS_MS;

const settle = (ms = 20) => new Promise((r) => setTimeout(r, ms));

beforeEach(() => {
  mockCtl.built = [];
  mockCtl.readyMode = "ready";
  mockCtl.hangEverything = false;
  mockPing.alive = true;
  SSHService.RECONNECT_DELAYS_MS = [20, 20, 20];
  SSHService.VERIFY_TIMEOUT_MS = 30;
});

afterEach(() => {
  SSHService.RECONNECT_DELAYS_MS = REAL_DELAYS;
});

test("constructing the service starts no background connection timer", async () => {
  const ssh = new SSHService();
  ssh.connectionInfo = INFO;

  await settle(300); // the old poller would have opened ~30 connections

  expect(mockCtl.built).toHaveLength(0);
});

test("a blackholed network does not produce a connection storm", async () => {
  const ssh = new SSHService();
  mockCtl.readyMode = "blackhole";
  ssh.connectionInfo = INFO;

  const attempts = [ssh.acquireConnection(), ssh.acquireConnection(), ssh.acquireConnection()];
  await settle(300);

  // single-flight: three callers share one dial, and no timer adds more
  expect(mockCtl.built).toHaveLength(1);
  void attempts;
});

test("a dead transport leaves the pool and the service stops reporting connected", async () => {
  const ssh = new SSHService();
  await ssh.connect(INFO);
  expect(ssh.connectionPool).toHaveLength(1);
  expect(ssh.connected).toBe(true);

  mockCtl.readyMode = "blackhole"; // no reconnect should succeed
  ssh.connectionPool[0].emit("close");

  expect(ssh.connectionPool).toHaveLength(0);
  expect(ssh.connected).toBe(false);
  ssh.reconnectAbort?.abort();
});

test("losing an established connection retries on the backoff schedule, one at a time", async () => {
  const ssh = new SSHService();
  await ssh.connect(INFO);
  const first = ssh.connectionPool[0];
  mockCtl.built = [];

  mockCtl.readyMode = "blackhole";
  first.emit("close");
  await settle(200); // spans all three stubbed 20ms delays

  // bounded by the schedule, never the old ~10/s
  expect(mockCtl.built.length).toBeLessThanOrEqual(SSHService.RECONNECT_DELAYS_MS.length);
  expect(ssh.lastState).toBe("disconnected");
});

test("a successful backoff attempt restores the connection", async () => {
  const ssh = new SSHService();
  await ssh.connect(INFO);
  const first = ssh.connectionPool[0];

  mockCtl.readyMode = "blackhole";
  first.emit("close");
  expect(ssh.connectionPool).toHaveLength(0);

  mockCtl.readyMode = "ready"; // the VPN comes back
  await settle(200);

  expect(ssh.connectionPool.length).toBeGreaterThan(0);
  expect(ssh.connected).toBe(true);
  expect(ssh.lastState).toBe("connected");
});

test("disconnect() does not throw when verification was cancelled", async () => {
  const ssh = new SSHService();
  await ssh.connect(INFO);

  // cancelVerification() nulls connectionInfo but leaves the pool; disconnect() used to
  // deref connectionInfo.host before its try block and throw - an instant login rejection
  ssh.cancelVerification();
  expect(ssh.connectionInfo).toBeNull();

  await expect(ssh.disconnect(true)).resolves.toBe(true);
});

test("an intentional disconnect does not trigger a reconnect", async () => {
  const ssh = new SSHService();
  await ssh.connect(INFO);
  mockCtl.built = [];

  await ssh.disconnect();
  await settle(200);

  expect(mockCtl.built).toHaveLength(0);
  expect(ssh.reconnecting).toBe(false);
});

test("an intentional disconnect emits no state that would pop the reconnect modal", async () => {
  const seen = [];
  const ssh = new SSHService((state) => seen.push(state));
  await ssh.connect(INFO);
  expect(seen).toEqual(["connected"]);

  await ssh.disconnect();
  await settle(50);

  expect(seen).toEqual(["connected"]); // logout stays silent
  expect(ssh.lastState).toBeNull(); // ...but a later connect can announce itself again
});

test("the backoff reports which attempt it is on and how long until the next", async () => {
  const seen = [];
  const ssh = new SSHService((state, detail) => seen.push({ state, ...(detail ?? {}) }));
  await ssh.connect(INFO);

  mockCtl.readyMode = "blackhole";
  ssh.connectionPool[0].emit("close");
  await settle(200); // runs the whole stubbed schedule

  const waiting = seen.filter((e) => e.phase === "waiting");
  expect(waiting).toHaveLength(3);
  expect(waiting.map((e) => e.attempt)).toEqual([1, 2, 3]);
  expect(waiting.every((e) => e.total === 3)).toBe(true);
  expect(waiting.every((e) => e.waitMs === 20)).toBe(true);
  // each wait is followed by an actual dial the modal can label "Connecting..."
  expect(seen.filter((e) => e.phase === "connecting")).toHaveLength(3);
  expect(seen[seen.length - 1].state).toBe("disconnected");
});

test("logging out mid-reconnect discards a handshake that lands afterwards", async () => {
  const ssh = new SSHService();
  await ssh.connect(INFO);
  mockCtl.built = [];

  mockCtl.readyMode = "manual"; // the backoff's handshake will hang
  ssh.connectionPool[0].emit("close");
  await settle(60); // backoff fires and starts a handshake

  const inFlight = mockCtl.built[mockCtl.built.length - 1];
  expect(inFlight).toBeDefined();

  await ssh.disconnect(); // user clicks Logout on the reconnect modal
  expect(ssh.connectionPool).toHaveLength(0);

  inFlight.emit("ready"); // the hung handshake completes after logout
  await settle(30);

  // It must not resurrect the session: the main process outlives the renderer reload,
  // so a pooled connection here would stay open against a node the user logged out of.
  expect(ssh.connectionPool).toHaveLength(0);
  expect(ssh.connected).toBe(false);
});

test("an exec in flight settles instead of hanging when the transport dies", async () => {
  const ssh = new SSHService();
  await ssh.connect(INFO);
  const conn = ssh.connectionPool[0];

  let settled = null;
  const pending = ssh.execCommand("HANG").then((r) => (settled = r));
  await settle(20);
  expect(settled).toBeNull(); // still running, as expected

  mockCtl.readyMode = "blackhole";
  conn.emit("close"); // VPN switch kills the transport
  await pending;

  // Without this the 2s service refresh would await a dead link forever
  expect(settled).toEqual({ rc: -1, stdout: "", stderr: "Connection lost!" });
  ssh.reconnectAbort?.abort();
});

test("a stream error settles the exec rather than throwing in the main process", async () => {
  const ssh = new SSHService();
  await ssh.connect(INFO);
  const conn = ssh.connectionPool[0];

  const pending = ssh.execCommand("HANG");
  await settle(20);
  conn.lastStream.emit("error", new Error("channel blew up"));

  await expect(pending).resolves.toEqual({ rc: -1, stdout: "", stderr: "channel blew up" });
});

test("a run of failed pings drops a dead link without waiting for keepalive", async () => {
  const ssh = new SSHService();
  await ssh.connect(INFO);
  mockPing.alive = true;
  await ssh.checkConnectionQuality(); // establishes that ICMP works here

  // transport is dead but keepalive has not noticed yet, so execs hang
  mockCtl.readyMode = "blackhole";
  mockCtl.hangEverything = true;
  mockPing.alive = false;
  await ssh.checkConnectionQuality();
  await ssh.checkConnectionQuality(); // second failure crosses the threshold
  await settle(200); // verify's own 3s race is stubbed short below

  expect(ssh.connectionPool).toHaveLength(0);
  expect(ssh.connected).toBe(false);
  ssh.reconnectAbort?.abort();
  mockCtl.hangEverything = false;
});

test("pings that never worked are not treated as a connection loss", async () => {
  const ssh = new SSHService();
  await ssh.connect(INFO);

  mockPing.alive = false; // ICMP blocked on this host from the start
  for (let i = 0; i < 5; i++) await ssh.checkConnectionQuality();
  await settle(50);

  expect(ssh.connectionPool).toHaveLength(1); // left alone
  expect(ssh.connected).toBe(true);
});

test("tunnels are torn down when the transport dies, so ports are not leaked", async () => {
  const ssh = new SSHService();
  await ssh.connect(INFO);

  // stand-ins for the tunnel servers holding 9000/9001
  const closed = [];
  ssh.tunnels = [
    { server: { close: () => closed.push(9000) }, config: { localPort: 9000 } },
    { server: { close: () => closed.push(9001) }, config: { localPort: 9001 } },
  ];

  mockCtl.readyMode = "blackhole";
  ssh.connectionPool[0].emit("close");
  await settle(20);

  // otherwise the next reconnect allocates 9002, 9003, ... and creeps up the range
  expect(closed.sort()).toEqual([9000, 9001]);
  expect(ssh.tunnels).toHaveLength(0);
  ssh.reconnectAbort?.abort();
});

test("closing tunnels when there are none is not an error", async () => {
  const ssh = new SSHService();
  await expect(ssh.closeTunnels()).resolves.toBe("No Tunnels to Close!");
});

test("concurrent execs share a single new connection instead of opening one each", async () => {
  const ssh = new SSHService();
  ssh.connectionInfo = INFO;

  await Promise.all([ssh.execCommand("ls"), ssh.execCommand("ls"), ssh.execCommand("ls")]);

  expect(mockCtl.built).toHaveLength(1);
});
