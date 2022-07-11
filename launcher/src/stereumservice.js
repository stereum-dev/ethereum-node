import { SSHService } from './sshservice.js'
import * as axios from 'axios'
import * as yaml from 'js-yaml'

const log = require('electron-log')

export class StereumService {
  constructor () {
    this.sshService = new SSHService()
  }

  async check_stereum () {
    // check if /etc/stereum/ethereum2.yaml does not exist
    log.info('  checking stereum')
    let exists = false
    try {
      const resp = await this.sshService.exec('ls /etc/stereum/ethereum2.yaml')
      exists = resp.rc == 0
    } catch (ex) {
      log.error("can't access ethereum2.yaml")
    }
    return exists
  }

  async get_latest_stereum_release_tag () {
    let latest_stereum_release_tag
    log.info('Fetching latest stereum releasetag from https://stereum.net/downloads/stable.update')
    const resp = await axios.get('https://stereum.net/downloads/stable.update')
    if (resp.status == 200) {
      latest_stereum_release_tag = resp.data.replace('\n', '')
      log.info('Found stereum release %s as latest available release' % latest_stereum_release_tag)
    }
    return latest_stereum_release_tag
  }

  async get_latest_stereum_release_rc_tag () {
    let latest_stereum_release_tag
    log.info('Fetching latest stereum releasetag from https://stereum.net/downloads/rc.update')
    const resp = await axios.get('https://stereum.net/downloads/rc.update')
    if (resp.status == 200) {
      latest_stereum_release_tag = resp.data.replace('\n', '')
      log.info('Found stereum release rc %s as latest available release rc ' % latest_stereum_release_tag)
    }
    return latest_stereum_release_tag
  }

  async check_controlcenter () {
    // check if /etc/stereum/ethereum2.yaml does not exist
    log.info('  checking stereum controlcenter')
    const resp = await this.sshService.exec('cat /opt/stereum/controlcenter/.env')
    log.info('resp.rc: ' + resp.rc)
    if (resp.rc == 0) {
      const out = resp.stdout
      log.info('  found /opt/stereum/controlcenter/.env with content' + out)
      const envLines = out.split('\n')
      let versionLine = ''
      for (const l of envLines) {
        if (l.startsWith('stereum_version_tag=')) {
          versionLine = l
          break
        }
      }
      log.info('  extracting version of /opt/stereum/controlcenter/.env of line ' + versionLine)
      return versionLine.split('=')[1]
    }
    return undefined
  }

  async check_controlcenter_web () {
    // check if /etc/stereum/ethereum2.yaml does not exist
    log.info('  checking stereum web cc')
    const resp = await this.sshService.exec('docker ps | grep control')
    if (resp.rc == 0) {
      return resp.stdout.split('   ')[1].split(':')[1]
    }
    return undefined
  }

  async get_stereum_release () {
    // check if /etc/stereum/ethereum2.yaml does not exist
    log.info('  getting installed stereum version')
    const resp = await this.sshService.exec('cat /etc/stereum/ethereum2.yaml')
    if (resp.rc == 0) {
      const yaml_doc = yaml.load(resp.stdout)
      return yaml_doc.stereum_version_tag
    }
  }

  async connect (connectionInfo) {
    try {
      await this.sshService.connect(connectionInfo)
    } catch (e) {
      throw e
    }
  }

  async disconnect () {
    try {
      await this.sshService.disconnect()
    } catch (e) {
      throw e
    }
  }

  async getInstalledVersions () {
    const stereumInfo = {
      exists: false,
      existingRelease: undefined,
      latestRelease: undefined,
      latestRcRelease: undefined,
      ccRelease: undefined,
      ccwebRelease: undefined
    }

    stereumInfo.latestRelease = await this.get_latest_stereum_release_tag()
    stereumInfo.latestRcRelease = await this.get_latest_stereum_release_rc_tag()

    const stereumExists = await this.check_stereum()
    if (stereumExists) {
      stereumInfo.exists = true
      stereumInfo.existingRelease = await this.get_stereum_release()
      stereumInfo.ccRelease = await this.check_controlcenter()
      stereumInfo.ccwebRelease = await this.check_controlcenter_web()
    }
    return stereumInfo
  }

  async launch_bundle (existing_release, port) {
    return new Promise(async (resolve, reject) => {
      log.info('  launching installation of stereum release ' + existing_release + ' This can take a few minutes, your browser will open up upon completion with the installation wizard!')
      const resp = await this.sshService.exec('chmod +x /tmp/base_installer.run && /tmp/base_installer.run --extra-vars=existing_release="' + existing_release + '" --extra-vars=stereum_ssh_port="' + port + '"')
      if (resp.rc == 0) {
        log.info('    successfully launched base-installer')
        resolve(resp)
      } else {
        log.error('**** problems launch base-installer: Status: ' + resp.rc + ' ****, ansible logs below:\n, ' + resp.stdout)
        reject(resp)
      }
      return resp.rc
    })
  }

  async setup (release) {
    return new Promise(async (resolve, reject) => {
      let commandString = ''
      log.info('checking requirements for base-installation')
      let resp = await this.sshService.exec('which curl')
      if (resp.stdout.length > 0) {
        log.info('  found curl at ' + resp.stdout.replace('\n', ''))
        commandString = 'curl --silent https://stereum.net/downloads/base-installer-' + release + '.run --output /tmp/base_installer.run'
      }
      resp = await this.sshService.exec('which wget')
      if (resp.stdout.length > 0) {
        log.info('  found wget at ' + resp.stdout.replace('\n', ''))
        commandString = 'wget https://stereum.net/downloads/base-installer-' + release + '.run -O /tmp/base_installer.run'
      }

      log.info('using base-installer bundle')
      log.info('  fetching')
      resp = await this.sshService.exec(commandString)
      let status
      if (resp.rc == 0) {
        log.info('    successfully fetched base-installer')
        const sshPort = this.sshService.connectionInfo.port || 22
        status = await this.launch_bundle(release, sshPort)
        resolve(status)
      } else {
        log.error('**** problems fetching base-installer: Status: ' + resp.rc + ' ****, ansible logs below:\n, ' + resp.stdout)
        status = -1
        reject(resp)
      }
      return status
    })
  }

  async setApikey (apikey) {
    return new Promise(async (resolve, reject) => {
      const resp = await this.sshService.exec("echo '" + apikey + "' > /etc/stereum/cc-apikey", "echo '<apikey>' > /etc/stereum/cc-apikey")
      if (resp.rc == 0) {
        log.info('    successfully set apikey')
        resolve(resp)
      } else {
        log.error('**** problems setting apikey: Status: ' + resp.rc + ' ****, ansible logs below:\n, ' + resp.stdout)
        reject(resp)
      }
    })
  }

  async openTunnels (args) {
    for (const tunnel of args) {
      await this.sshService.tunnel(tunnel)
    }
  }
}
