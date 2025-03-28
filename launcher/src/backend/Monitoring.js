import { ServiceManager } from "./ServiceManager";
import { ValidatorAccountManager } from "./ValidatorAccountManager";
import { StringUtils } from "./StringUtils.js";
import { SSHService } from "./SSHService.js";
import * as QRCode from "qrcode";
import * as log from "electron-log";
import * as crypto from "crypto";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import axios from "axios";
const { powerMonitor } = require("electron");

const globalMonitoringCache = {
  intervalHandler: null,
  isRefreshing: 0,
  refreshIntervalSeconds: 5,
  nodestatsInitialized: false,
  storagestatus: {},
  setTime: 300,
  idleTimerRunning: false,
  idleTimerStop: false,
};

export class Monitoring {
  constructor(nodeConnection) {
    this.nodeConnection = nodeConnection;
    this.nodeConnectionProm = nodeConnection;
    this.serviceManager = new ServiceManager(this.nodeConnection);
    this.serviceManagerProm = new ServiceManager(this.nodeConnectionProm);
    this.validatorAccountManager = new ValidatorAccountManager(this.nodeConnection, this.serviceManager);
    this.isLoggedIn = false;
    this.triedCurlInstall = false;
    this.rpcTunnel = {};
    this.wsTunnel = {};
    this.beaconTunnel = {};
    this.globalMonitoringCache = { ...globalMonitoringCache };
    this.serviceInfosCacheFile = path.join(os.tmpdir(), "server_infos_cache_" + process.getCreationTime() + ".txt");
    this.lastKnownHeadBlockFile = path.join(os.tmpdir(), "last_head_block_cache.txt");
  }

  // Cleanup (for example on connect/logout)
  async cleanup() {
    this.isLoggedIn = false;
    this.triedCurlInstall = false;
    this.idleTimerRunning = false;
    this.idleTimerStop = false;
    this.rpcTunnel = {};
    this.wsTunnel = {};
    this.beaconTunnel = {};
    this.globalMonitoringCache = { ...globalMonitoringCache };
    try {
      fs.unlinkSync(this.serviceInfosCacheFile);
    } catch (e) {}
  }

  // Jobs to handle on login
  async login() {
    await this.cleanup();
    this.isLoggedIn = true;
    await this.startGlobalMonitoringCacheBackgroundWorker();
  }

  // Jobs to handle on logout
  async logout() {
    await this.stopGlobalMonitoringCacheBackgroundWorker();
    await this.cleanup();
  }

  // Refresh global monitoring cache on request
  async refreshGlobalMonitoringCache() {
    const uxtsNow = Math.floor(Date.now() / 1000);
    const elapsedSeconds = uxtsNow - this.globalMonitoringCache.isRefreshing;
    const refreshTimeoutInSeconds = 30; // allow further refresh at least after 30 seconds
    const refreshTimeoutReached = elapsedSeconds > refreshTimeoutInSeconds;
    if (!this.globalMonitoringCache.isRefreshing || refreshTimeoutReached) {
      this.globalMonitoringCache.isRefreshing = uxtsNow;
      if (!this.globalMonitoringCache.nodestatsInitialized) {
        this.getNodeStats(); // dont cache but initialize nodestats in background once for faster page lodaing afterwards
        this.globalMonitoringCache.nodestatsInitialized = true;
      }
      this.globalMonitoringCache.storagestatus = await this.getStorageStatus(true);
      this.globalMonitoringCache.isRefreshing = 0;
    }
  }

  // Start global monitoring cache refreshing periodically each X seconds async in background
  // Therefore no "await" is used for implemented calls (otherwise the login is blocked)!
  async startGlobalMonitoringCacheBackgroundWorker() {
    this.refreshGlobalMonitoringCache();
    this.globalMonitoringCache.intervalHandler = setInterval(
      function (me) {
        me.refreshGlobalMonitoringCache();
      },
      this.globalMonitoringCache.refreshIntervalSeconds * 1000,
      this
    );
  }

  // Stop global monitoring cache refreshing
  async stopGlobalMonitoringCacheBackgroundWorker() {
    if (this.globalMonitoringCache.intervalHandler) {
      clearInterval(this.globalMonitoringCache.intervalHandler);
    }
  }

  async getQRCode() {
    const services = await this.serviceManager.readServiceConfigurations();
    const notifyService = services.find((s) => s.service === "NotificationService");
    if (notifyService) {
      const volume = notifyService.volumes.find((v) => v.servicePath == "/opt/app/qrcode");
      if (volume && volume.destinationPath) {
        const data = await this.nodeConnection.sshService.exec(`cat ${volume.destinationPath}/keys.json`);
        if (data.stdout) return await QRCode.toDataURL(data.stdout);
      }
    }
    return new Error("Couldn't read QRCode Data");
  }

  async checkStereumInstallation(nodeConnection) {
    if (!nodeConnection) {
      nodeConnection = this.nodeConnection;
    }
    if (nodeConnection.sshService.connected) {
      try {
        const settings = await nodeConnection.sshService.exec("ls /etc/stereum");

        // Return true if stdout includes "stereum.yaml"
        if (settings?.stdout && settings.stdout.includes("stereum.yaml")) {
          return true;
        }

        // Return false if stderr includes "No such file or directory"
        if (settings?.stderr && settings.stderr.includes("No such file or directory")) {
          return false;
        }
      } catch (err) {
        log.debug("checking stereum installation failed:", err);
      }
    }

    // Default return false if none of the above conditions are met
    return false;
  }

  async refreshServiceInfos() {
    if (await this.checkStereumInstallation()) {
      const serviceConfigs = await this.serviceManager.readServiceConfigurations();
      const serviceStates = await this.nodeConnection.listServices();
      if (serviceConfigs && serviceConfigs.length > 0 && serviceStates && Array.isArray(serviceStates)) {
        let newInfo = serviceConfigs.map((config) => {
          const newState = serviceStates.find((state) => state.Names.replace("stereum-", "") === config.id);
          return {
            service: config.service,
            state: newState ? newState.State : "exited",
            config: {
              serviceID: config.id,
              configVersion: config.configVersion,
              env: config.env,
              image: config.image,
              imageVersion: config.imageVersion,
              runningImageVersion: newState?.Image ? newState.Image.split(":").pop() : null,
              ports: config.ports,
              volumes: config.volumes,
              network: config.network,
              dependencies: config.dependencies,
            },
          };
        });
        return newInfo;
      }
    }
    return [];
  }

  async getServerName() {
    const serverName = await this.nodeConnection.sshService.exec("hostname");
    return serverName.stdout;
  }

  getIPAddress() {
    return this.nodeConnection.nodeConnectionParams.host;
  }

  // Returns true if var is numeric, false otherwise
  is_numeric(v) {
    return typeof v == "number" || (typeof v == "string" && !isNaN(v));
  }

  // Get last known head block
  // Returns last known head block or false if unknown
  async getLastKnownHeadBlock(ntwk) {
    const file = this.lastKnownHeadBlockFile;
    var cont = {};
    try {
      cont = fs.readFileSync(file);
      cont = JSON.parse(cont);
      if (cont.hasOwnProperty(ntwk)) {
        return cont[ntwk].val;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  // Set last known head block
  // Returns true on success, false otherwise
  async setLastKnownHeadBlock(val, ntwk) {
    if (!this.is_numeric(val)) return false;
    const file = this.lastKnownHeadBlockFile;
    var cont = {};
    let lkhb = await this.getLastKnownHeadBlock(ntwk);
    if (val <= lkhb) {
      return true;
    }
    try {
      cont[ntwk] = {
        val: val,
        uxts: Math.floor(Date.now() / 1000),
      };
      fs.writeFileSync(file, JSON.stringify(cont));
      return true;
    } catch (e) {
      return false;
    }
  }

  // Get service infos (either all or optional limited to specific - case-sensitive - service names)
  // Example A: const serviceInfos = await this.getServiceInfos(); // <- Returns all configs
  // Example B: const serviceInfos = await this.getServiceInfos("PrometheusService","GrafanaService");
  // Returns array of matched services with their associated (formated) config
  // Caches results for 10 seconds!
  async getServiceInfos() {
    const cache_max_seconds = 10;
    const args = Array.prototype.slice.call(arguments); // convert function "arguments" to Array
    const hash = crypto.createHash("md5").update(args.join("-")).digest("hex"); // cache id
    const file = this.serviceInfosCacheFile;
    const dnow = new Date(); // eslint-disable-line no-unused-vars
    var cont = {};
    //console.log("INCOMING '"+args.join("-")+"' -> " + hash);
    try {
      cont = fs.readFileSync(file);
      cont = JSON.parse(cont);
      if (cont.hasOwnProperty(hash)) {
        var uxts = Math.floor(Date.now() / 1000);
        var diff = uxts - cont[hash].uxts;
        if (diff < cache_max_seconds) {
          //console.log('RETURN cache ' + hash, file);
          return cont[hash].data;
        }
        //console.log('REQUIRE fresh cache ' + hash, dnow);
      }
    } catch (e) {}
    if (await this.checkStereumInstallation()) {
      var serviceConfigs = await this.serviceManagerProm.readServiceConfigurations();
      const serviceStates = await this.nodeConnectionProm.listServices();
      if (serviceConfigs && Array.isArray(serviceConfigs) && serviceConfigs.length > 0 && serviceStates && Array.isArray(serviceStates)) {
        serviceConfigs = args.length < 1 ? serviceConfigs : serviceConfigs.filter((s) => args.includes(s.service));
        serviceConfigs = serviceConfigs
          .map((config) => {
            const newState = serviceStates.find(
              (state) => (state.hasOwnProperty("Names") ? state.Names.replace("stereum-", "") : "") === config.id
            );
            return {
              service: config.service,
              state: newState ? newState.State : "exited",
              createdAt: newState ? newState.CreatedAt : null,
              config: {
                serviceID: config.id,
                instanceID: newState && newState.hasOwnProperty("Names") ? newState.Names : "N/A",
                command: config.command,
                env: config.env,
                configVersion: config.configVersion,
                image: config.image,
                imageVersion: config.imageVersion,
                ports: config.ports,
                volumes: config.volumes,
                network: config.network,
                dependencies: config.dependencies,
              },
              //fullconfig: config,
              //fullstate: newState,
            };
          })
          .sort((a, b) => args.indexOf(a.service) - args.indexOf(b.service));
        if (Array.isArray(serviceConfigs) && serviceConfigs.length > 0) {
          //console.log('REFRESH cache ' + hash, dnow, file);
          cont[hash] = {
            data: serviceConfigs,
            uxts: Math.floor(Date.now() / 1000),
            hash: hash,
          };
          fs.writeFileSync(file, JSON.stringify(cont));
        }
        return serviceConfigs;
      }
    }
    return [];
  }

  // Make sure the "finalized" endpoint of given checkpoint URL (cp_url) is available and responds HTTP status code 200 success.
  // Note: in further releases the checkpoint may also validated against other checkpoints.
  // Returns bool true if the given cp_url is ok, false otherwise
  async isCheckpointValid(cp_url) {
    let ep = "/eth/v2/debug/beacon/states/finalized";
    let url = cp_url.trim().endsWith("/") ? cp_url.trim().slice(0, -1) + ep : cp_url + ep;
    // check if curl is installed
    let r = await this.nodeConnection.sshService.exec("which curl");
    if (r.rc) {
      if (!this.triedCurlInstall) {
        this.triedCurlInstall = true;
        r = await this.nodeConnection.sshService.exec("apt-get -y update ; apt-get -y install curl");
        if (r.rc) {
          return true; // no curl = we can't check, thus all CP are considered valid..
        }
      } else {
        return true; // no curl = we can't check, thus all CP are considered valid..
      }
    }
    // validate checkpoint
    const cmd = `
      curl -s -o /dev/null --head --max-time 5 -w "%{http_code}" -X GET \
      -H 'Content-Type: application/json' \
      -H 'Accept: application/octet-stream' \
      ${url}
    `.trim();
    const result = await this.nodeConnection.sshService.exec(cmd);
    if (result.stdout != 200) {
      return false;
    }
    return true;
  }

  // Query Prometheus API via CURL on the node
  // https://prometheus.io/docs/prometheus/latest/querying/api/
  // https://prometheus.io/docs/prometheus/latest/querying/basics/
  // query=<string>: Prometheus expression query string.
  // time=<rfc3339|unix_timestamp>: Evaluation timestamp. Optional.
  // timeout=<duration>: Evaluation timeout. Optional. Defaults to and is capped by the value of the -query.timeout flag.
  // Returns json parsed result as described on Prometheus API reference (even for internal errors)
  async queryPrometheus(query, time = null, timeout = 5) {
    // Get Prometheus connection infos from config
    const serviceInfos = await this.getServiceInfos("PrometheusService");
    if (serviceInfos.length < 1) {
      return {
        status: "error",
        errorType: "internal",
        error: "service infos unavailable",
      };
    }
    const prometheus = serviceInfos.pop();
    if (typeof prometheus !== "object" || !prometheus.hasOwnProperty("config")) {
      return {
        status: "error",
        errorType: "internal",
        error: "prometheus config unavailable",
      };
    }
    let addr = prometheus.config.ports[0].destinationIp;
    let port = prometheus.config.ports[0].destinationPort;
    if (!prometheus.hasOwnProperty("state") || prometheus.state != "running") {
      return {
        status: "error",
        errorType: "internal",
        error: "prometheus service not running",
      };
    }

    // Escape single quotes in query for bash command (note the single quotes for curl -d arguments)
    query = query.replaceAll("'", "'\\''");

    // Build curl command
    const cmd =
      `
      curl -s -X POST http://${addr}:${port}/api/v1/query \
      -H "Content-Type: application/x-www-form-urlencoded" \
      -d 'query=${query}&timeout=${timeout}` +
      (time ? `&time=${time}` : "") +
      `'
    `.trim();

    // Execute the CURL command on the node and return the result
    let result = null;
    try {
      result = await this.nodeConnection.sshService.exec(cmd);
    } catch (err) {
      //throw err;
      return {
        status: "error",
        errorType: "internal",
        error: err,
      };
    }

    // No data in stdout or data in stderr? Executed code above failed to run!
    // Return error in same format as prometheus does for consistency reasons.
    if (result.rc || result.stdout == "" || result.stderr != "") {
      var err = "E:" + result.rc + ": executed code failed to run";
      if (result.stderr != "") {
        err += " (" + result.stderr + ")";
      } else if (result.stdout == "") {
        err += " (syntax error)";
      }
      return {
        status: "error",
        errorType: "internal",
        error: err,
        data: result,
      };
    }

    // Return the json parsed result of stdout
    // {rc: 0, stdout: "{"status":"success","data":{"resultType":"vector","result":[]}}", stderr: ""}
    // {rc: 0, stdout: "{"status":"error","errorType":"bad_data","error":"invalid parameter \"query\": 1:20: parse error: unexpected \"=\""}", stderr: ""}
    // {rc: 0, stdout: "{"status":"error","errorType":"bad_data","error":"… 1:1: parse error: no expression found in input"}", stderr: ""}
    return JSON.parse(result.stdout);
  }

  // Query RPC API via CURL on the node
  // https://api.besu.hyperledger.org/
  // https://playground.open-rpc.org/?schemaUrl=https://raw.githubusercontent.com/ethereum/execution-apis/assembled-spec/openrpc.json&uiSchema%5BappBar%5D%5Bui:splitView%5D=false&uiSchema%5BappBar%5D%5Bui:input%5D=false&uiSchema%5BappBar%5D%5Bui:examplesDropdown%5D=false
  // Arguments:
  // url=<mixed>        : [REQUIRED] Full HTTP API URL of the RPC server or object of {addr:'<addr>',port:'<port>'}
  // rpc_method=<string>: [REQUIRED] RPC method name or raw JSON RPC query string.
  // rpc_params=<array> : [OPTIONAL] RPC parameters associated to the given RPC method
  // method=<string>    : [OPTIONAL] HTTP request method (defaults to POST)
  // headers=<object>   : [OPTIONAL] HTTP headers (defaults to {"Content-Type":"application/json"})
  // Returns object with keys:
  // code=<number>: 0 (number!) means success all other values (including null or undefined) means error.
  // info=<string>: a message about the last result.
  // data=<mixed> : additional data (if available) or empty string
  // On success data keys are:
  // api_reponse=<mixed>: the response of the RPC api
  // api_httpcode=<int> : the http status code of the RPC api response
  async queryRpcApi(url, rpc_method, rpc_params = [], method = "POST", headers = {}) {
    // Setup query
    var query =
      rpc_method.trim().indexOf("{") < 0
        ? JSON.stringify({
            jsonrpc: "2.0",
            method: rpc_method.trim(),
            params: rpc_params,
            id: 1,
          })
        : rpc_method;

    // Define default response
    const data = {
      api_reponse: null,
      api_httpcode: null,
    };

    // Make sure query is valid JSON
    try {
      JSON.parse(query);
    } catch (e) {
      return {
        code: 1,
        info: "error: invalid query data specified (valid JSON string expected)",
        data: data,
      };
    }

    // Format url
    if (typeof url === "string") {
      url = url.trim();
    } else if (typeof url === "object") {
      let def = { addr: "127.0.0.1", port: 0 };
      url = { ...def, ...url };
      url = `http://${url.addr}:${url.port}`;
    }

    // Check url
    if (!url.startsWith("http")) {
      return {
        code: 3,
        info: "error: invalid url specified",
        data: data,
      };
    }

    // Build request headers
    headers = typeof headers === "object" && !Array.isArray(headers) && headers !== null ? headers : {};
    headers = {
      ...Object.fromEntries(
        Object.entries({
          "Content-Type": "application/json",
          //"Content-Type":"application/json; charset=utf-8",
        }).map(([k, v]) => [k.toLowerCase(), v])
      ),
      ...Object.fromEntries(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v])),
    };
    let requestheaders = [];
    for (let [k, v] of Object.entries(headers)) {
      k = k.replaceAll("'", "'\\''");
      v = v.replaceAll("'", "'\\''");
      requestheaders.push("-H '" + k + ": " + v + "'");
    }
    requestheaders = requestheaders.length ? requestheaders.join(" ") : "";

    // Escape single quotes in query for bash command (note the single quotes for curl --data-raw argument)
    query = query.replaceAll("'", "'\\''");

    // Build curl command
    const cmd = `
      curl -s --location --request ${method} -w "\\n%{http_code}" '${url}' ${requestheaders} \
      --data-raw '${query}'
    `.trim();

    // Execute the CURL command on the node and return the result
    let result = null;
    try {
      result = await this.nodeConnection.sshService.exec(cmd);
    } catch (err) {
      return {
        code: 4,
        info: "error: could not execute curl command (" + err + ")",
        data: data,
      };
    }

    // No data in stdout or data in stderr? Executed code above failed to run!
    if (result.rc || result.stdout == "" || result.stderr != "") {
      let err = "error:" + result.rc + ": executed code failed to run";
      if (result.stderr != "") {
        err += " (" + result.stderr + ")";
      } else if (result.stdout == "") {
        err += " (syntax error)";
      }
      data.api_reponse = result;
      return {
        code: 5,
        info: err,
        data: data,
      };
    }

    // Parse response
    let r = result.stdout.trim().split("\n");
    let statuscode = r.length > 0 ? parseInt(r.pop()) : data.api_httpcode;
    let jsonstring = r.length > 0 ? r.join("\n").trim() : "";
    data.api_httpcode = statuscode;
    try {
      data.api_reponse = jsonstring ? JSON.parse(jsonstring) : jsonstring;
    } catch (e) {
      data.api_reponse = jsonstring ? jsonstring : result.stdout;
      return {
        code: 6,
        info: "error: invalid api response (" + e + ")",
        data: data,
      };
    }

    // Check response format
    if (!data.api_reponse.hasOwnProperty("id")) {
      return {
        code: 7,
        info: "error: invalid api response (format unknown)",
        data: data,
      };
    }

    // Check for response errors
    if (data.api_reponse.hasOwnProperty("error")) {
      data.api_reponse = data.api_reponse.error.message + " (" + data.api_reponse.error.code + ")";
      return {
        code: 8,
        info: "error: api responded an error -> " + data.api_reponse,
        data: data,
      };
    }

    // Respond success
    data.api_reponse = data.api_reponse.result;
    return {
      code: 0,
      info: "success: api successfully requested",
      data: data,
    };
  }

  // Query BEACON API via CURL on the node
  // https://ethereum.github.io/beacon-APIs/
  // https://consensys.github.io/teku/
  // url=<mixed>      : [REQUIRED] Full HTTP API URL of the BEACON server or object of {addr:'<addr>',port:'<port>'}
  // endpoint=<string>: [REQUIRED] API endpoint (relative to the host:port or a full http url)
  // params=<array>   : [OPTIONAL] API parameters associated to the given endpoint
  // method=<string>  : [OPTIONAL] HTTP request method (defaults to GET)
  // headers=<object> : [OPTIONAL] HTTP headers (defaults to {"Content-Type":"application/json"})
  // Returns object with keys:
  // code=<number>: 0 (number!) means success all other values (including null or undefined) means error.
  // info=<string>: a message about the last result.
  // data=<mixed> : additional data (if available) or empty string
  // On success data keys are:
  // api_reponse=<mixed>: the response of the BEACON api
  // api_httpcode=<int> : the http status code of the BEACON api response
  async queryBeaconApi(url, endpoint, params = [], method = "GET", headers = {}) {
    // Define default response
    const data = {
      api_reponse: null,
      api_httpcode: null,
    };

    // Get service infos
    const serviceInfos = await this.getServiceInfos();
    if (serviceInfos.length < 1) {
      return {
        code: 1,
        info: "error: service infos unavailable",
        data: data,
      };
    }

    // Format endpoint
    endpoint = typeof endpoint === "string" ? endpoint.trim().replace(/^\//, "").trim() : ""; // /a/b/c/ => a/b/c/ : ''
    if (!endpoint) {
      return {
        code: 2,
        info: "error: invalid endpoint specified",
        data: data,
      };
    }

    // Format url
    if (typeof url === "string") {
      url = url.trim();
    } else if (typeof url === "object") {
      let def = { addr: "127.0.0.1", port: 0 };
      url = { ...def, ...url };
      url = `http://${url.addr}:${url.port}`;
    }
    url = endpoint.startsWith("http") ? endpoint : `${url}/${endpoint}`;

    // Check url
    if (!url.startsWith("http")) {
      return {
        code: 3,
        info: "error: invalid url specified",
        data: data,
      };
    }

    // Build request headers
    headers = typeof headers === "object" && !Array.isArray(headers) && headers !== null ? headers : {};
    headers = {
      ...Object.fromEntries(
        Object.entries({
          "Content-Type": "application/json",
          //"Content-Type":"application/json; charset=utf-8",
        }).map(([k, v]) => [k.toLowerCase(), v])
      ),
      ...Object.fromEntries(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v])),
    };
    let requestheaders = [];
    for (let [k, v] of Object.entries(headers)) {
      k = k.replaceAll("'", "'\\''");
      v = v.replaceAll("'", "'\\''");
      requestheaders.push("-H '" + k + ": " + v + "'");
    }
    requestheaders = requestheaders.length ? requestheaders.join(" ") : "";

    // Build request data
    let d = Array.isArray(params) && params.length ? JSON.stringify(params).replaceAll("'", "'\\''") : "";
    let requestdata = d ? `-d '${d}'` : "";

    // Build curl command
    const cmd = `curl -s --location --request ${method} -w "\\n%{http_code}" '${url}' ${requestheaders} ${requestdata}`.trim();

    // Execute the CURL command on the node and return the result
    let result = null;
    try {
      result = await this.nodeConnection.sshService.exec(cmd);
    } catch (err) {
      return {
        code: 4,
        info: "error: could not execute curl command (" + err + ")",
        data: data,
      };
    }

    // No data in stdout or data in stderr? Executed code above failed to run!
    if (result.rc || result.stdout == "" || result.stderr != "") {
      let err = "error:" + result.rc + ": executed code failed to run";
      if (result.stderr != "") {
        err += " (" + result.stderr + ")";
      } else if (result.stdout == "") {
        err += " (syntax error)";
      }
      data.api_reponse = result;
      return {
        code: 5,
        info: err,
        data: data,
      };
    }

    // Parse response
    let r = result.stdout.trim().split("\n");
    let statuscode = r.length > 0 ? parseInt(r.pop()) : data.api_httpcode;
    let jsonstring = r.length > 0 ? r.join("\n").trim() : "";
    data.api_httpcode = statuscode;
    try {
      data.api_reponse = jsonstring ? JSON.parse(jsonstring) : jsonstring;
    } catch (e) {
      data.api_reponse = jsonstring ? jsonstring : result.stdout;
      return {
        code: 6,
        info: "error: invalid api response (" + e + ")",
        data: data,
      };
    }

    // Check for response errors
    if (data.api_reponse.hasOwnProperty("code") && data.api_reponse.hasOwnProperty("message")) {
      data.api_reponse = data.api_reponse.message + " (" + data.api_reponse.code + ")";
      return {
        code: 7,
        info: "error: api responded an error -> " + data.api_reponse,
        data: data,
      };
    }

    // Respond success
    return {
      code: 0,
      info: "success: api successfully requested",
      data: data,
    };
  }

