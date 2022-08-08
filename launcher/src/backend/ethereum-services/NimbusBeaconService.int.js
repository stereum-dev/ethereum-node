import { HetznerServer } from '../HetznerServer.js'
import { NodeConnection } from '../NodeConnection.js'
import { ServicePort, servicePortProtocol } from './ServicePort.js'
import { StringUtils } from '../StringUtils.js'
import { ServiceManager } from '../ServiceManager.js'
import { NimbusBeaconService } from './NimbusBeaconService.js'
import { GethService } from './GethService.js'
const log = require('electron-log')

jest.setTimeout(1000000)

test('nimbus validator import', async () => {
    //create server
    const testServer = new HetznerServer()
    const serverSettings = {
        name: 'Nimbus--integration-test--ubuntu-2204',
        image: 'ubuntu-22.04',
        location: 'fsn1',
        server_type: 'cpx21',
        start_after_create: true,
    }
    await testServer.create(serverSettings)
    log.info('server started')


    const connectionParams = {
        host: testServer.serverIPv4,
        port: '22',
        username: 'root',
        password: testServer.serverRootPassword,
        privatekey: undefined
    }

    //connect to server
    const nodeConnection = new NodeConnection(connectionParams)
    const serviceManager = new ServiceManager(nodeConnection)
    await testServer.connect(nodeConnection)

    //change password
    await testServer.passwordAuthentication(testServer.serverRootPassword)

    //attach to subnetwork
    await testServer.attachToNetwork('eth2-prater', '10.10.0.145')
    log.info('server attached to network')

    //prepare node
    await nodeConnection.sshService.exec(` mkdir /etc/stereum &&
      echo "stereum_settings:
      settings:
        controls_install_path: /opt/stereum
        os_user: stereum
        updates:
          lane: stable
          unattended:
            install: false
    " > /etc/stereum/stereum.yaml`)
    await nodeConnection.findStereumSettings()
    await nodeConnection.prepareStereumNode(nodeConnection.settings.stereum.settings.controls_install_path);

    //install geth
    let ports = [
        new ServicePort(null, 30303, 30303, servicePortProtocol.tcp),
        new ServicePort(null, 30303, 30303, servicePortProtocol.udp),
        new ServicePort('127.0.0.1', 8551, 8551, servicePortProtocol.tcp),
      ]
    let geth = GethService.buildByUserInput('goerli', ports, nodeConnection.settings.stereum.settings.controls_install_path + '/geth')

    //install nimbus
    ports = [
        new ServicePort(null, 9000, 9000, servicePortProtocol.tcp),
        new ServicePort(null, 9000, 9000, servicePortProtocol.udp),
        new ServicePort('127.0.0.1', 9190, 9190, servicePortProtocol.tcp),
        new ServicePort('127.0.0.1', 5052, 5052, servicePortProtocol.tcp)
    ]
    let nimbusClient = NimbusBeaconService.buildByUserInput('prater', ports, nodeConnection.settings.stereum.settings.controls_install_path + '/nimbus', [geth], 'stereum.net')
    //change out web3 address for integration test
    // const index = nimbusClient.command.findIndex(element => element.includes('--web3-url='))
    // nimbusClient.command[index] = '--web3-url=ws://10.10.0.2:8545'
    
    //write config and start geth
    await nodeConnection.writeServiceConfiguration(geth.buildConfiguration())
    await serviceManager.manageServiceState(geth.id, 'started')
    
    //write config and start nimbus
    await nodeConnection.writeServiceConfiguration(nimbusClient.buildConfiguration())
    await serviceManager.manageServiceState(nimbusClient.id, 'started')

    //generate validator api-token
    const token = StringUtils.createRandomString();
    await nodeConnection.sshService.exec(`echo ${token} > /opt/stereum/nimbus-${nimbusClient.id}/validator/validators/api-token.txt`)

    //Waiting for the service to start properly
    await testServer.Sleep(60000)

    //import validator
    const extraVars = {
        stereum_role: 'validator-import-api', validator_service: nimbusClient.id , validator_keys:[{
                name: 'batch0',
                passwords: ['MyTestPassword','MyTestPassword','MyTestPassword'],
                content: [
                    '{"crypto": {"kdf": {"function": "scrypt", "params": {"dklen": 32, "n": 262144, "r": 8, "p": 1, "salt": "de4b32f49572c01146afb11a82c326fdc03be6cf447983daf9eb7ec0f868a116"}, "message": ""}, "checksum": {"function": "sha256", "params": {}, "message": "1ccb24f0f1469ab56cc0147dae242aab59ff360177c8ec4f710966913da839b6"}, "cipher": {"function": "aes-128-ctr", "params": {"iv": "a24857026939492f49444679544cb6bb"}, "message": "b5d944adfb65e33873c5c1b809c3c15b558821f2829cd7e9da1df65d0b78fdb6"}}, "description": "", "pubkey": "acaa51756fb445b406c9e599f3f4bec991f7799c002619566ab1fa5b70445c62f1ac6561154ca5e49d7542dbe690b96b", "path": "m/12381/3600/0/0/0", "uuid": "1ea9ed13-e3bb-4555-99d9-c5e83ab9eb67", "version": 4}',
                    '{"crypto": {"kdf": {"function": "scrypt", "params": {"dklen": 32, "n": 262144, "r": 8, "p": 1, "salt": "de4b32f49572c01146afb11a82c326fdc03be6cf447983daf9eb7ec0f868a116"}, "message": ""}, "checksum": {"function": "sha256", "params": {}, "message": "3691a02425a4607b86292313cc72e31d4866043034ee9cff0b7cab2096105269"}, "cipher": {"function": "aes-128-ctr", "params": {"iv": "a24857026939492f49444679544cb6bb"}, "message": "e8a184e9d70408acd33459c67632c7bb63cf9c58a175de2030f962da88a2eb4d"}}, "description": "", "pubkey": "82ed748ffbc23ee3b730577a81f4cd05fe7dba234b3de5efc31f53de67091de9631d8581d72892351dfad52b65e53fbf", "path": "m/12381/3600/1/0/0", "uuid": "f712f984-b926-4e90-a603-f3f14703bf4b", "version": 4}',
                    '{"crypto": {"kdf": {"function": "scrypt", "params": {"dklen": 32, "n": 262144, "r": 8, "p": 1, "salt": "de4b32f49572c01146afb11a82c326fdc03be6cf447983daf9eb7ec0f868a116"}, "message": ""}, "checksum": {"function": "sha256", "params": {}, "message": "fa52987837af01ec48e2b21f2078acef3368983943751013758052e07dae841d"}, "cipher": {"function": "aes-128-ctr", "params": {"iv": "a24857026939492f49444679544cb6bb"}, "message": "8c055c8c504cd3ad20bcb1101431b2b1a506b1a4d0efdbd294d75c39c0f2268b"}}, "description": "", "pubkey": "948f092cb5b5cae121fdc14af0e4e5a90d03ab661266b700ded1c1ca4fd6f0a76f8dac187815409197bf036675571458", "path": "m/12381/3600/2/0/0", "uuid": "c7521eed-533a-4fd1-90b7-ad1aa0f24a2d", "version": 4}',
                ]}]
    }
    await nodeConnection.runPlaybook('validator-import-api', extraVars)

    //Waiting for the service to start properly
    await testServer.Sleep(60000)

    //get logs
    const status = await nodeConnection.sshService.exec(`docker logs --tail=200 stereum-${nimbusClient.id}`)
    const ufw = await nodeConnection.sshService.exec('ufw status')
    const docker = await nodeConnection.sshService.exec('docker ps')

    // destroy
    await nodeConnection.destroyNode()
    await nodeConnection.sshService.disconnect()
    await testServer.destroy()

    //check ufw
    expect(ufw.stdout).toMatch(/9000\/tcp/)
    expect(ufw.stdout).toMatch(/9000\/udp/)
    expect(ufw.stdout).toMatch(/5052\/tcp/)
    expect(ufw.stdout).toMatch(/9190\/tcp/)

    //check docker container
    expect(docker.stdout).toMatch(/statusim\/nimbus-eth2/)
    expect(docker.stdout).toMatch(/5052->5052/)
    expect(docker.stdout).toMatch(/9190->9190/)
    expect(docker.stdout).toMatch(/9000->9000/)
    if(!(nimbusClient.id.includes('Up'))){
        expect((docker.stdout.match(new RegExp('Up', 'g')) || []).length).toBe(2)
    }

    //check nimbus service logs
    expect(status.stdout).toMatch(/Eth1 chain monitoring failure, restarting/)
    expect(status.stdout).toMatch(/Parameter \[result\] expected JObject but got JNull/)

})