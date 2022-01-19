export class ServiceVolume {
    constructor(destinationPath, servicePath) {
        this.destinationPath = destinationPath;
        this.servicePath = servicePath;
    }

    static buildByConfig(volumeString) {
        const volumeSettings = volumeString.split(":");

        return new ServiceVolume(volumeSettings[0], volumeSettings[1]);
    }

    buildVolumeMapping() {
        return this.destinationPath + ":" + this.servicePath;
    }
}