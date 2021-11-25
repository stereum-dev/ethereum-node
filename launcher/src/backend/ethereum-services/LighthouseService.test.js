import { LighthouseService } from './LighthouseService.js'
import { networks } from './NodeService.js'
import { ServicePort, servicePortProtocol } from './ServicePort.js'
import { ServiceVolume } from './ServiceVolume.js'

test('LighthouseService buildConfiguration', () => {
    const ports = [
        new ServicePort(null, 100, 200, servicePortProtocol.tcp),
        new ServicePort(null, 101, 202, servicePortProtocol.udp),
        new ServicePort("1.2.3.4", 303, 404, servicePortProtocol.udp),
    ];

    jest.mock('./GethService');
    const GethService = require('./GethService');
    const mMock = jest.fn(() => { return "http-endpoint-string" });
    GethService.GethService.mockImplementation(() => {
        return {
            buildExecutionClientHttpEndpointUrl: mMock,
        };
    });

    const lhService = new LighthouseService(networks.prater, ports, "/opt/stereum/lh", [new GethService.GethService()]).buildConfiguration();

    expect(lhService.env.ETH1_NODES).toHaveLength(1);
    expect(lhService.env.ETH1_NODES).toContain("http-endpoint-string");
    expect(lhService.volumes).toHaveLength(2);
    expect(lhService.volumes).toContain("/opt/stereum/lh/beacon:/opt/app/beacon");
    expect(lhService.volumes).toContain("/opt/stereum/lh/slasher:/opt/app/slasher");
    expect(lhService.ports).toHaveLength(3);
    expect(lhService.id).toHaveLength(36);
    expect(lhService.user).toMatch(/2000/);
    expect(lhService.image).toMatch(/stereum\/lighthouse/);
});

test('LighthouseService buildConsensusClientHttpEntpointUrl', () => {
    const ports = [
        new ServicePort(null, 100, 200, servicePortProtocol.tcp),
        new ServicePort(null, 101, 202, servicePortProtocol.udp),
        new ServicePort("1.2.3.4", 303, 404, servicePortProtocol.udp),
    ];

    jest.mock('./GethService');
    const GethService = require('./GethService');
    const mMock = jest.fn(() => { return "http-endpoint-string" });
    GethService.GethService.mockImplementation(() => {
        return {
            buildExecutionClientHttpEndpointUrl: mMock,
        };
    });

    const lhService = new LighthouseService(networks.prater, ports, "/opt/stereum/lh", []).buildConsensusClientHttpEntpointUrl();

    expect(lhService).toMatch(/http:\/\/stereum-.{36}:5052/);
});

test('LighthouseService getAvailablePorts', () => {
    const lhServicePorts = new LighthouseService(networks.prater, [], "/opt/stereum/lh", []).getAvailablePorts();

    expect(lhServicePorts).toHaveLength(3);
});

// EOF
