import { LighthouseBeaconService } from './LighthouseBeaconService.js'
import { LighthouseValidatorService } from './LighthouseValidatorService.js'
import { networks } from './NodeService.js'
import { ServicePort, servicePortProtocol } from './ServicePort.js'

test('LighthouseValidatorService buildConfiguration', () => {
    jest.mock('./LighthouseBeaconService');
    const LighthouseBeaconService = require('./LighthouseBeaconService');
    const mMock = jest.fn(() => { return "http-endpoint-string" });
    LighthouseBeaconService.LighthouseBeaconService.mockImplementation(() => {
        return {
            buildConsensusClientHttpEntpointUrl: mMock,
        };
    });

    const lhService = LighthouseValidatorService.buildByUserInput(networks.prater, "/opt/stereum/lh", [new LighthouseBeaconService.LighthouseBeaconService()], "foobar").buildConfiguration();

    expect(typeof lhService.env.BEACON_NODES).toBe('string')
    expect(lhService.env.BEACON_NODES).toContain("http-endpoint-string");
    expect(lhService.env.GRAFFITI).toMatch(/foobar/);
    expect(lhService.volumes).toHaveLength(2);
    expect(lhService.volumes).toContain("/opt/stereum/lh/wallets:/opt/app/validator");
    expect(lhService.volumes).toContain("/opt/stereum/lh/launchpad:/opt/app/launchpad");
    expect(lhService.ports).toHaveLength(0);
    expect(lhService.id).toHaveLength(36);
    expect(lhService.user).toMatch(/2000/);
    expect(lhService.image).toMatch(/stereum\/lighthouse/);

    expect(lhService.service).toMatch(/LighthouseValidatorService/);
});

test('LighthouseValidatorService getAvailablePorts', () => {
    const lhService = LighthouseValidatorService.buildByUserInput(networks.prater, "/opt/stereum/lh", [], "foobar").getAvailablePorts();

    expect(lhService).toHaveLength(0);
});

test('LighthouseValidatorService autoupdate', () => {
    const lhService = LighthouseValidatorService.buildByUserInput(networks.prater, "/opt/stereum/lh", [], "foobar").buildConfiguration();

    expect(lhService.autoupdate).toBe(true);
});

test('LighthouseValidatorService network', () => {
    const lhService = LighthouseValidatorService.buildByUserInput(networks.mainnet, "/opt/stereum/lh", [], "foobar").buildConfiguration();

    expect(lhService.network).toBe(networks.mainnet);
});

test('buildByConfiguration', () => {
    const bn1 = "http://node1:5052";
    const bn2 = "https://node2:999";

    const lh = LighthouseValidatorService.buildByConfiguration({
        id: "123",
        service: "LighthouseValidatorService",
        image: "lhval:v0.0.1",
        env: {
            DATADIR: "/data",
            DEBUG_LEVEL: "info",
            BEACON_NODES: [bn1, bn2],
            NETWORK: "mainnet",
            GRAFFITI: "stereum.net",
            LAUNCHPADDIR: "/launchpad",
        },
    });

    expect(lh.id).toBe("123");
    expect(lh.service).toBe("LighthouseValidatorService");
    expect(lh.image).toBe("lhval");
    expect(lh.imageVersion).toBe("v0.0.1");
    expect(lh.ports).toHaveLength(0);

    expect(lh.volumes).toHaveLength(0);

    expect(lh.env).toBeDefined();
    expect(lh.env.DEBUG_LEVEL).toMatch(/info/);
    expect(lh.env.BEACON_NODES).toHaveLength(2);
    expect(lh.env.BEACON_NODES[0]).toBe(bn1);
    expect(lh.env.BEACON_NODES[1]).toBe(bn2);
});

// EOF
