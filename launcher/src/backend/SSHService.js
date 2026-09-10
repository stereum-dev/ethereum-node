const {
  Client,
  utils: { generateKeyPairSync },
} = require("ssh2");
import { pipeline } from "stream/promises";
import { createTunnel } from "./SSHServiceTunnel";
import { StringUtils } from "./StringUtils";
import * as fs from "fs";
import * as path from "path";
const log = require("electron-log");
const ping = require("ping");

export class SSHService {
  // Connections open lazily, never on a timer: a poll loop can't tell "slow" from "gone" and
  // buries sshd in half-open handshakes until MaxStartups/fail2ban lock the client out.
  static MAX_POOL_SIZE = 6;
  static MAX_SESSIONS_PER_CONNECTION = 5;
  static RECONNECT_DELAYS_MS = [2000, 5000, 15000, 30000, 60000];
  static KEEPALIVE_INTERVAL_MS = 10000;
  static KEEPALIVE_COUNT_MAX = 3;
  static READY_TIMEOUT_MS = 20000;

  constructor(onStateChange = null) {
    this.connectionPool = [];
    this.connectionInfo = null;
    this.connected = false;
    this.tunnels = [];
    this.rpcReceivedDatas = [];
    this.shellConn = null;
    this.shellStream = null;
    this.loggingOut = false;
    // "connected" | "reconnecting" | "disconnected", deduplicated
    this.onStateChange = onStateChange;
    this.lastState = null;
    this.lastStateKey = null;
    this.reconnecting = false;
    this.reconnectAbort = null;
    this.growing = null; // in-flight pool growth, shared so concurrent execs open one connection
    this.epoch = 0; // bumped on disconnect so a handshake still in flight is discarded, not pooled
  }

  emitState(state, detail = null) {
    const key = detail ? `${state}:${JSON.stringify(detail)}` : state;
    if (key === this.lastStateKey) return;
    this.lastStateKey = key;
    this.lastState = state;
    try {
      this.onStateChange?.(state, detail);
    } catch (err) {
      log.error("onStateChange listener threw: ", err);
    }
  }

