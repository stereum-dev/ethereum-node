import { HetznerServer } from "./HetznerServer";
import { NodeConnection } from "./NodeConnection";
import { nodeOS } from "./NodeOS";
const log = require('electron-log');


jest.setTimeout(500000);

function Sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

test('prepareStereumNode on ubuntu', async () => {

    const serverSettings = {
        name: 'my-server',
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
    await testServer.passwordAuthentication(nodeConnection,testServer.serverRootPassword,"thisisaverysecurepassword");
    
    await nodeConnection.findOS();

    //create settings file
    await nodeConnection.sshService.exec(` mkdir /etc/stereum &&
    echo "{stereum: {settings: {controls_install_path: /opt/stereumnode, os_user: stereum, updates: {in_progress: null, lane: stable, available: null, unattended: {check: true, install: false}}}}}" > /etc/stereum/stereum.yaml`);
    await nodeConnection.findStereumSettings();
    
    //will be implemented once Playbooks exists to run roles
    //await nodeConnection.prepareStereumNode("/opt/stereumnode");
    
    await nodeConnection.sshService.disconnect();
    await testServer.destroy();

    expect(nodeConnection.os).toBe(nodeOS.ubuntu);
    expect(nodeConnection.settings).toBeDefined();
});

//EOF
