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
      cb(null, stream);
      setTimeout(() => stream.emit("close", 0), 0);
    }
    end() {
      this.ended = true;
      this.emit("close");
    }
  }
  return { Client: FakeClient, utils: { generateKeyPairSync: () => ({}) } };
});

global.__sshMock = mockCtl;

const { SSHService } = require("../../SSHService.js");

const INFO = { host: "10.0.0.1", port: 22, user: "root", password: "x" };
const REAL_DELAYS = SSHService.RECONNECT_DELAYS_MS;

const settle = (ms = 20) => new Promise((r) => setTimeout(r, ms));

beforeEach(() => {
  mockCtl.built = [];
  mockCtl.readyMode = "ready";
  SSHService.RECONNECT_DELAYS_MS = [20, 20, 20];
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

test("concurrent execs share a single new connection instead of opening one each", async () => {
  const ssh = new SSHService();
  ssh.connectionInfo = INFO;

  await Promise.all([ssh.execCommand("ls"), ssh.execCommand("ls"), ssh.execCommand("ls")]);

  expect(mockCtl.built).toHaveLength(1);
});
