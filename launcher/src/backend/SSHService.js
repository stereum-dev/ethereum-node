const { Client, utils: { generateKeyPairSync } } = require("ssh2");
import { createTunnel } from "./SSHServiceTunnel";
import { StringUtils } from "./StringUtils";
import { writeFile } from "fs/promises";
const log = require("electron-log");

export class SSHService {
  constructor() {
    this.connectionPool = [];
    this.connectionInfo = null;
    this.connected = false;
    this.tunnels = [];
    this.addingConnection = false;
    this.removeConnectionCount = 0;
    this.checkPoolPolling = setInterval(async () => {
      await this.checkConnectionPool();
    }, 100);
  }

  static checkExecError(err) {
    return !err || err.rc != 0;
  }

  static extractExecError(err) {
    return err && err.stderr ? err.stderr : "<stderr empty>";
  }

  async checkSSHConnection(connectionInfo, timeout) {
    return new Promise((resolve, reject) => {
      const conn = new Client();

      conn.on('ready', () => {
        conn.end();
        resolve(true);
      });

      conn.on('error', (err) => {
        reject(err);
      });

      conn.on('banner', (msg) => {
        reject(msg)
      });

      conn.connect({
        host: connectionInfo.host,
        port: parseInt(connectionInfo.port) || 22,
        username: connectionInfo.user || "root",
        password: connectionInfo.password || undefined,
        privateKey: connectionInfo.privateKey || undefined,
        passphrase: connectionInfo.passphrase || undefined,
        readyTimeout: timeout, // Set the readyTimeout parameter 
      });
    });
  }

  async checkConnectionPool() {
    let lastIndex = this.connectionPool.length - 1
    const threshholdIndex = lastIndex - 2

    if (this.connectionInfo && !this.addingConnection && (this.connectionPool.length < 5 || this.connectionPool[threshholdIndex]?._chanMgr?._count > 0)) {
      await this.connect(this.connectionInfo)
    }
    if (this.connectionPool.length > 5 && this.connectionPool[threshholdIndex]?._chanMgr?._count === 0) {
      this.removeConnectionCount++
    } else {
      this.removeConnectionCount = 0;
    }
    if (this.removeConnectionCount > 100) {
      this.removeConnectionCount = 0;
      this.connectionPool.pop().end();
    }
  }

  getConnectionFromPool() {
    let conn
    let maxVal = 5
    while (!conn && maxVal < 10) {
      conn = (this.connectionPool.find(c => c._chanMgr._count < maxVal))
      maxVal++
    }
    return conn
  }

  async connect(connectionInfo) {
    this.connectionInfo = connectionInfo;
    this.addingConnection = true;
    const conn = new Client();
    return new Promise((resolve, reject) => {
      conn.on("error", (error) => {
        this.addingConnection = false;
        log.error(error)
        reject(error);
      });
      conn.on("close", () => {
      });
      //only works for ubuntu 22.04
      conn.on("banner", (msg) => {
        if (new RegExp(/^(?=.*\bchange\b)(?=.*\bpassword\b).*$/gm).test(msg.toLowerCase())) {
          if (process.env.NODE_ENV === "test") {
            resolve(conn);
          }
          reject(msg);
        }
      });
      conn.on("ready", async () => {
        this.connectionPool.push(conn);
        this.connected = true;
        this.addingConnection = false;
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
      })
        .connect({
          host: connectionInfo.host,
          port: parseInt(connectionInfo.port) || 22,
          username: connectionInfo.user || "root",
          password: connectionInfo.password || undefined,
          privateKey: connectionInfo.privateKey || undefined,
          passphrase: connectionInfo.passphrase || undefined,
          keepaliveInterval: 30000,
        });
    });
  }

