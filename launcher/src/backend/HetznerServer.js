const { utils: { generateKeyPairSync } } = require('ssh2');
const log = require("electron-log");
const https = require("https");

export class HetznerServer {
  constructor() {
    this.apiToken = process.env.HCLOUD_TOKEN; // don't forget to set env variable "export HCLOUD_TOKEN=<your-hetzner-api-token>"
    this.serverID = null;
    this.serverName = null;
    this.serverIPv4 = null;
    this.serverRootPassword = null;
    this.sshKeyPair = generateKeyPairSync("ed25519")
  }

  async Sleep(ms) {
    let interval
    await new Promise((resolve) => { interval = setTimeout(resolve, ms) });
    clearInterval(interval);
  }

  async checkServerConnection(nodeConnection) {
    let tries = 0;
    let connected = false
    while (!connected && tries < 300) {
      try {
        tries++
        log.info(`Trying to connect (${tries})`)
        connected = await nodeConnection.sshService.checkSSHConnection(nodeConnection.nodeConnectionParams, 5000)
      } catch (err) {
        log.info(err)
      }
    }
  }

  /**
   * creates HTTPS options object
   * @param method {string} - Either "GET", "POST", "DELTE" or "PUT"
   * @param serverID {string} - Used to specify which server to target (optional)
   * @returns https options with given method and path
   */
  async createHTTPOptions(method, option, serverID, action) {
    serverID === undefined ? (serverID = "") : (serverID = "/" + serverID);
    action === undefined ? (action = "") : (action = "/actions/" + action);
    const options = {
      hostname: "api.hetzner.cloud",
      path: `/v1/${option}${serverID}${action}`,
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.apiToken,
      },
    };
    return options;
  }

  /**
   * makes HTTPS Request with given HTTPS options and body
   * @param options - https options
   * @param body - body of the Request (optional)
   */
  async makeRequest(options, body) {
    let data = "";
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        res.on("data", (d) => {
          data += d;
        });
        res.on("end", () => {
          resolve(data);
        });
      });

      req.on("error", (err) => {
        log.error(err);
        reject(err);
      });

      if (body !== undefined) {
        req.write(body);
      }
      req.end();
    });
  }

  /**
   * Creates Hetzner Server
   * @param serverSettings object with settings for Server Creation
   */
  async create(serverSettings) {
    const response = await this.getStatusAll();
    if (response.servers.some((server) => server.name == serverSettings.name)) {
      log.info("server already exists");
      response.servers.forEach((server) => {
        if (server.name == serverSettings.name) {
          this.serverID = server.id;
        }
      });
      await this.destroy();
    }

    const data = await this.makeRequest(
      await this.createHTTPOptions("POST", "servers"),
      JSON.stringify(serverSettings)
    );
    const responseData = JSON.parse(data);

    if (responseData.error !== undefined) {
      console.log(responseData);
      throw responseData.error;
    }

    this.serverID = responseData.server.id;
    this.serverName = responseData.server.name;
    this.serverIPv4 = responseData.server.public_net.ipv4.ip;
    this.serverRootPassword = responseData.root_password;

    const status = [];
    const check = { counter: 0, maxTries: 300 };
    do {
      log.info("Initializing Server");
      try {
        status[check.counter] = (await this.getStatus()).server.status;
        if (++check.counter == check.maxTries) throw "Server creation was canceled";
      } catch (e) {
        log.error("Error creating Server:\n");
        throw e;
      }
      await this.Sleep(2000);
    } while (status[check.counter] == "initializing");
  }

  /**
   * Destroys Server via API call
   */
  async destroy() {
    await this.makeRequest(await this.createHTTPOptions("DELETE", "servers", this.serverID));

    log.info("Server with ID " + this.serverID + " was destroyed successfully");
  }

  /**
   * Gets server information via API call
   * @returns object containing server information
   */
  async getStatus() {
    const data = await this.makeRequest(await this.createHTTPOptions("GET", "servers", this.serverID));
    const responseData = JSON.parse(data);
    return responseData;
  }

  async getStatusAll() {
    const data = await this.makeRequest(await this.createHTTPOptions("GET", "servers"));
    const responseData = JSON.parse(data);
    return responseData;
  }

  async getAllNetworks() {
    const data = await this.makeRequest(await this.createHTTPOptions("GET", "networks"));
    const responseData = JSON.parse(data);
    return responseData;
  }

  async getNetworkID(name) {
    const networks = await this.getAllNetworks();
    return networks.networks.find((network) => network.name === name).id;
  }

  async attachToNetwork(network, ip) {
    let networkID = await this.getNetworkID(network);
    let settings = {
      ip: ip,
      network: networkID,
    };
    console.log(
      await this.makeRequest(
        await this.createHTTPOptions("POST", "servers", this.serverID, "attach_to_network"),
        JSON.stringify(settings)
      )
    );
  }

  async getAllSSHKeys() {
    const data = await this.makeRequest(await this.createHTTPOptions("GET", "ssh_keys"));
    const responseData = JSON.parse(data);
    return responseData;
  }

  async deleteSSHKey(keyID) {
    await this.makeRequest(await this.createHTTPOptions("DELETE", "ssh_keys", keyID))

    log.info("SSH Key with ID " + keyID + " was deleted successfully");
  }

  async createSSHKey(name) {
    const response = await this.getAllSSHKeys();
    const existing = response.ssh_keys.find((key) => key.name === name);
    if (existing && existing.id) {
      await this.deleteSSHKey(existing.id);
    }
    return JSON.parse(await this.makeRequest(await this.createHTTPOptions("POST", "ssh_keys"),
      JSON.stringify({ name: name, public_key: this.sshKeyPair.public })));
  }

  async finishTestGracefully(nodeConnection, keyResponse) {
    clearInterval(nodeConnection.sshService.checkPoolPolling)
    await this.Sleep(10000)
    await nodeConnection.sshService.disconnect();
    await this.deleteSSHKey(keyResponse.ssh_key.id)
    await this.destroy();
  }
}
