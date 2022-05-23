import EventEmitter from 'events'

let instance = null
class ControlService extends EventEmitter {
  constructor () {
    super()
    this.promiseIpc = window.promiseIpc
  }

  init (store) {
    this.promiseIpc.send('ready', 'OK')
    instance.$store = store
  }

  async connect (args) {
    return this.promiseIpc.send('connect', {
      host: args.host,
      port: args.port,
      user: args.user,
      password: args.password,
      sshKeyAuth: args.sshKeyAuth,
      keyfileLocation: args.keyfileLocation,
      stereumRelease: args.stereumRelease
    })
  }

  async disconnect (args) {
    return this.promiseIpc.send('disconnect', args)
  }

  async inquire (args) {
    return this.promiseIpc.send('inquire', args)
  }

  async setup (args) {
    return this.promiseIpc.send('setup', args)
  }

  async destroy () {
    return await this.promiseIpc.send('destroy')
  }

  async openTunnels (args) {
    await this.promiseIpc.send('tunnel', args)
    return args
  }

  async setApikey (args) {
    await this.promiseIpc.send('setApikey', args)
  }

  async readConfig () {
    return await this.promiseIpc.send('readConfig')
  }

  async writeConfig (args) {
    await this.promiseIpc.send('writeConfig', args)
    return args
  }

  async checkOS () {
    return await this.promiseIpc.send('checkOS')
  }

  async getOneClickConstellation (args) {
    return await this.promiseIpc.send('getOneClickConstellation', args)
  }

  async prepareOneClickInstallation (args) {
    return await this.promiseIpc.send('prepareOneClickInstallation', args)
  }

  async writeOneClickConfiguration () {
    return await this.promiseIpc.send('writeOneClickConfiguration')
  }

  async startOneClickServices () {
    return await this.promiseIpc.send('startOneClickServices')
  }
  
  async getServerVitals(){
    return await this.promiseIpc.send('getServerVitals')
  }

  async getAvailablePort(args){
    return await this.promiseIpc.send('getAvailablePort', args)
  }
}
if (!instance) {
  instance = new ControlService(window.electron)
}
export default instance
