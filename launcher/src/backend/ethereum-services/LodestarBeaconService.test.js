import { LodestarBeaconService } from './LodestarBeaconService.js'
import { networks } from './NodeService.js'
import { ServicePort, servicePortProtocol } from './ServicePort.js'
import { ServiceVolume } from './ServiceVolume.js'

test('buildConfiguration', () => {
  const ports = [
    new ServicePort(null, 100, 200, servicePortProtocol.tcp),
    new ServicePort(null, 101, 202, servicePortProtocol.udp),
    new ServicePort('1.2.3.4', 303, 404, servicePortProtocol.udp)
  ]

  jest.mock('./GethService')
  const GethService = require('./GethService')
  const mMock = jest.fn(() => { return 'http-endpoint-string' })
  GethService.GethService.mockImplementation(() => {
    return {
      buildExecutionClientEngineRPCHttpEndpointUrl: mMock,
      buildMinimalConfiguration: jest.fn(() => {
        return {
          id: 'geth-id',
          service: 'GethService'
        }
      }),
      volumes: [
        new ServiceVolume('some/path/data', 'some/path/other/data'),
        new ServiceVolume('some/path/engine.jwt', '/engine.jwt')
      ]
    }
  })

  const lService = LodestarBeaconService.buildByUserInput(networks.prater, ports, '/opt/stereum/l', [new GethService.GethService()], 16).buildConfiguration()

  expect(lService.command).toContain('--execution.urls=http-endpoint-string')
  expect(lService.volumes).toHaveLength(2)
  expect(lService.volumes).toContain('/opt/stereum/l-' + lService.id + '/beacon:/opt/app/beacon')
  expect(lService.ports).toHaveLength(3)
  expect(lService.id).toHaveLength(36)
  expect(lService.user).toMatch(/2000/)
  expect(lService.image).toMatch(/chainsafe\/lodestar/)
  expect(lService.configVersion).toBe(1)
})

test('buildConsensusClientHttpEndpointUrl', () => {
  jest.mock('./GethService')
  const GethService = require('./GethService')
  const mMock = jest.fn(() => { return 'http-endpoint-string' })
  GethService.GethService.mockImplementation(() => {
    return {
      buildExecutionClientEngineRPCHttpEndpointUrl: mMock,
      buildMinimalConfiguration: jest.fn(() => {
        return {
          id: 'geth-id',
          service: 'GethService'
        }
      }),
      volumes: [
        new ServiceVolume('some/path/data', 'some/path/other/data'),
        new ServiceVolume('some/path/engine.jwt', '/engine.jwt')
      ]
    }
  })
  const ports = [
    new ServicePort(null, 100, 200, servicePortProtocol.tcp),
    new ServicePort(null, 101, 202, servicePortProtocol.udp),
    new ServicePort('1.2.3.4', 303, 404, servicePortProtocol.udp)
  ]

  const lService = LodestarBeaconService.buildByUserInput(networks.prater, ports, '/opt/stereum/l', [new GethService.GethService()], 16).buildConsensusClientHttpEndpointUrl()

  expect(lService).toMatch(/http:\/\/stereum-.{36}:9596/)
})

test('getAvailablePorts', () => {
  jest.mock('./GethService')
  const GethService = require('./GethService')
  const mMock = jest.fn(() => { return 'http-endpoint-string' })
  GethService.GethService.mockImplementation(() => {
    return {
      buildExecutionClientEngineRPCHttpEndpointUrl: mMock,
      buildMinimalConfiguration: jest.fn(() => {
        return {
          id: 'geth-id',
          service: 'GethService'
        }
      }),
      volumes: [
        new ServiceVolume('some/path/data', 'some/path/other/data'),
        new ServiceVolume('some/path/engine.jwt', '/engine.jwt')
      ]
    }
  })
  const lServicePorts = LodestarBeaconService.buildByUserInput(networks.prater, [], '/opt/stereum/l', [new GethService.GethService()], 16).getAvailablePorts()

  expect(lServicePorts).toHaveLength(3)
})

test('network', () => {
  jest.mock('./GethService')
  const GethService = require('./GethService')
  const mMock = jest.fn(() => { return 'http-endpoint-string' })
  GethService.GethService.mockImplementation(() => {
    return {
      buildExecutionClientEngineRPCHttpEndpointUrl: mMock,
      buildMinimalConfiguration: jest.fn(() => {
        return {
          id: 'geth-id',
          service: 'GethService'
        }
      }),
      volumes: [
        new ServiceVolume('some/path/data', 'some/path/other/data'),
        new ServiceVolume('some/path/engine.jwt', '/engine.jwt')
      ]
    }
  })
  const lServicePorts = LodestarBeaconService.buildByUserInput(networks.goerli, [], '/opt/stereum/l', [new GethService.GethService()], 16).buildConfiguration()

  expect(lServicePorts.network).toMatch(/goerli/)
})

test('buildByConfiguration', () => {
  const l = LodestarBeaconService.buildByConfiguration({
    id: '123',
    service: 'LodestarBeaconService',
    configVersion: 678,
    image: 'lbeacon:v1.0.0',
    ports: ['0.0.0.0:1234:5678/tcp', '8.8.8.8:1234:5678/udp'],
    volumes: ['/opt/stereum/foo:/opt/app/data']
  })

  expect(l.id).toBe('123')
  expect(l.service).toBe('LodestarBeaconService')
  expect(l.configVersion).toBe(678)
  expect(l.image).toBe('lbeacon')
  expect(l.imageVersion).toBe('v1.0.0')
  expect(l.ports).toHaveLength(2)
  expect(l.ports[0].destinationPort).toBe('1234')
  expect(l.ports[1].servicePort).toBe('5678')

  expect(l.volumes).toHaveLength(1)
  expect(l.volumes[0]).toBeDefined()
})

// EOF