  sleep(ms, signal) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(resolve, ms);
      signal.addEventListener(
        "abort",
        () => {
          clearTimeout(timer);
          reject(new Error("aborted"));
        },
        { once: true }
      );
    });
  }

  /** Drop a dead connection. Wired to "error", "end" and "close" so a blackholed transport
   * (a VPN switch) can't leave a corpse in the pool that makes the service look connected. */
  dropConnection(conn) {
    const before = this.connectionPool.length;
    this.connectionPool = this.connectionPool.filter((c) => c !== conn);
    if (this.connectionPool.length === before || this.connectionPool.length > 0) return;

    const wasConnected = this.lastState === "connected";
    this.connected = false;
    if (this.loggingOut) return; // intentional teardown
    if (wasConnected && !this.reconnecting) {
      this.reconnectWithBackoff();
    } else if (!this.reconnecting) {
      this.emitState("disconnected");
    }
  }

  /** Reconnect on the RECONNECT_DELAYS_MS schedule, one attempt in flight at a time. */
  async reconnectWithBackoff() {
    this.reconnectAbort?.abort();
    if (this.connectionPool.length > 0) return true;
    const abort = new AbortController();
    this.reconnectAbort = abort;
    this.reconnecting = true;
    const delays = SSHService.RECONNECT_DELAYS_MS;
    try {
      for (let i = 0; i < delays.length; i++) {
        const progress = { attempt: i + 1, total: delays.length };
        this.emitState("reconnecting", { ...progress, phase: "waiting", waitMs: delays[i] });
        try {
          await this.sleep(delays[i], abort.signal);
        } catch {
          return false; // aborted
        }
        if (this.loggingOut || !this.connectionInfo) return false;
        this.emitState("reconnecting", { ...progress, phase: "connecting" });
        try {
          await this.connect(this.connectionInfo);
          return true;
        } catch (err) {
          log.warn(`SSH :: reconnect attempt ${i + 1}/${delays.length} failed: ${err?.message || err}`);
        }
      }
      this.emitState("disconnected");
      return false;
    } finally {
      if (this.reconnectAbort === abort) {
        this.reconnecting = false;
        this.reconnectAbort = null;
      }
    }
  }

  /** Pooled connection with spare capacity, opening one if needed. Growth is single-flight. */
  async acquireConnection() {
    let conn = this.getConnectionFromPool();
    if (conn) return conn;
    if (this.loggingOut || !this.connectionInfo) return null;
    if (this.connectionPool.length >= SSHService.MAX_POOL_SIZE) {
      // saturated: reuse the least-loaded rather than opening past the cap
      return this.connectionPool.reduce((a, b) => (a._chanMgr._count <= b._chanMgr._count ? a : b), this.connectionPool[0]);
    }
    if (!this.growing) {
      this.growing = this.connect(this.connectionInfo)
        .catch((err) => {
          log.error("Failed opening an SSH connection: ", err);
          return null;
        })
        .finally(() => {
          this.growing = null;
        });
    }
    await this.growing;
    return this.getConnectionFromPool() ?? this.connectionPool[0] ?? null;
  }

  static checkExecError(err, accept_empty_result = false) {
    if (accept_empty_result) return err.rc != 0;
    return !err || err.rc != 0;
  }

  static extractExecError(err) {
    return err && err.stderr ? err.stderr : "<stderr empty>";
  }

  async checkSSHConnection(connectionInfo, timeout) {
    return new Promise((resolve, reject) => {
      const conn = new Client();

      conn.on("ready", () => {
        conn.end();
        resolve(true);
      });

      conn.on("error", (err) => {
        reject(err);
      });

      conn.on("banner", (msg) => {
        reject(msg);
      });

      conn.connect({
        host: connectionInfo.host,
        port: parseInt(connectionInfo.port) || 22,
        username: connectionInfo.user || "root",
        password: connectionInfo.password || undefined,
        privateKey: connectionInfo.privateKey || undefined,
        passphrase: connectionInfo.passphrase || undefined,
        tryKeyboard: true,
        readyTimeout: timeout, // Set the readyTimeout parameter
      });
    });
  }

  // Check the connection quality by pinging the host
  async checkConnectionQuality() {
    const host = this.connectionInfo.host;
    let connectionQuality = { pingTime: null };

    try {
      const res = await ping.promise.probe(host, {
        timeout: 2,
      });

      if (typeof res.time !== "undefined" && res.time !== null) {
        connectionQuality.pingTime = res.time;
      } else {
        console.log(`Ping to ${host} failed or timed out`);
      }
    } catch (err) {
      console.error("Ping failed:", err);
    }
    return connectionQuality;
  }

  /** Least-loaded connection with spare capacity, or undefined. Never opens one. */
  getConnectionFromPool() {
    const candidates = this.connectionPool.filter((c) => c._chanMgr._count < SSHService.MAX_SESSIONS_PER_CONNECTION);
    if (candidates.length === 0) return undefined;
    return candidates.reduce((a, b) => (a._chanMgr._count <= b._chanMgr._count ? a : b));
  }

  async connect(connectionInfo, currentWindow = null) {
    this.connectionInfo = connectionInfo;
    const epoch = this.epoch;
    let conn = new Client();
    let passwordBanner = false;
    return new Promise((resolve, reject) => {
      conn.on("error", (error) => {
        log.error(error);
        this.dropConnection(conn);
        reject(error);
      });
      conn.on("end", () => {
        this.dropConnection(conn);
      });
      conn.on("close", () => {
        this.dropConnection(conn);
      });
      //only works for ubuntu 22.04
      conn.on("banner", (msg) => {
        if (new RegExp(/^(?=.*\bchange\b)(?=.*\bpassword\b).*$/gm).test(msg.toLowerCase())) {
          passwordBanner = true;
          if (process.env.NODE_ENV === "test") {
            resolve(conn);
          }
          reject(msg);
        }
      });
      conn.on("keyboard-interactive", function (name, instructions, lang, prompts, finish) {
        let responses = [];
        let otp = false;

        for (let prompt of prompts) {
          if (/password/i.test(prompt.prompt)) {
            responses.push(connectionInfo.password || "");
          } else if (/verification code/i.test(prompt.prompt)) {
            if (!connectionInfo.authCode) {
              otp = true;
              break;
            }
            responses.push(connectionInfo.authCode.toString());
          } else {
            responses.push("");
          }
        }
        if (otp) {
          currentWindow?.send("require2FA", true);
          conn.end();
          return;
        }
        finish(responses);
      });
      conn
        .on("ready", async () => {
          if (epoch !== this.epoch) {
            // logged out (or torn down) while this handshake was in flight
            conn.end();
            return reject(new Error("SSH connection superseded"));
          }
          this.connectionPool.push(conn);
          this.connected = true;
          this.emitState("connected");
          if (!passwordBanner) {
            if (this.connectionPool.length === 1) {
              let test = await this.exec("ls");
              if (new RegExp(/^(?=.*\bchange\b)(?=.*\bpassword\b).*$/gm).test(test.stderr.toLowerCase())) {
                if (process.env.NODE_ENV === "test") {
                  resolve(conn);
                }
                reject(test.stderr);
              }
            }
            resolve(conn);
          }
        })
        .connect({
          host: connectionInfo.host,
          port: parseInt(connectionInfo.port) || 22,
          username: connectionInfo.user || "root",
          password: connectionInfo.password || undefined,
          privateKey: connectionInfo.privateKey || undefined,
          passphrase: connectionInfo.passphrase || undefined,
          keepaliveInterval: SSHService.KEEPALIVE_INTERVAL_MS,
          keepaliveCountMax: SSHService.KEEPALIVE_COUNT_MAX,
          tryKeyboard: true,
          readyTimeout: SSHService.READY_TIMEOUT_MS,
        });
    });
  }

  cancelVerification() {
    this.connectionInfo = null;
  }

  async disconnect(reconnecting = false) {
    this.loggingOut = true;
    this.epoch++;
    this.reconnectAbort?.abort(); // else backoff races the teardown and reopens what we're closing
    this.reconnecting = false;
    try {
      // connectionInfo is null after cancelVerification(); an unguarded deref here threw
      log.info("DISCONNECT: connectionInfo", this.connectionInfo?.host ?? "<none>");
      this.connected = false;
      if (!reconnecting) {
        this.connectionInfo = null;
      }
      let counter = 0;
      while (this.connectionPool.length > 0 && counter < 30) {
        this.connectionPool.forEach((conn) => {
          if (conn._chanMgr?._count == 0) {
            conn.end();
            this.connectionPool = this.connectionPool.filter((c) => c !== conn);
          }
        });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        counter++;
      }
      log.info(
        "SSH Channels left open: ",
        this.connectionPool
          .map((c) => c._chanMgr?._count)
          .reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
          }, 0)
      );
      this.connectionPool = [];
      return true;
    } catch (error) {
      return error;
    } finally {
      this.loggingOut = false;
      // Stay silent: an intentional teardown must not pop the reconnect modal on logout.
      // Clearing lastState lets the next connect() emit "connected" again.
      this.lastState = null;
      this.lastStateKey = null;
    }
  }

  async exec(command, useSudo = true, useRoot = true) {
    const ensureSudoCommand = `sudo -u ${useRoot ? "root" : this.connectionInfo.user} -i <<'=====EOF'\n` + command + `\n=====EOF`;
    return this.execCommand(useSudo ? ensureSudoCommand : command);
  }

  async execCommand(command) {
    if (this.loggingOut) return { rc: -1, stdout: "", stderr: "Logging Out!" };
    const conn = await this.acquireConnection();
    // an empty pool would otherwise surface as a TypeError on conn.exec
    if (!conn) return { rc: -1, stdout: "", stderr: "Not connected!" };
    return new Promise((resolve, reject) => {
      const data = {
        rc: -1,
        stdout: "",
        stderr: "",
      };
      conn.exec(command, (err, stream) => {
        if (err) {
          log.error("ERROR:", err);
          return reject(err);
        }
        stream
          .on("close", (code) => {
            data.rc = code;
            resolve(data);
          })
          .on("data", (stdout) => {
            data.stdout += stdout.toString("utf8");
          })
          .stderr.on("data", (stderr) => {
            log.debug("stderr got data", stderr.toString("utf8"));
            data.stderr += stderr.toString("utf8");
          });
      });
    });
  }

  async tunnel(tunnelConfig) {
    return new Promise((resolve, reject) => {
      const tunnelOptions = {
        autoClose: false,
      };
      const serverOptions = {
        port: tunnelConfig.localPort,
      };
      const sshOptions = {
        keepAlive: true,
        host: this.connectionInfo.host,
        port: this.connectionInfo.port || 22,
        username: this.connectionInfo.user || "root",
        password: this.connectionInfo.password,
        privateKey: this.connectionInfo.privateKey || undefined,
        passphrase: this.connectionInfo.passphrase || undefined,
        tryKeyboard: true,
      };
      const forwardOptions = {
        srcAddr: "localhost",
        srcPort: tunnelConfig.localPort,
        dstAddr: "localhost",
        dstPort: tunnelConfig.dstPort,
      };

      createTunnel(tunnelOptions, serverOptions, sshOptions, forwardOptions).then(([server, conn], error) => {
        if (error) {
          log.error("Tunnel Connection failed!");
          return reject(error);
        }
        log.info(`Tunnel Connection established! (${tunnelConfig.localPort})`);
        this.tunnels.push({ server: server, config: tunnelConfig });
        resolve(server);

        conn.on("error", function (error) {
          log.error("Tunnel SSH Connection error: ", error);
        });

        server.on("error", function (error) {
          log.error("Tunnel connection error: ", error);
        });

        if (tunnelConfig && tunnelConfig.sName) {
          server.on("connection", (connection) => {
            // Forward the connection to the destination address and port
            conn.forwardOut(
              forwardOptions.srcAddr,
              forwardOptions.srcPort,
              forwardOptions.dstAddr,
              forwardOptions.dstPort,
              (err, stream) => {
                if (err) {
                  log.error("Forwarding error: ", err);
                  return;
                }
                // Track data size for el rpc
                connection.on("data", (data) => {
                  stream.write(data);
                  this.handleReceivedData(data.length, forwardOptions.srcPort);
                });

                connection.on("end", () => {
                  stream.end();
                });
                stream.on("end", () => {
                  connection.end();
                });

                connection.on("error", (error) => {
                  log.error("Connection error: ", error);
                  stream.end();
                });

                stream.on("error", (error) => {
                  log.error("Stream error: ", error);
                  connection.end();
                });

                connection.on("close", () => {
                  stream.destroy();
                });
                stream.on("close", () => {
                  connection.destroy();
                });
              }
            );
          });
        }
      });
    });
  }

  /**
   * Handles the received data by storing it in the rpcReceivedDatas array.
   * @param {number} dataLength - The length of the received data (byte).
   * @param {number} srcPort - The source port.
   */
  async handleReceivedData(dataLength, srcPort) {
    try {
      const receivedData = {
        receivedDataLength: dataLength,
        srcPort: srcPort,
      };
      this.rpcReceivedDatas.push(receivedData);
    } catch (error) {
      console.error("Error handling received data:", error);
    }
  }

  /**
   * Retrieves and clears the stored received data.
   * @returns {Array} - The array of received data objects.
   */
  async getRPCReceivedData() {
    try {
      const dataToReturn = [...this.rpcReceivedDatas];
      this.rpcReceivedDatas = [];
      return dataToReturn;
    } catch (error) {
      console.error("Error retrieving and clearing received data:", error);
      return [];
    }
  }

  async closeTunnels(onlySpecificPorts = []) {
    return new Promise((resolve, reject) => {
      let i = this.tunnels.length;
      if (i > 0) {
        while (i--) {
          // loop backwards to splice array from specific ports
          let tunnel = this.tunnels[i];
          if (Array.isArray(onlySpecificPorts) && onlySpecificPorts.length && !onlySpecificPorts.includes(tunnel.config.localPort)) {
            continue;
          }
          tunnel.server.close();
          this.tunnels.splice(i, 1);
          log.info(`Tunnel Connection closed! (${tunnel.config.localPort})`);
        }
        resolve("Tunnels Closed!");
      } else {
        reject("No Tunnels to Close!");
      }
    });
  }

  async changePassword(password) {
    try {
      const result = await this.exec(`echo -e "${this.connectionInfo.user}:${password}" | chpasswd`);
      if (SSHService.checkExecError(result)) {
        throw new Error("Failed changing password: " + SSHService.extractExecError(result));
      }
      this.connectionInfo.password = password;
      return "Password changed successfully!";
    } catch (error) {
      log.error("Failed changing password: ", error);
    }
  }

  async generateSSHKeyPair(opts = {}) {
    if (opts.pickPath.endsWith("/")) opts.pickPath = opts.pickPath.slice(0, -1, ""); //if path ends with '/' remove it
    try {
      //default bit values for keys
      if (!opts.bits) {
        switch (opts.keyType.toLowerCase()) {
          case "rsa": {
            opts.bits = 4096;
            break;
          }
          case "ecdsa": {
            opts.bits = 521;
            break;
          }
          case "ed25519": {
            break;
          }
        }
      }

      //Make sure opts.bits is an integer
      opts.bits = parseInt(opts.bits);

      //if passphrase is set but cipher is not, set cipher to aes256-cbc
      if (opts.passphrase && !opts.cipher) opts = { ...opts, ...{ cipher: "aes256-cbc" } };

      //Set SSH Key Comment
      opts.comment = "StereumSSHKey";

      //generate Keypair read exiting ones and write to file
      const keyPair = generateKeyPairSync(opts.keyType, opts);
      let exitingKeys = await this.readSSHKeyFile();
      if (keyPair.public) {
        let allKeys = [...exitingKeys, keyPair.public];
        await this.writeSSHKeyFile(allKeys);
        const savePath = path.join(opts.pickPath, opts.keyType.toLowerCase());
        await fs.promises.writeFile(savePath, keyPair.private);
        await fs.promises.writeFile(savePath + ".pub", keyPair.public);
        return allKeys;
      }
      return exitingKeys;
    } catch (err) {
      log.error("Failed generating key pair: ", err);
    }
  }

  async readSSHKeyFile(sshDirPath = `~/.ssh`) {
    let authorizedKeys = [];
    if (this.connected) {
      try {
        if (sshDirPath.endsWith("/")) sshDirPath = sshDirPath.slice(0, -1, ""); //if path ends with '/' remove it
        let result = await this.exec(`cat ${sshDirPath}/authorized_keys`, false);
        if (SSHService.checkExecError(result)) {
          throw new Error("Failed reading authorized keys:\n" + SSHService.extractExecError(result));
        }
        authorizedKeys = result.stdout.split("\n").filter((e) => e); // split in new lines and remove empty lines
      } catch (err) {
        log.error("Can't read authorized keys ", err);
        return [];
      }
    } else {
      log.error("SSH not connected, can't read authorized keys");
    }
    return authorizedKeys;
  }

  async writeSSHKeyFile(keys = [], sshDirPath = `~/.ssh`) {
    try {
      if (sshDirPath.endsWith("/")) sshDirPath = sshDirPath.slice(0, -1, ""); //if path ends with '/' remove it
      let newKeys = keys.join("\n");
      let result = await this.exec(`echo -e ${StringUtils.escapeStringForShell(newKeys)} > ${sshDirPath}/authorized_keys`, false);
      if (SSHService.checkExecError(result)) {
        throw new Error("Failed writing authorized keys:\n" + SSHService.extractExecError(result));
      }
    } catch (err) {
      log.error("Can't write authorized keys ", err);
      return [];
    }
    return keys;
  }

  /**
   * Checks if mode is a directory with fs constants https://nodejs.org/api/fs.html#fsconstants.
   * `S_IFMT` is a bit mask used to extract the file type code.
   * `S_IFDIR` is a file type constant for a directory.
   * @param {Integer} mode
   * @returns `True` if mode is a directory, `False` otherwise
   */
  isDir(mode) {
    return (mode & fs.constants.S_IFMT) == fs.constants.S_IFDIR;
  }

  /**
   * Get an SFTP session object from the connection pool.
   * Optionally takes a ssh session object as an argument, otherwise it will get a new connection from the pool.
   * @param {Client} [conn]
   * @returns sftp session object
   */
  async getSFTPSession(conn = null) {
    conn = conn ?? (await this.acquireConnection());
    if (!conn) throw new Error("SSH not connected, can't open an SFTP session");
    return new Promise((resolve, reject) => {
      conn.sftp((err, sftp) => {
        if (err) {
          log.error("Failed to open SFTP session: ", err);
          reject(null);
        }
        resolve(sftp);
      });
    });
  }

  /**
   * Reads a directory's contents from remotePath using SFTP
   * @param {String} remotePath
   * @param {SFTP Session} [sftp]
   * @returns Array of objects containing filename and mode of the contents of a given directory on the remote server.
   */
  async readDirectorySFTP(remotePath, sftp = null) {
    if (!sftp) {
      sftp = await this.getSFTPSession();
    }
    return new Promise((resolve, reject) => {
      sftp.readdir(remotePath, (err, array) => {
        if (err) {
          log.error("Failed to read directory: ", err);
          reject(null);
        }
        resolve(array);
      });
    });
  }

  /**
   * Returns an array of objects containing filename and mode of the contents of a given directory on the remote server.
   * Workaround for readdir not running with sudo permissions.
   * @param {String} remotePath
   * @returns
   */
  async readDirectorySSH(remotePath) {
    try {
      const result = await this.exec(`find ${remotePath} -maxdepth 1 -exec stat --format '%n\n%f' {} +`);
      if (SSHService.checkExecError(result)) {
        throw new Error("Failed reading directory: " + SSHService.extractExecError(result));
      }
      const lines = result.stdout.split("\n").filter((e) => e);
      const files = [];
      for (let i = 0; i + 1 < lines.length; i += 2) {
        let filename = path.posix.basename(path.posix.normalize(lines[i])); // normalize path
        const mode = parseInt(lines[i + 1], 16); // convert mode from hex to integer
        files.push({ filename, mode });
      }
      files.shift(); //remove the first element which is the directory itself
      return files;
    } catch (error) {
      log.error("Failed reading directory via SSH: ", error);
      return [];
    }
  }

  /**
   * Reads a directory's contents from localPath
   * @param {String} localPath
   * @returns Array of Dirent objects or an empty array on error
   */
  async readDirectoryLocal(localPath) {
    try {
      const filenames = await fs.promises.readdir(localPath, { withFileTypes: true });
      return filenames;
    } catch (error) {
      console.error("Failed reading local directory: ", error);
      return [];
    }
  }

  /**
   * Downloads a file from remotePath to localPath.
   * Uses "cat" to get file contents and pipes that stream to a local write stream.
   * This is a workaround for the lack of sudo permissions with sftp createReadStream.
   * @param {String} remotePath
   * @param {String} localPath
   * @param {Client} [conn]
   * @returns `void`
   */
  async downloadFileSSH(remotePath, localPath, conn = null) {
    conn = conn ?? (await this.acquireConnection());
    return new Promise((resolve, reject) => {
      conn.exec(`sudo cat ${StringUtils.escapeStringForShell(remotePath)}`, async (err, stream) => {
        try {
          if (err) throw err;
          const writeStream = fs.createWriteStream(localPath);
          stream.on("error", (error) => {
            writeStream.close();
            fs.unlinkSync(localPath);
            reject(new Error("Failed to read remote file: " + error.message));
          });

          await pipeline(stream, writeStream);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  /**
   * Downloads a Directory and all its contents recursively from the remotePath to the localPath
   * @param {String} remotePath
   * @param {String} localPath
   * @param {Client} [conn]
   * @returns `true` if download was successful, `false` otherwise
   */
  async downloadDirectorySSH(remotePath, localPath, conn = null) {
    conn = conn ?? (await this.acquireConnection());
    try {
      if (!fs.existsSync(localPath)) {
        fs.mkdirSync(localPath, { recursive: true });
      }

      const dirContents = await this.readDirectorySSH(remotePath);
      for (let item of dirContents) {
        const remoteFilePath = path.posix.join(remotePath, item.filename);
        const localFilePath = path.join(localPath, item.filename);

        if (this.isDir(item.mode)) {
          await this.downloadDirectorySSH(remoteFilePath, localFilePath, conn);
        } else {
          await this.downloadFileSSH(remoteFilePath, localFilePath);
        }
      }
      return true;
    } catch (error) {
      log.error("Failed to download directory via SSH: ", error);
      return false;
    }
  }
  /**
   * Uploads a file from localPath to remotePath
   * @param {String} localPath
   * @param {String} remotePath
   * @param {Client} [conn]
   * @returns `void`
   */
  async uploadFileSSH(localPath, remotePath, conn = null) {
    conn = conn ?? (await this.acquireConnection());
    return new Promise((resolve, reject) => {
      conn.exec(`sudo cat > ${StringUtils.escapeStringForShell(remotePath)}`, async (err, stream) => {
        try {
          if (err) throw err;
          const readStream = fs.createReadStream(localPath);
          // Handle read stream errors
          readStream.on("error", (error) => {
            stream.end();
            reject(new Error("Failed to read local file: " + error.message));
          });

          // pipeline ends destination stream when the source ends
          await pipeline(readStream, stream);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }
  /**
   * Ensures that the remotePath exists and is owned by the current user
   * @param {String} remotePath
   * @param {Client} [conn]
   */
  async ensureRemotePathExists(remotePath, conn = null) {
    conn = conn ?? (await this.acquireConnection());
    return new Promise((resolve, reject) => {
      conn.exec(`sudo mkdir -p ${remotePath} && sudo chown ${this.connectionInfo.user} ${remotePath}`, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  /**
   * Uploads a directory and all its contents recursively from the localPath to the remotePath
   * @param {String} localPath
   * @param {String} remotePath
   * @param {Client} [conn]
   * @returns `true` if upload was successful, `false` otherwise
   */
  async uploadDirectorySSH(localPath, remotePath, conn = null) {
    try {
      if (!conn) {
        conn = await this.acquireConnection();
      }

      await this.ensureRemotePathExists(remotePath);

      const dirContents = await this.readDirectoryLocal(localPath);
      for (let item of dirContents) {
        const remoteFilePath = path.posix.join(remotePath, item.name);
        const localFilePath = path.join(localPath, item.name);
        if (item.isDirectory()) {
          await this.uploadDirectorySSH(localFilePath, remoteFilePath, conn);
        } else {
          await this.uploadFileSSH(localFilePath, remoteFilePath, conn);
        }
      }
      return true;
    } catch (error) {
      log.error("Failed to upload directory via SSH: ", error);
      return false;
    }
  }

  async startShell(connectionInfo, onDataCallback, onErrorCallback) {
    return new Promise((resolve, reject) => {
      this.shellConn = new Client();

      this.shellConn.on("ready", () => {
        console.info("Client :: ready");
        this.shellConn.shell(
          {
            pty: {
              term: "xterm-256color",
              cols: process.stdout.columns,
              rows: process.stdout.rows,
            },
          },
          (err, stream) => {
            if (err) {
              onErrorCallback(err);
              reject(err);
              return;
            }

            this.shellStream = stream;

            stream.on("data", (data) => {
              onDataCallback(data);
            });

            stream
              .on("close", () => {
                console.info("Stream :: close");
                if (this.shellConn) {
                  this.shellConn.end();
                }
              })
              .stderr.on("data", onErrorCallback);

            resolve(this);
          }
        );
      });

      this.shellConn.on("error", (err) => {
        onErrorCallback(err);
        reject(err);
        return;
      });

      this.shellConn.connect({
        host: connectionInfo.host,
        port: parseInt(connectionInfo.port) || 22,
        username: connectionInfo.user || "root",
        password: connectionInfo.password || undefined,
        privateKey: connectionInfo.privateKey || undefined,
        passphrase: connectionInfo.passphrase || undefined,
        keepaliveInterval: 60000,
        tryKeyboard: true,
      });
    });
  }

  async executeCommand(command) {
    if (this.shellStream) {
      this.shellStream.write(command);
    } else {
      console.error("Shell not started");
    }
  }

  async stopShell() {
    try {
      if (this.shellStream) {
        this.shellStream.end();
        this.shellStream = null;
      }
      if (this.shellConn) {
        this.shellConn.end();
        this.shellConn = null;
      }
    } catch (error) {
      console.error("An error occurred while stopping the shell:", error);
    }
  }
}
