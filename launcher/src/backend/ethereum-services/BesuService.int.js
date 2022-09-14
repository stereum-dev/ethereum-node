/**
 * @jest-environment node
 */
import { HetznerServer } from '../HetznerServer.js'
import { NodeConnection } from '../NodeConnection.js'
import { ServicePort, servicePortProtocol } from './ServicePort.js'
import { ServiceManager } from '../ServiceManager.js'
import { BesuService } from './BesuService.js'
const log = require('electron-log')

jest.setTimeout(500000)

test('besu installation', async () => {
  const serverSettings = {
    name: 'Besu--integration-test--ubuntu-2204',
    image: 'ubuntu-22.04',
    server_type: 'cpx21',
    start_after_create: true
  }

  const testServer = new HetznerServer()
  await testServer.create(serverSettings)
  log.info('Server started')

  const connectionParams = {
    host: testServer.serverIPv4,
    port: '22',
    username: 'root',
    password: testServer.serverRootPassword,
    privatekey: undefined
  }
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

  //install besu
  const ports = [
    new ServicePort(null, 30303, 30303, servicePortProtocol.tcp),
    new ServicePort(null, 30303, 30303, servicePortProtocol.udp)
  ]

  const executionClient = BesuService.buildByUserInput('goerli', ports, nodeConnection.settings.stereum.settings.controls_install_path + '/besu')
  await nodeConnection.writeServiceConfiguration(executionClient.buildConfiguration())
  await serviceManager.manageServiceState(executionClient.id, 'started')

  //get logs
  let condition = false
  let counter = 0
  let status = ""
  while(!condition && counter < 10){
    await testServer.Sleep(30000)
    status = await nodeConnection.sshService.exec(`docker logs stereum-${executionClient.id}`)
    if(
      /Websocket service started/.test(status.stdout) &&
      /P2P RLPx agent started/.test(status.stdout) &&
      /Starting peer discovery agent/.test(status.stdout) &&
      /Starting sync/.test(status.stdout)
    ){condition = true}
    counter ++;
  }
  const ufw = await nodeConnection.sshService.exec('ufw status')
  const docker = await nodeConnection.sshService.exec('docker ps')

  // destroy
  await nodeConnection.destroyNode()
  await nodeConnection.sshService.disconnect()
  await testServer.destroy()


  //check ufw
  expect(ufw.stdout).toMatch(/30303\/tcp/)
  expect(ufw.stdout).toMatch(/30303\/udp/)

  //check docker container
  expect(docker.stdout).toMatch(/hyperledger\/besu/)
  expect(docker.stdout).toMatch(/30303->30303/)
  if (!(executionClient.id.includes('Up'))) {
    expect((docker.stdout.match(new RegExp('Up', 'g')) || []).length).toBe(1)
  }

  expect(status.stdout).toMatch(/Websocket service started/)
  expect(status.stdout).toMatch(/P2P RLPx agent started/)
  expect(status.stdout).toMatch(/Starting peer discovery agent/)
  expect(status.stdout).toMatch(/Starting sync/)

})