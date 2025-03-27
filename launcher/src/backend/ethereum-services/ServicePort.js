export const servicePortProtocol = {
  tcp: "tcp",
  udp: "udp",
};

export const changeablePorts = {
  BesuService: 8545,
  ErigonService: 8545,
  GethService: 8545,
  RethService: 8545,
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
  GrandineBeaconService: 5052,
};

export const validatorPorts = {
  LighthouseValidatorService: 5062,
  PrysmValidatorService: 7500,
  NimbusBeaconService: 5052,
  NimbusValidatorService: 5052,
  TekuBeaconService: 5052,
  TekuValidatorService: 5052,
  LodestarValidatorService: 5062,
  Web3SignerService: 9000,
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
    const servicePortSettings = portSettings[2]?.split("/");

    const destinationIp = portSettings?.length >= 1 ? portSettings[0] : "";
    const destinationPort = portSettings?.length >= 2 ? portSettings[1] : "";
    const servicePort = servicePortSettings?.length >= 1 ? servicePortSettings[0] : "";
    const servicePortProtocol = servicePortSettings?.length >= 2 ? servicePortSettings[1] : "";

    return new ServicePort(destinationIp, destinationPort, servicePort, servicePortProtocol);
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
