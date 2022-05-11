import { NodeConnection } from './NodeConnection'
import { nodeOS } from './NodeOS'
import { HetznerServer } from './HetznerServer'
const log = require('electron-log')

jest.setTimeout(500000)

test('prepareStereumNode on ubuntu', async () => {
  const serverSettings = {
    name: 'NodeConnection--integration-test--ubuntu-2204',
    image: 'ubuntu-22.04',
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

  await nodeConnection.findOS()

  // create stereum settings
  await nodeConnection.sshService.exec(` mkdir /etc/stereum &&
    echo "{stereum: {settings: {controls_install_path: /opt/stereum, os_user: stereum, updates: {in_progress: null, lane: stable, available: null, unattended: {check: true, install: false}}}}}" > /etc/stereum/stereum.yaml`)
  await nodeConnection.findStereumSettings()

  const playbookRun = await nodeConnection.prepareStereumNode('/opt/stereum')
  const ansibleRoles = await nodeConnection.sshService.exec('ls /opt/stereum/ansible/controls')
  const collections = await nodeConnection.sshService.exec('ansible-galaxy collection install community.docker')
  const ansibleVersion = await nodeConnection.sshService.exec('ansible --version')
  await nodeConnection.sshService.disconnect()
  await testServer.destroy()

  const ansible = (ansibleVersion.stdout.split('\n'))[0].split(' ')
  ansible[1] = ansible[1].split('.')

  // check if findOS() works
  expect(nodeConnection.os).toBe(nodeOS.ubuntu)

  // check if findStereumSettings() works
  expect(nodeConnection.settings).toBeDefined()

  // check if playbook setup was run
  expect(playbookRun[0]).toHaveProperty('playbook', 'setup')
  expect(playbookRun[0]).toHaveProperty('playbookRunRef')
  expect(playbookRun[1]).toHaveProperty('playbook', 'configure-firewall')
  expect(playbookRun[1]).toHaveProperty('playbookRunRef')
  
  // check if ansible roles got pulled from repo
  expect(ansibleRoles.stdout).toMatch(/roles/)

  // check if community.docker was installed
  expect(collections.stdout).toMatch("Skipping 'community.docker' as it is already installed")

  // check ansible version
  expect(ansible[0]).toBe('ansible')
  expect(ansible[1][0]).toMatch(/[0-9]+/)
  expect(ansible[1][1]).toMatch(/[0-9]+/)
  expect(ansible[1][2]).toMatch(/[0-9]+/)
})

// EOF
