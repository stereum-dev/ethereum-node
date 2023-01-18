import { NodeConnection } from "./NodeConnection";
import { ServiceManager } from "./ServiceManager";
import * as log from 'electron-log'
import * as crypto from 'crypto'
import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'

export class Monitoring {
  constructor() {
    this.nodeConnection = new NodeConnection();
    this.nodeConnectionProm = new NodeConnection();
    this.serviceManager = new ServiceManager(this.nodeConnection);
    this.serviceManagerProm = new ServiceManager(this.nodeConnectionProm);
    this.rpcTunnel = {};
    this.beaconTunnel = {};
    this.serviceInfosCacheFile = path.join(os.tmpdir(), 'server_infos_cache_' + process.getCreationTime() + '.txt');
  }

  // Cleanup on logout
  async logout(){
    this.rpcTunnel = {};
    this.beaconTunnel = {};
    try{
      fs.unlinkSync(this.serviceInfosCacheFile)
    }catch(e){}
    await this.nodeConnection.logout();
    await this.nodeConnectionProm.logout();
    await this.serviceManager.nodeConnection.logout();
    await this.serviceManagerProm.nodeConnection.logout();
  }

  async checkStereumInstallation(nodeConnection) {
    if (!nodeConnection) {
      nodeConnection = this.nodeConnection;
    }
    if (nodeConnection.sshService.connected) {
      let services;
      let settings;
      try {
        settings = await nodeConnection.sshService.exec("ls /etc/stereum");
      } catch(err){
        log.debug("checking stereum installation failed:", err)
      }
      if (settings.stdout.includes("stereum.yaml"))
        return true;
    }
    return false;
  }