  // Query any API via CURL that responds a valid JSON format
  // url=<mixed>      : [REQUIRED] Full HTTP API URL of the server or object of {addr:'<addr>',port:'<port>'}
  // endpoint=<string>: [REQUIRED] API endpoint (relative to the host:port or a full http url)
  // params=<array>   : [OPTIONAL] API parameters associated to the given endpoint
  // method=<string>  : [OPTIONAL] HTTP request method (defaults to GET)
  // headers=<object> : [OPTIONAL] HTTP headers (defaults to {"Content-Type":"application/json"})
  // Returns object with keys:
  // code=<number>: 0 (number!) means success all other values (including null or undefined) means error.
  // info=<string>: a message about the last result.
  // data=<mixed> : additional data (if available) or empty string
  // On success data keys are:
  // api_reponse=<mixed>: the response of the JSON api
  // api_httpcode=<int> : the http status code of the JSON api response
  // Example:
  // const result = await this.queryJsonApi("http://127.0.0.1:8545", "health", [], "GET", {"X-ERIGON-HEALTHCHECK": "synced"});
  async queryJsonApi(url, endpoint, params = [], method = "GET", headers = {}) {
    // Define default response
    const data = {
      api_reponse: null,
      api_httpcode: null,
    };

    // Format endpoint
    endpoint = typeof endpoint === "string" ? endpoint.trim().replace(/^\//, "").trim() : ""; // /a/b/c/ => a/b/c/ : ''
    if (!endpoint) {
      return {
        code: 2,
        info: "error: invalid endpoint specified",
        data: data,
      };
    }

    // Format url
    if (typeof url === "string") {
      url = url.trim();
    } else if (typeof url === "object") {
      let def = { addr: "127.0.0.1", port: 0 };
      url = { ...def, ...url };
      url = `http://${url.addr}:${url.port}`;
    }
    url = endpoint.startsWith("http") ? endpoint : `${url}/${endpoint}`;

    // Check url
    if (!url.startsWith("http")) {
      return {
        code: 3,
        info: "error: invalid url specified",
        data: data,
      };
    }

    // Build request headers
    headers = typeof headers === "object" && !Array.isArray(headers) && headers !== null ? headers : {};
    headers = {
      ...Object.fromEntries(
        Object.entries({
          "Content-Type": "application/json",
          //"Content-Type":"application/json; charset=utf-8",
        }).map(([k, v]) => [k.toLowerCase(), v])
      ),
      ...Object.fromEntries(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v])),
    };

    let requestheaders = [];
    for (let [k, v] of Object.entries(headers)) {
      k = k.replaceAll("'", "'\\''");
      v = v.replaceAll("'", "'\\''");
      requestheaders.push("-H '" + k + ": " + v + "'");
    }
    requestheaders = requestheaders.length ? requestheaders.join(" ") : "";

    // Build request data
    let d = Array.isArray(params) && params.length ? JSON.stringify(params).replaceAll("'", "'\\''") : "";
    let requestdata = d ? `-d '${d}'` : "";

    // Build curl command
    const cmd = `curl -s --location --request ${method} -w "\\n%{http_code}" '${url}' ${requestheaders} ${requestdata}`.trim();

    // Execute the CURL command on the node and return the result
    let result = null;
    try {
      result = await this.nodeConnection.sshService.exec(cmd);
    } catch (err) {
      return {
        code: 4,
        info: "error: could not execute curl command (" + err + ")",
        data: data,
      };
    }

    // No data in stdout or data in stderr? Executed code above failed to run!
    if (result.rc || result.stdout == "" || result.stderr != "") {
      let err = "error:" + result.rc + ": executed code failed to run";
      if (result.stderr != "") {
        err += " (" + result.stderr + ")";
      } else if (result.stdout == "") {
        err += " (syntax error)";
      }
      data.api_reponse = result;
      return {
        code: 5,
        info: err,
        data: data,
      };
    }

    // Parse response
    let r = result.stdout.trim().split("\n");
    let statuscode = r.length > 0 ? parseInt(r.pop()) : data.api_httpcode;
    let jsonstring = r.length > 0 ? r.join("\n").trim() : "";
    data.api_httpcode = statuscode;
    try {
      if (!jsonstring.startsWith("{")) {
        return {
          code: 6,
          info: "error: invalid api response format (" + jsonstring + ")",
          data: data,
        };
      }
      data.api_reponse = jsonstring ? JSON.parse(jsonstring) : jsonstring;
    } catch (e) {
      data.api_reponse = jsonstring ? jsonstring : result.stdout;
      return {
        code: 7,
        info: "error: invalid api response (" + e + ")",
        data: data,
      };
    }

    // Check for response errors
    if (typeof data.api_httpcode == "number" && data.api_httpcode != 200) {
      return {
        code: 8,
        info: "error: api responded an http error code" + data.api_httpcode,
        data: data,
      };
    }

