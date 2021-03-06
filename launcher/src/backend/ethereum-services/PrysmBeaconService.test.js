import { PrysmBeaconService } from "./PrysmBeaconService";
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
      buildExecutionClientHttpEndpointUrl: mMock,
      buildMinimalConfiguration: jest.fn(() => {
        return {
          id: 'geth-id',
          service: 'GethService'
        }
      })
    }
  })
  const prysm = PrysmBeaconService.buildByUserInput(networks.prater, ports, '/opt/stereum/prysm/', [new GethService.GethService(),new GethService.GethService()]).buildConfiguration()

  expect(prysm.command).toMatch(/--fallback-web3provider=http-endpoint-string/)
  expect(prysm.command).toMatch(/--http-web3provider=http-endpoint-string/)
  expect(prysm.volumes).toHaveLength(2)
  expect(prysm.volumes).toContain('/opt/stereum/prysm-' + prysm.id + '/beacon:/opt/app/beacon')
  expect(prysm.volumes).toContain('/opt/stereum/prysm-' + prysm.id + '/genesis:/opt/app/genesis')
  expect(prysm.ports).toHaveLength(3)
  expect(prysm.id).toHaveLength(36)
  expect(prysm.user).toMatch(/2000/)
  expect(prysm.image).toMatch(/prysmaticlabs\/prysm-beacon-chain/)
  expect(prysm.configVersion).toBe(1)
})

test('buildConsensusClientHttpEndpointUrl', () => {
    const ports = [
      new ServicePort(null, 100, 200, servicePortProtocol.tcp),
      new ServicePort(null, 101, 202, servicePortProtocol.udp),
      new ServicePort('1.2.3.4', 303, 404, servicePortProtocol.udp)
    ]

    const prysm = PrysmBeaconService.buildByUserInput(networks.prater, ports, '/opt/stereum/prysm', []).buildConsensusClientHttpEndpointUrl()
  
    expect(prysm).toMatch(/http:\/\/stereum-.{36}:3500/)
  })

  test('buildConsensusClientGateway', () => {
    const ports = [
      new ServicePort(null, 100, 200, servicePortProtocol.tcp),
      new ServicePort(null, 101, 202, servicePortProtocol.udp),
      new ServicePort('1.2.3.4', 303, 404, servicePortProtocol.udp)
    ]

    const prysm = PrysmBeaconService.buildByUserInput(networks.prater, ports, '/opt/stereum/prysm', []).buildConsensusClientGateway()
  
    expect(prysm).toMatch(/stereum-.{36}:3500/)
  })

  test('buildConsensusClientEndpoint', () => {
    const ports = [
      new ServicePort(null, 100, 200, servicePortProtocol.tcp),
      new ServicePort(null, 101, 202, servicePortProtocol.udp),
      new ServicePort('1.2.3.4', 303, 404, servicePortProtocol.udp)
    ]

    const prysm = PrysmBeaconService.buildByUserInput(networks.prater, ports, '/opt/stereum/prysm', []).buildConsensusClientEndpoint()
  
    expect(prysm).toMatch(/stereum-.{36}:4000/)
  })

  test('getAvailablePorts', () => {
    const prysmPorts = PrysmBeaconService.buildByUserInput(networks.prater, [], '/opt/stereum/prysm', []).getAvailablePorts()
  
    expect(prysmPorts).toHaveLength(3)
  })

  test('network', () => {
    const prysmNetwork = PrysmBeaconService.buildByUserInput(networks.prater, [], '/opt/stereum/prysm', []).buildConfiguration()
  
    expect(prysmNetwork.network).toMatch(/prater/)
  })

  test('buildByConfiguration', () => {
    const prysm = PrysmBeaconService.buildByConfiguration({
      id: '321',
      service: 'PrysmBeaconService',
      configVersion: 216,
      image: 'prysmatic:v3.2.1',
      ports: ['0.0.0.0:1234:5678/tcp', '8.8.8.8:1234:5678/udp'],
      volumes: ['/opt/stereum/foo:/opt/app/data']
    })
  
    expect(prysm.id).toBe('321')
    expect(prysm.service).toBe('PrysmBeaconService')
    expect(prysm.configVersion).toBe(216)
    expect(prysm.image).toBe('prysmatic')
    expect(prysm.imageVersion).toBe('v3.2.1')
    expect(prysm.ports).toHaveLength(2)
    expect(prysm.ports[0].destinationPort).toBe('1234')
    expect(prysm.ports[1].servicePort).toBe('5678')
  
    expect(prysm.volumes).toHaveLength(1)
    expect(prysm.volumes[0]).toBeDefined()
  })
  
  // EOF
  
