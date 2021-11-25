export class ServiceVolume {
    constructor(destinationPath, servicePath) {
        this.destinationPath = destinationPath;
        this.servicePath = servicePath;
    }

    buildVolumeMapping() {
        return this.destinationPath + ":" + this.servicePath;
    }
}