    // Respond success
    return {
      code: 0,
      info: "success: api successfully requested",
      data: data,
    };
  }

  // Find beacon port from FIRST AVAILABLE running consesus client on the local system
  // If "synced" is set to true, the consensus client also needs to be fully synced
  async findBeaconPort(synced = false) {
    const result = await this.getBeaconStatus();
    if (result.code) {
      return {
        code: 1,
        info: "error: could not find beacon port (" + result.info + ")",
        data: {
          port: false,
          full_result: result,
        },
      };
    }
    if (!synced) {
      return {
        code: 0,
        info: "success: first available beacon port found",
        data: {
          port: result.data[0].beacon.destinationPort,
          full_result: result,
        },
      };
    }
    for (const obj of result.data) {
      if (obj.beacon.is_syncing === "false" || obj.beacon.sync_distance < 1) {
        return {
          code: 0,
          info: "success: first available beacon port where consensus client is fully synced found",
          data: {
            port: obj.beacon.destinationPort,
            full_result: result,
          },
        };
      }
    }
    return {
      code: 2,
      info: "error: could not find beacon port where consensus client is fully synced",
      data: {
        port: false,
        full_result: result,
      },
    };
  }

  // Get all locally imported public keys from given validator service id
  async getPublicKeys(serviceID) {
    try {
      const client = await this.nodeConnection.readServiceConfiguration(serviceID);
      if (!client.service.includes("ValidatorService")) {
        return {
          code: 1,
          info: "error: could not get public keys (given service id is not a validator service)",
          data: "",
        };
      }
      const resultKeymanagerAPI = await this.validatorAccountManager.keymanagerAPI(client, "GET", "/eth/v1/keystores");
      const result = JSON.parse(resultKeymanagerAPI.stdout);
      if (!result.data) result.data = [];
      const pubKeys = result.data.map((k) => k.validating_pubkey);
      return {
        code: 0,
        info: "success: retrieved public keys",
        data: pubKeys,
      };
    } catch (e) {
      return {
        code: 2,
        info: "error: could not get public keys (" + e + ")",
        data: "",
      };
    }
  }

  // Get RPC data of given query for all or a specific local running execution client(s)
  // Arguments:
  // query=<string> : [REQUIRED] The query to execute on the RPC server, e.g: "web3_clientVersion"
  // params=<object>: [OPTIONAL] An object of optional parameters:
  //                             serviceID<string>   : Service ID to match a specific execution client only
  //                             instanceID<string>  : Instance ID to match a specific execution client only
  //                             serviceInfos<object>: An object retrieved by method "getServiceInfos"
  // Returns object with keys:
  // code=<number>: 0 (number!) means success all other values (including null or undefined) means error.
  // info=<string>: A message about the last result.
  // data=<mixed> : An array of objects for each matched execution client (if available) or empty string
  // On success object keys per array item are:
  // now=<integer>            : Current timestamp in microseconds
  // client=<object>          : Matched execution client object
  // service_id=<string>      : Service ID of the matched execution client (if available) or "n/a"
  // instance_id=<string>     : Instance ID of the matched execution client (if available) or "n/a"
  // connection_infos=<object>: Connection infos that was used to query the rpc api
  // query_result=<object>    : Result of the query to the rpc api (see method "queryRpcApi" for response infos)
  async getRpcData(query, params) {
    // Service definitions with their associated rpc api (service) port
    const services = {
      GethService: 8545,
      RethService: 8545,
      BesuService: 8545,
      NethermindService: 8545,
      ErigonService: 8545,
    };

    // Extract additional params
    var { serviceID, instanceID, svcInfos } = Object.assign(
      {
        serviceID: null,
        instanceID: null,
        serviceInfos: null,
      },
      params
    );

    // Format additional params
    serviceID = typeof serviceID === "string" ? serviceID : "";
    instanceID = typeof instanceID === "string" ? instanceID : "";
    svcInfos = typeof svcInfos === "object" ? svcInfos : null;

    // Set timestamp in micro seconds
    var now = Date.now();

    // Check query
    if (typeof query !== "string") {
      return {
        code: 1,
        info: "error: query must be string (" + typeof query + " given)",
        data: "",
      };
    }

    // Get service infos
    const serviceInfos = svcInfos ? svcInfos : await this.getServiceInfos();
    if (serviceInfos.length < 1) {
      return {
        code: 2,
        info: "error: service infos unavailable",
        data: "",
      };
    }

    // Get execution clients with RPC query data, optionally filtered by serviceID and/or instanceID
    const data = [];
    const executions = serviceInfos.filter((s) => Object.keys(services).includes(s.service));
    for (let i = 0; i < executions.length; i++) {
      // Make sure execution client is valid and running
      let execution = executions[i];
      if (
        typeof execution !== "object" ||
        !execution.hasOwnProperty("config") ||
        !execution.hasOwnProperty("state") ||
        execution.state != "running"
      ) {
        continue;
      }

      // Filter the RPC port configuration and get addr/port that is mapped on docker host
      let sid = execution.config.hasOwnProperty("serviceID") ? execution.config.serviceID : "n/a";
      let iid = execution.config.hasOwnProperty("instanceID") ? execution.config.instanceID : "n/a";
      let rpc = execution.config.ports
        .filter((p) => p.servicePort == services[execution.service])
        .slice(-1)
        .pop();
      rpc.destinationIp = "127.0.0.1";
      let addr = rpc.destinationIp;
      let port = rpc.destinationPort;

      // Ignore the client if serviceID is given and does not match
      if (serviceID && sid != serviceID) continue;

      // Ignore the client if instanceID is given and does not match
      if (instanceID && iid != instanceID) continue;

      // Query RPC Server (e.g: "web3_clientVersion")
      let result = await this.queryRpcApi({ addr: addr, port: port }, query);

      // Add valid client to final result
      data.push({
        now: now,
        client: execution,
        service_id: sid,
        instance_id: iid,
        connection_infos: rpc,
        query_result: result,
      });
    }

    // Additional info
    let addinfo = [];
    if (serviceID) addinfo.push('given service "' + serviceID + '"');
    if (instanceID) addinfo.push('given instance "' + instanceID + '"');
    if (addinfo.length) {
      addinfo = " for " + addinfo.join(" and ").trim();
    } else {
      addinfo = "";
    }

    // Final check
    if (data.length < 1) {
      return {
        code: 3,
        info: "error: no running execution client with enabled RPC port found" + addinfo,
        data: "",
      };
    }

    // Respond success
    return {
      code: 0,
      info: "success: rpc data" + (addinfo ? addinfo : " for all running execution clients") + " successfully retrieved",
      data: data,
    };
  }

  // Get head block of execution client from Beacon API with servcie id "sid"
  // Returns head block number if the Beacon API is online and in sync, null otherwise
  async getExecutionHeadBlockFromBeaconApi(sid) {
    try {
      let gbs = await this.getBeaconStatus();
      let rpc = gbs.data.filter((d) => d.sid == sid).pop().beacon;
      let addr = rpc.destinationIp;
      let port = rpc.destinationPort;
      let result = await this.queryBeaconApi(`http://${addr}:${port}`, "eth/v2/beacon/blocks/head", [], "GET");
      let block_number = result.data.api_reponse.data.message.body.execution_payload.block_number;
      return !this.is_numeric(block_number) ? null : block_number;
    } catch (e) {
      return null;
    }
  }

  // Get sync status of consensus and execution clients
  async getSyncStatus() {
    // Service definitions with type and Prometheus labels for sync status
    const services = {
      consensus: {
        TekuBeaconService: ["beacon_slot", "beacon_head_slot"], // OK - query for job="teku"
        LighthouseBeaconService: ["slotclock_present_slot", "beacon_head_state_slot"], // OK - query for job="lighthouse_beacon"!
        PrysmBeaconService: ["beacon_clock_time_slot", "beacon_head_slot"], // OK - query for job="prysm_beacon"!
        NimbusBeaconService: ["beacon_slot", "beacon_head_slot"], // OK - query for job="nimbus"
        LodestarBeaconService: ["beacon_clock_slot", "beacon_head_slot"], // OK - query for job="lodestar_beacon"
        // GrandineBeaconService: ["", "beacon_head_slot"], // NOT OK Current Slot is not available - query for job="grandine_beacon"
      },
      execution: {
        GethService: ["chain_head_header", "chain_head_block"], // OK - query for job="geth"
        RethService: ["reth_sync_checkpoint", "reth_sync_checkpoint"], // OK [there is only one label] - query for job="reth"
        BesuService: ["ethereum_best_known_block_number", "ethereum_blockchain_height"], // OK - query for job="besu"
        NethermindService: ["nethermind_blocks", "nethermind_blocks"], // OK [there is only one label] - query for job="nethermind"
        // Note: Erigon labels are taken from their official Grafana Dashboard, however those are not available thru Prometheus!
        ErigonService: ["chain_head_header", "chain_head_block"], // TODO - query for job="erigon"
      },
    };

    // Prometheus job definitions
    const jobs = {
      //GrandineBeaconService: "grandine_beacon",
      TekuBeaconService: "teku_beacon",
      LighthouseBeaconService: "lighthouse_beacon",
      PrysmBeaconService: "prysm_beacon",
      NimbusBeaconService: "nimbus_beacon",
      LodestarBeaconService: "lodestar_beacon",
      GethService: "geth",
      RethService: "reth",
      BesuService: "besu",
      NethermindService: "nethermind",
      ErigonService: "erigon",
    };

    // Execution clients that should be queried by RPC for chain head block
    const get_chain_head_by_rpc = [
      "GethService",
      "RethService",
      // 'BesuService',
      "NethermindService",
      "ErigonService",
    ];

    // Merge all labels for Prometheus query
    const serviceLabels = [];
    for (let property in services) {
      for (let prop in services[property]) {
        for (let p of services[property][prop]) {
          serviceLabels.push(p);
        }
      }
    }

    // Get all service configurations
    const serviceInfos = await this.getServiceInfos();
    if (serviceInfos.length < 1) {
      return {
        code: 111,
        info: "error: service infos for syncstatus not available",
        data: "",
      };
    }

    // Query Prometehus for all possible labels
    const prometheus_result = await this.queryPrometheus('{__name__=~"' + serviceLabels.join("|") + '"}');
    if (typeof prometheus_result !== "object" || !prometheus_result.hasOwnProperty("status") || prometheus_result.status != "success") {
      return {
        code: 113,
        info: "error: prometheus query for syncstatus failed",
        data: prometheus_result,
      };
    }

    // If serviceInfos contains at least one service that requires to query the chain head block by
    // RPC then get block number for ALL running execution clients by RPC query (where available!)
    let ecBlockNumberByRPC = null;
    if (serviceInfos.filter((s) => get_chain_head_by_rpc.includes(s.service)).length > 0) {
      ecBlockNumberByRPC = await this.getRpcData("eth_blockNumber", { serviceInfos: serviceInfos });
    }

    // Build pairs for the FrontEnd (cc and ec member)
    const clientTypes = Object.keys(services);
    const groups = [];
    const utsNow = Math.floor(Date.now() / 1000);
    for (let i = 0; i < serviceInfos.length; i++) {
      // Find execution and consensus service configurations for this group
      let clt = serviceInfos[i];
      if (typeof clt !== "object" || !clt.hasOwnProperty("service") || !clt.hasOwnProperty("config")) continue;
      let isConsensus = clt.service in services.consensus;
      let hasMembers = clt.config.dependencies.executionClients.length ? true : false;
      if (!isConsensus || !hasMembers) continue;
      let cc = clt;
      let ec = null;
      try {
        ec = cc.config.dependencies.executionClients[0];
        if (typeof ec !== "object" || !ec.hasOwnProperty("service") || !ec.hasOwnProperty("id")) continue;
        ec = serviceInfos.find((item) => item.config.serviceID == ec.id);
      } catch (e) {
        continue;
      }

      // Filter Prometheus result by current used services
      try {
        // Add the response for "syncStatusItems" exact as defined in front-end
        // Values for "syncIcoSituation" and "syncIcoError" can generated from these!
        // Attention: frstVal needs to be the lower value in frontend, which is in key 1 + added new state key!
        let data = [];
        let consensus = cc;
        let execution = ec; // eslint-disable-line no-unused-vars
        let network = consensus.config.network;
        let last_known_head_block_number = 0;
        let head_block_number = 0;
        if (typeof ecBlockNumberByRPC == "object") {
          last_known_head_block_number = await this.getLastKnownHeadBlock(network);
          last_known_head_block_number = !this.is_numeric(last_known_head_block_number) ? 0 : last_known_head_block_number;
          head_block_number = await this.getExecutionHeadBlockFromBeaconApi(consensus.config.serviceID);
          await this.setLastKnownHeadBlock(head_block_number, network); // does update only if head_block_number is a number and higher
          if (!this.is_numeric(head_block_number)) {
            head_block_number = last_known_head_block_number;
          }
        }
        clientTypes.forEach(function (clientType, index) {
          let clt = "";
          eval("clt = " + clientType + ";"); // eval clt object from consensus/execution objects
          let results = [];
          let labels = services[clientType][clt.service];
          let xx = prometheus_result.data.result.filter(
            (s) =>
              labels.includes(s.metric.__name__) && s.metric.instance.includes(clt.config.instanceID) && s.metric.job == jobs[clt.service]
          );
          let frstVal = 0,
            scndVal = 0;
          if (xx.length) {
            labels.forEach(function (label, index) {
              try {
                results[label] = xx.filter((s) => s.metric.__name__ == labels[index])[0].value[1];
              } catch (e) {}
            });
            try {
              frstVal = results[labels[1]];
              scndVal = results[labels[0]];
            } catch (e) {}
          }
          // Set chain head block for this client from RPC server (if available)
          if (
            get_chain_head_by_rpc.includes(clt.service) &&
            typeof ecBlockNumberByRPC == "object" &&
            !ecBlockNumberByRPC.code &&
            Array.isArray(ecBlockNumberByRPC.data)
          ) {
            let chain_head_block = 0;
            try {
              const ecbfilt = ecBlockNumberByRPC.data.filter((s) => s.instance_id == clt.config.instanceID).pop();
              chain_head_block = ecbfilt.query_result.data.api_reponse;
              chain_head_block =
                typeof chain_head_block === "string" && chain_head_block.startsWith("0x") ? parseInt(chain_head_block, 16) : 0;
            } catch (e) {}
            let stay_on_hold_till_first_block = false; // true = enabled | false = disabled
            if (stay_on_hold_till_first_block && !chain_head_block) {
              // stay on hold until EC has responded the first block by RPC
              frstVal = 0;
              scndVal = 0;
            } else {
              frstVal = !head_block_number ? 0 : chain_head_block;
              scndVal = !head_block_number ? 0 : head_block_number;
              scndVal = frstVal > scndVal ? frstVal : scndVal; // can happen in theory while CL is down
            }
          }
          data.push({
            id: index + 1,
            serviceID: clt.config.serviceID,
            title: clt.service.replace(/Beacon|Service/gi, "").toUpperCase(),
            frstVal: frstVal ? frstVal : 0,
            scndVal: scndVal ? scndVal : 0,
            type: clientType,
            state: clt.state,
            uptime: clt.createdAt ? utsNow - Math.floor(new Date(clt.createdAt).getTime() / 1000) : 0,
          });
        });
        groups.push(data);
      } catch (err) {
        return {
          code: 114,
          info: "error: no prometheus data for syncstatus available yet",
          data: err,
        };
      }
    }

    // Make sure at least one pair of consensus and execution service configurations exists
    if (groups.length < 1) {
      return {
        code: 115,
        info: "error: a pair of consensus and execution client does not exist (in syncstatus)",
        data: serviceInfos,
      };
    }
    // console.log("groups", groups);
    // success
    return {
      code: 0,
      info: "success: syncstatus successfully retrieved",
      data: groups,
    };
  }

  // Get P2P status of consensus and execution clients
  async getP2PStatus() {
    // Service definitions with type and Prometheus labels for p2p status
    const services = {
      consensus: {
        TekuBeaconService: ["beacon_peer_count"],
        LighthouseBeaconService: ["libp2p_peers"],
        PrysmBeaconService: ["p2p_peer_count"], // needs to query for state="Connected"!
        NimbusBeaconService: ["nbc_peers"],
        LodestarBeaconService: ["libp2p_peers"],
        GrandineBeaconService: ["libp2p_peers"],
      },
      execution: {
        GethService: ["p2p_peers"],
        RethService: ["reth_network_connected_peers"],
        BesuService: ["ethereum_peer_count"],
        NethermindService: ["nethermind_sync_peers"],
        ErigonService: ["p2p_peers"],
      },
    };

    // Prometheus job definitions
    const jobs = {
      GrandineBeaconService: "grandine_beacon",
      TekuBeaconService: "teku_beacon",
      LighthouseBeaconService: "lighthouse_beacon",
      PrysmBeaconService: "prysm_beacon",
      NimbusBeaconService: "nimbus_beacon",
      LodestarBeaconService: "lodestar_beacon",
      GethService: "geth",
      RethService: "reth",
      BesuService: "besu",
      NethermindService: "nethermind",
      ErigonService: "erigon",
    };

    // Merge all labels for Prometheus query
    const serviceLabels = [];
    for (let property in services) {
      for (let prop in services[property]) {
        for (let p of services[property][prop]) {
          serviceLabels.push(p);
        }
      }
    }

    // Get all service configurations
    const serviceInfos = await this.getServiceInfos();
    if (serviceInfos.length < 1) {
      return {
        code: 221,
        info: "error: service infos for p2pstatus not available",
        data: "",
      };
    }

    // const tenMinutesAgo = Math.floor(Date.now() / 1000) - 10 * 60;

    // Query Prometehus for all possible labels
    const prometheus_result = await this.queryPrometheus('{__name__=~"' + serviceLabels.join("|") + '"}');

    // console.log("prometheus_result ========>", prometheus_result.data.result);
    if (typeof prometheus_result !== "object" || !prometheus_result.hasOwnProperty("status") || prometheus_result.status != "success") {
      return {
        code: 223,
        info: "error: prometheus query for p2pstatus failed",
        data: prometheus_result,
      };
    }

    // Build pairs for the FrontEnd (cc and ec member)
    const clientTypes = Object.keys(services);
    const groups = [];
    for (let i = 0; i < serviceInfos.length; i++) {
      // Find execution and consensus service configurations for this group
      let clt = serviceInfos[i];
      if (typeof clt !== "object" || !clt.hasOwnProperty("service") || !clt.hasOwnProperty("config")) continue;
      let isConsensus = clt.service in services.consensus;
      let hasMembers = clt.config.dependencies.executionClients.length ? true : false;
      if (!isConsensus || !hasMembers) continue;
      let cc = clt;
      let ec = null;
      try {
        ec = cc.config.dependencies.executionClients[0];
        if (typeof ec !== "object" || !ec.hasOwnProperty("service") || !ec.hasOwnProperty("id")) continue;
        ec = serviceInfos.find((item) => item.config.serviceID == ec.id);
      } catch (e) {
        continue;
      }

      // Setup details
      var details = {};
      var detailsbase = {
        service: "unknown",
        client: "unknown",
        state: "unknown",
        numPeer: 0,
        numPeerBy: {
          source: "prometheus",
          fields: [],
        },
        maxPeer: 0,
        maxPeerBy: {
          source: "config",
          fields: [],
        },
        valPeer: 0,
      };

      // Get max peers for consensus and execution clients by configuration or their default values
      // Do not disable consensuc/execution vars on lint warning because they are used with eval!
      let consensus = cc; // eslint-disable-line no-unused-vars
      let execution = ec; // eslint-disable-line no-unused-vars
      var data = {},
        opttyp = null,
        optnam = null,
        defval = null,
        optval = null,
        regexp = null;
      clientTypes.forEach(function (clientType, index /* eslint-disable-line no-unused-vars */) {
        let clt = "";
        eval("clt = " + clientType + ";"); // eval clt object from consensus/execution objects
        details[clientType] = JSON.parse(JSON.stringify(detailsbase)); // clone detailsbase!
        details[clientType]["service"] = clt.service;
        details[clientType]["client"] = clt.service.replace(/Beacon|Service/gi, "").toUpperCase();
        details[clientType]["state"] = clt.state;
        details[clientType]["serviceID"] = clt.config.serviceID;
        opttyp = Object.keys(services).find((key) => services[key].hasOwnProperty(clt.service));
        if (!opttyp) {
          return;
        }
        if (clt.service == "TekuBeaconService") {
          // --p2p-peer-upper-bound (Default: 100)
          optnam = "--p2p-peer-upper-bound";
          defval = 100;
        } else if (clt.service == "LighthouseBeaconService") {
          // --target-peers (Default: 80) + 10%
          // See extra dealing with + 10% below!
          optnam = "--target-peers";
          defval = 100;
        } else if (clt.service == "GrandineBeaconService") {
          optnam = "--target-peers";
          defval = 80;
        } else if (clt.service == "PrysmBeaconService") {
          // --p2p-max-peers (Default: 45)
          optnam = "--p2p-max-peers";
          defval = 45;
        } else if (clt.service == "NimbusBeaconService") {
          // --max-peers (The target number of peers to connect to, default: 160)
          // --hard-max-peers (The maximum number of peers to connect to. Defaults to maxPeers * 1.5)
          // See extra dealing with --hard-max-peers below!
          optnam = "--max-peers";
          defval = 160;
        } else if (clt.service == "LodestarBeaconService") {
          // --targetPeers(The target connected peers. Above this number peers will be disconnected, default: 50) + 10%
          // See extra dealing with + 10% below!
          optnam = "--targetPeers";
          defval = 100;
        } else if (clt.service == "GethService") {
          // [MAXVAL: --maxpeers (Default: 50)]
          optnam = "--maxpeers";
          defval = 50;
        } else if (clt.service == "RethService") {
          // [MAXVAL: --maxpeers (Default: 50)]
          optnam = "--maxpeers";
          defval = 100;
        } else if (clt.service == "BesuService") {
          // --max-peers (Default: 25)
          optnam = "--max-peers";
          defval = 25;
        } else if (clt.service == "NethermindService") {
          // --Network.MaxActivePeers (Default: 50)
          optnam = "--Network.MaxActivePeers";
          defval = 50;
        } else if (clt.service == "ErigonService") {
          // --maxpeers (Default: 100)
          // https://github.com/ledgerwatch/erigon/issues/2853
          optnam = "--maxpeers";
          defval = 100;
        } else {
          return;
        }
        regexp = new RegExp(optnam + "=(\\d+)", "si");
        if (Array.isArray(clt.config.command)) {
          try {
            optval = clt.config.command
              .find((item) => item.match(regexp))
              .match(regexp)
              .pop();
          } catch (e) {
            optval = defval;
          }
        } else {
          try {
            optval = clt.config.command.match(regexp).pop();
          } catch (e) {
            optval = defval;
          }
        }
        optval = parseInt(optval);
        if (clt.service == "LighthouseBeaconService") {
          // Extra calculate Lighthouse --target-peers + 10%
          optval = Math.round(optval * 1.1);
        }
        if (clt.service == "LodestarBeaconService") {
          // Extra calculate Lodestar --targetPeers + 10%
          optval = Math.round(optval * 1.1);
        }
        details[opttyp]["maxPeer"] = optval;
        details[opttyp]["maxPeerBy"]["fields"].push(optnam);
        if (clt.service == "NimbusBeaconService") {
          // Extra calculate Nimbus --hard-max-peers by Nimbus --max-peers
          if (!opttyp) {
            return;
          }
          optnam = "--hard-max-peers"; // Defaults to maxPeers (Nimbus "--max-peers") * 1.5
          defval = Math.round(optval * 1.5); // optval is here Nimbus --max-peers that was calculated in the current loop
          regexp = new RegExp(optnam + "=(\\d+)", "si");
          if (Array.isArray(clt.config.command)) {
            try {
              optval = clt.config.command
                .find((item) => item.match(regexp))
                .match(regexp)
                .pop();
            } catch (e) {
              optval = defval;
            }
          } else {
            try {
              optval = clt.config.command.match(regexp).pop();
            } catch (e) {
              optval = defval;
            }
          }
          optval = parseInt(optval);
          details[opttyp]["maxPeer"] = optval;
          details[opttyp]["maxPeerBy"]["fields"].push(optnam);
        }
      });

      // Filter Prometheus result by current used services and calculate number of currently used peers per client
      // Note that Prysm requires to match state="Connected" and Lodestar direction="outbound"
      try {
        var maxPeer = 0,
          numPeer = 0,
          valPeer = 0;
        clientTypes.forEach(function (clientType, index /* eslint-disable-line no-unused-vars*/) {
          let clt = "";
          eval("clt = " + clientType + ";"); // eval clt object from consensus/execution objects
          let xx = prometheus_result.data.result.filter(
            (s) =>
              services[clientType][clt.service].includes(s.metric.__name__) &&
              s.metric.instance.includes(clt.config.instanceID) &&
              s.metric.job == jobs[clt.service] &&
              (clt.service == "PrysmBeaconService" ? s.metric.state == "Connected" : true)
          );
          if (xx.length) {
            services[clientType][clt.service].forEach(function (item, index) {
              try {
                //Nethermind returns the peers per client type (e.g. Geth, Erigon, Nethermind ...), therefore we need to sum them up
                if (clt.service == "NethermindService") {
                  details[clientType]["numPeer"] = parseInt(
                    xx
                      .filter((s) => s.metric.__name__ == services[clientType][clt.service][index])
                      .reduce((total, obj) => total + parseInt(obj.value.pop()), 0)
                  );
                } else {
                  details[clientType]["numPeer"] = parseInt(
                    xx
                      .filter((s) => s.metric.__name__ == services[clientType][clt.service][index])
                      .pop()
                      .value.pop()
                  );
                }
                details[clientType]["numPeerBy"]["fields"].push(item);
              } catch (e) {}
            });
          }

          // Summarize details
          //details[clientType]["maxPeer"] = details[clientType]["maxPeer"];
          details[clientType]["numPeer"] =
            details[clientType]["numPeer"] > details[clientType]["maxPeer"]
              ? details[clientType]["maxPeer"]
              : details[clientType]["numPeer"];
          details[clientType]["valPeer"] = Math.round((details[clientType]["numPeer"] / details[clientType]["maxPeer"]) * 100);
          details[clientType]["valPeer"] = details[clientType]["valPeer"] > 100 ? 100 : details[clientType]["valPeer"];

          // Summarize totals
          maxPeer = parseInt(maxPeer + details[clientType]["maxPeer"]);
          numPeer = parseInt(numPeer + details[clientType]["numPeer"]);
          valPeer = Math.round((numPeer / maxPeer) * 100);
        });

        // Respond success for this group
        // Define the response for "valPeer" exact as defined in front-end as percentage (%).
        // Avoid overdues that may happen during peer cleaning. The exact values can be taken
        // from the details object if needed.
        data = {
          details: details,
          maxPeer: maxPeer,
          numPeer: numPeer > maxPeer ? maxPeer : numPeer,
          valPeer: valPeer > 100 ? 100 : valPeer,
        };
      } catch (err) {
        return {
          code: 224,
          info: "error: no prometheus data for p2pstatus available yet",
          data: err,
        };
      }
      groups.push(data);
    }

    // Make sure at least one pair of consensus and execution service configurations exists
    if (groups.length < 1) {
      return {
        code: 225,
        info: "error: a pair of consensus and execution client does not exist (in p2pstatus)",
        data: serviceInfos,
      };
    }

    // success
    return {
      code: 0,
      info: "success: p2pstatus successfully retrieved",
      data: groups,
    };
  }

  // Get storage status of all services
  async getStorageStatus(live = false) {
    // Define services that should be ignored and NOT queried at all
    const ignoreServices = ["PrometheusNodeExporterService"];

    // By default return cached data (if available)
    if (!live) {
      if (!this.globalMonitoringCache.hasOwnProperty("storagestatus") || !this.globalMonitoringCache.storagestatus.hasOwnProperty("data")) {
        return {
          code: 330,
          info: "error: storagestatus not available (waiting for updated cache)",
          data: "",
        };
      }
      return this.globalMonitoringCache.storagestatus;
    }

    // Get all service configurations
    const serviceInfos = await this.getServiceInfos();
    if (serviceInfos.length < 1) {
      return {
        code: 331,
        info: "error: service infos for storagestatus not available",
        data: "",
      };
    }

    // Build ssh commands to query storages
    var sshcommands = [];
    for (let svc of serviceInfos) {
      if (typeof svc !== "object" || !svc.hasOwnProperty("service") || !svc.hasOwnProperty("config")) {
        continue;
      }
      if (ignoreServices.includes(svc.service)) {
        continue;
      }
      if (Array.isArray(svc.config.volumes) && svc.config.volumes.length) {
        const strVolumes = '"' + svc.config.volumes.flatMap(({ destinationPath }) => destinationPath).join('" "') + '"';
        sshcommands.push({
          svc: svc,
          cmd: "du -csh " + strVolumes + " | tail -n1 | awk '{print $1;}'",
        });
      }
    }
    var sshcmd = sshcommands
      .flatMap(({ cmd }) => cmd)
      .join(" ; ")
      .trim();
    if (!sshcmd) {
      return {
        code: 332,
        info: "error: no storage volumes available (detected in storagestatus)",
        data: serviceInfos,
      };
    }

    // Execute the command on the node
    let result = null;
    try {
      result = await this.nodeConnectionProm.sshService.exec(sshcmd);
    } catch (err) {
      return {
        code: 333,
        info: "error: failed to execute ssh command in storagestatus",
        data: err,
      };
    }

    // No data in stdout or data in stderr? Executed code above failed to run!
    if (result.rc || result.stdout == "" /*|| result.stderr != ""*/) {
      var err = "error: ssh command in storagestatus failed with return code " + result.rc;
      if (result.stderr != "") {
        err += " (" + result.stderr + ")";
      } else if (result.stdout == "") {
        err += " (syntax error)";
      }
      return {
        code: 334,
        info: err,
        data: result,
      };
    }

    // Parse the result and add the response for "storageDataItems" exact as defined in front-end
    var data = [];
    var storagesizes = result.stdout.trim().split("\n");
    storagesizes.forEach(function (val, index) {
      let svc = index in sshcommands ? sshcommands[index].svc : false;

      if (svc) {
        // Prometheus NE does not store data but using "/" as volume, see #1095
        // Likely not queried at all if defined in ignoreServices (see above)
        if (svc.service === "PrometheusNodeExporterService") {
          //val = 0; // Solution A: Show 0 B as value for Prometheus NE
          return; // Solution B: Do not show Prometheus NE at all in the storage list
        }
        data.push({
          id: index + 1,
          title: svc.service
            .replace(/Beacon|Service/gi, "")
            .replace(/Validator/gi, " vc")
            .replace(/NodeExporter/gi, " ne")
            .toUpperCase(),
          storageValue: (!val || val < 1 ? "0 " : val.replace(/([a-z]+)/is, " $1")) + "B",
          service: svc.service,
        });
      }
    });

    // Respond success
    return {
      code: 0,
      info: "success: storagestatus successfully retrieved",
      data: data,
    };
  }

  // Get attestation rewards for given validators and epoch
  async getAttestationRewards(validators) {
    if (validators.length === 0) return [];
    try {
      // Get local beacon port from first available consensus client
      const beaconResult = await this.findBeaconPort();
      if (beaconResult.code) {
        throw new Error("error: could not get balancestatus due to missing beacon port (" + beaconResult.info + ")");
      }
      const baseURL = `http://127.0.0.1:${beaconResult.data.port}`;

      // Get latest finalized epoch
      const finalizedResult = await this.queryBeaconApi(baseURL, "/eth/v1/beacon/states/head/finality_checkpoints");
      const finalizedEpoch = finalizedResult.data.api_reponse.data.finalized.epoch;

      // Get attestation rewards for given validators
      const attestationResult = await this.queryBeaconApi(
        baseURL,
        "/eth/v1/beacon/rewards/attestations/" + finalizedEpoch,
        validators,
        "POST"
      );
      const rewardsPerValidator = attestationResult.data.api_reponse.data.total_rewards.map((data) => {
        return {
          ...data,
          total_rewards: parseInt(data.head) + parseInt(data.source) + parseInt(data.target) + parseInt(data.inactivity),
        };
      });

      return { finalized_epoch: finalizedEpoch, rewards: rewardsPerValidator };
    } catch (error) {
      log.error("Getting Attestation Rewards Failed:\n" + error);
      return {
        code: error.code ? error.code : 1,
        info: error.message ? error.message : error.info,
        data: error.data ? error.data : JSON.stringify(error),
      };
    }
  }

  // Get block rewards for given slot (count them together for whole epoch in frontend)
  async getBlockRewards(slot) {
    try {
      // Get local beacon port from first available consensus client
      const beaconResult = await this.findBeaconPort();
      if (beaconResult.code) {
        throw new Error("error: could not get balancestatus due to missing beacon port (" + beaconResult.info + ")");
      }
      const baseURL = `http://127.0.0.1:${beaconResult.data.port}`;

      // Get attestation rewards for given validators
      const blockResult = await this.queryBeaconApi(baseURL, "/eth/v1/beacon/rewards/blocks/" + slot);
      return blockResult.data.api_reponse.data;
    } catch (error) {
      log.error("Getting Block Rewards Failed:\n" + error);
      return {
        code: error.code ? error.code : 1,
        info: error.message ? error.message : error.info,
        data: error.data ? error.data : JSON.stringify(error),
      };
    }
  }

  // Get Sync Committee for given validators and slot (count them together for whole epoch in frontend)
  async getSyncCommitteeRewards(validators, slot) {
    if (validators.length === 0) return [];
    try {
      // Get local beacon port from first available consensus client
      const beaconResult = await this.findBeaconPort();
      if (beaconResult.code) {
        throw new Error("error: could not get balancestatus due to missing beacon port (" + beaconResult.info + ")");
      }
      const baseURL = `http://127.0.0.1:${beaconResult.data.port}`;

      // Get attestation rewards for given validators
      const blockResult = await this.queryBeaconApi(baseURL, "/eth/v1/beacon/rewards/sync_committee/" + slot, validators, "POST");
      return blockResult.data.api_httpcode == 200 ? blockResult.data.api_reponse.data : [];
    } catch (error) {
      log.error("Getting Block Rewards Failed:\n" + error);
      return {
        code: error.code ? error.code : 1,
        info: error.message ? error.message : error.info,
        data: error.data ? error.data : JSON.stringify(error),
      };
    }
  }

  // Get balance status
  async getBalanceStatus() {
    // Get local beacon port from first available consensus client
    const beaconResult = await this.findBeaconPort();
    if (beaconResult.code) {
      return {
        code: 441,
        info: "error: could not get balancestatus due to missing beacon port (" + beaconResult.info + ")",
        data: "",
      };
    }
    const baseURL = `http://127.0.0.1:${beaconResult.data.port}`;

    // Get all service configurations
    const serviceInfos = await this.getServiceInfos();
    if (serviceInfos.length < 1) {
      return {
        code: 442,
        info: "error: service infos for balancestatus not available",
        data: "",
      };
    }

    // Filter validator service configurations
    const validatorServiceInfos = serviceInfos.filter((s) => s.service.includes("ValidatorService"));
    if (validatorServiceInfos.length < 1) {
      return {
        code: 443,
        info: "error: validator service infos for balancestatus not available",
        data: "",
      };
    }

    // Get all imported public keys for each running validator service
    let arrValidatorPublicKeys = [];
    for (const obj of validatorServiceInfos) {
      const result = await this.getPublicKeys(obj.config.serviceID);
      if (result.code) {
        result.code = 444;
        result.info = "error: validator public keys for balancestatus not available -> " + result.info;
        return result;
      }
      arrValidatorPublicKeys = [...arrValidatorPublicKeys, ...result.data];
    }
    arrValidatorPublicKeys = [...new Set(arrValidatorPublicKeys)]; // unique values!

    // Get most recent finalized epoch
    const finalityResult = await this.queryBeaconApi(baseURL, "/eth/v1/beacon/states/head/finality_checkpoints");
    if (finalityResult.code) {
      return {
        code: 445,
        info: "error: could not get balancestatus due to failed finality query (" + finalityResult.info + ")",
        data: baseURL + "/eth/v1/beacon/states/head/finality_checkpoints",
      };
    }

    // Define response data and return immediately if no validators imported on the local system
    const finalizedEpoch = finalityResult.data.api_reponse.data.finalized.epoch;
    const data = { finalized_epoch: finalizedEpoch, balance: 0 };
    if (arrValidatorPublicKeys.length < 1) {
      return {
        code: 0,
        info: "success: balancestatus successfully retrieved (but no validators imported)",
        data: data,
      };
    }

    // Get total balance of all validators on the system for most recent finalized epoch
    const attestationResult = await this.queryBeaconApi(
      baseURL,
      `/eth/v1/beacon/rewards/attestations/${finalizedEpoch}`,
      arrValidatorPublicKeys,
      "POST",
      {
        "Content-Type": "application/json",
      }
    );
    if (attestationResult.code) {
      return {
        code: 446,
        info: "error: could not get balancestatus due to failed attestations query (" + attestationResult.info + ")",
        data: "",
      };
    }
    try {
      if (Array.isArray(attestationResult.data.api_reponse.data.total_rewards)) {
        for (const obj of attestationResult.data.api_reponse.data.total_rewards) {
          if (!obj.hasOwnProperty("validator_index") || !obj.validator_index) {
            continue;
          }
          // Values for "head", "source" and "target" are in GWei!
          // head: "1989";
          // source: "2792";
          // target: "5294";
          // validator_index: "216403";
          data.balance += parseInt(obj.head) + parseInt(obj.source) + parseInt(obj.target);
        }
      }
    } catch (e) {
      return {
        code: 447,
        info: "error: could not get balancestatus due to failed attestations summary",
        data: "",
      };
    }

    // success
    return {
      code: 0,
      info: "success: balancestatus successfully retrieved",
      data: data,
    };
  }

  // Open RPC tunnel(s) on request
  async openRpcTunnel(args) {
    var { force_fresh } = Object.assign(
      {
        force_fresh: false,
      },
      args
    );

    // Get current RPC status
    const rpcstatus = await this.getRpcStatus();
    if (rpcstatus.code) return rpcstatus;

    // Get available ports
    const localPorts = await this.nodeConnection.checkAvailablePorts({
      min: 8545,
      max: 8999,
      amount: rpcstatus.data.length,
    });

    // Make sure there are enough ports available
    if (localPorts.length !== rpcstatus.data.length) {
      return {
        code: 1,
        info: "error: not enough local ports available for all RPC services",
        data: "",
      };
    }

    // Helper function to open a tunnel
    const openTunnel = async (service) => {
      const { sName, sid, rpc } = service;
      const { destinationIp: addr, destinationPort: port } = rpc;

      // Check if the tunnel is already open
      if (this.rpcTunnel[sid] > 0 && !force_fresh) {
        return;
      }

      // Open the tunnel
      try {
        const localPort = localPorts.shift();
        await this.nodeConnection.openTunnels([
          {
            sName: sName,
            dstHost: addr,
            dstPort: port,
            localPort: localPort,
          },
        ]);
        // Update tunnel with opened port
        this.rpcTunnel[sid] = localPort;
      } catch (e) {
        // On any error stop opening further tunnels and close all already opened
        await this.closeRpcTunnel();
        const freshrpcstatus = await this.getRpcStatus();
        freshrpcstatus.info += "(fresh after failed attempt to open rpc tunnels)";
        return {
          code: 2,
          info: `error: failed to open tunnels (${e})`,
          data: freshrpcstatus,
        };
      }
    };

    if (args) {
      // Create a tunnel for a single service
      const service = rpcstatus.data.find((service) => service.sid === args);
      if (!service) {
        return {
          code: 1,
          info: "error: service not found",
          data: "",
        };
      }
      return openTunnel(service);
    } else {
      // Create a tunnel for each service
      for (const service of rpcstatus.data) {
        const result = await openTunnel(service);
        if (result && result.code === 2) {
          return result;
        }
      }
    }

    // Respond success with fresh RPC status data
    const freshrpcstatus = await this.getRpcStatus();
    freshrpcstatus.info += "(fresh after opening rpc tunnels)";
    return {
      code: 0,
      info: "success: tunnels successfully opened",
      data: freshrpcstatus,
    };
  }

  // Close RPC tunnel(s) on request
  async closeRpcTunnel() {
    // Close all open tunnels, ignore any errors
    try {
      const openTunnels = Object.values(this.rpcTunnel);
      if (openTunnels.length) {
        await this.nodeConnection.closeTunnels(openTunnels);
        this.rpcTunnel = {};
      }
    } catch (e) {}

    // Respond success with fresh RPC status data
    const freshrpcstatus = await this.getRpcStatus();
    freshrpcstatus.info = freshrpcstatus.info + "(fresh after closing rpc tunnels)";
    return {
      code: 0,
      info: "success: tunnels successfully closed",
      data: freshrpcstatus,
    };
  }

  // Get RPC status
  async getRpcStatus() {
    // Service definitions with their associated rpc api (service) port
    const services = {
      GethService: 8545,
      RethService: 8545,
      BesuService: 8545,
      NethermindService: 8545,
      ErigonService: 8545,
    };

    // Set timestamp in micro seconds
    var now = Date.now();

    // Get service infos
    const serviceInfos = await this.getServiceInfos();
    if (serviceInfos.length < 1) {
      return {
        code: 1,
        info: "error: service infos unavailable",
        data: "",
      };
    }

    // Get execution clients with RPC data by service name
    const data = [];
    const executions = serviceInfos.filter((s) => Object.keys(services).includes(s.service));
    for (let i = 0; i < executions.length; i++) {
      // Make sure execution client is valid and running
      let execution = executions[i];
      if (
        typeof execution !== "object" ||
        !execution.hasOwnProperty("config") ||
        !execution.hasOwnProperty("state") ||
        execution.state != "running"
      ) {
        continue;
      }

      // Filter the RPC port configuration and get addr/port that is mapped on docker host
      const sid = execution.config.serviceID;
      const sName = execution.service;
      const rpc = execution.config.ports
        .filter((p) => p.servicePort == services[execution.service])
        .slice(-1)
        .pop();
      if (typeof rpc !== "object" || !rpc.hasOwnProperty("destinationIp") || !rpc.hasOwnProperty("destinationPort")) {
        continue;
      }
      rpc.destinationIp = rpc.destinationIp == "0.0.0.0" ? "127.0.0.1" : rpc.destinationIp; // FIX: rpc.destinationIp could be 0.0.0.0 if config was changed in expert mode
      let addr = rpc.destinationIp;
      let port = rpc.destinationPort;

      // Check if RPC port is enabled
      // Changed query to "eth_blockNumber" since "web3_clientVersion" may not available by default in all clients (like Erigon)
      let result = await this.queryRpcApi({ addr: addr, port: port }, "eth_blockNumber");
      if (result.code) continue;

      // Add valid client to final result
      data.push({
        now: now,
        sName: sName,
        sid: sid,
        rpc: rpc,
        url: this.rpcTunnel[sid] > 0 ? "http://" + addr + ":" + this.rpcTunnel[sid] : "",
        clt: execution.service.replace(/Service/gi, "").toUpperCase(),
      });
    }

    // Final check
    if (data.length < 1) {
      return {
        code: 2,
        info: "error: no running execution client with enabled RPC port found",
        data: "",
      };
    }

    // Respond success
    return {
      code: 0,
      info: "success: rpcstatus successfully retrieved",
      data: data,
    };
  }

  // Open WS tunnel(s) on request
  async openWsTunnel(args) {
    // Extract arguments
    var { force_fresh } = Object.assign(
      {
        force_fresh: false,
      },
      args
    );

    // Get current WS status
    const wsstatus = await this.getWsStatus();
    if (wsstatus.code) return wsstatus;

    // Get available ports
    const localPorts = await this.nodeConnection.checkAvailablePorts({
      min: 8546,
      max: 8999,
      amount: wsstatus.data.length,
    });

    // Make sure there are enough ports available
    if (localPorts.length !== wsstatus.data.length) {
      return {
        code: 1,
        info: "error: not enough local ports available for all WS services",
        data: "",
      };
    }

    // Helper function to open a tunnel
    const openTunnel = async (service) => {
      const { sid, ws } = service;
      const { destinationIp: addr, destinationPort: port } = ws;

      // Check if the tunnel is already open
      if (this.wsTunnel[sid] > 0 && !force_fresh) {
        return;
      }

      // Open the tunnel
      try {
        const localPort = localPorts.shift();
        await this.nodeConnection.openTunnels([
          {
            dstHost: addr,
            dstPort: port,
            localPort: localPort,
          },
        ]);
        // Update tunnel with opened port
        this.wsTunnel[sid] = localPort;
      } catch (e) {
        // On any error stop opening further tunnels and close all already opened
        await this.closeWsTunnel();
        const freshwsstatus = await this.getWsStatus();
        freshwsstatus.info += "(fresh after failed attempt to open ws tunnels)";
        return {
          code: 2,
          info: `error: failed to open tunnels (${e})`,
          data: freshwsstatus,
        };
      }
    };

    if (args) {
      const service = wsstatus.data.find((service) => service.sid === args);
      if (!service) {
        return {
          code: 1,
          info: "error: service not found",
          data: "",
        };
      }
      return openTunnel(service);
    } else {
      // Create a tunnel for each service
      for (const service of wsstatus.data) {
        const result = await openTunnel(service);
        if (result && result.code === 2) {
          return result;
        }
      }
    }

    // Respond success with fresh WS status data
    const freshwsstatus = await this.getWsStatus();
    freshwsstatus.info += "(fresh after opening ws tunnels)";
    return {
      code: 0,
      info: "success: tunnels successfully opened",
      data: freshwsstatus,
    };
  }

  // Close WS tunnel(s) on request
  async closeWsTunnel() {
    // Close all open tunnels, ignore any errors
    try {
      const openTunnels = Object.values(this.wsTunnel);
      if (openTunnels.length) {
        await this.nodeConnection.closeTunnels(openTunnels);
        this.wsTunnel = {};
      }
    } catch (e) {}

    // Respond success with fresh WS status data
    const freshwsstatus = await this.getWsStatus();
    freshwsstatus.info = freshwsstatus.info + "(fresh after closing ws tunnels)";
    return {
      code: 0,
      info: "success: tunnels successfully closed",
      data: freshwsstatus,
    };
  }

  // Get WS status
  async getWsStatus() {
    // Service definitions with their associated ws api (service) port
    const services = {
      GethService: 8546,
      RethService: 8546,
      BesuService: 8546,
      NethermindService: 8546,
      ErigonService: 8545,
    };

    // Set timestamp in micro seconds
    var now = Date.now();

    // Get service infos
    const serviceInfos = await this.getServiceInfos();
    if (serviceInfos.length < 1) {
      return {
        code: 1,
        info: "error: service infos unavailable",
        data: "",
      };
    }

    // Get execution clients with WS data by service name
    const data = [];
    const executions = serviceInfos.filter((s) => Object.keys(services).includes(s.service));
    for (let i = 0; i < executions.length; i++) {
      // Make sure execution client is valid and running
      let execution = executions[i];
      if (
        typeof execution !== "object" ||
        !execution.hasOwnProperty("config") ||
        !execution.hasOwnProperty("state") ||
        execution.state != "running"
      ) {
        continue;
      }

      // Filter the WS port configuration and get addr/port that is mapped on docker host
      const sid = execution.config.serviceID;
      const ws = execution.config.ports
        .filter((p) => p.servicePort == services[execution.service])
        .slice(-1)
        .pop();
      if (typeof ws !== "object" || !ws.hasOwnProperty("destinationIp") || !ws.hasOwnProperty("destinationPort")) {
        continue;
      }
      ws.destinationIp = ws.destinationIp == "0.0.0.0" ? "127.0.0.1" : ws.destinationIp; // FIX: ws.destinationIp could be 0.0.0.0 if config was changed in expert mode
      let addr = ws.destinationIp;
      let port = ws.destinationPort;

      // Check if WS port is enabled
      let result = await this.isWsAvailable({ addr: addr, port: port });
      if (result.code) continue;

      // Add valid client to final result
      data.push({
        now: now,
        sid: sid,
        ws: ws,
        url: this.wsTunnel[sid] > 0 ? "http://" + addr + ":" + this.wsTunnel[sid] : "",
        clt: execution.service.replace(/Service/gi, "").toUpperCase(),
      });
    }

    // Final check
    if (data.length < 1) {
      return {
        code: 2,
        info: "error: no running execution client with enabled WS port found",
        data: "",
      };
    }

    // Respond success
    return {
      code: 0,
      info: "success: wsstatus successfully retrieved",
      data: data,
    };
  }

  // Check if WS Port is open on the node (via CURL on localhost)
  // Arguments:
  // url=<mixed>     : [REQUIRED] Full HTTP API URL of the RPC server or object of {addr:'<addr>',port:'<port>'}
  // timeout=<number>: [OPTIONAL] Timeout in seconds for the HTTP request (default: 2)
  // Returns true if WS port is open, false otherwiese
  async isWsAvailable(url, timeout = 2) {
    // Format url
    if (typeof url === "string") {
      url = url.trim();
    } else if (typeof url === "object") {
      let def = { addr: "127.0.0.1", port: 0 };
      url = { ...def, ...url };
      url = `http://${url.addr}:${url.port}`;
    }

    // Check url
    if (!url.startsWith("http")) {
      return {
        code: 1,
        info: "error: invalid url specified",
        data: "",
      };
    }

    // Check timeout
    if (isNaN(timeout) || timeout < 0) {
      return {
        code: 2,
        info: "error: invalid timeout specified",
        data: "",
      };
    }

    // Build curl command
    const key = "x3JJHMbDL1EzLkh9GBhXDw==";
    const cmd = `
      curl -i -N \
      -H "Connection: Upgrade" \
      -H "Upgrade: websocket" \
      -H "Sec-WebSocket-Version: 13" \
      -H "Sec-WebSocket-Key: ${key}" \
      --connect-timeout ${timeout} \
      --max-time 0.25 \
      -w "\\n%{http_code}" \
      ${url}
    `.trim();

    // Execute curl command
    const wsResult = await this.nodeConnection.sshService.exec(cmd);

    let statuscode = 0;
    try {
      let r = wsResult.stdout.trim().split("\n");
      statuscode = r.length > 0 ? parseInt(r.pop()) : statuscode;
    } catch (e) {}

    // Respond true if websocket is available, false otherwise
    if (!wsResult.stdout.toLowerCase().includes("sec-websocket") && statuscode != 200) {
      return {
        code: 2,
        info: "error: ws port not available",
        data: "",
      };
    }

    // Success
    return {
      code: 0,
      info: "success: ws port available",
      data: wsResult,
    };
  }

  // Open BEACON tunnel(s) on request
  async openBeaconTunnel(args) {
    // Extract arguments
    var { force_fresh } = Object.assign(
      {
        force_fresh: false,
      },
      args
    );

    // Get current BEACON status
    const beaconstatus = await this.getBeaconStatus();
    if (beaconstatus.code) return beaconstatus;

    // Get available ports
    const localPorts = await this.nodeConnection.checkAvailablePorts({
      min: 5545,
      max: 5999,
      amount: beaconstatus.data.length,
    });

    // Make sure there are enough ports available
    if (localPorts.length !== beaconstatus.data.length) {
      return {
        code: 1,
        info: "error: not enough local ports available for all BEACON services",
        data: "",
      };
    }

    // Helper function to open a tunnel
    const openTunnel = async (service) => {
      const { sid, beacon } = service;
      const { destinationIp: addr, destinationPort: port } = beacon;

      // Check if the tunnel is already open
      if (this.beaconTunnel[sid] > 0 && !force_fresh) {
        return;
      }

      // Open the tunnel
      try {
        const localPort = localPorts.shift();
        await this.nodeConnection.openTunnels([
          {
            dstHost: addr,
            dstPort: port,
            localPort: localPort,
          },
        ]);
        // Update tunnel with opened port
        this.beaconTunnel[sid] = localPort;
      } catch (e) {
        // On any error stop opening further tunnels and close all already opened
        await this.closeBeaconTunnel();
        const freshbeaconstatus = await this.getBeaconStatus();
        freshbeaconstatus.info += "(fresh after failed attempt to open beacon tunnels)";
        return {
          code: 2,
          info: `error: failed to open tunnels (${e})`,
          data: freshbeaconstatus,
        };
      }
    };

    if (args) {
      const service = beaconstatus.data.find((service) => service.sid === args);
      if (!service) {
        return {
          code: 1,
          info: "error: service not found",
          data: "",
        };
      }
      return openTunnel(service);
    } else {
      // Create a tunnel for each service
      for (const service of beaconstatus.data) {
        const result = await openTunnel(service);
        if (result && result.code === 2) {
          return result;
        }
      }
    }

    // Respond success with fresh BEACON status data
    const freshbeaconstatus = await this.getBeaconStatus();
    freshbeaconstatus.info += "(fresh after opening beacon tunnels)";
    return {
      code: 0,
      info: "success: tunnels successfully opened",
      data: freshbeaconstatus,
    };
  }

  // Close BEACON tunnel(s) on request
  async closeBeaconTunnel() {
    // Close all open tunnels, ignore any errors
    try {
      const openTunnels = Object.values(this.beaconTunnel);
      if (openTunnels.length) {
        await this.nodeConnection.closeTunnels(openTunnels);
        this.beaconTunnel = {};
      }
    } catch (e) {}

    // Respond success with fresh BEACON status data
    const freshbeaconstatus = await this.getBeaconStatus();
    freshbeaconstatus.info = freshbeaconstatus.info + "(fresh after closing beacon tunnels)";
    return {
      code: 0,
      info: "success: tunnels successfully closed",
      data: freshbeaconstatus,
    };
  }

  // Get BEACON status
  async getBeaconStatus() {
    // Service definitions with their associated beacon api (service) port
    const services = {
      TekuBeaconService: 5051,
      LighthouseBeaconService: 5052,
      GrandineBeaconService: 5052,
      PrysmBeaconService: 3500,
      NimbusBeaconService: 5052,
      LodestarBeaconService: 9596,
    };

    // Set timestamp in micro seconds
    var now = Date.now();

    // Get service infos
    const serviceInfos = await this.getServiceInfos();
    if (serviceInfos.length < 1) {
      return {
        code: 1,
        info: "error: service infos unavailable",
        data: "",
      };
    }

    // Get consensus clients with BEACON data by service name
    const data = [];
    const consensusclients = serviceInfos.filter((s) => Object.keys(services).includes(s.service));
    for (let i = 0; i < consensusclients.length; i++) {
      // Make sure consensus client is valid and running
      let consensus = consensusclients[i];
      if (
        typeof consensus !== "object" ||
        !consensus.hasOwnProperty("config") ||
        !consensus.hasOwnProperty("state") ||
        consensus.state != "running"
      ) {
        continue;
      }

      // Filter the BEACON port configuration and get addr/port that is mapped on docker host
      const sid = consensus.config.serviceID;
      const beacon = consensus.config.ports
        .filter((p) => p.servicePort == services[consensus.service])
        .slice(-1)
        .pop();
      beacon.destinationIp = beacon.destinationIp == "0.0.0.0" ? "127.0.0.1" : beacon.destinationIp; // FIX: beacon.destinationIp could be 0.0.0.0 if config was changed in expert mode
      let addr = beacon.destinationIp;
      let port = beacon.destinationPort;

      // Check if BEACON port is enabled
      let result = await this.queryBeaconApi({ addr: addr, port: port }, "/eth/v1/node/syncing");
      if (result.code) continue;

      // Add valid client to final result
      data.push({
        now: now,
        sid: sid,
        beacon: { ...beacon, ...result.data.api_reponse.data },
        url: this.beaconTunnel[sid] > 0 ? "http://" + addr + ":" + this.beaconTunnel[sid] : "",
        clt: consensus.service.replace(/Beacon|Service/gi, "").toUpperCase(),
      });
    }

    // Final check
    if (data.length < 1) {
      return {
        code: 2,
        info: "error: no running consensus client with enabled BEACON port found",
        data: "",
      };
    }

    // Respond success
    return {
      code: 0,
      info: "success: beaconstatus successfully retrieved",
      data: data,
    };
  }

  // Get a list of all ports (including the associated service and protocol) that are available either publicly, locally or thru specific ip addresses
  // Accepts an optional object of arguments:
  // [OPTIONAL] addr=<string|array> (default: "public"):
  // - "public": retrieve only ports that are publicly available (which means not localhost/127.0.0.1)
  // - "local": retrieve only ports that are locally available (which thru localhost/127.0.0.1)
  // - ["IPv4"]: retrieve only ports that are available thru specified IP addresses
  // Returns array with code/info/data keys where:
  // - code: 0 means success and every other value means an error
  // - info: a info message regarding the last reuqest (for example success or error)
  // - data: a array of objects with port and associated protocol/service on success or empty string on errors
  async getPortStatus(args) {
    // Extract arguments
    var { addr } = Object.assign(
      {
        addr: "public",
      },
      typeof args === "object" ? args : {}
    );

    // Get service infos
    const serviceInfos = await this.getServiceInfos();
    if (serviceInfos.length < 1) {
      return {
        code: 1,
        info: "error: service infos unavailable",
        data: "",
      };
    }

    // Check and format addr
    const addr_type = Array.isArray(addr) ? "arr" : typeof addr === "string" && ["public", "local"].includes(addr) ? "str" : "invalid";
    addr = addr_type == "str" ? addr.toLowerCase().trim() : addr;
    if (addr_type == "invalid") {
      return {
        code: 1,
        info: 'error: addr must have a value of "public", "local" or an array of ip addresses',
        data: "",
      };
    }

    // Get ports that are bound to a public or local address (or to a address specified in addr array)
    let data = [];
    const local_addresses = ["127.0.0.1", "localhost"];
    const addresses = addr_type == "arr" ? addr : local_addresses;
    for (let i = 0; i < serviceInfos.length; i++) {
      let svc = serviceInfos[i];
      let ports = svc.config.ports;
      if (ports.length < 1) continue;
      for (let n = 0; n < ports.length; n++) {
        if (addr == "public" && addresses.some((w) => ports[n].destinationIp.toLowerCase().includes(w))) continue;
        if ((addr_type == "arr" || addr == "local") && !addresses.some((w) => ports[n].destinationIp.toLowerCase().includes(w))) continue;

        data.push({
          name: svc.service.replace(/Beacon|Service/gi, "").toUpperCase(),
          port: ports[n].destinationPort,
          prot: ports[n].servicePortProtocol,
          type: addr_type == "arr" ? addresses.find((w) => ports[n].destinationIp.toLowerCase().includes(w)) : addr,
          id: svc.config.serviceID,
        });
      }
    }

    // Remove equal ports values (usually the case with equal udp/tcp ports)
    // data = data.filter((value, index, self) =>
    //   index === self.findIndex((t) => (
    //     t.port === value.port
    //   ))
    // );

    // Return success
    const addinfo = addr_type === "str" ? "that are " + addr + "ly available" : "that are available thru ip " + addr.join(" or ");
    return {
      code: 0,
      info: "success: open ports " + addinfo + " retrieved",
      data: data,
    };
  }

  // Get a list of all ports (including the associated service and protocol) that are available publicly (which means thru an ip that is NOT localhost/127.0.0.1)
  async getPublicPortStatus() {
    return await this.getPortStatus({ addr: "public" });
  }

  // Get a list of all ports (including the associated service and protocol) that are available locally (thru localhost/127.0.0.1)
  async getLocalPortStatus() {
    return await this.getPortStatus({ addr: "local" });
  }

  // Used for fast debug/dev purposes
  async getDebugStatus() {
    // Get all service configurations
    const serviceInfos = await this.getServiceInfos();
    if (serviceInfos.length < 1) {
      return {
        code: 9999,
        info: "error: service infos for debugstatus not available",
        data: "",
      };
    }

    // Get all dependency infos
    const dependencyInfos = [];
    for (let i = 0; i < serviceInfos.length; i++) {
      dependencyInfos.push({
        service: serviceInfos[i].service,
        instanceID: serviceInfos[i].config.instanceID,
        dependencies: serviceInfos[i].config.dependencies,
      });
    }

    // Make an easy dependency view
    const easyInfos = [];
    for (let i = 0; i < serviceInfos.length; i++) {
      const hashDependencies =
        serviceInfos[i].config.dependencies.consensusClients.length || serviceInfos[i].config.dependencies.executionClients.length
          ? "yes"
          : "no";
      easyInfos.push({
        hashDependencies: hashDependencies,
        service: serviceInfos[i].service,
        instanceID: serviceInfos[i].config.instanceID,
        dependencies: serviceInfos[i].config.dependencies,
      });
    }

    return {
      serviceInfos: serviceInfos,
      dependencyInfos: dependencyInfos,
      easyInfos: easyInfos,
    };
  }

  // Get the number of subnet subscriptions for consensus clients
  async getSubnetSubs() {
    // Service definitions with type and Prometheus labels for subnet subscription
    const services = {
      consensus: {
        TekuBeaconService: ["network_subnet_peer_count"],
        LighthouseBeaconService: ["gossipsub_mesh_peer_counts"],
        GrandineBeaconService: ["gossipsub_mesh_peer_counts"],
        PrysmBeaconService: ["p2p_topic_peer_count"],
        NimbusBeaconService: ["libp2p_gossipsub_healthy_peers_topics"],
        LodestarBeaconService: ["gossipsub_topic_peer_count"],
      },
    };

    // Merge all labels for Prometheus query
    const serviceLabels = Object.values(services)
      .flatMap((service) => Object.values(service))
      .flatMap((labels) => labels);

    // Get all service configurations
    const serviceInfos = await this.getServiceInfos();
    if (serviceInfos.length < 1) {
      return {
        code: 221,
        info: "error: service infos for subnet-subscription not available",
        data: "",
      };
    }

    // Query Prometehus for all possible labels
    const prometheus_result = await this.queryPrometheus('{__name__=~"' + serviceLabels.join("|") + '"}');
    if (typeof prometheus_result !== "object" || !prometheus_result.hasOwnProperty("status") || prometheus_result.status != "success") {
      return {
        code: 223,
        info: "error: prometheus query for subnet-subscription failed",
        data: prometheus_result,
      };
    }

    const instanceCounts = {};

    // Iterate over the result array and count instances
    prometheus_result.data.result.forEach((item) => {
      const serviceId = item.metric.instance.replace(/^stereum-/, "").replace(/:\d+$/, "");
      if (instanceCounts[serviceId]) {
        instanceCounts[serviceId]++;
      } else {
        instanceCounts[serviceId] = 1;
      }
    });

    // Check serviceID in serviceInfos and count it
    const beaconServiceCounts = serviceInfos
      .filter((serviceInfo) => serviceInfo.service.includes("BeaconService"))
      .map((serviceInfo) => {
        const serviceId = serviceInfo.config.serviceID;
        return {
          serviceId: serviceId,
          subnetCount: instanceCounts[serviceId] || 0,
        };
      });

    // Make sure at least one consensus service currently running/existing
    if (beaconServiceCounts.length < 1) {
      return {
        code: 225,
        info: "error: consensus client does not exist/not running (in subnet subscription)",
        data: serviceInfos,
      };
    }

    // success
    return {
      code: 0,
      info: "success: subnet subscription retrieved successfully",
      data: beaconServiceCounts,
    };
  }

  // Get node stats (mostly by Prometheus)
  async getNodeStats() {
    try {
      const debugstatus = await this.getDebugStatus();
      // if(debugstatus.code)
      //   return debugstatus;
      const portstatus = await this.getPortStatus();
      // if(portstatus.code)
      //   return portstatus;
      const beaconstatus = await this.getBeaconStatus();
      // if(beaconstatus.code)
      //   return beaconstatus;
      const rpcstatus = await this.getRpcStatus();
      // if(rpcstatus.code)
      //   return rpcstatus;
      const wsstatus = await this.getWsStatus();
      // if(wsstatus.code)
      //   return wsstatus;
      const syncstatus = await this.getSyncStatus();
      // if(syncstatus.code)
      //   return syncstatus;
      const p2pstatus = await this.getP2PStatus();
      // if(p2pstatus.code)
      //   return p2pstatus;
      const subnetSubs = await this.getSubnetSubs();
      const rpcReceivedData = await this.nodeConnection.sshService.getRPCReceivedData();

      return {
        code: 0,
        info: "success: data successfully retrieved",
        data: {
          debugstatus: debugstatus,
          syncstatus: syncstatus,
          p2pstatus: p2pstatus,
          rpcstatus: rpcstatus,
          wsstatus: wsstatus,
          beaconstatus: beaconstatus,
          portstatus: portstatus,
          subnetSubs: subnetSubs,
          rpcReceivedData: rpcReceivedData,
        },
      };
    } catch (err) {
      return {
        code: 1,
        info: "error: an general error occurred",
        data: err,
      };
    }
  }

  // Just a demo for the Beacon API
  async myBeaconApiDemo() {
    // queryBeaconApi(endpoint,params=[],method="GET",headers={},cc_only=false)
    //let result = await this.queryBeaconApi("/eth/v1/node/health");
    //let result = await this.queryBeaconApi("/eth/v1/node/syncingx");
    let result = await this.queryBeaconApi("/eth/v1/node/syncing");
    // let result = await this.queryBeaconApi("/eth/v1/validator/sync_committee_subscriptions",[
    //   {
    //     "validator_index": "string",
    //     "sync_committee_indices": [
    //       "string"
    //     ],
    //     "until_epoch": "string"
    //   }
    // ],"POST");
    return result;
  }

  // Just a demo how to get all keys from prometheus and how to fetch different services thru getServiceInfos
  async getAllPrometheusKeysDemo() {
    const serviceInfos = await this.getServiceInfos("PrometheusService", "GrafanaService");
    const prometheus = serviceInfos.filter((s) => s.service == "PrometheusService").pop();
    if (typeof prometheus != "object") {
      return "we have a bad day ;)";
    }
    let addr = prometheus.config.ports[0].destinationIp; // the addr on the docker host
    let port = prometheus.config.ports[0].destinationPort; // the port on the docker host
    //let service_port = prometheus.config.ports[0].servicePort; // the port in the docker container eslint-disable-line no-unused-vars
    //let service_prot = prometheus.config.ports[0].servicePortProtocol; // the protocol on the docker host and in the container
    const cmd = `curl -s http://${addr}:${port}/api/v1/label/__name__/values`;
    const resp = await this.nodeConnection.sshService.exec(cmd);
    return resp;
  }

  // Get CPU temperature from the remote server using lm-sensors or hwmon
  async getCPUTemperature() {
    try {
      // Check and install lm-sensors if not installed
      const installed = await this.checkAndInstallLmSensors();
      if (installed) {
        const temperature = await this.getTemperatureFromLmSensors();
        if (temperature && temperature !== null) return temperature;
      }
      // Fallback to hwmon if lm-sensors does not provide a valid temperature
      return await this.getTemperatureFromHwmon();
    } catch (error) {
      console.error("Error determining CPU temperature:", error);
      throw error;
    }
  }

  async checkAndInstallLmSensors() {
    const checkInstalled = await this.nodeConnection.sshService.exec("dpkg -l lm-sensors");
    if (!checkInstalled.stdout.includes("ii  lm-sensors")) {
      await this.nodeConnection.sshService.exec("sudo apt-get update && sudo apt-get install -y lm-sensors");
    }
    // Run sensors-detect
    const detectSensor = await this.nodeConnection.sshService.exec("sudo sensors-detect --auto");
    const lines = detectSensor.stdout.split("\n").map((line) => line.replace(/\s+/g, " ").trim());
    return lines.some((line) => line.includes("thermal sensor... Success!"));
  }

  async getTemperatureFromLmSensors() {
    const tempCPU = await this.nodeConnection.sshService.exec("sudo sensors");
    const tempCPUMatch = tempCPU.stdout.match(/Package id 0:\s*\+([0-9.]+)°C/);
    if (tempCPUMatch && tempCPUMatch[1]) {
      return tempCPUMatch[1];
    } else {
      return null;
    }
  }

  async getTemperatureFromHwmon() {
    const hwmonDevices = await this.nodeConnection.sshService.exec("ls /sys/class/hwmon/");
    const hwmonDirs = hwmonDevices.stdout.trim().split("\n");

    for (const dir of hwmonDirs) {
      const name = await this.nodeConnection.sshService.exec(`cat /sys/class/hwmon/${dir}/name`);
      if (name.stdout.trim() === "coretemp" || name.stdout.trim() === "k10temp") {
        const tempCPUResult = await this.nodeConnection.sshService.exec(`cat /sys/class/hwmon/${dir}/temp1_input`);
        const tempInMillidegrees = parseInt(tempCPUResult.stdout.trim(), 10);

        if (!isNaN(tempInMillidegrees)) {
          const cpuTemperature = (tempInMillidegrees / 1000).toFixed(1);
          return cpuTemperature;
        }
      }
    }
    return null;
  }

  //serverNmae
  //totalRam, usedRam
  //Total, usedDisk, used%
  //CPUusage
  //rx tx
  //readSpeed writeSpeed
  async getServerVitals() {
    const tempCPU = await this.getCPUTemperature();
    const serverVitals = await this.nodeConnection.sshService.exec(`
      hostname &&
      free --mega | sed -n '2p' | awk '{print $2" "$3}' &&
      df --total -BG --exclude-type=overlay | grep ^total | awk '{print $2" "$4" "$5}' &&
      sar -u 1 1 | awk '{if ($7 != "%idle") print 100.000-$NF}' | tail -1 &&
      INTERFACE=\`ip route get 8.8.8.8 | head -n1 | awk '{print $5}'\` &&
      sar -n DEV 1 1 | awk -v var="$INTERFACE" '{ if($2 == var) print $5" "$6}' | sed -n '1p' &&
      rm -rf disks &&
      rm -rf diskspeeds &&
      rm -rf diskoutput &&
      lsblk -d -o NAME | grep -v '[$!loop|NAME|]' | sed '/sr0/d' > disks &&
      input="disks" &&
      while IFS= read -r line
      do
        iostat -xdmy 2 1 | grep "$line" | awk '{print $3" "$9}' >> diskspeeds
      done < "$input" &&
      linecount=\`wc -l disks | awk '{print $1}'\` &&
      counter=1 &&
      while [[ $linecount -ge $counter ]]
      do
        linea=$( head -n $counter disks | tail -1)
        lineb=$( head -n $counter diskspeeds | tail -1)
        echo "$linea $lineb"
        counter=$(($counter + 1))
      done &&
      rm -rf disks &&
      rm -rf diskspeeds &&
      rm -rf diskoutput
    `);
    try {
      let arr = serverVitals.stdout.split(/\n/);
      const data = {
        ServerName: arr[0],
        totalRam: arr[1].split(" ")[0],
        usedRam: arr[1].split(" ")[1],
        totalDisk: parseInt(arr[2].split(" ")[0]),
        availDisk: parseInt(arr[2].split(" ")[1]),
        usedPerc: arr[2].split(" ")[2],
        cpu: arr[3],
        rx: arr[4].split(" ")[0],
        tx: arr[4].split(" ")[1],
        readValue: (arr[5] && arr[5].split(" ")[1]) || "0",
        writeValue: (arr[5] && arr[5].split(" ")[2]) || "0",
        tempCPU: tempCPU,
      };

      return data;
    } catch (e) {
      return null;
    }
  }

  // Get service logs from docker
  // Accepts an optional object of arguments:
  // [OPTIONAL] logs_since=<ISO8601DateString>: Get logs since (must be a valid ISO 8601 date string, e.g. 2013-01-02T13:23:37Z)
  // [OPTIONAL] logs_until=<ISO8601DateString>: Get logs until (must be a valid ISO 8601 date string, e.g. 2013-01-02T13:23:37Z)
  // [OPTIONAL] logs_tail=<number>: Number of lines to show from the end of the logs (if greater 0 logs_since/logs_until arguments are ignored - default 150)
  // [OPTIONAL] logs_ts=<bool>: When true each log line is prefixed with a ISO8601DateString timestamp (default is false)
  // [OPTIONAL] service_name=<string>: When specified only logs for the specified case-sensitive service name (e.g.: "BesuService") are returned
  // Returns array of services including their docker logs on success or empty array on errors
  async getServiceLogs(args) {
    // Extract arguments
    var { logs_since, logs_until, logs_tail, logs_ts, service_name } = Object.assign(
      {
        logs_since: null,
        logs_until: null,
        logs_tail: null,
        logs_ts: null,
        service_name: null,
      },
      typeof args === "object" ? args : {}
    );

    // Get all service configurations
    const serviceInfos = service_name ? await this.getServiceInfos(service_name) : await this.getServiceInfos();
    if (serviceInfos.length < 1) {
      return [];
    }

    // Get container logs from server (by default last "logs_tail" [150] lines per container)
    // Docker log options:
    // --details        Show extra details provided to logs
    // -f, --follow         Follow log output
    //     --since string   Show logs since timestamp (e.g. 2013-01-02T13:23:37Z) or relative (e.g. 42m for 42 minutes)
    // -n, --tail string    Number of lines to show from the end of the logs (default "all")
    // -t, --timestamps     Show timestamps
    // --until string   Show logs before a timestamp (e.g. 2013-01-02T13:23:37Z) or relative (e.g. 42m for 42 minutes)
    // --since string   Show logs since timestamp (e.g. 2013-01-02T13:23:37Z) or relative (e.g. 42m for 42 minutes)
    const dateNow = Date.now();
    const logsSince = typeof logs_since == "string" ? logs_since : new Date(dateNow - 1000 * 60 * 10).toISOString();
    const logsUntil = typeof logs_until == "string" ? logs_until : new Date(dateNow).toISOString();
    const logsTail = this.is_numeric(logs_tail) ? parseInt(logs_tail) : 0;
    const logsTs = typeof logs_ts == "boolean" && logs_ts ? true : false;
    var sshcommand = [];
    var logArgs = "";
    for (let i = 0; i < serviceInfos.length; i++) {
      var containerName = serviceInfos[i].config.instanceID;
      if (logsTail > 0) {
        logArgs = `--tail ${logsTail}`;
      } else {
        logArgs = `--since ${logsSince} --until ${logsUntil}`;
      }
      logArgs = logsTs ? `--timestamps ${logArgs}` : logArgs;
      sshcommand.push(`docker logs ${logArgs} ${containerName} 2>&1 ; echo "---STEREUMSTRINGSPLITTER---"`);
    }
    sshcommand = sshcommand.join(" && ");
    var result = await this.nodeConnection.sshService.exec(sshcommand);
    if (result.rc || result.stdout == "" || result.stderr != "") {
      return [];
    }
    result = result.stdout.trim().split("---STEREUMSTRINGSPLITTER---");

    // Attach container logs to each service
    for (let i = 0; i < serviceInfos.length; i++) {
      try {
        var logs = result[i].trim();
        serviceInfos[i].logs = logs ? logs.split(/\n/) : [];
      } catch (e) {
        serviceInfos[i].logs = [];
      }
      serviceInfos[i].logsSince = logsTail > 0 ? null : logsSince;
      serviceInfos[i].logsUntil = logsTail > 0 ? null : logsUntil;
    }

    // Return service infos with logs
    return serviceInfos;
  }

  async getCurrentEpochandSlot() {
    try {
      // Get local beacon port from first available consensus client
      const beaconResult = await this.findBeaconPort();
      if (beaconResult.code) {
        throw new Error("error: could not get balancestatus due to missing beacon port (" + beaconResult.info + ")");
      }
      const baseURL = `http://127.0.0.1:${beaconResult.data.port}`;

      let genesisRes = await this.queryBeaconApi(baseURL, "/eth/v1/beacon/genesis", [], "GET");
      let specRes = await this.queryBeaconApi(baseURL, "/eth/v1/config/spec", [], "GET");
      if (genesisRes.code || specRes.code) {
        throw new Error(`Couldn't get genesis or spec:\n${genesisRes.info}\n${specRes.info}`);
      }

      const { SLOTS_PER_EPOCH: slotsPerEpoch, SECONDS_PER_SLOT: secondsPerSlot } = specRes.data.api_reponse.data;
      const { genesis_time } = genesisRes.data.api_reponse.data;

      const current_time = Math.floor(Date.now() / 1000);
      const slot_time = secondsPerSlot;

      const current_slot = Math.floor((current_time - genesis_time) / slot_time);
      const current_epoch = Math.floor(current_slot / slotsPerEpoch);

      return { current_epoch, current_slot, secondsPerSlot, slotsPerEpoch };
    } catch (error) {
      log.error("Getting Epoch and Slot Failed:\n" + error);
      return {
        code: error.code ? error.code : 1,
        info: error.message ? error.message : error.info,
        data: error.data ? error.data : JSON.stringify(error),
      };
    }
  }

  // Fetches the validator duties (proposer and sync) for the given validator indices
  // Returns an array of validator duties (proposer and sync) for the given validator indices
  // validatorIndices: array of validator indices
  async getValidatorDuties(validatorIndices) {
    try {
      if (!Array.isArray(validatorIndices)) {
        throw new Error("Invalid Argument: validatorIndices must be an Array");
      }

      // Get local beacon port from first available consensus client
      const beaconResult = await this.findBeaconPort();
      if (beaconResult.code) {
        throw new Error("error: could not get balancestatus due to missing beacon port (" + beaconResult.info + ")");
      }
      const baseURL = `http://127.0.0.1:${beaconResult.data.port}`;

      const { current_epoch, current_slot } = await this.getCurrentEpochandSlot();

      let proposerDutiesRes = await this.queryBeaconApi(baseURL, "/eth/v1/validator/duties/proposer/" + current_epoch, [], "GET");
      let syncDutiesRes = await this.queryBeaconApi(baseURL, "/eth/v1/validator/duties/sync/" + current_epoch, validatorIndices, "POST");

      return {
        proposerDuties: proposerDutiesRes.data.api_reponse.data.filter((d) => validatorIndices.some((i) => i === d.validator_index)), // filter out duties for validators that are not in the validatorIndices (imported vals) array
        syncDuties: syncDutiesRes.data.api_reponse.data,
        currentEpoch: current_epoch,
        currentSlot: current_slot,
      };
    } catch (error) {
      log.error("Getting Validator Duties Failed:\n" + error);
      return {
        code: error.code ? error.code : 1,
        info: error.message ? error.message : JSON.stringify(error),
        data: error,
      };
    }
  }

  // get States of Validators
  // validatorPublicKeys: array of all pubkeys
  async getValidatorState(validatorPublicKeys) {
    let validatorBalances = [];
    // get status of beacon container
    try {
      const beaconStatus = await this.getBeaconStatus();
      if (beaconStatus.code === 0) {
        const beaconAPIPort = beaconStatus.data[0].beacon.destinationPort;

        // get validator's states from beacon container
        if (beaconAPIPort !== "" && validatorPublicKeys.length > 0) {
          var beaconAPIRunCmd = "";
          var beaconAPIRunCmdLastEpoch = "";
          let validatorNotFound;
          const chunkSize = 250;
          let data = [];

          for (let i = 0; i < validatorPublicKeys.length; i += chunkSize) {
            const chunk = validatorPublicKeys.slice(i, i + chunkSize);
            const beaconAPICmd = `curl -s -X GET 'http://localhost:${beaconAPIPort}/eth/v1/beacon/states/head/validators?id=${chunk.join()}' -H 'accept: application/json'`;
            beaconAPIRunCmd = await this.nodeConnection.sshService.exec(beaconAPICmd);

            //check response
            validatorNotFound =
              beaconAPIRunCmd.rc != 0 || beaconAPIRunCmd.stderr || JSON.parse(beaconAPIRunCmd.stdout).hasOwnProperty("message");
            if (!validatorNotFound) data = data.concat(JSON.parse(beaconAPIRunCmd.stdout).data); //merge all gathered stats in one array
          }
          const beaconAPICmdLastEpoch = `curl -s -X GET 'http://localhost:${beaconAPIPort}/eth/v1/beacon/states/head/finality_checkpoints' -H 'accept: application/json'`;
          beaconAPIRunCmdLastEpoch = await this.nodeConnection.sshService.exec(beaconAPICmdLastEpoch);

          const queryResult = data;
          validatorBalances = queryResult.map((key, id) => {
            return {
              id: id,
              validatorindex: key.index,
              balance: key.balance,
              status: key.validator.slashed === "true" ? "slashed" : key.status.replace(/_.*/, ""),
              pubkey: key.validator.pubkey,
              activationEpoch: key.validator.activation_epoch,
              activationElgibilityEpoch: key.validator.activation_eligibility_epoch,
              withdrawableEpoch: key.validator.withdrawable_epoch,
              exitEpoch: key.validator.exit_epoch,
              latestEpoch: parseInt(JSON.parse(beaconAPIRunCmdLastEpoch.stdout).data.current_justified.epoch) + 1,
            };
          });
        }
        // return array of objects which include following:
        // - id: value
        // - index: index
        // - balance: balance
        // - status: state
        // - pubkey: pub_key
        // - activation_epoch: epoch_number
        // - activeSince: active_since_day
        return validatorBalances;
      } else if (beaconStatus.code === 2) return validatorBalances; // empty array will be returned, if there is a no running consensus client
    } catch (error) {
      console.log("Error occured to get Beacon node status: ", error);
    }
  }

  async getCurrentEpochSlot(currBeaconService) {
    try {
      currBeaconService = currBeaconService.toUpperCase();
      let beaconStatus = await this.getBeaconStatus();
      // Ensure beaconStatus.data is an array
      if (!Array.isArray(beaconStatus.data)) {
        beaconStatus.data = [beaconStatus.data];
      }
      beaconStatus.data = beaconStatus.data.filter((obj) => obj.clt === currBeaconService);
      let currentEpochSlotStatus = {};
      if (beaconStatus.code === 0) {
        // retrive current network & define epoch length (ethereum -> 32 | gnosis -> 16)
        let serviceName = beaconStatus.data[0].clt.toLowerCase();
        let serviceNameConverted = serviceName.charAt(0).toUpperCase() + serviceName.slice(1);
        let serviceInfo = await this.getServiceInfos(serviceNameConverted + "BeaconService");
        const currentNetwork = serviceInfo[0].config.network;
        const epochLength = currentNetwork === "gnosis" ? 16 : 32;

        // retrive current-Slot also current, justified and finalized-Epochs
        const beaconAPIPort = beaconStatus.data[0].beacon.destinationPort;
        let APIBegin = `curl -s -X 'GET' 'http://localhost:${beaconAPIPort}/eth/v1/beacon/`;
        let cmdBegin = `curl -s -X 'GET' 'http://localhost:${beaconAPIPort}/eth/v2/beacon/blocks/`;
        let cmdEnd = "' -H 'accept: application/json'";
        let notFound = ":404";

        let beaconAPISlotRunCmd = await this.nodeConnection.sshService.exec(`${APIBegin}headers/head${cmdEnd}`);
        let beaconAPIEpochRunCmd = await this.nodeConnection.sshService.exec(`${APIBegin}states/head/finality_checkpoints${cmdEnd}`);

        let currentSlot = parseInt(JSON.parse(beaconAPISlotRunCmd.stdout).data.header.message.slot);
        let currentEpoch = Math.floor(currentSlot / epochLength);
        let currentJustifiedEpoch = parseInt(JSON.parse(beaconAPIEpochRunCmd.stdout).data.current_justified.epoch);
        let previousJustifiedEpoch = parseInt(JSON.parse(beaconAPIEpochRunCmd.stdout).data.previous_justified.epoch);
        let finalizedEpoch = parseInt(JSON.parse(beaconAPIEpochRunCmd.stdout).data.finalized.epoch) - 1; // because beacon-API sends previousJustifiedEpoch = finalizedEpoch

        // create return data
        currentEpochSlotStatus = {
          currentSlot: currentSlot,
          currentEpoch: currentEpoch,
          currentJustifiedEpoch: currentJustifiedEpoch,
          previousJustifiedEpoch: previousJustifiedEpoch,
          finalizedEpoch: finalizedEpoch,
          beaconStatus: beaconStatus.code,
          currentEpochStatus: [],
          justifiedEpochStatus: [],
          preJustifiedEpochStatus: [],
          finalizedEpochStatus: [],
        };

        // create sub arrays
        const currentSlotStatusArray = [];
        const justifiedSlotStatusArray = [];
        const preJustifiedSlotStatusArray = [];
        const finalizedSlotStatusArray = [];

        // retrive corresponding Slots' status
        let firstSlots = {
          firstSlotInCurrentEpoch: currentEpoch * epochLength,
          firstSlotInJustifiedEpoch: currentJustifiedEpoch * epochLength,
          firstSlotInPreviousJustifiedEpoch: previousJustifiedEpoch * epochLength,
          firstSlotInFinalizedEpoch: finalizedEpoch * epochLength,
        };

        for (const slots in firstSlots) {
          let slotsNumberInEpoch = `${slots}` === "firstSlotInCurrentEpoch" ? (currentSlot % epochLength) + 1 : epochLength;

          for (let i = 0; i < slotsNumberInEpoch; i++) {
            let beaconAPISlotStatusCmd =
              serviceNameConverted === "Lodestar"
                ? `${cmdBegin}${firstSlots[slots] + i}${cmdEnd}`
                : `${cmdBegin}${firstSlots[slots] + i}/root${cmdEnd}`;

            let beaconAPISlotStatusRunCmd = await this.nodeConnection.sshService.exec(beaconAPISlotStatusCmd);
            if (`${slots}` === "firstSlotInCurrentEpoch") {
              currentSlotStatusArray.push({
                slotNumber: firstSlots[slots] + i,
                slotStatus: beaconAPISlotStatusRunCmd.stdout.includes(notFound) ? "missed" : "proposed",
              });
            } else if (`${slots}` === "firstSlotInJustifiedEpoch") {
              justifiedSlotStatusArray.push({
                slotNumber: firstSlots[slots] + i,
                slotStatus: beaconAPISlotStatusRunCmd.stdout.includes(notFound) ? "missed" : "proposed",
              });
            } else if (`${slots}` === "firstSlotInPreviousJustifiedEpoch") {
              preJustifiedSlotStatusArray.push({
                slotNumber: firstSlots[slots] + i,
                slotStatus: beaconAPISlotStatusRunCmd.stdout.includes(notFound) ? "missed" : "proposed",
              });
            } else {
              finalizedSlotStatusArray.push({
                slotNumber: firstSlots[slots] + i,
                slotStatus: beaconAPISlotStatusRunCmd.stdout.includes(notFound) ? "missed" : "proposed",
              });
            }
          }
        }

        currentEpochSlotStatus["currentEpochStatus"].push(currentSlotStatusArray);
        currentEpochSlotStatus["justifiedEpochStatus"].push(justifiedSlotStatusArray);
        currentEpochSlotStatus["preJustifiedEpochStatus"].push(preJustifiedSlotStatusArray);
        currentEpochSlotStatus["finalizedEpochStatus"].push(finalizedSlotStatusArray);
        return currentEpochSlotStatus;
      } else if (beaconStatus.code === 2) {
        return (currentEpochSlotStatus = {
          currentSlot: null,
          currentEpoch: null,
          currentJustifiedEpoch: null,
          previousJustifiedEpoch: null,
          finalizedEpoch: null,
          beaconStatus: 2,
          currentEpochStatus: [],
          justifiedEpochStatus: [],
          preJustifiedEpochStatus: [],
          finalizedEpochStatus: [],
        });
      }
    } catch (error) {
      console.log("Error occured to get Beacon node status: ", error);
      return {
        info: "Error occured to get Beacon node status: ",
        data: error,
      };
    }
  }

  async exitValidatorAccount(pubkey, serviceID) {
    const beaconStatus = await this.getBeaconStatus();

    if (beaconStatus.code !== 0) {
      return [
        {
          pubkey: undefined,
          code: null,
          msg: beaconStatus.info,
        },
      ];
    }

    try {
      //Check if connected to CharonService
      const vc = await this.nodeConnection.readServiceConfiguration(serviceID);
      const connectedCharon = vc?.dependencies.consensusClients.find((client) => client.service === "CharonService");

      const beaconAPIPort = connectedCharon ? 3600 : beaconStatus.data[0].beacon.servicePort;
      const serviceId = connectedCharon ? connectedCharon.id : beaconStatus.data[0].sid;
      if (!Array.isArray(pubkey)) {
        pubkey = [pubkey];
      }
      let results = [];

      const parseRunExitCommandOutput = (output, pubkey) => {
        if (!output.includes("{") || !output.includes("}")) {
          return {
            pubkey: pubkey,
            code: /20[0-8] OK/.test(output) ? 200 : null,
            msg: output,
          };
        }

        const jsonStartIndex = output.indexOf("{");
        const jsonEndIndex = output.lastIndexOf("}");
        const stdoutJson = output.substring(jsonStartIndex, jsonEndIndex + 1);
        const parsedJson = JSON.parse(stdoutJson);

        let message =
          `${parsedJson?.message || ""}${parsedJson?.message && parsedJson?.stacktraces ? "\n" : ""}${
            parsedJson?.stacktraces || ""
          }`.trim() || output;

        return {
          pubkey: pubkey,
          code: parsedJson.code || null,
          msg: message,
        };
      };

      const handleExitCommand = async (pubkey, serviceId, beaconAPIPort) => {
        const ref = StringUtils.createRandomString();
        this.nodeConnection.taskManager.otherTasksHandler(ref, `Exit Account ${pubkey.substring(0, 6)}..`);
        try {
          const result = await this.validatorAccountManager.getExitValidatorMessage(pubkey, serviceID);
          if (result.data === undefined || !("data" in result)) {
            throw new Error(result);
          }

          const curlTag = await this.nodeConnection.ensureCurlImage();
          const exitMsg = result.data;
          const exitCommand =
            `docker run --rm --network=stereum curlimages/curl:${curlTag} curl ` +
            `'http://stereum-${serviceId}:${beaconAPIPort}/eth/v1/beacon/pool/voluntary_exits' ` +
            `-H 'accept: */*' ` +
            `-H 'Content-Type: application/json' ` +
            `-d '${JSON.stringify(exitMsg)}' -i -s`;

          const runExitCommand = await this.nodeConnection.sshService.exec(exitCommand);
          log.info(runExitCommand);

          if (SSHService.checkExecError(runExitCommand) && runExitCommand.stderr) {
            throw new Error(SSHService.extractExecError(runExitCommand));
          }
          if (!runExitCommand.stdout)
            throw `ReturnCode: ${runExitCommand.rc}\nStderr: ${runExitCommand.stderr}\nStdout: ${runExitCommand.stdout}\nIs Your Consensus Client Running?`;

          const response = parseRunExitCommandOutput(runExitCommand.stdout, pubkey);

          if (response.code === 200) {
            this.nodeConnection.taskManager.otherTasksHandler(ref, `Exiting Account`, true, runExitCommand.stdout);
          } else {
            this.nodeConnection.taskManager.otherTasksHandler(
              ref,
              `Exiting Account Failed`,
              false,
              `Exiting Account Failed ${pubkey}:\n${runExitCommand.stdout}`
            );
          }

          this.nodeConnection.taskManager.otherTasksHandler(ref);
          return response;
        } catch (error) {
          this.nodeConnection.taskManager.otherTasksHandler(
            ref,
            `Exiting Account Failed`,
            false,
            `Exiting Account Failed ${pubkey}:\n${error}`
          );
          this.nodeConnection.taskManager.otherTasksHandler(ref);
          log.error(`Exiting signed voluntary account failed for ${pubkey}:\n`, error);
          return {
            pubkey: pubkey,
            code: null,
            msg: error.toString(),
          };
        }
      };

      for (let i = 0; i < pubkey.length; i++) {
        const result = await handleExitCommand(pubkey[i], serviceId, beaconAPIPort);
        results.push(result);
      }

      return results;
    } catch (error) {
      const ref = StringUtils.createRandomString();
      this.nodeConnection.taskManager.otherTasksHandler(
        ref,
        "Error occurred to get Beacon service ID & port",
        false,
        `Error occurred to get Beacon service ID & port: ${error}`
      );
      this.nodeConnection.taskManager.otherTasksHandler(ref);
      return [
        {
          pubkey: undefined,
          code: null,
          msg: error.toString(),
        },
      ];
    }
  }

  /**
   * Will gather metrics from Prometheus and evaluate.
   * If thresholds are exceeded, an alert will be generated and added to the retuned array.
   * @returns {Object[]} Array of alerts e.g. [{name: "Cluster in Unknown Status", level: "warning"}, {name: "Beacon Node Down", level: "critical"}]
   */
  async fetchObolCharonAlerts() {
    try {
      const serviceInfos = await this.getServiceInfos("CharonService");
      if (serviceInfos.length < 1) {
        return [];
      }
      const queries = {
        app_monitoring_readyz: "max((app_monitoring_readyz)) by (cluster_name, cluster_hash, cluster_peer)",
        cluster_missed_attestations: "max(increase(core_tracker_failed_duties_total[10m])) by (cluster_hash, cluster_name)",
        cluster_failure_rate:
          "floor(100 * (max(increase(core_tracker_success_duties_total[15m])) by (cluster_hash, cluster_name) / max(increase(core_tracker_expect_duties_total[15m])) by (cluster_hash, cluster_name)))",
        percentage_failed_sync_message_duty:
          "(\n    sum(increase(core_tracker_failed_duties_total[1h])) by (cluster_name,cluster_hash,cluster_peer)\n) \n/ \n(\n    sum(increase(core_tracker_failed_duties_total[1h])) by (cluster_name,cluster_hash,cluster_peer) \n    + \n    sum(increase(core_bcast_broadcast_total[1h])) by (cluster_name,cluster_hash,cluster_peer) \n)",
        connected_relays: "group (p2p_relay_connections) by (cluster_peer)",
        peer_ping_latency: "histogram_quantile(0.90, sum(rate(p2p_ping_latency_secs_bucket[2m])) by (le,peer))",
      };

      const queryPromises = Object.entries(queries).map(([key, query]) => {
        return this.queryPrometheus(encodeURIComponent(query)).then((result) => ({ key, result }));
      });

      const results = await Promise.all(queryPromises);

      let alerts = results
        .map((metric) => {
          if (metric.result.status != "success") {
            return;
          }
          if (metric.key === "peer_ping_latency") {
            let value = Math.max(...metric.result.data.result.map((r) => r.value[1]));
            return this.parseObolCharonAlerts(metric.key, value);
          }
          let value = metric.result.data.result[0].value[1];
          return this.parseObolCharonAlerts(metric.key, value);
        })
        .filter((alert) => alert);

      return alerts;
    } catch (error) {
      log.error("Fetching Obol Charon Alerts Failed:\n" + error);
      return [];
    }
  }

  parseObolCharonAlerts(key, value) {
    //app_monitoring_readyz
    if (key === "app_monitoring_readyz") {
      switch (value) {
        case 0:
          return {
            name: "Cluster in Unknown Status",
            level: "warning",
          };
        case 2:
          return {
            name: "Beacon Node Down",
            level: "critical",
          };
        case 4:
          return {
            name: "Cluster Insufficient Peers",
            level: "warning",
          };
        case 6:
          return {
            name: "Cluster Missing Validators",
            level: "critical",
          };
        case 7:
          return {
            name: "Beacon Node Zero Peers",
            level: "critical",
          };
      }
    }
    if (key === "cluster_missed_attestations" && value > 0) {
      return {
        name: "Cluster Missed Attestations",
        level: "critical",
      };
    }
    if (key === "cluster_failure_rate" && value < 95) {
      return {
        name: "Cluster Failure Rate",
        level: "critical",
      };
    }
    if (key === "percentage_failed_sync_message_duty" && value > 0.1) {
      return {
        name: "Failed Sync Msg Duty",
        level: "critical",
      };
    }
    if (key === "connected_relays" && value < 1) {
      return {
        name: "Num. Connected Relays",
        level: "warning",
      };
    }
    if (key === "peer_ping_latency" && value > 0.4) {
      return {
        name: "Peer Ping Latency",
        level: "warning",
      };
    }
  }

  /**
   * Fetches metrics from the ssvnoms service (fast and slow registries) and returns their values.
   * Each metric is retrieved and formatted into an array of objects containing the metric name, value, and optional tags.
   * Missing metrics will be included with a value of null.
   * @returns {Object[]} Array of metric values, e.g.,
   * [
   *   { name: "ssvnoms_operator_fee", value: 10 },
   *   { name: "ssvnoms_cluster_balance", tags: { clustertag: "[29, 87, 92, 133]" }, value: 2973601782960000000 },
   *   { name: "ssvnoms_cluster_balance", tags: { clustertag: "[4, 5, 6, 7]" }, value: 3289502782940000000 },
   *   { name: "ssvnoms_cluster_burnRate", tags: { clustertag: "[1, 2, 3, 4]" }, value: null }
   * ]
   */
  async fetchSsvnomsMetrics() {
    try {
      // Define the Prometheus queries where property names match the exact query string
      const queries = {
        // Fast registry metrics
        ssvnoms_operator_fee: "ssvnoms_operator_fee",
        ssvnoms_operator_validatorCount: "ssvnoms_operator_validatorCount",
        ssvnoms_operator_isPrivate: "ssvnoms_operator_isPrivate",
        ssvnoms_operator_active: "ssvnoms_operator_active",
        ssvnoms_operator_declaredFee_boolean: "ssvnoms_operator_declaredFee_boolean",
        ssvnoms_operator_declaredFee_value: "ssvnoms_operator_declaredFee_value",
        ssvnoms_operator_declaredFee_time1: "ssvnoms_operator_declaredFee_time1",
        ssvnoms_operator_declaredFee_time2: "ssvnoms_operator_declaredFee_time2",
        ssvnoms_operator_balance: "ssvnoms_operator_balance",
        ssvnoms_cluster_balance: "ssvnoms_cluster_balance",
        ssvnoms_cluster_burnRate: "ssvnoms_cluster_burnRate",
        ssvnoms_cluster_isLiquidatable: "ssvnoms_cluster_isLiquidatable",
        ssvnoms_cluster_isLiquidated: "ssvnoms_cluster_isLiquidated",
        ssvnoms_validator_balance: '{__name__=~"^ssvnoms_validator_balance_.*"}',

        // Slow registry metrics
        ssvnoms_NetworkFee: "ssvnoms_NetworkFee[30m]",
        ssvnoms_NetworkEarnings: "ssvnoms_NetworkEarnings[30m]",
        ssvnoms_LiquidationThresholdPeriod: "ssvnoms_LiquidationThresholdPeriod[30m]",
        ssvnoms_MinimumLiquidationCollateral: "ssvnoms_MinimumLiquidationCollateral[30m]",
        ssvnoms_OperatorFeeIncreaseLimit: "ssvnoms_OperatorFeeIncreaseLimit[30m]",
        ssvnoms_MaximumOperatorFee: "ssvnoms_MaximumOperatorFee[30m]",
        ssvnoms_ValidatorsPerOperatorLimit: "ssvnoms_ValidatorsPerOperatorLimit[30m]",
      };

      // Create promises to query Prometheus for all metrics
      const queryPromises = Object.entries(queries).map(([key, query]) =>
        this.queryPrometheus(encodeURIComponent(query)).then((result) => ({ key, result }))
      );

      const results = await Promise.all(queryPromises);

      // Process results and extract metric values, including handling labeled metrics
      const metrics = results.flatMap((metric) => {
        if (metric.result.status !== "success" || !metric.result.data.result) {
          return [];
        }

        return metric.result.data.result.map((data) => {
          let parsedValue;

          // Handle time series metrics (e.g., "ssvnoms_MaximumOperatorFee[30m]")
          if (Array.isArray(data.values) && data.values.length > 0) {
            const rawValue = data.values[0][1]; // Extract the latest value in the time range
            parsedValue = rawValue !== undefined && rawValue !== null ? parseFloat(rawValue) : null;
          } else if (Array.isArray(data.value) && data.value.length > 1) {
            // Handle instant vector metrics
            const rawValue = data.value[1];
            parsedValue = rawValue !== undefined && rawValue !== null ? parseFloat(rawValue) : null;
          }

          // Extract optional tags (e.g., "clustertag")
          const tags = data.metric || {};

          // Return the metric object with the name, value, and optional tags
          return {
            name: metric.key,
            value: parsedValue,
            tags: Object.keys(tags).length > 0 ? tags : undefined,
          };
        });
      });

      // Include missing metrics with value: null if not already present in metrics
      const allMetricKeys = Object.keys(queries);
      const finalMetrics = allMetricKeys.flatMap((key) => {
        const matchingMetrics = metrics.filter((m) => m.name === key);

        if (matchingMetrics.length > 0) {
          return matchingMetrics; // Keep all instances of this metric (e.g., labeled ones)
        }

        // Add a null entry for non-labeled missing metrics
        return [{ name: key, value: null }];
      });

      return finalMetrics;
    } catch (error) {
      log.error("Fetching ssvnoms metrics failed:\n" + error);
      return [];
    }
  }

  /**
   * Fetches metrics from Prometheus and returns their values.
   * If a metric is missing, it will be included in the result with a value of null.
   * @returns {Object[]} Array of metric values e.g. [{ name: "lcoms_stealing_penalty_stolenAmount", value: 150.75 },
   *                                                  { name: "lcoms_node_operator_status", value: 1 },
   *                                                  { name: "if a metric is missing", value: null }]
   */
  async fetchCsmMetrics() {
    try {
      // Retrieve service information to ensure the service is available
      const serviceInfos = await this.getServiceInfos("LCOMService");
      if (serviceInfos.length < 1) {
        return [];
      }

      const queries = {
        lcoms_stealing_penalty_stolenAmount: "lcoms_stealing_penalty_stolenAmount",
        lcoms_node_operator_status: "lcoms_node_operator_status",
        lcoms_current_bond: "lcoms_current_bond",
        lcoms_required_bond: "lcoms_required_bond",
        lcoms_current_bond_shares: "lcoms_current_bond_shares",
        lcoms_required_bond_shares: "lcoms_required_bond_shares",
        lcoms_unbonded_keys: "lcoms_unbonded_keys",
        lcoms_required_bond_st_eth: "lcoms_required_bond_st_eth",
        lcoms_total_added_keys: "lcoms_total_added_keys",
        lcoms_total_withdrawn_keys: "lcoms_total_withdrawn_keys",
        lcoms_total_deposited_keys: "lcoms_total_deposited_keys",
        lcoms_total_vetted_keys: "lcoms_total_vetted_keys",
        lcoms_stuck_validators_count: "lcoms_stuck_validators_count",
        lcoms_depositable_validators_count: "lcoms_depositable_validators_count",
        lcoms_target_limit: "lcoms_target_limit",
        lcoms_target_limit_mode: "lcoms_target_limit_mode",
        lcoms_total_exited_keys: "lcoms_total_exited_keys",
        lcoms_enqueued_count: "lcoms_enqueued_count",
        lcoms_target_validators_count: "lcoms_target_validators_count",
        lcoms_refunded_validators_count: "lcoms_refunded_validators_count",
        lcoms_stuck_penalty_end_timestamp: "lcoms_stuck_penalty_end_timestamp",
        lcoms_total_exited_validators: "lcoms_total_exited_validators",
        lcoms_total_deposited_validators: "lcoms_total_deposited_validators",
        lcoms_fee_to_distribute: "lcoms_fee_to_distribute",
        lcoms_fee_distributed: "lcoms_fee_distributed",
        lcoms_fee_distributed_value: "lcoms_fee_distributed_value",
        lcoms_exit_request_timestamp: "lcoms_exit_request_timestamp",
      };

      // Create promises to fetch all metric data from Prometheus
      const queryPromises = Object.entries(queries).map(([key, query]) => {
        return this.queryPrometheus(encodeURIComponent(query)).then((result) => ({ key, result }));
      });

      // Wait for all Prometheus queries to resolve
      const results = await Promise.all(queryPromises);

      // Process results and extract metric values, ensuring missing metrics return null
      const metrics = Object.keys(queries).map((key) => {
        const metric = results.find((m) => m.key === key);
        if (!metric || metric.result.status !== "success" || !metric.result.data.result || metric.result.data.result.length === 0) {
          return { name: key, value: null };
        }

        const metricData = metric.result.data.result[0];
        if (!metricData || !metricData.value || metricData.value.length < 2) {
          return { name: key, value: null };
        }

        // Parse the metric value from Prometheus response
        return { name: key, value: parseFloat(metricData.value[1]) };
      });

      return metrics;
    } catch (error) {
      log.error("Fetching CSM Metrics Failed:\n" + error);
      return [];
    }
  }

  /**
   * Will gather metrics from Prometheus and evaluate.
   * If thresholds are exceeded, an alert will be generated and added to the retuned array.
   * @returns {Object[]} Array of alerts e.g. [{name: "slashing event", level: "critical"},]
   */
  async fetchCsmAlerts() {
    try {
      const serviceInfos = await this.getServiceInfos("LCOMService");
      if (serviceInfos.length < 1) {
        return [];
      }

      const queries = {
        lcoms_initial_slashing_submitted: "lcoms_initial_slashing_submitted",
        lcoms_withdrawal_submitted: "lcoms_withdrawal_submitted",
        lcoms_stealing_penalty: "lcoms_stealing_penalty",
        lcoms_stealing_penalty_stolenAmount: "lcoms_stealing_penalty_stolenAmount",
        lcoms_exit_request: "lcoms_exit_request",
        lcoms_exit_request_timestamp: "lcoms_exit_request_timestamp",
        lcoms_fee_to_distribute: "lcoms_fee_to_distribute",
        lcoms_node_operator_status: "lcoms_node_operator_status",
        lcoms_current_bond: "lcoms_current_bond",
        lcoms_required_bond: "lcoms_required_bond",
      };

      const queryPromises = Object.entries(queries).map(([key, query]) => {
        return this.queryPrometheus(encodeURIComponent(query)).then((result) => ({ key, result }));
      });

      const results = await Promise.all(queryPromises);

      let currentBond = null;
      let requiredBond = null;

      let alerts = results
        .map((metric) => {
          if (metric.result.status !== "success") {
            return [];
          }

          if (!metric.result.data.result || metric.result.data.result.length === 0) {
            return [];
          }

          const metricData = metric.result.data.result[0];
          if (!metricData || !metricData.value || metricData.value.length < 2) {
            return [];
          }

          const value = parseFloat(metricData.value[1]);

          if (metric.key === "lcoms_current_bond") {
            currentBond = value;
          } else if (metric.key === "lcoms_required_bond") {
            requiredBond = value;
          }

          return this.parseCsmAlerts(metric.key, value);
        })
        .filter((alert) => alert !== null);

      if (currentBond !== null && requiredBond !== null) {
        const bondDifference = currentBond - requiredBond;
        const bondAlert = this.parseCsmAlerts("bond_difference", bondDifference);
        if (bondAlert) {
          alerts.push(bondAlert);
        }
      }

      return alerts;
    } catch (error) {
      log.error("Fetching CSM Alerts Failed:\n" + error);
      return [];
    }
  }

  parseCsmAlerts(key, value) {
    if (key === "lcoms_initial_slashing_submitted" && value > 0) {
      return {
        name: "slashing event",
        level: "critical",
      };
    }
    if (key === "lcoms_withdrawal_submitted" && value > 0) {
      return {
        name: "withdrawal submitted",
        level: "notification",
      };
    }
    if (key === "lcoms_stealing_penalty" && value > 0) {
      return {
        name: "EL stealing penalty",
        level: "critical",
      };
    }
    if (key === "lcoms_exit_request" && value > 0) {
      return {
        name: "exit request",
        level: "critical",
      };
    }
    if (key === "lcoms_fee_to_distribute" && value > 0) {
      return {
        name: "none-claimed rewards",
        level: "notification",
      };
    }
    if (key === "lcoms_node_operator_status" && value < 1) {
      return {
        name: "node operator inactive",
        level: "critical",
      };
    }
    if (key === "bond_difference" && value < 0) {
      return {
        name: "Insufficient Bond",
        level: "critical",
      };
    }
    return [];
  }
  async fetchCurrentTimeZone() {
    return await this.nodeConnection.sshService.exec(`timedatectl | grep "Time zone"`);
  }

  async setIdleTime(setTime) {
    this.globalMonitoringCache.setTime = setTime;
  }

  async idleTimerCheck(timerStop, win) {
    if (!this.globalMonitoringCache.idleTimerRunning) {
      this.globalMonitoringCache.idleTimerRunning = true;
      await this.idleTimerLoop(win);
    }
    this.globalMonitoringCache.idleTimerStop = timerStop;
  }

  async idleTimerLoop(win) {
    if (powerMonitor.getSystemIdleTime() >= this.globalMonitoringCache.setTime * 60) {
      win.send("IdleLogout");
    } else if (this.isLoggedIn && !this.globalMonitoringCache.idleTimerStop) {
      await new Promise((resolve) => setTimeout(resolve, 60000));
      await this.idleTimerLoop(win);
    } else {
      this.globalMonitoringCache.idleTimerStop = false;
      this.globalMonitoringCache.idleTimerRunning = false;
    }
  }

  async getObolClusterInformation(serviceID) {
    const serviceInfos = await this.getServiceInfos("CharonService");
    const charon = serviceInfos.find((service) => service.config?.serviceID === serviceID);
    if (!charon) {
      log.info("No such Charon found!");
      return {};
    }

    const queries = {
      app_monitoring_readyz: `app_monitoring_readyz{instance=~".*${serviceID}.*"}`, // for Cluster Peer
      cluster_attestation_performance: `(sum(increase(core_tracker_success_duties_total{instance=~".*${serviceID}.*",duty="attester"}[1h])) / sum(increase(core_tracker_expect_duties_total{instance=~".*${serviceID}.*",duty="attester"}[1h])) > 0) * 100`,
      cluster_attestation_participation: `core_tracker_participation{instance=~".*${serviceID}.*",duty="attester"}`,
      cluster_operators: `cluster_operators{instance=~".*${serviceID}.*"}`,
      cluster_threshold: `cluster_threshold{instance=~".*${serviceID}.*"}`,
      cluster_validators: `cluster_validators{instance=~".*${serviceID}.*"}`,
    };

    const queryPromises = Object.entries(queries).map(([key, query]) => {
      return this.queryPrometheus(encodeURIComponent(query)).then((result) => ({ key, result }));
    });

    const results = await Promise.all(queryPromises);

    const stats = {};

    results.forEach((metric) => {
      if (metric.result.status != "success") {
        return;
      }
      switch (metric.key) {
        case "app_monitoring_readyz":
          stats.nodeStatus = metric.result.data.result[0].value[1] === "1" ? "ACTIVE" : "INACTIVE";
          stats.peerName = metric.result.data.result[0].metric.cluster_peer;
          break;
        case "cluster_attestation_performance":
          stats.attestationPerformance = metric.result.data.result[0].value[1];
          break;
        case "cluster_attestation_participation":
          stats.attestationParticipation = metric.result.data.result.reduce((acc, curr) => acc + parseInt(curr.value[1]), 0);
          break;
        case "cluster_operators":
          stats.operators = parseInt(metric.result.data.result[0].value[1]);
          break;
        case "cluster_threshold":
          stats.threshold = parseInt(metric.result.data.result[0].value[1]);
          break;
        case "cluster_validators":
          stats.validators = parseInt(metric.result.data.result[0].value[1]);
          break;
      }
    });
    return stats;
  }

  async getSSVClusterInformation(serviceID) {
    const serviceInfos = await this.getServiceInfos("SSVNetworkService");
    const ssv = serviceInfos.find((service) => service.config.serviceID === serviceID);
    if (!ssv) {
      log.info("No such SSV found!");
      return {};
    }
    const operator = await this.nodeConnection.getSSVLastKnownOperatorId(serviceID);
    if (!operator) {
      log.info("No SSV Operator found!");
      return {};
    }
    const stats = {};

    stats.operator = operator;

    const data = await axios.get(`https://api.ssv.network/api/v4/${ssv.config.network}/operators/` + operator);
    if (data.status !== 200) {
      log.error("Error fetching SSV Operator Information:\n" + JSON.stringify(data.data, null, 2));
      return {};
    }

    stats.private = data.data.is_private;
    stats.status = data.data.status;
    stats.performance = data.data.performance["24h"];
    return stats;
  }
}
