const { Client } = require('ssh2')
const tunnel = require('tunnel-ssh')
const log = require('electron-log')

export class SSHService {
  constructor () {
    this.conn = null
    this.connectionInfo = null
    this.connected = false
    this.tunnels = []
  }

  static checkExecError (err) {
    return !err || err.rc != 0
  }

  static extractExecError (err) {
    return err && err.stderr ? err.stderr : '<stderr empty>'
  }

  async connect (connectionInfo) {
    this.connectionInfo = connectionInfo
    this.conn = new Client()

    return new Promise((resolve, reject) => {
      this.conn.on('error', (error) => {
        this.conn.end()
        reject(error)
      })
      this.conn.on('close', () => {
        this.connected = false
      })
      //only works for ubuntu 22.04
      this.conn.on('banner', (msg) => {
        if(new RegExp(/^(?=.*\bchange\b)(?=.*\bpassword\b).*$/gm).test(msg.toLowerCase())){
          if (process.env.NODE_ENV === "test") {
            resolve(this.conn)
          }
          reject(msg)
        }
      })
      this.conn.on('ready', async () => {
        let test = await this.exec('ls')
        if(new RegExp(/^(?=.*\bchange\b)(?=.*\bpassword\b).*$/gm).test(test.stderr.toLowerCase())){
          if (process.env.NODE_ENV === "test") {
            resolve(this.conn)
          }
          reject(test.stderr)
        }
        this.connected = true
        resolve(this.conn)
      }).connect({
        host: connectionInfo.host,
        port: connectionInfo.port || 22,
        username: connectionInfo.user || 'root',
        password: connectionInfo.password || undefined,
        privateKey: connectionInfo.privateKey || undefined,
        keepaliveInterval: 30000
      })
    })
  }

  async disconnect (connectionInfo) {
    log.info('DISCONNECT: connectionInfo', this.connectionInfo.host)

    return new Promise((resolve, reject) => {
      try {
        this.conn.end()
        resolve(true)
      } catch (error) {
        reject(error)
      }
    })
  }

  async exec (command, useSudo = true) {
    const ensureSudoCommand = "sudo -u 'root' -i <<'=====EOF'\n" + command + "\n=====EOF"
    return this.execCommand(useSudo ? ensureSudoCommand : command)
  }

  async execCommand (command) {

    return new Promise((resolve, reject) => {
      const data = {
        rc: -1,
        stdout: '',
        stderr: ''
      }
      this.conn.exec(command, (err, stream) => {
        if (err) return reject(err)
        stream
          .on('close', (code, signal) => {
            data.rc = code
            resolve(data)
          })
          .on('data', (stdout) => {
            data.stdout += stdout.toString('utf8')
          })
          .stderr.on('data', (stderr) => {
            log.error('stderr got data', stderr.toString('utf8'))
            data.stderr += stderr.toString('utf8')
          })
      })
    })
  }

  async tunnel (tunnelConfig) {
    return new Promise((resolve, reject) => {
      const config = {
        keepAlive: true,
        username: this.connectionInfo.user || 'root',
        password: this.connectionInfo.password,
        host: this.connectionInfo.host,
        port: this.connectionInfo.port || 22,
        dstHost: 'localhost',
        dstPort: tunnelConfig.dstPort,
        localHost: 'localhost',
        localPort: tunnelConfig.localPort,
        privateKey: this.connectionInfo.privateKey || undefined
      }

      const server = tunnel(config, (error, server) => {
        if (error) {
          log.error('Tunnel Connection failed!')
          return reject(error)
        }
        log.info(`Tunnel Connection established! (${tunnelConfig.localPort})`)
        this.tunnels.push({server: server, config: tunnelConfig})
        resolve(server)
      })

      server.on('error', function (error) {
        log.error('Tunnel connection error: ', error)
      })
    })
  }

  async closeTunnels (onlySpecificPorts=[]) {
    return new Promise((resolve, reject) => {
      if(this.tunnels.length > 0){
        for(let [i, tunnel] of this.tunnels.entries()){
          if(Array.isArray(onlySpecificPorts) && onlySpecificPorts.length && !onlySpecificPorts.includes(tunnel.config.localPort)){
            continue;
          }
          tunnel.server.close()
          this.tunnels.splice(i, 1);
          log.info(`Tunnel Connection closed! (${tunnel.config.localPort})`)
        }
        resolve("Tunnels Closed!")
      }else{
        reject("No Tunnels to Close!")
      }
    })
  }
}