  async disconnect() {
    log.info("DISCONNECT: connectionInfo", this.connectionInfo.host);

    return new Promise((resolve, reject) => {
      try {
        this.connected = false;
        this.connectionInfo = null;
        this.connectionPool.forEach((conn) => { conn.end(); });
        this.connectionPool = [];
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  async exec(command, useSudo = true) {
    const ensureSudoCommand = "sudo -u 'root' -i <<'=====EOF'\n" + command + "\n=====EOF";
    return this.execCommand(useSudo ? ensureSudoCommand : command);
  }

  async execCommand(command) {
    return new Promise((resolve, reject) => {
      let conn = this.getConnectionFromPool()

      const data = {
        rc: -1,
        stdout: "",
        stderr: "",
      };
      conn.exec(command, (err, stream) => {
        if (err) {
          log.error("ERROR:", err)
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
      });
    });
  }

  async closeTunnels(onlySpecificPorts = []) {
    return new Promise((resolve, reject) => {
      let i = this.tunnels.length;
      if (i > 0) {
        while (i--) {
          // loop backwards to splice array from specific ports
          let tunnel = this.tunnels[i];
          if (
            Array.isArray(onlySpecificPorts) &&
            onlySpecificPorts.length &&
            !onlySpecificPorts.includes(tunnel.config.localPort)
          ) {
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
      const result = await this.exec(`echo -e "${this.connectionInfo.user}:${password}" | chpasswd`)
      if (SSHService.checkExecError(result)) {
        throw new Error("Failed changing password: " + SSHService.extractExecError(result));
      }
      this.connectionInfo.password = password
      return "Password changed successfully!"
    } catch (error) {
      log.error("Failed changing password: ", error)
    }
  }

  async generateSSHKeyPair(opts = {}) {
    const path = require("path");
    if (opts.pickPath.endsWith("/")) opts.pickPath = opts.pickPath.slice(0, -1, ""); //if path ends with '/' remove it
    try {

      //default bit values for keys
      if (!opts.bits) {
        switch (opts.keyType.toLowerCase()) {
          case "rsa": {
            opts.bits = 4096
            break;
          }
          case "ecdsa": {
            opts.bits = 521
            break;
          }
          case "ed25519": {
            break;
          }
        }
      }

      //Make sure opts.bits is an integer
      opts.bits = parseInt(opts.bits)

      //if passphrase is set but cipher is not, set cipher to aes256-cbc
      if (opts.passphrase && !opts.cipher)
        opts = { ...opts, ...{ cipher: "aes256-cbc" } }

      //Set SSH Key Comment
      opts.comment = 'StereumSSHKey'

      //generate Keypair read exiting ones and write to file
      const keyPair = generateKeyPairSync(opts.keyType, opts)
      let exitingKeys = await this.readSSHKeyFile()
      if (keyPair.public) {
        let allKeys = [...exitingKeys, keyPair.public]
        await this.writeSSHKeyFile(allKeys)
        const savePath = path.join(opts.pickPath, opts.keyType.toLowerCase())
        await writeFile(savePath, keyPair.private)
        await writeFile(savePath + ".pub", keyPair.public)
        return allKeys
      }
      return exitingKeys
    } catch (err) {
      log.error("Failed generating key pair: ", err)
    }
  }

  async readSSHKeyFile(path = `~/.ssh`) {
    let authorizedKeys = []
    try {
      if (path.endsWith("/")) path = path.slice(0, -1, ""); //if path ends with '/' remove it
      let result = await this.exec(`cat ${path}/authorized_keys`);
      if (SSHService.checkExecError(result)) {
        throw new Error("Failed reading authorized keys:\n" + SSHService.extractExecError(result));
      }
      authorizedKeys = result.stdout.split("\n").filter((e) => e); // split in new lines and remove empty lines
    } catch (err) {
      log.error("Can't read authorized keys ", err);
      return []
    }
    return authorizedKeys;
  }

  async writeSSHKeyFile(keys = [], path = `~/.ssh`) {
    try {
      if (path.endsWith("/")) path = path.slice(0, -1, ""); //if path ends with '/' remove it
      let newKeys = keys.join("\n")
      let result = await this.exec(`echo -e ${StringUtils.escapeStringForShell(newKeys)} > ${path}/authorized_keys`);
      if (SSHService.checkExecError(result)) {
        throw new Error("Failed writing authorized keys:\n" + SSHService.extractExecError(result));
      }
    } catch (err) {
      log.error("Can't write authorized keys ", err);
      return []
    }
    return keys;
  }
}
