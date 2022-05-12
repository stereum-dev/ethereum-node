import { BloxSSVService } from './BloxSSVService.js'
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
  const mMock = jest.fn(() => { return 'http-endpoint-string' })
  GethService.GethService.mockImplementation(() => {
    return {
      buildExecutionClientHttpEndpointUrl: mMock,
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

  const bloxService = BloxSSVService.buildByUserInput(networks.prater, ports, '/opt/stereum/ssv', [new GethService.GethService()], [new LighthouseBeaconService.LighthouseBeaconService()]).buildConfiguration()

  log.info('cmd: ', bloxService.command)

  expect(bloxService.env.CONFIG_PATH).toMatch(/\/config.yaml/)
  expect(bloxService.volumes).toHaveLength(1)
  expect(bloxService.volumes).toContain('/opt/stereum/ssv/data:/data')
  expect(bloxService.ports).toHaveLength(2)
  expect(bloxService.id).toHaveLength(36)
  expect(bloxService.user).toMatch(/root/)
  expect(bloxService.image).toMatch(/bloxstaking\/ssv-node/)
  expect(bloxService.configVersion).toBe(1)
})

test('getServiceConfiguration', () => {
  jest.mock('./GethService')
  const GethService = require('./GethService')
  const mMock = jest.fn(() => { return 'http-endpoint-string' })
  GethService.GethService.mockImplementation(() => {
    return {
      buildExecutionClientHttpEndpointUrl: mMock
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

  const bloxService = BloxSSVService.getServiceConfiguration(networks.prater, [new GethService.GethService()], [new LighthouseBeaconService.LighthouseBeaconService()])

  expect(bloxService.MetricsAPIPort).toBeDefined()
  expect(bloxService.eth2.Network).toMatch(/prater/)
  expect(bloxService.eth2.BeaconNodeAddr).toMatch(/http-lh-endpoint-string/)
  expect(bloxService.eth1.ETH1Addr).toMatch(/http-endpoint-string/)
  expect(bloxService.eth1.RegistryContractAddr).toHaveLength(42)
  expect(bloxService.OperatorPrivateKey).toBeDefined()
})

test('getAvailablePorts', () => {
  const service = BloxSSVService.buildByUserInput(networks.prater, null, '/opt/stereum/ssv', [], []).getAvailablePorts()

  expect(service).toHaveLength(2)
})

test('service name', () => {
  const service = BloxSSVService.buildByUserInput(networks.prater, null, '/opt/stereum/ssv', [], []).buildConfiguration()

  expect(service.service).toMatch(/BloxSSVService/)
})

test('autoupdate', () => {
  const service = BloxSSVService.buildByUserInput(networks.prater, null, '/opt/stereum/ssv', [], []).buildConfiguration()

  expect(service.autoupdate).toBe(true)
})

// EOF
