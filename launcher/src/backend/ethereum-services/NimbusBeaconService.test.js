import { NimbusBeaconService } from './NimbusBeaconService.js'
import { networks } from './NodeService.js'
import { ServicePort, servicePortProtocol } from './ServicePort.js'
import { ServiceVolume } from './ServiceVolume.js'

test('buildConfiguration', () => {
  const ports = [
    new ServicePort(null, 9000, 9000, servicePortProtocol.tcp),
    new ServicePort(null, 9000, 9000, servicePortProtocol.udp),
    new ServicePort('127.0.0.1', 9190, 9190, servicePortProtocol.tcp)
  ]

  jest.mock('./GethService')
  const GethService = require('./GethService')
  const mMock = jest.fn(() => { return 'Ws-endpoint-string' })
  GethService.GethService.mockImplementation(() => {
    return {
      buildExecutionClientWsEndpointUrl: mMock,
      buildMinimalConfiguration: jest.fn(() => {
        return {
          id: 'geth-id',
          service: 'GethService'
        }
      })
    }
  })

  const nimbusService = NimbusBeaconService.buildByUserInput(networks.prater, ports, '/opt/stereum/nimbus', [new GethService.GethService()]).buildConfiguration()

  expect(nimbusService.command).toContain('--web3-url=Ws-endpoint-string')
  expect(nimbusService.command).toContain('--network=prater')
  expect(nimbusService.volumes).toHaveLength(3)
  expect(nimbusService.volumes).toContain('/opt/stereum/nimbus/beacon:/opt/app/beacon')
  expect(nimbusService.volumes).toContain('/opt/stereum/nimbus/validator/validators:/opt/app/validators')
  expect(nimbusService.volumes).toContain('/opt/stereum/nimbus/validator/secrets:/opt/app/secrets')
  expect(nimbusService.ports).toHaveLength(3)
  expect(nimbusService.id).toHaveLength(36)
  expect(nimbusService.user).toMatch(/2000/)
  expect(nimbusService.image).toMatch(/statusim\/nimbus-eth2/)
  expect(nimbusService.configVersion).toBe(1)
})

test('buildConsensusClientHttpEndpointUrl', () => {
  const ports = [
    new ServicePort(null, 100, 200, servicePortProtocol.tcp),
    new ServicePort(null, 101, 202, servicePortProtocol.udp),
    new ServicePort('1.2.3.4', 303, 404, servicePortProtocol.udp)
  ]

  jest.mock('./GethService')
  const GethService = require('./GethService')
  const mMock = jest.fn(() => { return 'Ws-endpoint-string' })
  GethService.GethService.mockImplementation(() => {
    return {
      buildExecutionClientWsEndpointUrl: mMock
    }
  })

  const nimbusService = NimbusBeaconService.buildByUserInput(networks.prater, ports, '/opt/stereum/nimbus', []).buildConsensusClientHttpEndpointUrl()

  expect(nimbusService).toMatch(/http:\/\/stereum-.{36}:9190/)
})

test('getAvailablePorts', () => {
  const nimbusServicePorts = NimbusBeaconService.buildByUserInput(networks.prater, [], '/opt/stereum/nimbus', []).getAvailablePorts()

  expect(nimbusServicePorts).toHaveLength(4)
})

test('network', () => {
  const nimbusServicePorts = NimbusBeaconService.buildByUserInput(networks.goerli, [], '/opt/stereum/nimbus', []).buildConfiguration()

  expect(nimbusServicePorts.network).toMatch(/goerli/)
})

test('buildByConfiguration', () => {
  const nimbus = NimbusBeaconService.buildByConfiguration({
    id: '123',
    service: 'NimbusBeaconService',
    configVersion: 234,
    image: 'nimbusbeacon:v0.0.1',
    ports: ['0.0.0.0:1234:5678/tcp', '8.8.8.8:1234:5678/udp'],
    volumes: ['/opt/stereum/foo:/opt/app/data']
  })

  expect(nimbus.id).toBe('123')
  expect(nimbus.service).toBe('NimbusBeaconService')
  expect(nimbus.configVersion).toBe(234)
  expect(nimbus.image).toBe('nimbusbeacon')
  expect(nimbus.imageVersion).toBe('v0.0.1')
  expect(nimbus.ports).toHaveLength(2)
  expect(nimbus.ports[0].destinationPort).toBe('1234')
  expect(nimbus.ports[1].servicePort).toBe('5678')

  expect(nimbus.volumes).toHaveLength(1)
  expect(nimbus.volumes[0]).toBeDefined()
})

// EOF
