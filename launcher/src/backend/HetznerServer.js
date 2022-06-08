import * as crypto from 'crypto'
const log = require('electron-log')
const https = require('https')

export class HetznerServer {
  constructor () {
    this.apiToken = process.env.HCLOUD_TOKEN // don't forget to set env variable "export HCLOUD_TOKEN=<your-hetzner-api-token>"
    this.serverID = null
    this.serverName = null
    this.serverIPv4 = null
    this.serverRootPassword = null
  }

  async Sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
     * creates HTTPS options object
     * @param method {string} - Either "GET", "POST", "DELTE" or "PUT"
     * @param serverID {string} - Used to specify which server to target (optional)
     * @returns https options with given method and path
     */
  async createHTTPOptions (method, option, serverID, action) {
    serverID === undefined ? serverID = '' : serverID = '/' + serverID
    action === undefined ? action = '' : action = '/actions/' + action
    const options = {
      hostname: 'api.hetzner.cloud',
      path: `/v1/${option}${serverID}${action}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.apiToken
      }
    }
    return options
  }

  /**
     * makes HTTPS Request with given HTTPS options and body
     * @param options - https options
     * @param body - body of the Request (optional)
     */
  async makeRequest (options, body) {
    let data = ''
    return new Promise((resolve, reject) => {
      const req = https.request(options, res => {
        res.on('data', d => {
          data += d
        })
        res.on('end', () => {
          resolve(data)
        })
      })

      req.on('error', err => {
        log.error(err)
        reject(err)
      })

      if (body !== undefined) {
        req.write(body)
      }
      req.end()
    })
  }

  /**
     * Creates a shell session to handle Password Authentication (reset root password)
     * @param password {string} root password generated on server creation
     * @param newPassword new root password
     */
  async passwordAuthentication (password) {
    const buf = crypto.randomBytes(20)
    const newPassword = buf.toString('hex')
    return new Promise((resolve, reject) => {
      this.nodeConnection.sshService.conn.shell(function (err, stream) {
        if (err) throw err
        stream.stderr.on('data', (err) => {
          log.error(err)
          reject()
        })
        stream.stdout.on('data', (data) => {
          if (/Current password:/.test(data)) {
            stream.stdin.write(`${password}\r\n`)
          } else if (/New password:/.test(data)) {
            stream.stdin.write(`${newPassword}\r\n`)
          } else if (/Retype new password:/.test(data)) {
            stream.stdin.write(`${newPassword}\r\n`)
          } else if (/:~#/.test(data)) {
            stream.end()
            resolve()
          }
        })
      })
    }).then(async () => {
      await this.nodeConnection.sshService.disconnect()
      this.serverRootPassword = newPassword
      this.nodeConnection.nodeConnectionParams.password = newPassword
      await this.nodeConnection.establish()
      log.info('Reconnected after password change')
    }).catch(err => log.error('Password Authentication failed:\n', err))
  }

  /**
     * Creates Hetzner Server
     * @param serverSettings object with settings for Server Creation
     */
  async create (serverSettings) {
    const response = await this.getStatusAll()
    if (response.servers.some(server => server.name == serverSettings.name)) {
      log.info('server already exists')
      response.servers.forEach(server => {
        if (server.name == serverSettings.name) {
          this.serverID = server.id
        }
      })
      await this.destroy()
    }

    const data = await this.makeRequest(await this.createHTTPOptions('POST', 'servers'), JSON.stringify(serverSettings))
    const responseData = JSON.parse(data)

    if (responseData.error !== undefined) {
      console.log(responseData)
      throw responseData.error
    }

    this.serverID = responseData.server.id
    this.serverName = responseData.server.name
    this.serverIPv4 = responseData.server.public_net.ipv4.ip
    this.serverRootPassword = responseData.root_password

    const status = []
    const check = { counter: 0, maxTries: 300 }
    do {
      log.info('Initializing Server')
      try {
        status[check.counter] = (await this.getStatus()).server.status
        if (++check.counter == check.maxTries) throw 'Server creation was canceled'
      } catch (e) {
        log.error('Error creating Server:\n')
        throw e
      }
      await this.Sleep(2000)
    } while (status[check.counter] == 'initializing')
  }

  async connect (nodeConnection) {
    this.nodeConnection = nodeConnection
    const retry = { connected: false, counter: 0, maxTries: 300 }
    log.info('Connecting via SSH')
    while (!retry.connected) {
      try {
        await this.nodeConnection.establish()
        retry.connected = true
        log.info('Connected!')
      } catch (e) {
        if (++retry.counter == retry.maxTries) throw e
        log.info(' Could not connect.\n' + (retry.maxTries - retry.counter) + ' tries left.')
        await this.Sleep(2000)
      }
    }
  }

  /**
     * Destroys Server via API call
     */
  async destroy () {
    const data = await this.makeRequest(await this.createHTTPOptions('DELETE', 'servers', this.serverID))
    const responseData = JSON.parse(data)
    if (responseData.action.status == 'success' && responseData.action.progress == 100) {
      log.info('Server with ID ' + this.serverID + ' was destroyed successfully')
    } else {
      log.error('Error deleting Server:\n', responseData)
    }
  }

  /**
     * Gets server information via API call
     * @returns object containing server information
     */
  async getStatus () {
    const data = await this.makeRequest(await this.createHTTPOptions('GET', 'servers', this.serverID))
    const responseData = JSON.parse(data)
    return responseData
  }

  async getStatusAll () {
    const data = await this.makeRequest(await this.createHTTPOptions('GET', 'servers'))
    const responseData = JSON.parse(data)
    return responseData
  }

  async getAllNetworks () {
    const data = await this.makeRequest(await this.createHTTPOptions('GET', 'networks'))
    const responseData = JSON.parse(data)
    return responseData
  }

  async getNetworkID (name) {
    const networks = await this.getAllNetworks()
    return (networks.networks.find(network => network.name === name)).id
  }

  async attachToNetwork (network, ip){
    let networkID = await this.getNetworkID(network)
    let settings = {
      ip: ip,
      network: networkID
    }
    console.log(await this.makeRequest(await this.createHTTPOptions('POST', 'servers', this.serverID, 'attach_to_network'),JSON.stringify(settings)))
  }
}
