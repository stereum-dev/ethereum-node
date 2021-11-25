import { ServicePort, servicePortProtocol } from './ServicePort'

test('serviceport any destination ip', () => {
    expect(new ServicePort(null, 1234, 5678, servicePortProtocol.tcp).buildPortMapping())
        .toBe("0.0.0.0:1234:5678/tcp");
});

test('serviceport specific destination ip', () => {
    expect(new ServicePort("8.8.8.8", 1234, 5678, servicePortProtocol.udp).buildPortMapping())
        .toBe("8.8.8.8:1234:5678/udp");
});
