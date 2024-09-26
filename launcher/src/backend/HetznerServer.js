const {
  utils: { generateKeyPairSync },
} = require("ssh2");
const log = require("electron-log");
const https = require("https");

export class HetznerServer {
  constructor() {
    this.apiToken = process.env.HCLOUD_TOKEN; // don't forget to set env variable "export HCLOUD_TOKEN=<your-hetzner-api-token>"
    this.serverID = null;
    this.serverName = null;
    this.serverIPv4 = null;
    this.serverRootPassword = null;
    this.sshKeyPair = generateKeyPairSync("ed25519");
    this.sshKeyName = null;
  }

  async Sleep(ms) {
    let interval;
    await new Promise((resolve) => {
      interval = setTimeout(resolve, ms);
    });
    clearInterval(interval);
  }

  async checkServerConnection(nodeConnection) {
    let tries = 0;
    let connected = false;
    while (!connected && tries < 300) {
      try {
        await this.Sleep(2000);
        tries++;
        log.info(`Trying to connect (${tries})`);
        connected = await nodeConnection.sshService.checkSSHConnection(nodeConnection.nodeConnectionParams, 5000);
      } catch (err) {
        log.info(err);
      }
    }
  }

  /**
   * creates HTTPS options object
   * @param method {string} - Either "GET", "POST", "DELTE" or "PUT"
   * @param path {string} - Path to the API endpoint
   * @param query {string} - Query for the API endpoint (optional)
   * @returns https options with given method and path
   */
  async createHTTPOptions(method, path, query) {
    if (!path.startsWith("/")) path = "/" + path;
    if (query && !query.startsWith("?")) query = "?" + query;
    const options = {
      hostname: "api.hetzner.cloud",
      path: query ? `${path}${query}` : `${path}`,
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
   * @param method - Either "GET", "POST", "DELTE" or "PUT"
   * @param path - Path to the API endpoint
   * @param query - Query for the API endpoint (optional)
   * @param body - body of the Request (optional)
   */
  async makeRequest(method, path, query, body) {
    const options = await this.createHTTPOptions(method, path, query);
    let data = "";
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        res.on("data", (d) => {
          data += d;
        });
        res.on("end", () => {
          log.debug(`${options.method} ${options.path} ${res.statusCode} ${res.statusMessage}`);
          if (res.statusCode >= 300) {
            log.error(data);
          }
          resolve(data);
        });
      });

      req.on("error", (err) => {
        log.info(`${method} ${path} ${query} ${body}`);
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
    const response = await this.getStatusByName(serverSettings.name);
    const existing = response.servers.find((server) => server.name === serverSettings.name);
    if (existing) {
      log.info("server already exists");
      this.serverID = existing.id;
      await this.destroy();
    }

    const data = await this.makeRequest("POST", "/v1/servers", "", JSON.stringify(serverSettings));
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
    log.info("Destroying Server with ID " + this.serverID + " ...");

    await this.makeRequest("DELETE", `/v1/servers/${this.serverID}`);

    log.info("Server with ID " + this.serverID + " was destroyed successfully");
  }

  /**
   * Gets server information via API call
   * @returns object containing server information
   */
  async getStatus() {
    const data = await this.makeRequest("GET", `/v1/servers/${this.serverID}`);
    const responseData = JSON.parse(data);
    return responseData;
  }

  async getStatusByName(name) {
    const data = await this.makeRequest("GET", "/v1/servers", `?${name}`);
    const responseData = JSON.parse(data);
    return responseData;
  }

  async getAllNetworks() {
    const data = await this.makeRequest("GET", "/v1/networks");
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
    await this.makeRequest("POST", `/v1/servers/${this.serverID}/actions/attach_to_network`, "", JSON.stringify(settings));
  }

  async getSSHKeyByName(name) {
    const data = await this.makeRequest("GET", "/v1/ssh_keys", `?name=${name}`);
    const responseData = JSON.parse(data);
    return responseData;
  }

  async deleteSSHKey(keyID) {
    if (!keyID) {
      const response = await this.getSSHKeyByName(this.sshKeyName);
      const key = response.ssh_keys.find((key) => key.name === this.sshKeyName);
      keyID = key.id;
    }
    await this.makeRequest("DELETE", `/v1/ssh_keys/${keyID}`);

    log.info("SSH Key with ID " + keyID + " was deleted successfully");
  }

  async createSSHKey(name) {
    this.sshKeyName = name;
    const response = await this.getSSHKeyByName(name);
    const existing = response.ssh_keys.find((key) => key.name === name);
    if (existing && existing.id) {
      await this.deleteSSHKey(existing.id);
      log.debug("deleted existing ssh key with name " + name + " and id " + existing.id);
    }
    return JSON.parse(
      await this.makeRequest("POST", "/v1/ssh_keys", "", JSON.stringify({ name: name, public_key: this.sshKeyPair.public }))
    );
  }

  async finishTestGracefully(nodeConnection) {
    clearInterval(nodeConnection.sshService.checkPoolPolling);
    await this.Sleep(10000);
    await nodeConnection.sshService.disconnect();
    await this.deleteSSHKey();
    await this.destroy();
  }
}
