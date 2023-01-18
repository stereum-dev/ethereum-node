export class ServiceVolume {
  constructor (destinationPath, servicePath, bindOptions) {
    this.destinationPath = destinationPath
    this.servicePath = servicePath
    this.bindOptions = bindOptions
  }

  static buildByConfig (volumeString) {
    const volumeSettings = volumeString.split(':')

    return new ServiceVolume(volumeSettings[0], volumeSettings[1], volumeSettings[2] ? volumeSettings[2] : "")
  }

  buildVolumeMapping () {
    if(this.bindOptions)
      return this.destinationPath + ':' + this.servicePath + ':' + this.bindOptions
    return this.destinationPath + ':' + this.servicePath
  }
}
