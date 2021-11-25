export const servicePortProtocol = {
    tcp: "tcp",
    udp: "udp",
};

export class ServicePort {
    constructor(destinationIp, destinationPort, servicePort, servicePortProtocol) {
        this.destinationIp = destinationIp;
        this.destinationPort = destinationPort;
        this.servicePort = servicePort;
        this.servicePortProtocol = servicePortProtocol;
    }

    buildPortMapping() {
        let destination;
        if (this.destinationIp) { // https://stackoverflow.com/a/5515349
            destination = this.destinationIp;
        } else {
            destination = "0.0.0.0"; // use any network address on the server
        }

        return destination + ":" + this.destinationPort  + ":" + this.servicePort + "/" + this.servicePortProtocol;
    }
}