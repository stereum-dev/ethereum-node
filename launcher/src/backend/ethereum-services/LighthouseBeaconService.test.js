import { LighthouseBeaconService } from './LighthouseBeaconService.js'
import { networks } from './NodeService.js'
import { ServicePort, servicePortProtocol } from './ServicePort.js'
import { ServiceVolume } from './ServiceVolume.js'

test('buildConfiguration', () => {
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

    const lhService = LighthouseBeaconService.buildByUserInput(networks.prater, ports, "/opt/stereum/lh", [new GethService.GethService()], 16).buildConfiguration();

    expect(typeof lhService.env.ETH1_NODES).toBe('string')
    expect(lhService.env.ETH1_NODES).toContain("http-endpoint-string");
    expect(lhService.volumes).toHaveLength(2);
    expect(lhService.volumes).toContain("/opt/stereum/lh/beacon:/opt/app/beacon");
    expect(lhService.volumes).toContain("/opt/stereum/lh/slasher:/opt/app/slasher");
    expect(lhService.ports).toHaveLength(3);
    expect(lhService.id).toHaveLength(36);
    expect(lhService.user).toMatch(/2000/);
    expect(lhService.image).toMatch(/stereum\/lighthouse/);
});

test('buildConsensusClientHttpEndpointUrl', () => {
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

    const lhService = LighthouseBeaconService.buildByUserInput(networks.prater, ports, "/opt/stereum/lh", [], 16).buildConsensusClientHttpEndpointUrl();

    expect(lhService).toMatch(/http:\/\/stereum-.{36}:5052/);
});

test('getAvailablePorts', () => {
    const lhServicePorts = LighthouseBeaconService.buildByUserInput(networks.prater, [], "/opt/stereum/lh", [], 16).getAvailablePorts();

    expect(lhServicePorts).toHaveLength(3);
});

test('network', () => {
    const lhServicePorts = LighthouseBeaconService.buildByUserInput(networks.goerli, [], "/opt/stereum/lh", [], 16).buildConfiguration();

    expect(lhServicePorts.network).toMatch(/goerli/);
});

test('slasherDbSize', () => {
    const lhServicePorts = LighthouseBeaconService.buildByUserInput(networks.goerli, [], "/opt/stereum/lh", [], 123).buildConfiguration();

    expect(lhServicePorts.env.SLASHER_DB_SIZE).toBe(123);
});

test('buildByConfiguration', () => {
    const lh = LighthouseBeaconService.buildByConfiguration({
        id: "123",
        service: "LighthouseBeaconService",
        image: "lhbeacon:v0.0.1",
        ports: ["0.0.0.0:1234:5678/tcp","8.8.8.8:1234:5678/udp"],
        volumes: ["/opt/stereum/foo:/opt/app/data"],
    });

    expect(lh.id).toBe("123");
    expect(lh.service).toBe("LighthouseBeaconService");
    expect(lh.image).toBe("lhbeacon");
    expect(lh.imageVersion).toBe("v0.0.1");
    expect(lh.ports).toHaveLength(2);
    expect(lh.ports[0].destinationPort).toBe("1234");
    expect(lh.ports[1].servicePort).toBe("5678");

    expect(lh.volumes).toHaveLength(1);
    expect(lh.volumes[0]).toBeDefined();
});

// EOF
