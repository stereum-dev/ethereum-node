import { HetznerServer } from './HetznerServer.js'
import { OneClickInstall } from './OneClickInstall.js'
import { NodeConnection } from './NodeConnection.js'
const log = require('electron-log')

jest.setTimeout(500000)

test('geth', async () => {
  const serverSettings = {
    name: 'Geth--integration-test--ubuntu-2004',
    image: 'ubuntu-20.04',
    location: 'fsn1',
    server_type: 'cx11',
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
  await testServer.connect(nodeConnection)

  await testServer.passwordAuthentication(testServer.serverRootPassword)

  const installer = new OneClickInstall()

  // setup node
  installer.choosenClient = 'Nimbus'
  await installer.prepareNode('/opt/sterem', nodeConnection)
  installer.createServices()
  await installer.writeConfig()
  await installer.startServices()

  // get logs
  await testServer.Sleep(10000)
  const status = await nodeConnection.sshService.exec(`docker logs stereum-${installer.executionClient.id}`)

  // destroy
  await nodeConnection.destroyNode()
  await nodeConnection.sshService.disconnect()
  await testServer.destroy()

  // check if geth service established WebSocket connection
  // idk why but logs are stored in stderr but stdout string is empty
  expect(status.stderr).toMatch(/WebSocket enabled/)
  expect(status.stderr).toMatch(/Started P2P networking/)
  expect(status.stderr).not.toMatch(/Rejected WebSocket connection/)
})
