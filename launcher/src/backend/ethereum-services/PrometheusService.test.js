import { PrometheusService } from './PrometheusService'
import { networks } from './NodeService.js'
import { ServicePort, servicePortProtocol } from './ServicePort.js'

test('getServiceConfiguration', () => {
  jest.mock('./NimbusBeaconService')
  const NimbusBeaconService = require('./NimbusBeaconService')
  NimbusBeaconService.NimbusBeaconService.mockImplementation(() => {
    return {
      buildConsensusClientHttpEndpointUrl: jest.fn(() => { return 'http://stereum-someID:9190' })
    }
  })

  jest.mock('./PrometheusNodeExporterService')
  const PrometheusNodeExporterService = require('./PrometheusNodeExporterService')
  PrometheusNodeExporterService.PrometheusNodeExporterService.mockImplementation(() => {
    return {
      buildPrometheusNodeExporterClientHttpEndpointUrl: jest.fn(() => { return 'http://stereum-someOtherID:9100' })
    }
  })

  const config = PrometheusService.getServiceConfiguration([new NimbusBeaconService.NimbusBeaconService(), new NimbusBeaconService.NimbusBeaconService()], [new PrometheusNodeExporterService.PrometheusNodeExporterService(), new PrometheusNodeExporterService.PrometheusNodeExporterService()])
  expect(config).toStrictEqual({ CONFIG: 'global:\n  scrape_interval:     15s\n  evaluation_interval: 15s\n\nalerting:\n  alertmanagers:\n  - static_configs:\n    - targets:\n      # - alertmanager:9093\n\nrule_files:\n  # - \"first_rules.yml\"\n  # - \"second_rules.yml\"\n\nscrape_configs:\n  - job_name: \'ConsensusClients\'\n    static_configs:\n      - targets: [\'stereum-someID:9190\',\'stereum-someID:9190\']\n  - job_name: \'PrometheusNodeExporterService\'\n    static_configs:\n      - targets: [\'stereum-someOtherID:9100\',\'stereum-someOtherID:9100\']\n' })
})

test('buildConfiguration', () => {
  const ports = [
    new ServicePort('127.0.0.1', 9090, 9090, servicePortProtocol.tcp)
  ]

  jest.mock('./NimbusBeaconService')
  const NimbusBeaconService = require('./NimbusBeaconService')
  NimbusBeaconService.NimbusBeaconService.mockImplementation(() => {
    return {
      buildConsensusClientHttpEndpointUrl: jest.fn(() => { return 'http://stereum-someID:9190' }),
      buildMinimalConfiguration: jest.fn(() => {
        return {
          id: 'nimbus-id',
          service: 'NimbusBeaconService'
        }
      })
    }
  })

  jest.mock('./PrometheusNodeExporterService')
  const PrometheusNodeExporterService = require('./PrometheusNodeExporterService')
  PrometheusNodeExporterService.PrometheusNodeExporterService.mockImplementation(() => {
    return {
      buildPrometheusNodeExporterClientHttpEndpointUrl: jest.fn(() => { return 'http://stereum-someOtherID:9100' }),
      buildMinimalConfiguration: jest.fn(() => {
        return {
          id: 'pne-id',
          service: 'PrometheusNodeExporterService'
        }
      })
    }
  })

  const prometheus = PrometheusService.buildByUserInput(networks.prater, ports, '/opt/stereum/prometheus', [new NimbusBeaconService.NimbusBeaconService()], [new PrometheusNodeExporterService.PrometheusNodeExporterService()]).buildConfiguration()

  expect(prometheus.volumes).toHaveLength(2)
  expect(prometheus.volumes).toContain('/opt/stereum/prometheus/data/prometheus:/prometheus')
  expect(prometheus.volumes).toContain('/opt/stereum/prometheus/config:/etc/prometheus')
  expect(prometheus.ports).toHaveLength(1)
  expect(prometheus.id).toHaveLength(36)
  expect(prometheus.user).toMatch(/2000/)
  expect(prometheus.image).toMatch(/prom\/prometheus/)
  expect(prometheus.configVersion).toBe(1)
})

test('getAvailablePorts', () => {
  const prometheus = PrometheusService.buildByUserInput(networks.prater, [], '/opt/stereum/prometheus', [], []).getAvailablePorts()

  expect(prometheus).toHaveLength(1)
})

test('buildByConfiguration', () => {
  const prometheus = PrometheusService.buildByConfiguration({
    id: '123',
    service: 'PrometheusService',
    configVersion: 876,
    image: 'prometheus:v0.0.1',
    ports: ['0.0.0.0:1234:5678/tcp', '8.8.8.8:1234:5678/udp'],
    volumes: ['/opt/stereum/foo:/opt/app/data']
  })

  expect(prometheus.id).toBe('123')
  expect(prometheus.service).toBe('PrometheusService')
  expect(prometheus.configVersion).toBe(1)
  expect(prometheus.image).toBe('prometheus')
  expect(prometheus.imageVersion).toBe('v0.0.1')
  expect(prometheus.ports).toHaveLength(2)
  expect(prometheus.ports[0].destinationPort).toBe('1234')
  expect(prometheus.ports[1].servicePort).toBe('5678')

  expect(prometheus.volumes).toHaveLength(1)
  expect(prometheus.volumes[0]).toBeDefined()
})
