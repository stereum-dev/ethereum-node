import { GrafanaService } from './GrafanaService.js'
import { networks } from './NodeService.js'
import { ServicePort, servicePortProtocol } from './ServicePort.js'
import { ServiceVolume } from './ServiceVolume.js'

test('buildConfiguration', () => {
  const ports = [
    new ServicePort('127.0.0.1', 3000, 3000, servicePortProtocol.tcp)
  ]

  const grafanaService = GrafanaService.buildByUserInput(networks.prater, ports, '/opt/stereum/grafana', 'nimbus').buildConfiguration()

  expect(typeof grafanaService.env.GRAFANA_PROVISIONING).toBe('string')
  expect(grafanaService.env.GRAFANA_PROVISIONING).toContain('nimbus')
  expect(grafanaService.volumes).toHaveLength(3)
  expect(grafanaService.volumes).toContain('/opt/stereum/grafana/provisioning:/etc/grafana/provisioning')
  expect(grafanaService.volumes).toContain('/opt/stereum/grafana/data:/var/lib/grafana')
  expect(grafanaService.volumes).toContain('/opt/stereum/grafana:/etc/grafana')
  expect(grafanaService.ports).toHaveLength(1)
  expect(grafanaService.id).toHaveLength(36)
  expect(grafanaService.user).toMatch(/2000/)
  expect(grafanaService.image).toMatch(/grafana\/grafana/)
  expect(grafanaService.configVersion).toBe(1)
})

test('getAvailablePorts', () => {
  const grafanaServicePorts = GrafanaService.buildByUserInput(networks.prater, [], '/opt/stereum/grafana', 'nimbus').getAvailablePorts()

  expect(grafanaServicePorts).toHaveLength(1)
})

test('buildByConfiguration', () => {
  const grafana = GrafanaService.buildByConfiguration({
    id: '123',
    service: 'GrafanaService',
    configVersion: 999,
    image: 'grafana:v8.4.0',
    ports: ['0.0.0.0:1234:5678/tcp', '8.8.8.8:1234:5678/udp'],
    volumes: ['/opt/stereum/foo:/opt/app/data']
  })

  expect(grafana.id).toBe('123')
  expect(grafana.service).toBe('GrafanaService')
  expect(grafana.configVersion).toBe(999)
  expect(grafana.image).toBe('grafana')
  expect(grafana.imageVersion).toBe('v8.4.0')
  expect(grafana.ports).toHaveLength(2)
  expect(grafana.ports[0].destinationPort).toBe('1234')
  expect(grafana.ports[1].servicePort).toBe('5678')

  expect(grafana.volumes).toHaveLength(1)
  expect(grafana.volumes[0]).toBeDefined()
})
