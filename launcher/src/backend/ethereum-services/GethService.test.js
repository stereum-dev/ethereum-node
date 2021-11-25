//const GethService = require('./GethService');
import { GethService } from './GethService.js'
import { networks } from './NodeService.js'
import { ServicePort, servicePortProtocol } from './ServicePort.js'
import { ServiceVolume } from './ServiceVolume.js'
// const ServicePort = require('./ServicePort');
// const ServiceVolume = require('./ServiceVolume');

test('gethService id test', () => {
    expect(new GethService(networks.prater).id).toBeDefined();
});

test('gethService network test goerli', () => {
    expect(new GethService(networks.goerli, null, null).buildConfiguration().command).toMatch(/goerli/);
});

test('gethService network test mainnet', () => {
    expect(new GethService(networks.mainnet, null, null).buildConfiguration().command).toMatch(/mainnet/);
});

test('gethService user', () => {
    expect(new GethService(networks.mainnet, null, null).buildConfiguration().user).toMatch(/root/);
});

test('gethService image', () => {
    expect(new GethService(networks.mainnet, null, null).buildConfiguration().image).toMatch(/ethereum\/client-go/);
});

test('gethService endpoint url', () => {
    expect(new GethService(networks.mainnet, null, null).buildExecutionClientHttpEndpointUrl()).toMatch(new RegExp("^http:\/\/stereum-.*:8545"));
});

test('gethService endpoint ws url', () => {
    expect(new GethService(networks.mainnet, null, null).buildExecutionClientWsEndpointUrl()).toMatch(new RegExp("^ws:\/\/stereum-.*:8546"));
});

test('gethService empty ports', () => {
    expect(new GethService(networks.goerli, null, null).buildConfiguration().ports).toHaveLength(0);
});

test('gethService ports', () => {
    expect(new GethService(networks.goerli, [new ServicePort(null, 100, 200, servicePortProtocol.tcp)], null).buildConfiguration().ports).toHaveLength(1);
    expect(new GethService(networks.goerli, [new ServicePort(null, 100, 200, servicePortProtocol.tcp)], null).buildConfiguration().ports).toContain("0.0.0.0:100:200/tcp");
});

test('gethService multiple ports', () => {
    const ports = [
        new ServicePort(null, 100, 200, servicePortProtocol.tcp),
        new ServicePort(null, 101, 202, servicePortProtocol.udp),
        new ServicePort("1.2.3.4", 303, 404, servicePortProtocol.udp),
    ];

    expect(new GethService(networks.goerli, ports, null).buildConfiguration().ports).toHaveLength(3);
    expect(new GethService(networks.goerli, ports, null).buildConfiguration().ports).toContain("0.0.0.0:100:200/tcp");
    expect(new GethService(networks.goerli, ports, null).buildConfiguration().ports).toContain("0.0.0.0:101:202/udp");
    expect(new GethService(networks.goerli, ports, null).buildConfiguration().ports).toContain("1.2.3.4:303:404/udp");
});

test('gethService workingDir', () => {
    const volumes = [
        new ServiceVolume("/opt/stereum/foo", "/opt/app/bar")
    ];

    const gethConfig = new GethService(networks.goerli, null, "/opt/stereum/geth").buildConfiguration();

    expect(gethConfig.volumes).toHaveLength(1);
    expect(gethConfig.volumes).toContain("/opt/stereum/geth/data:/root/.ethereum");
});

// EOF
