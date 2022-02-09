import { NodeConnection } from "./NodeConnection";
import { nodeOS } from "./NodeOS";
import * as crypto from "crypto";
const log = require('electron-log');
const https = require('https');

jest.setTimeout(500000);

function Sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class HetznerServer {
    constructor(){
        this.apiToken = process.env.HCLOUD_TOKEN    //don't forget to set env variable "export HCLOUD_TOKEN=<your-hetzner-api-token>"
        this.serverID = null;
        this.serverName = null;
        this.serverIPv4 = null;
        this.serverRootPassword = null;
    }


    /**
     * creates HTTPS options object
     * @param method {string} - Either "GET", "POST", "DELTE" or "PUT"
     * @param serverID {string} - Used to specify which server to target (optional)
     * @returns https options with given method and path
     */
    async createHTTPOptions(method, serverID) {
        serverID === undefined ? serverID = "" : serverID = "/" + serverID
        let options = {
            hostname: 'api.hetzner.cloud',
            path: `/v1/servers${serverID}`,
            method: method,
            headers: {
              'Content-Type': 'application/json',
              Authorization : 'Bearer ' + this.apiToken
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
        return new Promise ((resolve, reject) => {
            const req = https.request(options, res => {
                res.on('data', d => {
                    data += d;
                  })
                res.on('end', () => {
                    resolve(data);
                })
            });

            req.on('error', err => {
                log.error(err);
                reject(err);
            });

            if(body !== undefined){
                req.write(body)
            }
            req.end();
        });
    }

    /**
     * Creates a shell session to handle Password Authentication (reset root password)
     * @param nodeConnection instance with defined SSHService (SSH-Connection)
     * @param password {string} root password generated on server creation
     * @param newPassword new root password
     */
    async passwordAuthentication(nodeConnection,password,newPassword){
        return new Promise((resolve, reject) => {
            nodeConnection.sshService.conn.shell(function(err, stream) {
                if (err) throw err;
                stream.stderr.on('data', (err) => {
                    log.error(err);
                    reject();
                })
                stream.stdout.on('data', (data) => {
                    if(/Current password:/.test(data)){
                        stream.stdin.write(`${password}\r\n`);
                    }else if(/New password:/.test(data)){
                        stream.stdin.write(`${newPassword}\r\n`);
                    }else if(/Retype new password:/.test(data)){
                        stream.stdin.write(`${newPassword}\r\n`);
                    }else if(/:~#/.test(data)){
                        stream.end();
                        nodeConnection.sshService.disconnect();
                        resolve()
                    }
                })
            });
        }).then( async () => {
            this.serverRootPassword = newPassword;
            nodeConnection.nodeConnectionParams.password = newPassword;
            await nodeConnection.establish();
            log.info("Reconnected after password change");
        }).catch(err => log.error("Password Authentication failed:\n",err));
    }

    /**
     * Creates Hetzner Server
     * @param serverSettings object with settings for Server Creation 
     */
    async create(serverSettings) {
        let data = await this.makeRequest(await this.createHTTPOptions("POST"),JSON.stringify(serverSettings));
        const responseData = JSON.parse(data);
        if(responseData.error !== undefined) throw responseData.error;

        this.serverID = responseData.server.id;
        this.serverName = responseData.server.name;
        this.serverIPv4 = responseData.server.public_net.ipv4.ip;
        this.serverRootPassword = responseData.root_password;

        let status = [];
        let check = {counter : 0, maxTries : 25};
        do {
        log.info("Initializing Server");
            try{
                status[check.counter] = (await this.getStatus()).server.status;
                if(++check.counter == check.maxTries) throw 'Server creation was canceled';
            } catch(e) {
                log.error("Error creating Server:\n")
                throw e;
            }
            await Sleep(2000);
        } while(status == 'initializing');
    } 

    /**
     * Destroys Server via API call
     */
    async destroy() {
        let data = await this.makeRequest(await this.createHTTPOptions("DELETE",this.serverID));
        const responseData = JSON.parse(data);
        if(responseData.action.status == 'success' && responseData.action.progress == 100){
            log.info("Server with ID " + this.serverID + " was destroyed successfully")
        }else{
            log.error("Error deleting Server:\n", responseData);
        }
    }

    /**
     * Gets server information via API call
     * @returns object containing server information
     */
    async getStatus() {
        let data = await this.makeRequest(await this.createHTTPOptions("GET",this.serverID));
        const responseData = JSON.parse(data);
        return responseData;
    }
}

test('prepareStereumNode on ubuntu', async () => {

    const serverSettings = {
        name: 'NodeConnection--integration-test--ubuntu-2004',
        image: "ubuntu-20.04",
        location: "fsn1",
        server_type: "cx11",
        start_after_create: true
      };    
      
    let testServer = new HetznerServer();
    await testServer.create(serverSettings);
    log.info("Server started");

    const connectionParams = {
        host: testServer.serverIPv4,  //testServer.serverIPv4
        port: '22',
        username: 'root',
        password: testServer.serverRootPassword, //testServer.serverRootPassword
        privatekey: undefined
    };
    
    let nodeConnection = new NodeConnection(connectionParams);
    let retry = {connected : false, counter : 0, maxTries : 10};
    log.info("Connecting via SSH");
    while(!retry.connected){
        try {
            await nodeConnection.establish();
            retry.connected = true;
            log.info("Connected!");
        }
        catch(e) {
            if(++retry.counter == retry.maxTries) throw e;
            log.info(" Could not connect.\n" + (retry.maxTries - retry.counter) + " tries left.");
            await Sleep(2000);
        }
    }

    let buf = crypto.randomBytes(20);
    const password = buf.toString('hex');
    await testServer.passwordAuthentication(nodeConnection,testServer.serverRootPassword,password);
    
    await nodeConnection.findOS();

    //create settings file
    await nodeConnection.sshService.exec(` mkdir /etc/stereum &&
    echo "{stereum: {settings: {controls_install_path: /opt/stereumnode, os_user: stereum, updates: {in_progress: null, lane: stable, available: null, unattended: {check: true, install: false}}}}}" > /etc/stereum/stereum.yaml`);
    await nodeConnection.findStereumSettings();
    
    //will be implemented once Playbooks exist to run roles
    //await nodeConnection.prepareStereumNode("/opt/stereumnode");
    
    await nodeConnection.sshService.disconnect();
    await testServer.destroy();

    expect(nodeConnection.os).toBe(nodeOS.ubuntu);
    expect(nodeConnection.settings).toBeDefined();
});

//EOF
