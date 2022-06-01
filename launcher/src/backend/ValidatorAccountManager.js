import { readFileSync } from "fs";
import { StringUtils } from './StringUtils.js'

const log = require('electron-log')

async function Sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export class ValidatorAccountManager {
    constructor(nodeConnection, serviceManager) {
        this.nodeConnection = nodeConnection
        this.serviceManager = serviceManager
    }

    async importKey(files, password) {
        let services = await this.serviceManager.readServiceConfigurations()
        let client = undefined
        let possibilities = ['Validator', 'Beacon', 'BloxSSV']
        let i = 0
        while (client === undefined && i <= 2) {
            client = (services.find(service => service.service.includes(possibilities[i])))
            i++
        }
        let service = (client.service.replace(/(Beacon|Validator|Service)/gm, '')).toLowerCase()
        switch (service) {
            case 'lighthouse':
                await this.nodeConnection.runPlaybook('validator-import-api', { stereum_role: 'validator-import-api', consClient: service, validator_password: password, validator_service: client.id, validator_keys: (files.map(file => { return { name: file.name, content: [readFileSync(file.path, { encoding: "utf8", })] } })) })
                break;
            
            case 'prysm':
                const wallet_path = ((client.buildConfiguration().volumes.find(volume => volume.includes('wallets'))).split(':'))[0]
                const passwords_path = ((client.buildConfiguration().volumes.find(volume => volume.includes('passwords'))).split(':'))[0]

                if ((await this.nodeConnection.sshService.exec(`sudo cat ${passwords_path}/wallet-password`)).rc === 1) {
                    log.error("No Wallet found")
                    log.info("Generating one")
                    //generate wallet password
                    await this.nodeConnection.sshService.exec(`sudo echo ${StringUtils.createRandomString()} > ${passwords_path}/wallet-password`)
                    await this.nodeConnection.sshService.exec(`sudo chmod 700 ${passwords_path}/wallet-password`)
                    await this.nodeConnection.sshService.exec(`sudo chown 2000:2000 ${passwords_path}/wallet-password`)
                    //Prysm - Create wallet for account(s)
                    await this.nodeConnection.sshService.exec(`bash -c "docker exec stereum-${client.id} /app/cmd/validator/validator wallet create --wallet-dir=/opt/app/data/wallets --wallet-password-file=/opt/app/data/passwords/wallet-password --accept-terms-of-use --keymanager-kind=direct --prater"`)

                    await this.nodeConnection.sshService.exec(`sudo chown -R 2000:2000 ${wallet_path}`)


                    await Promise.all([
                        this.serviceManager.manageServiceState(client.dependencies.consensusClients[0].id, 'stopped'),
                        this.serviceManager.manageServiceState(client.id, 'stopped')
                    ])

                    await Promise.all([
                        this.serviceManager.manageServiceState(client.dependencies.consensusClients[0].id, 'started'),
                        this.serviceManager.manageServiceState(client.id, 'started')
                    ])
                    await this.nodeConnection.sshService.exec(`sudo chmod 600 ${wallet_path}/direct/accounts/all-accounts.keystore.json`)
                    await Sleep(180000)
                }

                await this.nodeConnection.runPlaybook('validator-import-api', { stereum_role: 'validator-import-api', consClient: service, validator_password: password, validator_service: client.id, validator_keys: (files.map(file => { return { name: file.name, content: [readFileSync(file.path, { encoding: "utf8", })] } })) })

                break;

            case 'nimbus':
                //generate validator api-token
                const validator_path = ((client.buildConfiguration().volumes.find(volume => volume.includes('validators'))).split(':'))[0]

                if ((await this.nodeConnection.sshService.exec(`sudo cat ${validator_path}/api-token.txt`)).rc === 1) {
                    log.error("Couldn't read API-Token")
                    log.info("Generating one")
                    await this.nodeConnection.sshService.exec(`sudo echo ${StringUtils.createRandomString()} > ${validator_path}/api-token.txt`)
                    await Sleep(180000)
                }
                await this.nodeConnection.runPlaybook('validator-import-api', { stereum_role: 'validator-import-api', consClient: service, validator_password: password, beacon_service: client.id, validator_keys: (files.map(file => { return { name: file.name, content: readFileSync(file.path, { encoding: "utf8", }) } })) })
                break;

            case 'teku':
                break;
        }

    }

}