  async refreshServiceInfos() {
    if (await this.checkStereumInstallation()) {
      const serviceConfigs = await this.serviceManager.readServiceConfigurations()
      const serviceStates = await this.nodeConnection.listServices();
      if (
        serviceConfigs &&
        serviceConfigs.length > 0 &&
        serviceStates &&
        Array.isArray(serviceStates)
      ) {
        let newInfo = serviceConfigs.map((config) => {
          const newState = serviceStates.find(
            (state) => state.Names.replace("stereum-", "") === config.id
          );
          return {
            service: config.service,
            state: newState ? newState.State : "exited",
            config: {
              serviceID: config.id,
              configVersion: config.configVersion,
              image: config.image,
              imageVersion: config.imageVersion,
              ports: config.ports,
              volumes: config.volumes,
              network: config.network,
              dependencies : config.dependencies,
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
    return this.nodeConnection.nodeConnectionParams.host
  }

  // Get service infos (either all or optional limited to specific - case-sensitive - service names)
  // Example A: const serviceInfos = await this.getServiceInfos(); // <- Returns all configs
  // Example B: const serviceInfos = await this.getServiceInfos("PrometheusService","GrafanaService");
  // Returns array of matched services with their associated (formated) config
  // Caches results for 10 seconds!
  async getServiceInfos() {
    const cache_max_seconds = 10;
    const args = Array.prototype.slice.call(arguments); // convert functon "arguments" to Array
    const hash = crypto.createHash('md5').update(args.join("-")).digest('hex'); // cache id
    const file = this.serviceInfosCacheFile;
    const dnow = new Date();
    var cont = {};
    //console.log("INCOMING '"+args.join("-")+"' -> " + hash);
    try{
      cont = fs.readFileSync(file);
      cont = JSON.parse(cont);
      if(cont.hasOwnProperty(hash)){
        var uxts = Math.floor(Date.now() / 1000);
        var diff = uxts - cont[hash].uxts;
        if(diff<cache_max_seconds){
          //console.log('RETURN cache ' + hash, file);
          return cont[hash].data;
        }
        //console.log('REQUIRE fresh cache ' + hash, dnow);
      }
    }catch(e){}
    if (await this.checkStereumInstallation()){
      var serviceConfigs = await this.serviceManagerProm.readServiceConfigurations();
      const serviceStates = await this.nodeConnectionProm.listServices();
      if(
        serviceConfigs &&
        Array.isArray(serviceConfigs) &&
        serviceConfigs.length > 0 &&
        serviceStates &&
        Array.isArray(serviceStates)
      ){
        serviceConfigs = args.length<1 ? serviceConfigs : serviceConfigs.filter((s) => args.includes(s.service));
        serviceConfigs = serviceConfigs.map((config) => {
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
        }).sort((a, b) => args.indexOf(a.service) - args.indexOf(b.service));
        if(Array.isArray(serviceConfigs) && serviceConfigs.length > 0){
          //console.log('REFRESH cache ' + hash, dnow, file);
          cont[hash] = {
            data: serviceConfigs,
            uxts: Math.floor(Date.now() / 1000),
            hash: hash,
          };
          fs.writeFileSync(file,JSON.stringify(cont));
        }
        return serviceConfigs;
      }
    }
    return [];
  }

  // Query Prometheus API via CURL on the node
  // https://prometheus.io/docs/prometheus/latest/querying/api/
  // https://prometheus.io/docs/prometheus/latest/querying/basics/
  // query=<string>: Prometheus expression query string.
  // time=<rfc3339|unix_timestamp>: Evaluation timestamp. Optional.
  // timeout=<duration>: Evaluation timeout. Optional. Defaults to and is capped by the value of the -query.timeout flag.
  // Returns json parsed result as described on Prometheus API reference (even for internal errors)
  async queryPrometheus(query,time=null,timeout=5){

    // Get Prometheus connection infos from config
    const serviceInfos = await this.getServiceInfos("PrometheusService");
    if(serviceInfos.length <1){
      return {
        "status": "error",
        "errorType": "internal",
        "error": "service infos unavailable",
      };
    }
    const prometheus = serviceInfos.pop();
    if(typeof prometheus !== "object" || !prometheus.hasOwnProperty("config")){
      return {
        "status": "error",
        "errorType": "internal",
        "error": "prometheus config unavailable",
      };
    }
    let addr = prometheus.config.ports[0].destinationIp;
    let port = prometheus.config.ports[0].destinationPort;
    if(!prometheus.hasOwnProperty("state") || prometheus.state != "running"){
      return {
        "status": "error",
        "errorType": "internal",
        "error": "prometheus service not running",
      };
    }

    // Escape single quotes in query for bash command (note the single quotes for curl -d arguments)
    query = query.replaceAll("'","'\\''");

    // Build curl command
    const cmd = `
      curl -s -X POST http://${addr}:${port}/api/v1/query \
      -H "Content-Type: application/x-www-form-urlencoded" \
      -d 'query=${query}&timeout=${timeout}` + ( time ? `&time=${time}` : '') + `'
    `.trim();

    // Execute the CURL command on the node and return the result
    let result = null;
    try {
      result = await this.nodeConnection.sshService.exec(cmd);
    } catch (err) {
      //throw err;
      return {
        "status": "error",
        "errorType": "internal",
        "error": err,
      };
    }

    // No data in stdout or data in stderr? Executed code above failed to run!
    // Return error in same format as prometheus does for consistency reasons.
    if(result.rc || result.stdout == "" || result.stderr != ""){
      var err = "E:" + result.rc +": executed code failed to run";
      if(result.stderr != ""){
        err += " (" + result.stderr + ")";
      }else if(result.stdout == ""){
        err += " (syntax error)";
      }
      return {
        "status": "error",
        "errorType": "internal",
        "error": err,
        "data": result,
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
  async queryRpcApi(url,rpc_method,rpc_params=[],method="POST",headers={}){
    
    // Setup query
    var query = rpc_method.trim().indexOf("{") < 0 ? JSON.stringify({
      "jsonrpc": "2.0",
      "method": rpc_method.trim(),
      "params": rpc_params,
      "id": 1,
    }) : rpc_method;

    // Define default response
    const data = {
      "api_reponse":null,
      "api_httpcode":null,
    }

    // Make sure query is valid JSON
    try{
      JSON.parse(query);
    }catch(e){
      return {
        "code": 1,
        "info": "error: invalid query data specified (valid JSON string expected)",
        "data": data,
      };
    }

    // Format url
    if(typeof url === "string"){
      url = url.trim();
    }else if(typeof url === "object"){
      let def = {'addr': '127.0.0.1','port':0};
      url = {...def, ...url}
      url = `http://${url.addr}:${url.port}`
    }

    // Check url
    if(!url.startsWith('http')){
      return {
        "code": 3,
        "info": "error: invalid url specified",
        "data": data,
      };
    }

    // Build request headers
    headers = typeof headers === "object" && !Array.isArray(headers) && headers !== null ? headers : {};
    headers = {...Object.fromEntries(Object.entries({
      "Content-Type":"application/json",
      //"Content-Type":"application/json; charset=utf-8",
    }).map(([k, v]) => [k.toLowerCase(), v])), ...Object.fromEntries(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v])) }
    let requestheaders = [];
    for (let [k, v] of Object.entries(headers)) {
      k = k.replaceAll("'","'\\''");
      v = v.replaceAll("'","'\\''");
      requestheaders.push("-H '"+k+": "+v+"'");
    }
    requestheaders = requestheaders.length ? requestheaders.join(" ") : '';

    // Escape single quotes in query for bash command (note the single quotes for curl --data-raw argument)
    query = query.replaceAll("'","'\\''");

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
        "code": 4,
        "info": "error: could not execute curl command (" + err + ")",
        "data": data,
      };
    }

    // No data in stdout or data in stderr? Executed code above failed to run!
    if(result.rc || result.stdout == "" || result.stderr != ""){
      let err = "error:" + result.rc +": executed code failed to run";
      if(result.stderr != ""){
        err += " (" + result.stderr + ")";
      }else if(result.stdout == ""){
        err += " (syntax error)";
      }
      data.api_reponse = result;
      return {
        "code": 5,
        "info": err,
        "data": data,
      };
    }

    // Parse response
    let r = result.stdout.trim().split("\n");
    let statuscode = r.length > 0 ? parseInt(r.pop()) : data.api_httpcode;
    let jsonstring = r.length > 0 ? r.join("\n").trim() : '';
    data.api_httpcode = statuscode;
    try{
      data.api_reponse = jsonstring ? JSON.parse(jsonstring) : jsonstring;
    }catch(e){
      data.api_reponse = jsonstring ? jsonstring : result.stdout;
      return {
        "code": 6,
        "info": "error: invalid api response (" + e + ")",
        "data": data,
      };
    }

    // Check response format
    if(!data.api_reponse.hasOwnProperty("id")){
      return {
        "code": 7,
        "info": "error: invalid api response (format unknown)",
        "data": data,
      };
    }

    // Check for response errors
    if(data.api_reponse.hasOwnProperty("error")){
      data.api_reponse = data.api_reponse.error.message + " (" + data.api_reponse.error.code + ")";
      return {
        "code": 8,
        "info": "error: api responded an error -> " + data.api_reponse,
        "data": data,
      };
    }

    // Respond success
    data.api_reponse = data.api_reponse.result;
    return {
      "code": 0,
      "info": "success: api successfully requested",
      "data": data,
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
  async queryBeaconApi(url,endpoint,params=[],method="GET",headers={},cc_only=false){

    // Service definitions with their associated beacon api (service) port
    const services = {
      'TekuBeaconService' : 5051,
      'LighthouseBeaconService' : 5052,
      'PrysmBeaconService' : 3500,
      'NimbusBeaconService' : 5052,
    };

    // Define default response
    const data = {
      "api_reponse":null,
      "api_httpcode":null,
    }

    // Get service infos
    const serviceInfos = await this.getServiceInfos();
    if(serviceInfos.length <1){
      return {
        "code": 1,
        "info": "error: service infos unavailable",
        "data": data,
      };
    }

    // Format endpoint
    endpoint = typeof endpoint === "string" ? endpoint.trim().replace(/^\//, '').trim() : ''; // /a/b/c/ => a/b/c/ : ''
    if(!endpoint){
      return {
        "code": 2,
        "info": "error: invalid endpoint specified",
        "data": data,
      };
    }

    // Format url
    if(typeof url === "string"){
      url = url.trim();
    }else if(typeof url === "object"){
      let def = {'addr': '127.0.0.1','port':0};
      url = {...def, ...url}
      url = `http://${url.addr}:${url.port}`
    }
    url = endpoint.startsWith('http') ? endpoint : `${url}/${endpoint}`;

    // Check url
    if(!url.startsWith('http')){
      return {
        "code": 3,
        "info": "error: invalid url specified",
        "data": data,
      };
    }

    // Build request headers
    headers = typeof headers === "object" && !Array.isArray(headers) && headers !== null ? headers : {};
    headers = {...Object.fromEntries(Object.entries({
      "Content-Type":"application/json",
      //"Content-Type":"application/json; charset=utf-8",
    }).map(([k, v]) => [k.toLowerCase(), v])), ...Object.fromEntries(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v])) }
    let requestheaders = [];
    for (let [k, v] of Object.entries(headers)) {
      k = k.replaceAll("'","'\\''");
      v = v.replaceAll("'","'\\''");
      requestheaders.push("-H '"+k+": "+v+"'");
    }
    requestheaders = requestheaders.length ? requestheaders.join(" ") : '';

    // Build request data
    let d = Array.isArray(params) && params.length ? JSON.stringify(params).replaceAll("'","'\\''") : '';
    let requestdata = d ? `-d '${d}'` : '';

    // Build curl command
    const cmd = `curl -s --location --request ${method} -w "\\n%{http_code}" '${url}' ${requestheaders} ${requestdata}`.trim();
 
    // Execute the CURL command on the node and return the result
    let result = null;
    try {
      result = await this.nodeConnection.sshService.exec(cmd);
    } catch (err) {
      return {
        "code": 4,
        "info": "error: could not execute curl command (" + err + ")",
        "data": data,
      };
    }

    // No data in stdout or data in stderr? Executed code above failed to run!
    if(result.rc || result.stdout == "" || result.stderr != ""){
      let err = "error:" + result.rc +": executed code failed to run";
      if(result.stderr != ""){
        err += " (" + result.stderr + ")";
      }else if(result.stdout == ""){
        err += " (syntax error)";
      }
      data.api_reponse = result;
      return {
        "code": 5,
        "info": err,
        "data": data,
      };
    }

    // Parse response
    let r = result.stdout.trim().split("\n");
    let statuscode = r.length > 0 ? parseInt(r.pop()) : data.api_httpcode;
    let jsonstring = r.length > 0 ? r.join("\n").trim() : '';
    data.api_httpcode = statuscode;
    try{
      data.api_reponse = jsonstring ? JSON.parse(jsonstring) : jsonstring;
    }catch(e){
      data.api_reponse = jsonstring ? jsonstring : result.stdout;
      return {
        "code": 6,
        "info": "error: invalid api response (" + e + ")",
        "data": data,
      };
    }

    // Check for response errors
    if(data.api_reponse.hasOwnProperty("code") && data.api_reponse.hasOwnProperty("message")){
      data.api_reponse = data.api_reponse.message + " (" + data.api_reponse.code + ")";
      return {
        "code": 7,
        "info": "error: api responded an error -> " + data.api_reponse,
        "data": data,
      };
    }

    // Respond success
    return {
      "code": 0,
      "info": "success: api successfully requested",
      "data": data,
    };
  }

  // Get sync status of consensus and execution clients
  async getSyncStatus(){

    // Service definitions with type and Prometheus labels for sync status
    const services = {
      'consensus':{
        'TekuBeaconService' : ['beacon_slot','beacon_head_slot'], // OK - query for job="teku"
        'LighthouseBeaconService' : ['slotclock_present_slot','beacon_head_state_slot'], // OK - query for job="lighthouse_beacon"!
        'PrysmBeaconService' : ['beacon_clock_time_slot','beacon_head_slot'], // OK - query for job="prysm_beacon"!
        'NimbusBeaconService' : ['beacon_slot','beacon_head_slot'], // OK - query for job="nimbus"
      },
      'execution':{
        'GethService' : ['chain_head_header','chain_head_block'], // OK - query for job="geth"
        'BesuService' : ['ethereum_best_known_block_number','ethereum_blockchain_height'], // OK - query for job="besu"
        'NethermindService' : ['nethermind_blocks','nethermind_blocks'], // OK [there is only one label] - query for job="nethermind"
      },
    };

    // Prometheus job definitions
    const jobs = {
      'TekuBeaconService' : 'teku',
      'LighthouseBeaconService' : 'lighthouse_beacon',
      'PrysmBeaconService' : 'prysm_beacon',
      'NimbusBeaconService' : 'nimbus',
      'GethService' : 'geth',
      'BesuService' : 'besu',
      'NethermindService' : 'nethermind',
    };

    // Merge all labels for Prometheus query
    const serviceLabels = [];
    for (let property in services) {
      for (let prop in services[property]) {
        for (let p of services[property][prop]) {
          serviceLabels.push(p)
        }
      }
    }

    // Get all service configurations
    const serviceInfos = await this.getServiceInfos();
    if(serviceInfos.length <1){
      return {
        "code": 111,
        "info": "error: service infos for syncstatus not available",
        "data": "",
      };
    }

    // Query Prometehus for all possible labels
    const prometheus_result = await this.queryPrometheus('{__name__=~"'+serviceLabels.join('|')+'"}');
    if(typeof prometheus_result !== "object" || !prometheus_result.hasOwnProperty("status") || prometheus_result.status != "success"){
      return {
        "code": 113,
        "info": "error: prometheus query for syncstatus failed",
        "data": prometheus_result,
      };
    }

    // Build pairs for the FrontEnd (cc and ec member)
    const clientTypes = Object.keys(services);
    const groups = [];
    const utsNow = Math.floor(Date.now() / 1000);
    for(let i=0;i<serviceInfos.length;i++){

      // Find execution and consensus service configurations for this group
      let clt = serviceInfos[i];
      if(typeof clt !== "object" || !clt.hasOwnProperty("service") || !clt.hasOwnProperty("config"))
        continue;
      let isConsensus = clt.service in services.consensus;
      let hasMembers = clt.config.dependencies.executionClients.length ? true : false;
      if(!isConsensus || !hasMembers)
        continue;
      let cc = clt;
      let ec = null;
      try{
        ec = cc.config.dependencies.executionClients[0];
        if(typeof ec !== "object" || !ec.hasOwnProperty("service") || !ec.hasOwnProperty("id"))
          continue;
        ec = serviceInfos.find(item => item.config.serviceID == ec.id)
      }catch(e){
        continue;
      }

      // Filter Prometheus result by current used services
      try{
        
        // Add the response for "syncStatusItems" exact as defined in front-end
        // Values for "syncIcoSituation" and "syncIcoError" can generated from these!
        // Attention: frstVal needs to be the lower value in frontend, which is in key 1 + added new state key!
        let data = [];
        let consensus = cc;
        let execution = ec;
        clientTypes.forEach(function (clientType, index) {
          let clt = '';
          eval("clt = " + clientType + ";"); // eval clt object from consensus/execution objects
          let results = [];
          let labels = services[clientType][clt.service];
          let xx = prometheus_result.data.result.filter((s) => 
            labels.includes(s.metric.__name__) &&
            s.metric.instance.includes(clt.config.instanceID) &&
            s.metric.job == jobs[clt.service]
          );
          let frstVal = 0, scndVal = 0;
          if(xx.length){
            labels.forEach(function (label, index) {              
              try{
                results[label] = xx.filter((s) => s.metric.__name__ == labels[index])[0].value[1];
              }catch(e){}
            });
            try{
              frstVal = results[labels[1]];
              scndVal = results[labels[0]];
            }catch(e){}   
          }
          data.push({
            id: index+1,
            title: clt.service.replace(/Beacon|Service/gi,"").toUpperCase(),
            frstVal: frstVal ? frstVal : 0,
            scndVal: scndVal ? scndVal : 0,
            type: clientType,
            state: clt.state,
            uptime: clt.createdAt ? utsNow - Math.floor(new Date(clt.createdAt).getTime() / 1000) : 0,
          });
        });
        groups.push(data);

      }catch(err){
        return {
          "code": 114,
          "info": "error: no prometheus data for syncstatus available yet",
          "data": err,
        };
      }
    }

    // Make sure at least one pair of consensus and execution service configurations exists
    if(groups.length < 1){
      return {
        "code": 115,
        "info": "error: a pair of consensus and execution client does not exist (in syncstatus)",
        "data": serviceInfos,
      };
    }

    // success
    return {
      "code": 0,
      "info": "success: syncstatus successfully retrieved",
      "data": groups,
    };
  }

  // Get P2P status of consensus and execution clients
  async getP2PStatus(){

    // Service definitions with type and Prometheus labels for p2p status
    const services = {
      'consensus':{
        'TekuBeaconService' : ['beacon_peer_count'],
        'LighthouseBeaconService' : ['libp2p_peers'],
        'PrysmBeaconService' : ['p2p_peer_count'], // needs to query for state="Connected"! 
        'NimbusBeaconService' : ['nbc_peers'],
      },
      'execution':{
        'GethService' : ['p2p_peers'],
        'BesuService' : ['ethereum_peer_count'],
        'NethermindService' : ['nethermind_sync_peers'],
      },
    };

    // Prometheus job definitions
    const jobs = {
      'TekuBeaconService' : 'teku',
      'LighthouseBeaconService' : 'lighthouse_beacon',
      'PrysmBeaconService' : 'prysm_beacon',
      'NimbusBeaconService' : 'nimbus',
      'GethService' : 'geth',
      'BesuService' : 'besu',
      'NethermindService' : 'nethermind',
    };

    // Merge all labels for Prometheus query
    const serviceLabels = [];
    for (let property in services) {
      for (let prop in services[property]) {
        for (let p of services[property][prop]) {
          serviceLabels.push(p)
        }
      }
    }

    // Get all service configurations
    const serviceInfos = await this.getServiceInfos();
    if(serviceInfos.length <1){
      return {
        "code": 221,
        "info": "error: service infos for p2pstatus not available",
        "data": "",
      };
    }

    // Query Prometehus for all possible labels
    const prometheus_result = await this.queryPrometheus('{__name__=~"'+serviceLabels.join('|')+'"}');
    if(typeof prometheus_result !== "object" || !prometheus_result.hasOwnProperty("status") || prometheus_result.status != "success"){
      return {
        "code": 223,
        "info": "error: prometheus query for p2pstatus failed",
        "data": prometheus_result,
      };
    }

    // Build pairs for the FrontEnd (cc and ec member)
    const clientTypes = Object.keys(services);
    const groups = [];
    const utsNow = Math.floor(Date.now() / 1000);
    for(let i=0;i<serviceInfos.length;i++){

      // Find execution and consensus service configurations for this group
      let clt = serviceInfos[i];
      if(typeof clt !== "object" || !clt.hasOwnProperty("service") || !clt.hasOwnProperty("config"))
        continue;
      let isConsensus = clt.service in services.consensus;
      let hasMembers = clt.config.dependencies.executionClients.length ? true : false;
      if(!isConsensus || !hasMembers)
        continue;
      let cc = clt;
      let ec = null;
      try{
        ec = cc.config.dependencies.executionClients[0];
        if(typeof ec !== "object" || !ec.hasOwnProperty("service") || !ec.hasOwnProperty("id"))
          continue;
        ec = serviceInfos.find(item => item.config.serviceID == ec.id)
      }catch(e){
        continue;
      }

      // Setup details
      var details = {};
      var detailsbase = {
        'service': 'unknown',
        'client': "unknown",
        'state': "unknown",
        'numPeer': 0,
        'numPeerBy': {
          'source': 'prometheus',
          'fields': [],
        },
        'maxPeer': 0,
        'maxPeerBy': {
          'source': 'config',
          'fields': [],
        },
        'valPeer': 0,
      };

      // Get max peers for consensus and execution clients by configuration or their default values
      let consensus = cc;
      let execution = ec;
      var data = {}, opttyp=null, optnam=null, defval=null, optval=null, regexp=null;
      clientTypes.forEach(function (clientType, index) {
        let clt = '';
        eval("clt = " + clientType + ";"); // eval clt object from consensus/execution objects
        details[clientType] = JSON.parse(JSON.stringify(detailsbase)); // clone detailsbase!
        details[clientType]['service'] = clt.service;
        details[clientType]['client'] = clt.service.replace(/Beacon|Service/gi,"").toUpperCase();
        details[clientType]['state'] = clt.state;
        opttyp = Object.keys(services).find(key => services[key].hasOwnProperty(clt.service));
        if(!opttyp){
          return;
        }
        if(clt.service == "TekuBeaconService"){
          // --p2p-peer-upper-bound (Default: 100)
          optnam = '--p2p-peer-upper-bound';
          defval = 100;
        }else if(clt.service == "LighthouseBeaconService"){
          // --target-peers (Default: 80) + 10%
          // See extra dealing with + 10% below!
          optnam = '--target-peers';
          defval = 80;
        }else if(clt.service == "PrysmBeaconService"){
          // --p2p-max-peers (Default: 45)
          optnam = '--p2p-max-peers';
          defval = 45;
        }else if(clt.service == "NimbusBeaconService"){
          // --max-peers (The target number of peers to connect to, default: 160)
          // --hard-max-peers (The maximum number of peers to connect to. Defaults to maxPeers * 1.5)
          // See extra dealing with --hard-max-peers below!
          optnam = '--max-peers';
          defval = 160;
        }else if(clt.service == "GethService"){
            // [MAXVAL: --maxpeers (Default: 50)]
          optnam = '--maxpeers';
          defval = 50;
        }else if(clt.service == "BesuService"){
          // --max-peers (Default: 25)
          optnam = '--max-peers';
          defval = 25;
        }else if(clt.service == "NethermindService"){
          // --Network.MaxActivePeers (Default: 50)
          optnam = '--Network.MaxActivePeers';
          defval = 50;
        }else{
          return;
        }
        regexp = new RegExp(optnam+"=(\\d+)", "si");
        if(Array.isArray(clt.config.command)){
          try{
            optval = clt.config.command.find((item) => item.match(regexp)).match(regexp).pop();
          }catch(e){
            optval = defval;
          }
        }else{
          try{
            optval = clt.config.command.match(regexp).pop();
          }catch(e){
            optval = defval;
          }
        }
        optval = parseInt(optval);
        if(clt.service == "LighthouseBeaconService"){ // Extra calculate Lighthouse --target-peers + 10%
          optval = Math.round(optval*1.1);
        }
        details[opttyp]['maxPeer'] = optval;
        details[opttyp]['maxPeerBy']['fields'].push(optnam);
        if(clt.service == "NimbusBeaconService"){ // Extra calculate Nimbus --hard-max-peers by Nimbus --max-peers
          if(!opttyp){
            return;
          }
          optnam = '--hard-max-peers'; // Defaults to maxPeers (Nimbus "--max-peers") * 1.5
          defval = Math.round(optval*1.5); // optval is here Nimbus --max-peers that was calculated in the current loop
          regexp = new RegExp(optnam+"=(\\d+)", "si");
          if(Array.isArray(clt.config.command)){
            try{
              optval = clt.config.command.find((item) => item.match(regexp)).match(regexp).pop();
            }catch(e){
              optval = defval;
            }
          }else{
            try{
              optval = clt.config.command.match(regexp).pop();
            }catch(e){
              optval = defval;
            }
          }
          optval = parseInt(optval);
          details[opttyp]['maxPeer'] = optval;
          details[opttyp]['maxPeerBy']['fields'].push(optnam);
        }
      });

      // Filter Prometheus result by current used services and calculate number of currently used peers per client
      // Note that Prysm requires to match state="Connected"!
      try{
        var maxPeer = 0, numPeer = 0, valPeer = 0;
        clientTypes.forEach(function (clientType, index) {
          let clt = '';
          eval("clt = " + clientType + ";"); // eval clt object from consensus/execution objects
          let xx = prometheus_result.data.result.filter((s) => 
            services[clientType][clt.service].includes(s.metric.__name__) && 
            s.metric.instance.includes(clt.config.instanceID) &&
            s.metric.job == jobs[clt.service] &&
            clt.service == "PrysmBeaconService" ? s.metric.state == 'Connected' : true
          );
          if(xx.length){
            services[clientType][clt.service].forEach(function (item, index) {
              try{
                details[clientType]['numPeer'] = parseInt(xx.filter((s) => s.metric.__name__ == services[clientType][clt.service][index]).pop().value.pop());
                details[clientType]['numPeerBy']['fields'].push(item);
              }catch(e){}
            });
          }

          // Summarize details
          details[clientType]['maxPeer'] = details[clientType]['maxPeer'];
          details[clientType]['numPeer'] = details[clientType]['numPeer'] > details[clientType]['maxPeer'] ? details[clientType]['maxPeer'] : details[clientType]['numPeer'];
          details[clientType]['valPeer'] = Math.round((details[clientType]['numPeer']/details[clientType]['maxPeer'])*100);
          details[clientType]['valPeer'] = details[clientType]['valPeer'] > 100 ? 100 : details[clientType]['valPeer'];
  
          // Summarize totals
          maxPeer = parseInt(maxPeer + details[clientType]['maxPeer']);
          numPeer = parseInt(numPeer + details[clientType]['numPeer']);
          valPeer = Math.round((numPeer/maxPeer)*100);
        });
        
        // Respond success for this group
        // Define the response for "valPeer" exact as defined in front-end as percentage (%).
        // Avoid overdues that may happen during peer cleaning. The exact values can be taken
        // from the details object if needed.
        data = {
          'details': details,
          'maxPeer': maxPeer,
          'numPeer': numPeer > maxPeer ? maxPeer : numPeer,
          'valPeer': valPeer > 100 ? 100 : valPeer,
        };
  
      }catch(err){
        return {
          "code": 224,
          "info": "error: no prometheus data for p2pstatus available yet",
          "data": err,
        };
      }
      groups.push(data);
    }

    // Make sure at least one pair of consensus and execution service configurations exists
    if(groups.length < 1){
      return {
        "code": 225,
        "info": "error: a pair of consensus and execution client does not exist (in p2pstatus)",
        "data": serviceInfos,
      };
    }

    // success
    return {
      "code": 0,
      "info": "success: p2pstatus successfully retrieved",
      "data": groups,
    };
  }

  // Get storage status of all services
  async getStorageStatus() {

    // Get all service configurations
    const serviceInfos = await this.getServiceInfos();
    if(serviceInfos.length <1){
      return {
        "code": 331,
        "info": "error: service infos for storagestatus not available",
        "data": "",
      };
    }

    // Build ssh commands to query storages 
    var sshcommands = [];
    for(let svc of serviceInfos){
        if(typeof svc !== "object" || !svc.hasOwnProperty("service") || !svc.hasOwnProperty("config")){
            continue;
        }
        if(Array.isArray(svc.config.volumes) && svc.config.volumes.length){
          const strVolumes = '"' + svc.config.volumes.flatMap(({ destinationPath }) => destinationPath).join('" "') + '"';
          sshcommands.push({
            svc: svc,
            cmd: "du -csh " + strVolumes + " | tail -n1 | awk '{print $1;}'",
          });
        }
    }
    var sshcmd = sshcommands.flatMap(({ cmd }) => cmd).join(' ; ').trim();
    if(!sshcmd){
      return {
        "code": 332,
        "info": "error: no storage volumes available (detected in storagestatus)",
        "data": serviceInfos,
      };
    }

    // Execute the command on the node
    let result = null;
    try {
      result = await this.nodeConnectionProm.sshService.exec(sshcmd);
    } catch (err) {
      return {
        "code": 333,
        "info": "error: failed to execute ssh command in storagestatus",
        "data": err,
      };
    }

    // No data in stdout or data in stderr? Executed code above failed to run!
    if(result.rc || result.stdout == "" /*|| result.stderr != ""*/){
      var err = "error: ssh command in storagestatus failed with return code " + result.rc;
      if(result.stderr != ""){
        err += " (" + result.stderr + ")";
      }else if(result.stdout == ""){
        err += " (syntax error)";
      }
      return {
        "code": 334,
        "info": err,
        "data": result,
      };
    }

    // Parse the result and add the response for "storageDataItems" exact as defined in front-end
    var data = [];
    var storagesizes = result.stdout.trim().split("\n");
    storagesizes.forEach(function (val, index) {
      let svc = index in sshcommands ? sshcommands[index].svc : false;
      if(svc){
        data.push({
          id: index+1,
          title: svc.service.replace(/Beacon|Service/gi,"").replace(/Validator/gi," vc").replace(/NodeExporter/gi," ne").toUpperCase(),
          storageValue: ( (!val || val < 1) ? '0 ' : val.replace(/([a-z]+)/si,' $1') ) + "B",
        });
      }
    });

    // Respond success
    return {
      "code": 0,
      "info": "success: storagestatus successfully retrieved",
      "data": data,
    };
  }

  // Open RPC tunnel(s) on request
  async openRpcTunnel(args){

    // Extract arguments
    var {force_fresh} = Object.assign({
      force_fresh:false,
    }, args);

    // Get current RPC status
    const rpcstatus = await this.getRpcStatus();
    if(rpcstatus.code)
      return rpcstatus;

    // Get available ports
    const localPorts = await this.nodeConnection.checkAvailablePorts({
      min: 8545,
      max: 8999,
      amount: rpcstatus.data.length,
    });

    // Make sure there are enough ports available
    if(localPorts.length != rpcstatus.data.length){
      return {
        "code": 1,
        "info": "error: not enough local ports availbe for all RPC services",
        "data": '',
      };
    }

    // Create a tunnel for each service
    for(let i=0; i < rpcstatus.data.length; i++){

      // Setup details for this service
      let sid = rpcstatus.data[i].sid;
      let rpc = rpcstatus.data[i].rpc;
      let addr = rpc.destinationIp;
      let port = rpc.destinationPort;

      // Check if the tunnel is already open
      if(this.rpcTunnel[sid] > 0 && !force_fresh){
        continue;
      }

      // Open the tunnel
      try{
        var localPort = localPorts.shift();
        await this.nodeConnection.openTunnels([{
          dstHost: addr,
          dstPort: port,
          localPort: localPort,
        }]);
      }catch(e){
        // On any error stop opening further tunnels and close all already opened
        await this.closeRpcTunnel()
        const freshrpcstatus = await this.getRpcStatus();
        freshrpcstatus.info = freshrpcstatus.info + '(fresh after failed attempt to open rpc tunnels)';
        return {
          "code": 2,
          "info": "error: failed to open tunnels (" + e + ")",
          "data": freshrpcstatus,
        };
      }

      // Update tunnel with opened port
      this.rpcTunnel[sid] = localPort;
    }

    // Respond success with fresh RPC status data
    const freshrpcstatus = await this.getRpcStatus();
    freshrpcstatus.info = freshrpcstatus.info + '(fresh after opening rpc tunnels)';
    return {
      "code": 0,
      "info": "success: tunnels successfully opened",
      "data": freshrpcstatus,
    };
  }

  // Close RPC tunnel(s) on request
  async closeRpcTunnel(){

    // Close all open tunnels, ignore any errors
    try{
      const openTunnels = Object.values(this.rpcTunnel);
      if(openTunnels.length){
        await this.nodeConnection.closeTunnels(openTunnels);
        this.rpcTunnel = {};
      }
    }catch(e){}

    // Respond success with fresh RPC status data
    const freshrpcstatus = await this.getRpcStatus();
    freshrpcstatus.info = freshrpcstatus.info + '(fresh after closing rpc tunnels)';
    return {
      "code": 0,
      "info": "success: tunnels successfully closed",
      "data": freshrpcstatus,
    };
  }

  // Get RPC status
  async getRpcStatus(){

    // Service definitions with their associated rpc api (service) port
    const services = {
      'GethService' : 8545,
      'BesuService' : 8545,
      'NethermindService' : 8545,
    };

    // Set timestamp in micro seconds
    var now = Date.now();

    // Get service infos
    const serviceInfos = await this.getServiceInfos();
    if(serviceInfos.length <1){
      return {
        "code": 1,
        "info": "error: service infos unavailable",
        "data": '',
      };
    }

    // Get execution clients with RPC data by service name
    const data = [];
    const executions = serviceInfos.filter((s) => Object.keys(services).includes(s.service)); 
    for(let i = 0; i < executions.length; i++){

      // Make sure execution client is valid and running
      let execution = executions[i]
      if(typeof execution !== "object" || !execution.hasOwnProperty("config") ||  !execution.hasOwnProperty("state") || execution.state != 'running'){
        continue;
      }

      // Filter the RPC port configuration and get addr/port that is mapped on docker host
      const sid = execution.config.serviceID;
      const rpc = execution.config.ports.filter((p) => p.servicePort == services[execution.service]).slice(-1).pop();
      rpc.destinationIp = rpc.destinationIp == '0.0.0.0' ? '127.0.0.1' : rpc.destinationIp; // FIX: rpc.destinationIp could be 0.0.0.0 if config was changed in expert mode
      let addr = rpc.destinationIp;
      let port = rpc.destinationPort;

      // Check if RPC port is enabled
      let result = await this.queryRpcApi({'addr':addr,'port':port},"web3_clientVersion");
      if(result.code)
        continue;
      
      // Add valid client to final result
      data.push({
        now: now,
        sid: sid,
        rpc: rpc,
        url: this.rpcTunnel[sid] > 0 ? 'http://' + addr + ':' + this.rpcTunnel[sid] : '',
        clt: execution.service.replace(/Service/gi,"").toUpperCase(),
      });
    }

    // Final check
    if(data.length < 1){
      return {
        "code": 2,
        "info": "error: no running execution client with enabled RPC port found",
        "data": '',
      };
    }

    // Respond success
    return {
      "code": 0,
      "info": "success: rpcstatus successfully retrieved",
      "data": data,
    };
  }

  // Open BEACON tunnel(s) on request
  async openBeaconTunnel(args){

    // Extract arguments
    var {force_fresh} = Object.assign({
      force_fresh:false,
    }, args);

    // Get current BEACON status
    const beaconstatus = await this.getBeaconStatus();
    if(beaconstatus.code)
      return beaconstatus;

    // Get available ports
    const localPorts = await this.nodeConnection.checkAvailablePorts({
      min: 5545,
      max: 5999,
      amount: beaconstatus.data.length,
    });

    // Make sure there are enough ports available
    if(localPorts.length != beaconstatus.data.length){
      return {
        "code": 1,
        "info": "error: not enough local ports availbe for all BEACON services",
        "data": '',
      };
    }

    // Create a tunnel for each service
    for(let i=0; i < beaconstatus.data.length; i++){

      // Setup details for this service
      let sid = beaconstatus.data[i].sid;
      let beacon = beaconstatus.data[i].beacon;
      let addr = beacon.destinationIp;
      let port = beacon.destinationPort;

      // Check if the tunnel is already open
      if(this.beaconTunnel[sid] > 0 && !force_fresh){
        continue;
      }

      // Open the tunnel
      try{
        var localPort = localPorts.shift();
        await this.nodeConnection.openTunnels([{
          dstHost: addr,
          dstPort: port,
          localPort: localPort,
        }]);
      }catch(e){
        // On any error stop opening further tunnels and close all already opened
        await this.closeBeaconTunnel()
        const freshbeaconstatus = await this.getBeaconStatus();
        freshbeaconstatus.info = freshbeaconstatus.info + '(fresh after failed attempt to open beacon tunnels)';
        return {
          "code": 2,
          "info": "error: failed to open tunnels (" + e + ")",
          "data": freshbeaconstatus,
        };
      }

      // Update tunnel with opened port
      this.beaconTunnel[sid] = localPort;
    }

    // Respond success with fresh BEACON status data
    const freshbeaconstatus = await this.getBeaconStatus();
    freshbeaconstatus.info = freshbeaconstatus.info + '(fresh after opening beacon tunnels)';
    return {
      "code": 0,
      "info": "success: tunnels successfully opened",
      "data": freshbeaconstatus,
    };
  }

  // Close BEACON tunnel(s) on request
  async closeBeaconTunnel(){

    // Close all open tunnels, ignore any errors
    try{
      const openTunnels = Object.values(this.beaconTunnel);
      if(openTunnels.length){
        await this.nodeConnection.closeTunnels(openTunnels);
        this.beaconTunnel = {};
      }
    }catch(e){}

    // Respond success with fresh BEACON status data
    const freshbeaconstatus = await this.getBeaconStatus();
    freshbeaconstatus.info = freshbeaconstatus.info + '(fresh after closing beacon tunnels)';
    return {
      "code": 0,
      "info": "success: tunnels successfully closed",
      "data": freshbeaconstatus,
    };
  }

  // Get BEACON status
  async getBeaconStatus(){

    // Service definitions with their associated beacon api (service) port
    const services = {
      'TekuBeaconService' : 5051,
      'LighthouseBeaconService' : 5052,
      'PrysmBeaconService' : 3500,
      'NimbusBeaconService' : 5052,
    };

    // Set timestamp in micro seconds
    var now = Date.now();

    // Get service infos
    const serviceInfos = await this.getServiceInfos();
    if(serviceInfos.length <1){
      return {
        "code": 1,
        "info": "error: service infos unavailable",
        "data": '',
      };
    }

    // Get consensus clients with BEACON data by service name
    const data = [];
    const consensusclients = serviceInfos.filter((s) => Object.keys(services).includes(s.service)); 
    for(let i = 0; i < consensusclients.length; i++){

      // Make sure consensus client is valid and running
      let consensus = consensusclients[i]
      if(typeof consensus !== "object" || !consensus.hasOwnProperty("config") ||  !consensus.hasOwnProperty("state") || consensus.state != 'running'){
        continue;
      }

      // Filter the BEACON port configuration and get addr/port that is mapped on docker host
      const sid = consensus.config.serviceID;
      const beacon = consensus.config.ports.filter((p) => p.servicePort == services[consensus.service]).slice(-1).pop();
      beacon.destinationIp = beacon.destinationIp == '0.0.0.0' ? '127.0.0.1' : beacon.destinationIp; // FIX: beacon.destinationIp could be 0.0.0.0 if config was changed in expert mode
      let addr = beacon.destinationIp;
      let port = beacon.destinationPort;

      // Check if BEACON port is enabled
      let result = await this.queryBeaconApi({'addr':addr,'port':port},"/eth/v1/node/syncing");
      if(result.code)
        continue;
      
      // Add valid client to final result
      data.push({
        now: now,
        sid: sid,
        beacon: beacon,
        url: this.beaconTunnel[sid] > 0 ? 'http://' + addr + ':' + this.beaconTunnel[sid] : '',
        clt: consensus.service.replace(/Beacon|Service/gi,"").toUpperCase(),
      });
    }

    // Final check
    if(data.length < 1){
      return {
        "code": 2,
        "info": "error: no running consensus client with enabled BEACON port found",
        "data": '',
      };
    }

    // Respond success
    return {
      "code": 0,
      "info": "success: beaconstatus successfully retrieved",
      "data": data,
    };
  }

  // Get a list of all publicly available ports (including the associated service and protocol)
  async getPortStatus(){

    // Get service infos
    const serviceInfos = await this.getServiceInfos();
    if(serviceInfos.length <1){
      return {
        "code": 1,
        "info": "error: service infos unavailable",
        "data": '',
      };
    }

    // Get ports that are bound to a public network
    let data = [];
    const ignore = ["127.0.0.1","localhost"];
    for(let i = 0; i < serviceInfos.length; i++){
      let svc = serviceInfos[i];
      let ports = svc.config.ports
      if(ports.length < 1) continue;
      for(let n = 0; n < ports.length; n++){
        if(ignore.some(w => ports[n].destinationIp.toLowerCase().includes(w)))
          continue;
        data.push({
          name: svc.service.replace(/Beacon|Service/gi,"").toUpperCase(),
          port: ports[n].destinationPort,
          prot: ports[n].servicePortProtocol,
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
    return {
      "code": 0,
      "info": "success: open ports retrieved",
      "data": data,
    };
  }

  // Used for fast debug/dev purposes
  async getDebugStatus(){

    // Get all service configurations
    const serviceInfos = await this.getServiceInfos();
    if(serviceInfos.length <1){
      return {
        "code": 9999,
        "info": "error: service infos for debugstatus not available",
        "data": "",
      };
    }

    // Get all dependency infos
    const dependencyInfos = []
    for(let i=0;i<serviceInfos.length;i++){
      dependencyInfos.push({
        service: serviceInfos[i].service,
        instanceID: serviceInfos[i].config.instanceID,
        dependencies: serviceInfos[i].config.dependencies,
      })
    }

    // Make an easy dependency view
    const easyInfos = []
    for(let i=0;i<serviceInfos.length;i++){
      const hashDependencies = serviceInfos[i].config.dependencies.consensusClients.length || serviceInfos[i].config.dependencies.executionClients.length ? 'yes' : 'no';
      easyInfos.push({
        hashDependencies: hashDependencies,
        service: serviceInfos[i].service,
        instanceID: serviceInfos[i].config.instanceID,
        dependencies: serviceInfos[i].config.dependencies,
      })
    }

    return {
      serviceInfos:serviceInfos,
      dependencyInfos:dependencyInfos,
      easyInfos:easyInfos,
    }

    // Nothign else, just string info..
    return "debugstatus"
  }

  // Get node stats (mostly by Prometheus)
  async getNodeStats(){
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
      const storagestatus = await this.getStorageStatus();
      // if(storagestatus.code)
      //   return storagestatus;
      const syncstatus = await this.getSyncStatus();
      // if(syncstatus.code)
      //   return syncstatus;
      const p2pstatus = await this.getP2PStatus();
      // if(p2pstatus.code)
      //   return p2pstatus;
      return {
        "code": 0,
        "info": "success: data successfully retrieved",
        "data": {
          'debugstatus':debugstatus,
          'syncstatus':syncstatus,
          'p2pstatus':p2pstatus,
          'storagestatus':storagestatus,
          'rpcstatus':rpcstatus,
          'beaconstatus':beaconstatus,
          'portstatus':portstatus,
        }
      };
    } catch (err) {
      return {
        "code": 1,
        "info": "error: an general error occured",
        "data": err,
      };
    }
  }

  // Just a demo for the Beacon API
  async myBeaconApiDemo(){
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
  async getAllPrometheusKeysDemo(){
    const serviceInfos = await this.getServiceInfos("PrometheusService","GrafanaService");
    const prometheus = serviceInfos.filter((s) => s.service == "PrometheusService").pop();
    if(typeof prometheus != "object"){
      return "we have a bad day ;)";
    }
    let addr = prometheus.config.ports[0].destinationIp;                // the addr on the docker host
    let port = prometheus.config.ports[0].destinationPort;              // the port on the docker host
    let service_port = prometheus.config.ports[0].servicePort;          // the port in the docker container
    let service_prot = prometheus.config.ports[0].servicePortProtocol;  // the protocol on the docker host and in the container
    const cmd = `curl -s http://${addr}:${port}/api/v1/label/__name__/values`;
    const resp = await this.nodeConnection.sshService.exec(cmd);
    return resp;
  }

  //serverNmae
  //totalRam, usedRam
  //Total, usedDisk, used%
  //CPUusage
  //rx tx
  //readSpeed writeSpeed
  async getServerVitals() {
    const serverVitals = await this.nodeConnection.sshService.exec(`
        hostname &&
        free --mega | sed -n '2p' | awk '{print $2" "$3}' &&
        df --total -BG --exclude-type=overlay | grep ^total | awk '{print $2" "$4" "$5}'
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
iostat -x | grep "$line" | awk '{print $3" "$9}' >> diskspeeds
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
    try{
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
        readValue: arr[5].split(" ")[1],
        writeValue: arr[5].split(" ")[2],
      };
      return data;
    }catch(e){
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
  async getServiceLogs(args){

    // Extract arguments
    var {logs_since, logs_until, logs_tail, logs_ts, service_name} = Object.assign({
      logs_since:null,
      logs_until:null,
      logs_tail:150,
      logs_ts:null,
      service_name:null,
    }, (typeof args === 'object' ? args : {}));

    // Get all service configurations
    const serviceInfos = service_name ? await this.getServiceInfos(service_name) : await this.getServiceInfos();
    if(serviceInfos.length <1){
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
    const logsSince = typeof logs_since == "string" ? logs_since : new Date(dateNow - 1000*60*10).toISOString();
    const logsUntil = typeof logs_until == "string" ? logs_until : new Date(dateNow).toISOString();
    const logsTail = typeof logs_tail == "number" || (typeof logs_tail == "string" && !isNaN(logs_tail)) ? parseInt(logs_tail) : 0;
    const logsTs= typeof logs_ts == "boolean" && logs_ts ? true : false;
    var sshcommand = [];
    var logArgs='';
    var logTs='';
    for(let i=0; i<serviceInfos.length; i++){
      var containerName = serviceInfos[i].config.instanceID;
      if(logsTail > 0){
        logArgs = `--tail ${logsTail}`;
      }else{
        logArgs = `--since ${logsSince} --until ${logsUntil}`;
      }
      logArgs = logsTs ? `--timestamps ${logArgs}` : logArgs;
      sshcommand.push(`docker logs ${logArgs} ${containerName} 2>&1 ; echo "---STEREUMSTRINGSPLITTER---"`);
    }
    sshcommand = sshcommand.join(" && ");
    var result = await this.nodeConnection.sshService.exec(sshcommand);
    if(result.rc || result.stdout == "" || result.stderr != ""){
      return [];
    }
    var result = result.stdout.trim().split("---STEREUMSTRINGSPLITTER---");

    // Attach container logs to each service
    for(let i=0; i<serviceInfos.length; i++){
      try{
        var logs = result[i].trim();
        serviceInfos[i].logs = logs ? logs.split(/\n/) : [];
      }catch(e){
        serviceInfos[i].logs = [];
      }
      serviceInfos[i].logsSince = logsTail > 0 ? null : logsSince;
      serviceInfos[i].logsUntil = logsTail > 0 ? null : logsUntil;
    }

    // Return service infos with logs
    return serviceInfos;
  }
}
