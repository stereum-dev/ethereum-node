const log = require('electron-log');
const https = require('https');

/**
 * Used to wait for the server to fully initialize
 */
function Sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export class HetznerServer {
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

//EOF
