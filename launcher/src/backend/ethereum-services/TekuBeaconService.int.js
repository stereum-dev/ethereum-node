/**
 * @jest-environment node
 */
import { HetznerServer } from '../HetznerServer.js'
import { NodeConnection } from '../NodeConnection.js'
import { ServicePort, servicePortProtocol } from './ServicePort.js'
import { StringUtils } from '../StringUtils.js'
import { ServiceManager } from '../ServiceManager.js'
import { TekuBeaconService } from './TekuBeaconService.js'
import { GethService } from './GethService.js'
import { ServiceVolume } from './ServiceVolume.js'
const log = require('electron-log')

jest.setTimeout(1000000)

test('teku validator import', async () => {
    //create server
    const testServer = new HetznerServer()
    const serverSettings = {
        name: 'Teku--integration-test--ubuntu-2204',
        image: 'ubuntu-22.04',
        server_type: 'cpx31',
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

    let ports = [
      new ServicePort(null, 30303, 30303, servicePortProtocol.tcp),
      new ServicePort(null, 30303, 30303, servicePortProtocol.udp),
      new ServicePort('127.0.0.1', 8551, 8551, servicePortProtocol.tcp),
    ]
    let geth = GethService.buildByUserInput('goerli', ports, nodeConnection.settings.stereum.settings.controls_install_path + '/geth')

    ports = [
      new ServicePort(null, 9001, 9001, servicePortProtocol.tcp),
      new ServicePort(null, 9001, 9001, servicePortProtocol.udp),
      new ServicePort('127.0.0.1', 5051, 5051, servicePortProtocol.tcp),
      new ServicePort('127.0.0.1', 5052, 5052, servicePortProtocol.tcp),
      new ServicePort('127.0.0.1', 8008, 8008, servicePortProtocol.tcp)
    ]
    let tekuClient = TekuBeaconService.buildByUserInput('prater', ports, nodeConnection.settings.stereum.settings.controls_install_path + '/teku', [geth], [])
    //change out eth1 endpoint address for integration test
    // const index = tekuClient.command.findIndex(element => element.includes('--ee-endpoint='))
    // tekuClient.command[index] = '--ee-endpoint==http://10.10.0.3:8545'
    
    await nodeConnection.writeServiceConfiguration(geth.buildConfiguration()),
    await serviceManager.manageServiceState(geth.id, 'started')

    //write config and start teku
    await nodeConnection.writeServiceConfiguration(tekuClient.buildConfiguration())
    await serviceManager.manageServiceState(tekuClient.id, 'started')
    await testServer.Sleep(30000)

    const dataDir = ((tekuClient.buildConfiguration().volumes.find(volume => volume.includes('data'))).split(':'))[0]
    log.debug(dataDir)

    //generate keystore password and file
    const password = StringUtils.createRandomString()
    await nodeConnection.sshService.exec('apt install -y openjdk-8-jre-headless')
    await nodeConnection.sshService.exec(`echo ${password} > ${dataDir}/teku_api_password.txt`)
    await nodeConnection.sshService.exec(`cd ${dataDir} && keytool -genkeypair -keystore teku_api_keystore -storetype PKCS12 -storepass ${password} -keyalg RSA -keysize 2048 -validity 109500 -dname 'CN=localhost, OU=MyCompanyUnit, O=MyCompany, L=MyCity, ST=MyState, C=AU' -ext san=dns:localhost,ip:127.0.0.1`)

    await serviceManager.manageServiceState(tekuClient.id, 'stopped')
    await serviceManager.manageServiceState(tekuClient.id, 'started')

    await testServer.Sleep(30000)
    //import validator
    const extraVars = {
      stereum_role: 'validator-import-api', validator_service: tekuClient.id , validator_keys:[{
              name: 'batch0',
              passwords: ['MyTestPassword','MyTestPassword','MyTestPassword'],
              content: [
                  '{"crypto": {"kdf": {"function": "scrypt", "params": {"dklen": 32, "n": 262144, "r": 8, "p": 1, "salt": "de4b32f49572c01146afb11a82c326fdc03be6cf447983daf9eb7ec0f868a116"}, "message": ""}, "checksum": {"function": "sha256", "params": {}, "message": "1ccb24f0f1469ab56cc0147dae242aab59ff360177c8ec4f710966913da839b6"}, "cipher": {"function": "aes-128-ctr", "params": {"iv": "a24857026939492f49444679544cb6bb"}, "message": "b5d944adfb65e33873c5c1b809c3c15b558821f2829cd7e9da1df65d0b78fdb6"}}, "description": "", "pubkey": "acaa51756fb445b406c9e599f3f4bec991f7799c002619566ab1fa5b70445c62f1ac6561154ca5e49d7542dbe690b96b", "path": "m/12381/3600/0/0/0", "uuid": "1ea9ed13-e3bb-4555-99d9-c5e83ab9eb67", "version": 4}',
                  '{"crypto": {"kdf": {"function": "scrypt", "params": {"dklen": 32, "n": 262144, "r": 8, "p": 1, "salt": "de4b32f49572c01146afb11a82c326fdc03be6cf447983daf9eb7ec0f868a116"}, "message": ""}, "checksum": {"function": "sha256", "params": {}, "message": "3691a02425a4607b86292313cc72e31d4866043034ee9cff0b7cab2096105269"}, "cipher": {"function": "aes-128-ctr", "params": {"iv": "a24857026939492f49444679544cb6bb"}, "message": "e8a184e9d70408acd33459c67632c7bb63cf9c58a175de2030f962da88a2eb4d"}}, "description": "", "pubkey": "82ed748ffbc23ee3b730577a81f4cd05fe7dba234b3de5efc31f53de67091de9631d8581d72892351dfad52b65e53fbf", "path": "m/12381/3600/1/0/0", "uuid": "f712f984-b926-4e90-a603-f3f14703bf4b", "version": 4}',
                  '{"crypto": {"kdf": {"function": "scrypt", "params": {"dklen": 32, "n": 262144, "r": 8, "p": 1, "salt": "de4b32f49572c01146afb11a82c326fdc03be6cf447983daf9eb7ec0f868a116"}, "message": ""}, "checksum": {"function": "sha256", "params": {}, "message": "fa52987837af01ec48e2b21f2078acef3368983943751013758052e07dae841d"}, "cipher": {"function": "aes-128-ctr", "params": {"iv": "a24857026939492f49444679544cb6bb"}, "message": "8c055c8c504cd3ad20bcb1101431b2b1a506b1a4d0efdbd294d75c39c0f2268b"}}, "description": "", "pubkey": "948f092cb5b5cae121fdc14af0e4e5a90d03ab661266b700ded1c1ca4fd6f0a76f8dac187815409197bf036675571458", "path": "m/12381/3600/2/0/0", "uuid": "c7521eed-533a-4fd1-90b7-ad1aa0f24a2d", "version": 4}',
              ]}]
  }
    await nodeConnection.runPlaybook('validator-import-api', extraVars)



    //get logs
    let condition = false
    let counter = 0
    let status = ""
    while(!condition && counter < 10){
      await testServer.Sleep(60000)
      status = await nodeConnection.sshService.exec(`docker logs stereum-${tekuClient.id}`)
      if(
        /Syncing started/.test(status.stdout) &&
        /Added validator:/.test(status.stdout) &&
        /Execution Client is online/.test(status.stdout)
      ){condition = true}
      counter ++;
    }

    const ufw = await nodeConnection.sshService.exec('ufw status')
    const docker = await nodeConnection.sshService.exec('docker ps')
    const teku_api_keystore = await nodeConnection.sshService.exec(`cat ${dataDir}/teku_api_keystore`)
    const teku_api_password = await nodeConnection.sshService.exec(`cat ${dataDir}/teku_api_password.txt`)
    const validator_api_bearer = await nodeConnection.sshService.exec(`cat ${dataDir}/validator/key-manager/validator-api-bearer`)

    // destroy
    await nodeConnection.destroyNode()
    await nodeConnection.sshService.disconnect()
    await testServer.destroy()

    //check ufw
    expect(ufw.stdout).toMatch(/9001\/tcp/)
    expect(ufw.stdout).toMatch(/9001\/udp/)
    expect(ufw.stdout).toMatch(/5052\/tcp/)
    expect(ufw.stdout).toMatch(/5051\/tcp/)
    expect(ufw.stdout).toMatch(/8008\/tcp/)

    //check teku API keystore, password & api bearer
    expect(teku_api_keystore.stdout).toBeTruthy()
    expect(teku_api_password.stdout).toBeTruthy()
    expect(validator_api_bearer.stdout).toBeTruthy()

    //teku teku logs
    expect(status.stdout).toMatch(/Syncing started/)
    expect(status.stdout).toMatch(/Added validator:/)
    expect(status.stdout).toMatch(/Execution Client is online/)

    //check docker container
    expect(docker.stdout).toMatch(/consensys\/teku/)
    expect(docker.stdout).toMatch(/5051-5052->5051-5052/)
    expect(docker.stdout).toMatch(/8008->8008/)
    expect(docker.stdout).toMatch(/9001->9001/)
    if(!(tekuClient.id.includes('Up'))){
      expect((docker.stdout.match(new RegExp('Up', 'g')) || []).length).toBe(2)
    }

})

// EOF
 