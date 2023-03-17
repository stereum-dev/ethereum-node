const { Client } = require("ssh2");
import { createTunnel } from "./SSHServiceTunnel";
const log = require("electron-log");

export class SSHService {
  constructor() {
    this.conn = null;
    this.connectionInfo = null;
    this.connected = false;
    this.tunnels = [];
  }

  static checkExecError(err) {
    return !err || err.rc != 0;
  }

  static extractExecError(err) {
    return err && err.stderr ? err.stderr : "<stderr empty>";
  }

  async connect(connectionInfo) {
    this.connectionInfo = connectionInfo;
    this.conn = new Client();

    return new Promise((resolve, reject) => {
      this.conn.on("error", (error) => {
        this.conn.end();
        reject(error);
      });
      this.conn.on("close", () => {
        this.connected = false;
      });
      //only works for ubuntu 22.04
      this.conn.on("banner", (msg) => {
        if (new RegExp(/^(?=.*\bchange\b)(?=.*\bpassword\b).*$/gm).test(msg.toLowerCase())) {
          if (process.env.NODE_ENV === "test") {
            resolve(this.conn);
          }
          reject(msg);
        }
      });
      this.conn
        .on("ready", async () => {
          let test = await this.exec("ls");
          if (new RegExp(/^(?=.*\bchange\b)(?=.*\bpassword\b).*$/gm).test(test.stderr.toLowerCase())) {
            if (process.env.NODE_ENV === "test") {
              resolve(this.conn);
            }
            reject(test.stderr);
          }
          this.connected = true;
          resolve(this.conn);
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

  async disconnect(connectionInfo) {
    log.info("DISCONNECT: connectionInfo", this.connectionInfo.host);

    return new Promise((resolve, reject) => {
      try {
        this.conn.end();
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
      const data = {
        rc: -1,
        stdout: "",
        stderr: "",
      };
      this.conn.exec(command, (err, stream) => {
        if (err) return reject(err);
        stream
          .on("close", (code, signal) => {
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
    return new Promise(async (resolve, reject) => {
      const config = {
        keepAlive: true,
        username: this.connectionInfo.user || "root",
        password: this.connectionInfo.password,
        host: this.connectionInfo.host,
        port: this.connectionInfo.port || 22,
        dstHost: "localhost",
        dstPort: tunnelConfig.dstPort,
        localHost: "localhost",
        localPort: tunnelConfig.localPort,
        privateKey: this.connectionInfo.privateKey || undefined,
        passphrase: this.connectionInfo.passphrase || undefined,
      };
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
}
