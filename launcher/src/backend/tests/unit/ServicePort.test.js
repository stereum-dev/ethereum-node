import { ServicePort, servicePortProtocol } from "../../ethereum-services/ServicePort";

test("serviceport any destination ip", () => {
  expect(new ServicePort(null, 1234, 5678, servicePortProtocol.tcp).buildPortMapping()).toBe("0.0.0.0:1234:5678/tcp");
});

test("serviceport specific destination ip", () => {
  expect(new ServicePort("8.8.8.8", 1234, 5678, servicePortProtocol.udp).buildPortMapping()).toBe("8.8.8.8:1234:5678/udp");
});

test("buildByConfig", () => {
  const port = ServicePort.buildByConfig("0.0.0.0:1234:5678/tcp");

  expect(port.destinationIp).toBe("0.0.0.0");
  expect(port.destinationPort).toBe("1234");
  expect(port.servicePort).toBe("5678");
  expect(port.servicePortProtocol).toBe("tcp");
});

test("buildByConfig", () => {
  const port = ServicePort.buildByConfig("8.8.8.8:1235:5679/udp");

  expect(port.destinationIp).toBe("8.8.8.8");
  expect(port.destinationPort).toBe("1235");
  expect(port.servicePort).toBe("5679");
  expect(port.servicePortProtocol).toBe("udp");
});

// EOF
