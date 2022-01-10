import { LighthouseBeaconService } from './LighthouseBeaconService.js'
import { networks } from './NodeService.js'
import { ServicePort, servicePortProtocol } from './ServicePort.js'
import { ServiceVolume } from './ServiceVolume.js'

test('LighthouseBeaconService buildConfiguration', () => {
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

    const lhService = new LighthouseBeaconService(networks.prater, ports, "/opt/stereum/lh", [new GethService.GethService()], 16).buildConfiguration();

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

test('LighthouseBeaconService buildConsensusClientHttpEntpointUrl', () => {
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

    const lhService = new LighthouseBeaconService(networks.prater, ports, "/opt/stereum/lh", [], 16).buildConsensusClientHttpEntpointUrl();

    expect(lhService).toMatch(/http:\/\/stereum-.{36}:5052/);
});

test('LighthouseBeaconService getAvailablePorts', () => {
    const lhServicePorts = new LighthouseBeaconService(networks.prater, [], "/opt/stereum/lh", [], 16).getAvailablePorts();

    expect(lhServicePorts).toHaveLength(3);
});

test('LighthouseBeaconService network', () => {
    const lhServicePorts = new LighthouseBeaconService(networks.goerli, [], "/opt/stereum/lh", [], 16).buildConfiguration();

    expect(lhServicePorts.network).toMatch(/goerli/);
});

test('LighthouseBeaconService slasherDbSize', () => {
    const lhServicePorts = new LighthouseBeaconService(networks.goerli, [], "/opt/stereum/lh", [], 123).buildConfiguration();

    expect(lhServicePorts.env.SLASHER_DB_SIZE).toBe(123);
});

// EOF
