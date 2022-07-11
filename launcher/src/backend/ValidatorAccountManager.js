import ElectronLog from "electron-log";
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
        this.batches = []
    }

    createBatch(files, password){
        const content = files.map(file => {
            return readFileSync(file.path, { encoding: "utf8", })
        })
        const passwords = Array(content.length).fill(password)
        this.batches.push({
            name: "batch" + this.batches.length,
            passwords: passwords,
            content: content
        })
    }

    async importKey(files, password) {
        this.createBatch(files, password)
        let services = await this.serviceManager.readServiceConfigurations()
        let client = undefined
        let possibilities = ['Validator', 'Beacon']
        let i = 0
        while (client === undefined && i <= 1) {
            client = (services.find(service => service.service.includes(possibilities[i])))
            i++
        }
        let service = (client.service.replace(/(Beacon|Validator|Service)/gm, '')).toLowerCase()



        switch (service) {
            case 'prysm':
                const wallet_path = ((client.buildConfiguration().volumes.find(volume => volume.includes('wallets'))).split(':'))[0]
                const passwords_path = ((client.buildConfiguration().volumes.find(volume => volume.includes('passwords'))).split(':'))[0]

                if ((await this.nodeConnection.sshService.exec(`cat ${passwords_path}/wallet-password`)).rc === 1) {
                    log.error("No Wallet found")
                    log.info("Generating one")
                    //generate wallet password
                    await this.nodeConnection.sshService.exec(`echo ${StringUtils.createRandomString()} > ${passwords_path}/wallet-password`)
                    await this.nodeConnection.sshService.exec(`chmod 700 ${passwords_path}/wallet-password`)
                    await this.nodeConnection.sshService.exec(`chown 2000:2000 ${passwords_path}/wallet-password`)
                    //Prysm - Create wallet for account(s)
                    await this.nodeConnection.sshService.exec(`docker exec stereum-${client.id} /app/cmd/validator/validator wallet create --wallet-dir=/opt/app/data/wallets --wallet-password-file=/opt/app/data/passwords/wallet-password --accept-terms-of-use --keymanager-kind=direct --prater`)

                    await this.nodeConnection.sshService.exec(`chown -R 2000:2000 ${wallet_path}`)


                    await Promise.all([
                        this.serviceManager.manageServiceState(client.dependencies.consensusClients[0].id, 'stopped'),
                        this.serviceManager.manageServiceState(client.id, 'stopped')
                    ])

                    await Promise.all([
                        this.serviceManager.manageServiceState(client.dependencies.consensusClients[0].id, 'started'),
                        this.serviceManager.manageServiceState(client.id, 'started')
                    ])
                    await this.nodeConnection.sshService.exec(`chmod 600 ${wallet_path}/direct/accounts/all-accounts.keystore.json`)
                    await Sleep(180000)
                }
                break;

            case 'nimbus':
                //generate validator api-token
                const validator_path = ((client.buildConfiguration().volumes.find(volume => volume.includes('validators'))).split(':'))[0]

                if ((await this.nodeConnection.sshService.exec(`cat ${validator_path}/api-token.txt`)).rc === 1) {
                    log.error("Couldn't read API-Token")
                    log.info("Generating one")
                    await this.nodeConnection.sshService.exec(`echo ${StringUtils.createRandomString()} > ${validator_path}/api-token.txt`)
                    await Sleep(180000)
                }
                break;

            case 'teku':
                const dataDir = (client.volumes.find(vol => vol.servicePath === '/opt/app/data')).destinationPath
                if((await this.nodeConnection.sshService.exec(`cat ${dataDir}/teku_api_password.txt`)).rc === 1){
                    log.error("Couldn't read API-Token")
                    log.info("Generating one")
                    const password = StringUtils.createRandomString()
                    await this.nodeConnection.sshService.exec('apt install -y openjdk-8-jre-headless')
                    await this.nodeConnection.sshService.exec(`echo ${password} > ${dataDir}/teku_api_password.txt`)
                    await this.nodeConnection.sshService.exec(`cd ${dataDir} && keytool -genkeypair -keystore teku_api_keystore -storetype PKCS12 -storepass ${password} -keyalg RSA -keysize 2048 -validity 109500 -dname 'CN=localhost, OU=MyCompanyUnit, O=MyCompany, L=MyCity, ST=MyState, C=AU' -ext san=dns:localhost,ip:127.0.0.1`)
                    await Sleep(30000)
                }
                break;

        }
        try{
            await this.nodeConnection.runPlaybook('validator-import-api', { stereum_role: 'validator-import-api', validator_service: client.id, validator_keys: this.batches })
        }catch(err){
            log.error("Validator Import Failed:\n", err)
            return err
        }
        this.batches = []
        return client
    }

    async listValidators(serviceID) {
        try{
            let run = await this.nodeConnection.runPlaybook('validator-list-api', { stereum_role: 'validator-list-api', validator_service: serviceID})
            let logs = new RegExp(/^DATA: ({"msg":.*)/,'gm').exec(await this.nodeConnection.playbookStatus(run.playbookRunRef))
            let result = (JSON.parse(logs[1])).msg
            return result
        }catch(err){
            log.error("Listing Validators Failed:\n", err)
            return err
        }
    }

}