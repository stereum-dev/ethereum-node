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

    const lhService = new LighthouseValidatorService(networks.prater, "/opt/stereum/lh", [new LighthouseBeaconService.LighthouseBeaconService()], "foobar").buildConfiguration();

    expect(lhService.env.BEACON_NODES).toHaveLength(1);
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
    const lhService = new LighthouseValidatorService(networks.prater, "/opt/stereum/lh", [], "foobar").getAvailablePorts();

    expect(lhService).toHaveLength(0);
});

test('LighthouseValidatorService autoupdate', () => {
    const lhService = new LighthouseValidatorService(networks.prater, "/opt/stereum/lh", [], "foobar").buildConfiguration();

    expect(lhService.autoupdate).toBe(true);
});

test('LighthouseValidatorService network', () => {
    const lhService = new LighthouseValidatorService(networks.mainnet, "/opt/stereum/lh", [], "foobar").buildConfiguration();

    expect(lhService.network).toMatch(/mainnet/);
});

// EOF
