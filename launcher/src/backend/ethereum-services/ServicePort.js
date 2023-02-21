export const servicePortProtocol = {
  tcp: "tcp",
  udp: "udp",
};

export const changeablePorts = {
  BesuService: 8545,
  ErigonService: 8545,
  GethService: 8545,
  NethermindService: 8545,
  LighthouseBeaconService: 5052,
  LighthouseValidatorService: 5062,
  LodestarBeaconService: 9596,
  LodestarValidatorService: 5062,
  PrysmBeaconService: 3500,
  PrysmValidatorService: 7500,
  NimbusBeaconService: 5052,
  TekuBeaconService: 5051,
  GrafanaService: 3000,
  PrometheusService: 9090,
};

export class ServicePort {
  constructor(destinationIp, destinationPort, servicePort, servicePortProtocol) {
    this.destinationIp = destinationIp;
    this.destinationPort = destinationPort;
    this.servicePort = servicePort;
    this.servicePortProtocol = servicePortProtocol;
  }

  static buildByConfig(portString) {
    const portSettings = portString.split(":");
    const servicePortSettings = portSettings[2].split("/");

    return new ServicePort(portSettings[0], portSettings[1], servicePortSettings[0], servicePortSettings[1]);
  }

  buildPortMapping() {
    let destination;
    if (this.destinationIp) {
      // https://stackoverflow.com/a/5515349
      destination = this.destinationIp;
    } else {
      destination = "0.0.0.0"; // use any network address on the server
    }

    return destination + ":" + this.destinationPort + ":" + this.servicePort + "/" + this.servicePortProtocol;
  }
}
