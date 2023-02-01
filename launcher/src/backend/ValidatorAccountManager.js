import { readFileSync } from "fs";
import { StringUtils } from './StringUtils.js'
import YAML from "yaml";
import * as crypto from 'crypto'

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

    createBatch(files, password, slashingDB) { // this function can be called both with or without "slashing_protection_content" ---> README & REMOVE ME!!!
        if(slashingDB)
            var slashing_protection_content = readFileSync(slashingDB, { encoding: "utf8", })
        const content = files.map(file => {
            return readFileSync(file.path, { encoding: "utf8", })
        })
        const passwords = Array(content.length).fill(password)

        let batch = {
            name: "batch" + this.batches.length,
            passwords: passwords,
            content: content,
            ...(slashing_protection_content && {slashing_protection_content: slashing_protection_content}) // READ ME & REMOVE ME short explanation !!! ---> for Martin, if slashing protection data is defined, then batch will use pass, content also slashing_p_db, if not defined, then only pass and content will be used ----> short explanation for Martin
        }
        this.batches.push(batch)
    }

    async importKey(files, password, serviceID, slashingDB) {
        this.createBatch(files, password, slashingDB)
        let services = await this.serviceManager.readServiceConfigurations()

        let client = services.find(service => service.id === serviceID)
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
                        this.serviceManager.manageServiceState(client.id, 'stopped')
                    ])

                    await Promise.all([
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
                if ((await this.nodeConnection.sshService.exec(`cat ${dataDir}/teku_api_password.txt`)).rc === 1) {
                    log.error("Couldn't read API-Token")
                    log.info("Generating one")
                    const password = StringUtils.createRandomString()
                    await this.nodeConnection.sshService.exec('apt install -y openjdk-8-jre-headless')
                    await this.nodeConnection.sshService.exec(`echo ${password} > ${dataDir}/teku_api_password.txt`)
                    await this.nodeConnection.sshService.exec(`cd ${dataDir} && keytool -genkeypair -keystore teku_api_keystore -storetype PKCS12 -storepass ${password} -keyalg RSA -keysize 2048 -validity 109500 -dname "CN=teku, OU=MyCompanyUnit, O=MyCompany, L=MyCity, ST=MyState, C=AU" -ext "SAN=DNS:stereum-${client.id}"`)
                    await this.serviceManager.manageServiceState(client.id, 'stopped')
                    await this.serviceManager.manageServiceState(client.id, 'started')
                    await Sleep(30000)
                }
                break;

        }
        try {
            let run = await this.nodeConnection.runPlaybook('validator-import-api', { stereum_role: 'validator-import-api', validator_service: client.id, validator_keys: this.batches })
            let logs = [...(await this.nodeConnection.playbookStatus(run.playbookRunRef)).matchAll(/^DATA: ({"msg":.*)/gm)]

            let output = logs.map(log => {
                return (JSON.parse(log[1]))
            })

            let result = (output.map(log => {
                if(log.msg.data === undefined){
                    if(log.msg.code === undefined || log.msg.message === undefined){
                        throw log.msg
                    }
                    throw log.msg.code + " " + log.msg.message
                }
                return log.msg.data
            })).flat()
            let imported = 0
            let duplicate = 0
            let error = 0
            let pubkeys = this.batches.map(b => b.content.map(c => JSON.parse(c).pubkey)).flat()
            let message = (result.map((key, index, arr) => {
                if(key.status === "imported")imported ++
                if(key.status === "duplicate")duplicate ++
                if(key.status === "error")error ++
                return ((`${pubkeys[index].substring(0, 20)}...${pubkeys[index].substring(pubkeys[index].length - 6, pubkeys[index].length)}:\t${key.status}`) + (key.status == "error" ? `:\n${key.message}\n` : ""))
            })).join('\n')

            this.batches = []
            return message + `\n${imported} key(s) imported...\n${duplicate} duplicate(s)...\n${error} import(s) failed...`
        } catch (err) {
            log.error("Validator Import Failed:\n", err)
            this.batches = []
            return "Validator Import Failed:\n" + err
        }
    }

    async listValidators(serviceID) {
        try {
            let run = await this.nodeConnection.runPlaybook('validator-list-api', { stereum_role: 'validator-list-api', validator_service: serviceID })
            let logs = new RegExp(/^DATA: ({"msg":.*)/, 'gm').exec(await this.nodeConnection.playbookStatus(run.playbookRunRef))
            let result = (JSON.parse(logs[1])).msg
            await this.writeKeys(result.data.map(k => k.validating_pubkey))
            return result
        } catch (err) {
            log.error("Listing Validators Failed:\n", err)
            return err
        }
    }

    async deleteValidators(serviceID, keys, picked){
        try {
                let run = await this.nodeConnection.runPlaybook('validator-delete-api', { stereum_role: 'validator-delete-api', validator_service: serviceID, validator_public_keys: [{pubkeys: keys}] })
                let logs = new RegExp(/^DATA: ({"msg":.*)/, 'gm').exec(await this.nodeConnection.playbookStatus(run.playbookRunRef))
                let result = (JSON.parse(logs[1])).msg
                if (picked) {
                    return JSON.parse(result.slashing_protection);
                }
                return result
        } catch(err) {
            log.error("Deleting Validators Failed:\n", err)
            return err
        }
    }

    async insertSSVNetworkKeys(service, sk) {
        return new Promise(async (resolve, reject) => {
            try {
                const dataDir = (service.config.volumes.find(vol => vol.servicePath === '/data')).destinationPath
                let ssvConfig = (await this.nodeConnection.sshService.exec(`cat ${dataDir}/config.yaml`)).stdout
                if (ssvConfig) {
                    const escapedConfigFile = StringUtils.escapeStringForShell(ssvConfig.replace(/^OperatorPrivateKey.*/gm,"OperatorPrivateKey: \"" + sk + "\""))
                    await this.nodeConnection.sshService.exec(`echo ${escapedConfigFile} > ${dataDir}/config.yaml`)

                    await this.serviceManager.manageServiceState(service.config.serviceID, 'stopped')
                    await this.serviceManager.manageServiceState(service.config.serviceID, 'started')

                    let pk = undefined
                    let tries = 0
                    while (pk === undefined) {
                        let logs = await this.nodeConnection.getServiceLogs(service.config.serviceID)
                        if (new RegExp(/"public-key": "(.*)"/gm).test(logs)) {
                            pk = new RegExp(/"public-key": "(.*)"/gm).exec(logs)[1]
                        }
                        tries++
                        if(tries === 20){
                            throw new Error('"public-key" was not found in service logs')
                        }
                    }
                    let serviceConfig = await this.nodeConnection.readServiceConfiguration(service.config.serviceID)
                    serviceConfig.ssv_pk = pk
                    await this.nodeConnection.writeServiceConfiguration(serviceConfig)
                    return resolve(serviceConfig.ssv_pk)
                }else{
                    throw new Error('no ssv config.yaml')
                }
            } catch (err) {
                log.error("Inserting Keys failed:\n", err)
                return reject(err)
            }
        })

    }

    async addFeeRecipient(keys, address){
        if(keys && keys.length != 0 && address){
            const serviceID = keys[0].validatorID
            const validatorKeys = keys.map(key => {
                return {
                    pubkey: key.key,
                    recipient: address
                }
            })

        try {
            let run = await this.nodeConnection.runPlaybook('validator-fee-recipient-api', { stereum_role: 'validator-fee-recipient-api', validator_service: serviceID, validator_keys: validatorKeys })
            //let logs = new RegExp(/^DATA: ({"msg":.*)/, 'gm').exec(await this.nodeConnection.playbookStatus(run.playbookRunRef))
            //let result = (JSON.parse(logs[1])).msg
            return run
        } catch (err) {
            log.error("Changing Fee Recipient Failed:\n", err)
            return err
        }
        }
        return 0
    }

    async getOperatorPageURL(pubKey){
        const hash = crypto.createHash('sha256').update(pubKey).digest('hex')
        const URL = "https://explorer.ssv.network/operators/" + hash
        return URL
    }

    async setGraffitis(graffiti){
        let services = await this.serviceManager.readServiceConfigurations()
        let validators = await services.filter(service => {
            if(
                service.service.includes("Teku") ||
                service.service.includes("Nimbus") ||
                service.service.includes("Validator")
            ){
                return true
            }
            return false
        })

        for(let client of validators){
            let service = (client.service.replace(/(Beacon|Validator|Service)/gm, '')).toLowerCase()

            const graffitiVolume = (client.volumes.find(vol => vol.servicePath === '/opt/app/graffitis'))
            let graffitiDir = ""
            if(graffitiVolume)
                graffitiDir = graffitiVolume.destinationPath + '/graffitis.yaml'
            let config = ""
            switch (service) {
                case "lighthouse":
                    config = `default: ${graffiti}`
                    await this.nodeConnection.sshService.exec('echo ' + StringUtils.escapeStringForShell(config) + ' > ' + graffitiDir)
                    break;

                case "prysm":
                    config = `default: "${graffiti}"`
                    await this.nodeConnection.sshService.exec('echo ' + StringUtils.escapeStringForShell(config) + ' > ' + graffitiDir)
                    break;

                case "nimbus":
                    //Nimbus only supports Graffiti changes while running via their rest api
                    let command = client.command.find(c => c.includes("--rest-port="))
                    let port = command.replace("--rest-port=", "")
                    config = `curl -s -X POST http://localhost:${port}/nimbus/v1/graffiti -H  "Content-Type: text/plain" -d "${graffiti}"`
                    await this.nodeConnection.sshService.exec(config)
                    break;

                case "teku":
                    config = graffiti
                    await this.nodeConnection.sshService.exec('echo ' + StringUtils.escapeStringForShell(config) + ' > ' + graffitiDir)
                    break;

                default:
                    break;
            }
        }
    }

    async writeKeys(keys){
        let obj = keys
        if(Array.isArray(keys)){
            obj = {}
            const existing = await this.readKeys()
            keys.forEach(key => {
                if(existing && existing[key]){
                    obj[key] = existing[key]
                }else{
                    obj[key] = ""
                }
            })
        }
        await this.nodeConnection.sshService.exec("echo -e " + StringUtils.escapeStringForShell(YAML.stringify(obj)) + " > /etc/stereum/keys.yaml")
    }

    async readKeys(){
        const result = await this.nodeConnection.sshService.exec('cat /etc/stereum/keys.yaml')
        if(result.rc ==  0)
            return YAML.parse(result.stdout)
        log.error(result.stderr)
        return undefined
    }

}