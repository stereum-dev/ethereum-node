import { GethService } from './GethService.js'
import { networks } from './NodeService.js'
import { ServicePort, servicePortProtocol } from './ServicePort.js'
import { ServiceVolume } from './ServiceVolume.js'

test('id test', () => {
  expect(GethService.buildByUserInput(networks.prater).id).toBeDefined()
})

test('network test goerli', () => {
  expect(GethService.buildByUserInput(networks.goerli, null, null).buildConfiguration().command).toMatch(/goerli/)
})

test('network test mainnet', () => {
  expect(GethService.buildByUserInput(networks.mainnet, null, null).buildConfiguration().command).toMatch(/mainnet/)
})

test('user', () => {
  expect(GethService.buildByUserInput(networks.mainnet, null, null).buildConfiguration().user).toMatch(/root/)
})

test('image', () => {
  expect(GethService.buildByUserInput(networks.mainnet, null, null).buildConfiguration().image).toMatch(/ethereum\/client-go/)
})

test('endpoint url', () => {
  expect(GethService.buildByUserInput(networks.mainnet, null, null).buildExecutionClientHttpEndpointUrl()).toMatch(new RegExp('^http:\/\/stereum-.*:8545'))
})

test('endpoint ws url', () => {
  expect(GethService.buildByUserInput(networks.mainnet, null, null).buildExecutionClientWsEndpointUrl()).toMatch(new RegExp('^ws:\/\/stereum-.*:8546'))
})

test('empty ports', () => {
  expect(GethService.buildByUserInput(networks.goerli, null, null).buildConfiguration().ports).toHaveLength(0)
})

test('ports', () => {
  expect(GethService.buildByUserInput(networks.goerli, [new ServicePort(null, 100, 200, servicePortProtocol.tcp)], null).buildConfiguration().ports).toHaveLength(1)
  expect(GethService.buildByUserInput(networks.goerli, [new ServicePort(null, 100, 200, servicePortProtocol.tcp)], null).buildConfiguration().ports).toContain('0.0.0.0:100:200/tcp')
})

test('multiple ports', () => {
  const ports = [
    new ServicePort(null, 100, 200, servicePortProtocol.tcp),
    new ServicePort(null, 101, 202, servicePortProtocol.udp),
    new ServicePort('1.2.3.4', 303, 404, servicePortProtocol.udp)
  ]

  const gethService = GethService.buildByUserInput(networks.goerli, ports, null).buildConfiguration()

  expect(gethService.ports).toHaveLength(3)
  expect(gethService.ports).toContain('0.0.0.0:100:200/tcp')
  expect(gethService.ports).toContain('0.0.0.0:101:202/udp')
  expect(gethService.ports).toContain('1.2.3.4:303:404/udp')
})

test('workingDir', () => {
  const volumes = [
    new ServiceVolume('/opt/stereum/foo', '/opt/app/bar')
  ]

  const gethConfig = GethService.buildByUserInput(networks.goerli, null, '/opt/stereum/geth').buildConfiguration()

  expect(gethConfig.volumes).toHaveLength(1)
  expect(gethConfig.volumes).toContain('/opt/stereum/geth/data:/root/.ethereum')
})

test('buildByConfiguration', () => {
  const gethConfig = GethService.buildByConfiguration({
    id: '987',
    service: 'GethService',
    configVersion: 1,
    image: 'geth:v0.0.1'
  }).buildConfiguration()

  expect(gethConfig.id).toBe('987')
  expect(gethConfig.service).toBe('GethService')
  expect(gethConfig.configVersion).toBe(1)
})

// EOF
