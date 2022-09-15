import { NodeConnection } from "./NodeConnection";
import { ServiceManager } from "./ServiceManager";
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
        services = await nodeConnection.listServicesConfigurations();
      } catch {
        services = [];
      }
      if (services.length != 0 && settings.stdout.includes("stereum.yaml"))
        return true;
    }
    return false;
  }

  async refreshServiceInfos() {
    if (await this.checkStereumInstallation()) {
      const serviceConfigs = (
        await this.serviceManager.readServiceConfigurations()
      ).filter((s) => s.service != "PrometheusNodeExporterService");
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
    const file = path.join(os.tmpdir(), 'server_infos_cache.txt');
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

  // Get sync status of consensus and execution clients
  async getSyncStatus(){

    // Service definitions with type and Prometheus labels for sync status
    // TODO: Verify this keys!
    const services = {
      'consensus':{
        'TekuBeaconService' : ['beacon_slot','beacon_head_slot'], // OK
        'LighthouseBeaconService' : ['slotclock_present_slot','beacon_head_state_slot'], // OK
        'PrysmBeaconService' : ['beacon_clock_time_slot','beacon_head_slot'], // OK
        'NimbusBeaconService' : ['beacon_slot','beacon_head_slot'], // OK
      },
      'execution':{
        'GethService' : ['chain_head_header','chain_head_receipt','chain_head_block'], // TODO: which of those keys ​​are correct?
        'BesuService' : ['ethereum_best_known_block_number','ethereum_blockchain_height'], // OK
        'NethermindService' : ['nethermind_blocks','nethermind_blocks_sealed'], // TODO: N/A (ask)
      },
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

    // Find execution and consensus service configurations
    var consensus, execution;
    const clientTypes = Object.keys(services);
    for(let i=0;i<clientTypes.length;i++){
      let clientType = clientTypes[i];
      let clt = serviceInfos.filter((s) => Object.keys(services[clientType]).includes(s.service)).pop();
      if(typeof clt !== "object" || !clt.hasOwnProperty("service") || !clt.hasOwnProperty("config")){
        return {
          "code": 112,
          "info": "error: " + clientType + " client not found (in syncstatus)",
          "data": serviceInfos,
        };
      }
      eval(clientType + " = clt;");  // eval objects -> consensus/execution
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

    // Filter Prometheus result by current used services
    try{

      // Add the response for "syncStatusItems" exact as defined in front-end
      // Values for "syncIcoSituation" and "syncIcoError" can generated from these!
      // Attention: frstVal needs to be the lower value in frontend, which is in key 1 + added new state key!
      var data = [];
      clientTypes.forEach(function (clientType, index) {
        let clt = '';
        eval("clt = " + clientType + ";"); // eval clt object from consensus/execution objects
        let results = [];
        let labels = services[clientType][clt.service];
        let xx = prometheus_result.data.result.filter((s) => labels.includes(s.metric.__name__));
        if(xx.length){
          labels.forEach(function (label, index) {
            try{
              results[label] = xx.filter((s) => s.metric.__name__ == labels[index]).pop().value.pop()
            }catch(e){}
          });
        }
        let frstVal = 0, scndVal = 0;
        try{
          frstVal = results[labels[1]];
          scndVal = results[labels[0]];
        }catch(e){}
        data.push({
          id: index+1,
          title: clt.service.replace(/Beacon|Service/gi,"").toUpperCase(),
          frstVal: frstVal ? frstVal : 0,
          scndVal: scndVal ? scndVal : 0,
          state: clt.state,
        });
      });

      // Respond success
      return {
        "code": 0,
        "info": "success: syncstatus successfully retrieved",
        "data": data,
      };

    }catch(err){
      return {
        "code": 114,
        "info": "error: no prometheus data for syncstatus available yet",
        "data": err,
      };
    }
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

    // Find execution and consensus service configurations
    var consensus, execution;
    const clientTypes = Object.keys(services);
    for(let i=0;i<clientTypes.length;i++){
      let clientType = clientTypes[i];
      let clt = serviceInfos.filter((s) => Object.keys(services[clientType]).includes(s.service)).pop();
      if(typeof clt !== "object" || !clt.hasOwnProperty("service") || !clt.hasOwnProperty("config")){
        return {
          "code": 222,
          "info": "error: " + clientType + " client not found (in p2pstatus)",
          "data": serviceInfos,
        };
      }
      eval(clientType + " = clt;");  // eval objects -> consensus/execution
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
    var opttyp=null, optnam=null, defval=null, optval=null, regexp=null;
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

    // Query Prometehus for all possible labels
    const prometheus_result = await this.queryPrometheus('{__name__=~"'+serviceLabels.join('|')+'"}');
    if(typeof prometheus_result !== "object" || !prometheus_result.hasOwnProperty("status") || prometheus_result.status != "success"){
      return {
        "code": 223,
        "info": "error: prometheus query for p2pstatus failed",
        "data": prometheus_result,
      };
    }

    // Filter Prometheus result by current used services and calculate number of currently used peers per client
    // Note that Prysm requires to match state="Connected"!
    try{
      var maxPeer = 0, numPeer = 0, valPeer = 0;
      clientTypes.forEach(function (clientType, index) {
        let clt = '';
        eval("clt = " + clientType + ";"); // eval clt object from consensus/execution objects
        let xx = prometheus_result.data.result.filter((s) => 
          services[clientType][clt.service].includes(s.metric.__name__) && 
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
      
      // Respond success
      // Define the response for "valPeer" exact as defined in front-end as percentage (%).
      // Avoid overdues that may happen during peer cleaning. The exact values can be taken
      // from the details object if needed.
      return {
        "code": 0,
        "info": "success: p2pstatus successfully retrieved",
        "data": {
          'details': details,
          'maxPeer': maxPeer,
          'numPeer': numPeer > maxPeer ? maxPeer : numPeer,
          'valPeer': valPeer > 100 ? 100 : valPeer,
        },
      };

    }catch(err){
      return {
        "code": 224,
        "info": "error: no prometheus data for p2pstatus available yet",
        "data": err,
      };
    }
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

    // Build ssh command to query storages 
    var sshcmd = '';
    for(let svc of serviceInfos){
        if(typeof svc !== "object" || !svc.hasOwnProperty("service") || !svc.hasOwnProperty("config")){
            continue;
        }
        if(Array.isArray(svc.config.volumes) && svc.config.volumes.length){
          const strVolumes = '"' + svc.config.volumes.flatMap(({ destinationPath }) => destinationPath).join('" "') + '"';
          sshcmd += 'du -csh ' + strVolumes + ' | tail -n1 | awk \'{print $1;}\' ; ';
        }
    }
    sshcmd = sshcmd.trim();
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
    serviceInfos.forEach(function (svc, index) {
      data.push({
        id: index+1,
        title: svc.service.replace(/Beacon|Service/gi,"").replace(/Validator/gi," vc").replace(/NodeExporter/gi," ne").toUpperCase(),
        storageValue: ( (!(index in storagesizes) || !storagesizes[index] || storagesizes[index] < 1) ? '0 ' : storagesizes[index].replace(/([a-z]+)/si,' $1') ) + "B",
      });
    });

    // Respond success
    return {
      "code": 0,
      "info": "success: storagestatus successfully retrieved",
      "data": data,
    };
  }

  // Get node stats (mostly by Prometheus)
  async getNodeStats(){
    try {
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
          // 'syncstatus':syncstatus.data,
          // 'p2pstatus':p2pstatus.data,
          // 'storagestatus':storagestatus.data,
          'syncstatus':syncstatus,
          'p2pstatus':p2pstatus,
          'storagestatus':storagestatus,
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

  // Just a demo how to get all keys from prometheus and how to fetch different services thru getServiceInfos
  async getAllPrometheusKeysDemo(){
    const serviceInfos = await this.getServiceInfos("PrometheusService","GrafanaService");
    const prometheus = serviceInfos.filter((s) => s.service == "PrometheusService").pop();
    if(typeof prometheus != "object"){
      return "we have a bad day ;)";
    }
    let addr = prometheus.config.ports[0].destinationIp;
    let port = prometheus.config.ports[0].destinationPort;
    let service_port = prometheus.config.ports[0].servicePort;
    let service_prot = prometheus.config.ports[0].servicePortProtocol;
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
        df --total -h --exclude-type=overlay | grep ^total | awk '{print $2" "$4" "$5}'
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
  }
}
