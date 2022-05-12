import { LighthouseBeaconService } from './LighthouseBeaconService.js'
import { LighthouseValidatorService } from './LighthouseValidatorService.js'
import { networks } from './NodeService.js'
import { ServicePort, servicePortProtocol } from './ServicePort.js'

test('LighthouseValidatorService buildConfiguration', () => {
  jest.mock('./LighthouseBeaconService')
  const LighthouseBeaconService = require('./LighthouseBeaconService')
  const mMock = jest.fn(() => { return 'http-endpoint-string' })
  LighthouseBeaconService.LighthouseBeaconService.mockImplementation(() => {
    return {
      buildConsensusClientHttpEndpointUrl: mMock,
      buildMinimalConfiguration: jest.fn(() => {
        return {
          id: 'lh_bc-id',
          service: 'LighthouseBeaconService'
        }
      })
    }
  })
  const ports = [
    new ServicePort('1.2.3.4', 303, 404, servicePortProtocol.udp)
  ]

  const lhService = LighthouseValidatorService.buildByUserInput(networks.prater, ports, '/opt/stereum/lh', [new LighthouseBeaconService.LighthouseBeaconService()], 'foobar').buildConfiguration()



  expect(lhService.command).toContain('--beacon-nodes=http-endpoint-string')
  expect(lhService.command).toContain('--graffiti=\"foobar\"')
  expect(lhService.volumes).toHaveLength(1)
  expect(lhService.volumes).toContain('/opt/stereum/lh/validator:/opt/app/validator')
  expect(lhService.ports).toHaveLength(1)
  expect(lhService.id).toHaveLength(36)
  expect(lhService.user).toMatch(/2000/)
  expect(lhService.image).toMatch(/sigp\/lighthouse/)
  expect(lhService.configVersion).toBe(1)

  expect(lhService.service).toMatch(/LighthouseValidatorService/)
})

test('LighthouseValidatorService getAvailablePorts', () => {
  const ports = [
    new ServicePort('1.2.3.4', 303, 404, servicePortProtocol.udp)
  ]
  const lhService = LighthouseValidatorService.buildByUserInput(networks.prater, ports, '/opt/stereum/lh', [], 'foobar').getAvailablePorts()

  expect(lhService).toHaveLength(1)
})

test('LighthouseValidatorService autoupdate', () => {
  const ports = [
    new ServicePort('1.2.3.4', 303, 404, servicePortProtocol.udp)
  ]
  const lhService = LighthouseValidatorService.buildByUserInput(networks.prater, ports, '/opt/stereum/lh', [], 'foobar').buildConfiguration()

  expect(lhService.autoupdate).toBe(true)
})

test('LighthouseValidatorService network', () => {
  const ports = [
    new ServicePort('1.2.3.4', 303, 404, servicePortProtocol.udp)
  ]
  const lhService = LighthouseValidatorService.buildByUserInput(networks.mainnet, ports, '/opt/stereum/lh', [], 'foobar').buildConfiguration()

  expect(lhService.network).toBe(networks.mainnet)
})

test('buildByConfiguration', () => {
  const bn1 = 'http://node1:5052'
  const bn2 = 'https://node2:999'

  const lh = LighthouseValidatorService.buildByConfiguration({
    id: '123',
    service: 'LighthouseValidatorService',
    configVersion: 333,
    image: 'lhval:v0.0.1',
    command:[
      'lighthouse',
      'vc',
      '--debug-level=debug',
      '--network=prater',
      `--beacon-nodes=${bn1},${bn2}`,
      `--datadir=/opt/app/validator`,
      '--init-slashing-protection',
      '--graffiti="stereum.net"',
      '--metrics',
      '--metrics-address=0.0.0.0',
      '--http',
      '--http-address=0.0.0.0',
      '--unencrypted-http-transport'
    ]
  })

  expect(lh.id).toBe('123')
  expect(lh.service).toBe('LighthouseValidatorService')
  expect(lh.configVersion).toBe(333)
  expect(lh.image).toBe('lhval')
  expect(lh.imageVersion).toBe('v0.0.1')
  expect(lh.ports).toHaveLength(0)

  expect(lh.volumes).toHaveLength(0)

  expect(lh.command).toBeDefined()
  expect(lh.command).toContain('--debug-level=debug')
  expect(lh.command).toContain('--beacon-nodes=http://node1:5052,https://node2:999')
})

// EOF
