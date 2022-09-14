/**
 * @jest-environment node
 */
import { HetznerServer } from '../HetznerServer.js'
import { NodeConnection } from '../NodeConnection.js'
import { ServicePort, servicePortProtocol } from './ServicePort.js'
import { ServiceManager } from '../ServiceManager.js'
import { GethService } from './GethService.js'
const log = require('electron-log')

jest.setTimeout(500000)

test('geth installation', async () => {
  const serverSettings = {
    name: 'Geth--integration-test--ubuntu-2204',
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

  //install geth
  const ports = [
    new ServicePort(null, 30303, 30303, servicePortProtocol.tcp),
    new ServicePort(null, 30303, 30303, servicePortProtocol.udp)
  ]
  const executionClient = GethService.buildByUserInput('goerli', ports, nodeConnection.settings.stereum.settings.controls_install_path + '/geth')
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
      /WebSocket enabled/.test(status.stderr) &&
      /Started P2P networking/.test(status.stderr) &&
      !(/Rejected WebSocket connection/.test(status.stderr))
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
  expect(docker.stdout).toMatch(/ethereum\/client-go/)
  expect(docker.stdout).toMatch(/30303->30303/)
  if (!(executionClient.id.includes('Up'))) {
    expect((docker.stdout.match(new RegExp('Up', 'g')) || []).length).toBe(1)
  }

  // check if geth service established WebSocket connection
  // idk why but logs are stored in stderr but stdout string is empty
  expect(status.stderr).toMatch(/WebSocket enabled/)
  expect(status.stderr).toMatch(/Started P2P networking/)
  expect(status.stderr).not.toMatch(/Rejected WebSocket connection/)
})
