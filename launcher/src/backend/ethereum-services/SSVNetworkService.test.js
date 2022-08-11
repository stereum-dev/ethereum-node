import { SSVNetworkService } from './SSVNetworkService.js'
import { networks } from './NodeService.js'
import { ServicePort, servicePortProtocol } from './ServicePort.js'
const log = require('electron-log')

test('buildConfiguration', () => {
  const ports = [
    new ServicePort(null, 100, 200, servicePortProtocol.tcp),
    new ServicePort(null, 101, 202, servicePortProtocol.udp)
  ]

  jest.mock('./GethService')
  const GethService = require('./GethService')
  const mMock = jest.fn(() => { return 'ws-endpoint-string' })
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

  jest.mock('./LighthouseBeaconService')
  const LighthouseBeaconService = require('./LighthouseBeaconService')
  const mMockLh = jest.fn(() => { return 'http-lh-endpoint-string' })
  LighthouseBeaconService.LighthouseBeaconService.mockImplementation(() => {
    return {
      buildConsensusClientHttpEndpointUrl: mMockLh,
      buildMinimalConfiguration: jest.fn(() => {
        return {
          id: 'lh-beacon-id',
          service: 'LighthouseBeaconService'
        }
      })
    }
  })

  const ssvService = SSVNetworkService.buildByUserInput(networks.prater, ports, '/opt/stereum/ssv', [new GethService.GethService()], [new LighthouseBeaconService.LighthouseBeaconService()]).buildConfiguration()

  log.info('cmd: ', ssvService.command)

  expect(ssvService.env.CONFIG_PATH).toMatch(/\/config.yaml/)
  expect(ssvService.volumes).toHaveLength(1)
  expect(ssvService.volumes).toContain('/opt/stereum/ssv-' + ssvService.id + '/data/ssv/network:/data')
  expect(ssvService.ports).toHaveLength(2)
  expect(ssvService.id).toHaveLength(36)
  expect(ssvService.user).toMatch(/2000/)
  expect(ssvService.image).toMatch(/bloxstaking\/ssv-node-shifu/)
  expect(ssvService.configVersion).toBe(1)
})

test('getServiceConfiguration', () => {
  jest.mock('./GethService')
  const GethService = require('./GethService')
  const mMock = jest.fn(() => { return 'ws-endpoint-string' })
  GethService.GethService.mockImplementation(() => {
    return {
      buildExecutionClientWsEndpointUrl: mMock
    }
  })

  jest.mock('./LighthouseBeaconService')
  const LighthouseBeaconService = require('./LighthouseBeaconService')
  const mMockLh = jest.fn(() => { return 'http-lh-endpoint-string' })
  LighthouseBeaconService.LighthouseBeaconService.mockImplementation(() => {
    return {
      buildConsensusClientHttpEndpointUrl: mMockLh
    }
  })

  const ssvService = SSVNetworkService.buildByUserInput(networks.prater, null, '/opt/stereum/ssv', [new GethService.GethService()], [new LighthouseBeaconService.LighthouseBeaconService()]).getServiceConfiguration(networks.prater, [new GethService.GethService()], [new LighthouseBeaconService.LighthouseBeaconService()])

  expect(ssvService).toBeDefined()
  expect(ssvService).toMatch(/prater/)
  expect(ssvService).toMatch(/http-lh-endpoint-string/)
  expect(ssvService).toMatch(/ws-endpoint-string/)
})

test('getAvailablePorts', () => {
  const service = SSVNetworkService.buildByUserInput(networks.prater, null, '/opt/stereum/ssv', [], []).getAvailablePorts()

  expect(service).toHaveLength(3)
})

test('service name', () => {
  const service = SSVNetworkService.buildByUserInput(networks.prater, null, '/opt/stereum/ssv', [], []).buildConfiguration()

  expect(service.service).toMatch(/SSVNetworkService/)
})

test('autoupdate', () => {
  const service = SSVNetworkService.buildByUserInput(networks.prater, null, '/opt/stereum/ssv', [], []).buildConfiguration()

  expect(service.autoupdate).toBe(true)
})

// EOF
