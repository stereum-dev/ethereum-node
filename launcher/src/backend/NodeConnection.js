import { SSHService } from "./SSHService";
import { StringUtils } from "./StringUtils";
import { NodeConnectionParams } from "./NodeConnectionParams";
import { nodeOS } from "./NodeOS";
import YAML from 'yaml';
import * as crypto from "crypto";
const log = require('electron-log');

export class NodeConnection {
    constructor(nodeConnectionParams) {
        this.sshService = new SSHService();
        this.nodeConnectionParams = nodeConnectionParams;
        this.os = null;
    }

    async establish() {
        await this.sshService.connect(this.nodeConnectionParams);
    }

    /**
     * identify the operating system of the connected node
     */
    async findOS() {
        const uname = await this.sshService.exec("sudo cat /etc/*-release");
        log.debug("result uname: ", uname);
        if (uname.rc == 0) {
            if (uname.stdout && uname.stdout.toLowerCase().search("centos") >= 0) {
                this.os = nodeOS.centos;
            } else if (uname.stdout && uname.stdout.toLowerCase().search("ubuntu") >= 0) {
                log.debug("setting ubuntu");
                this.os = nodeOS.ubuntu;
            }
        }
    }

    /**
     * read stereum settings and make them accessible
     */
    async findStereumSettings() {
        const stereumConfig = await this.sshService.exec("sudo cat /etc/stereum/stereum.yaml");

        if (stereumConfig.rc == 0) {
            this.settings = YAML.parse(stereumConfig.stdout);
        }
    }



    /**
     * Prepare a fresh server to run stereum services on it
     */
    async prepareStereumNode(installationDirectory) {
        return new Promise(async (resolve, reject) => {
            if (!this.os) {
                log.debug("os not found yet")
                await this.findOS();
            }

            /**
             * install necessary OS packages
             */
            log.info("installing necessary os packages");

            log.debug("this.os: ", this.os);
            log.debug("nodeOS.ubuntu: ", nodeOS.ubuntu);
            if (this.os == nodeOS.centos) {
                return reject("not implemented yet");
            } else if (this.os == nodeOS.ubuntu) {
                log.debug("procede on ubuntu")
                let installPkgResult;
                try {
                    installPkgResult = await this.sshService.exec(
                    `sudo apt update &&
                    sudo apt install -y pip ansible tar gzip wget`);
                } catch (err) {
                    log.error(err);
                    installPkgResult = {rc: 1, stderr: err};
                }
                if (SSHService.checkExecError(installPkgResult)) {
                    return reject("Can't install os packages: " + SSHService.extractExecError(installPkgResult));
                }
            } else {
                return reject("unsupported OS");
            }

            /**
             * install stereum ansible playbooks & roles
             */
            log.info("installing stereum ansible roles");

            let installResult;
            try {
                installResult = await this.sshService.exec(`
                sudo mkdir -p "` + installationDirectory + `/ansible" &&
                cd "` + installationDirectory + `/ansible" &&
                sudo git init &&
                sudo git remote add -f ethereum-node https://github.com/stereum-dev/ethereum-node.git &&
                sudo git config core.sparseCheckout true &&
                sudo echo 'controls' >> .git/info/sparse-checkout &&
                sudo git checkout stable
                `);
            } catch (err) {
                log.error("can't install ansible roles", err);
                return reject("Can't install ansible roles: " + err);
            }

            if (SSHService.checkExecError(installResult)) {
                return reject("Can't install ansible role: " + SSHService.extractExecError(installResult));
            }

            /**
             * run stereum ansible playbook "setup"
             */
            log.info("run stereum ansible playbook 'setup'");

            try {
                const playbookRun = await this.runPlaybook("setup");

                return resolve(playbookRun);
            } catch (err) {
                log.error("foo", err);
                reject("Can't run setup playbook: " + err);
            }
        });
    }

    /**
     * start a playbook
     */
    async runPlaybook(playbook, extraVars) {
        return new Promise(async (resolve, reject) => {
            if (!this.settings) {
                reject("Settings not loaded! Run findStereumSettings() first.");
            }

            log.info("starting playbook " + playbook + " with extra vars", extraVars);

            const playbookRunRef = crypto.randomUUID();

            log.info("using playbookRunRef: ", playbookRunRef);

            let extraVarsJson = "";
            if (extraVars) {
                extraVarsJson = JSON.stringify(extraVars);
            }

            let ansibleResult;
            try {
                ansibleResult = await this.sshService.exec(
                    `sudo\
                        ANSIBLE_STDOUT_CALLBACK=log_plays\
                        ANSIBLE_LOG_FOLDER=/tmp/` + playbookRunRef + `\
                        ansible-playbook\
                        --connection=local\
                        --inventory 127.0.0.1,\
                        --extra-vars ` + StringUtils.escapeStringForShell(extraVarsJson) + `\
                        playbook ` + this.settings.stereum.settings.controls_install_path + `/ansible/` + playbook + `.yaml\
                        `);
            } catch (err) {
                log.error("Can't run playbook '" + playbook + "'", err);
                return reject("Can't run playbook: " + err);
            }

            if (SSHService.checkExecError(ansibleResult)) {
                return reject("Failed running '" + playbook + "': " + SSHService.extractExecError(ansibleResult));
            }

            return resolve({
                playbook: playbook,
                playbookRunRef: playbookRunRef,
            });
        });
    }

    /**
     * get the logs of a playbook started via runPlayboook(...)
     */
    async playbookStatus(playbookRunRef) {
        return new Promise(async (resolve, reject) => {
            log.info("playbook status of ref ", playbookRunRef);

            let statusResult;
            try {
                statusResult = await this.sshService.exec("sudo cat /tmp/" + playbookRunRef + "/localhost");
            } catch (err) {
                log.error("Can't read playbook status '" + playbookRunRef + "'", err);
                return reject("Can't read playbook status '" + playbookRunRef + "': " + err);
            }

            if (SSHService.checkExecError(statusResult)) {
                return reject("Failed reading status of ref '" + playbookRunRef + "': " + SSHService.extractExecError(statusResult));
            }

            return resolve(statusResult.stdout);
        });
    }

    /**
     * list services configurations
     */
    async listServicesConfigurations() {
        return new Promise(async (resolve, reject) => {
            let services;
            try {
                services = await this.sshService.exec("sudo ls -1 /etc/stereum/services");
            } catch (err) {
                log.error("Can't read services configurations", err);
                return reject("Can't read services configurations: " + err);
            }

            if (SSHService.checkExecError(services)) {
                return reject("Failed reading services configurations: " + SSHService.extractExecError(services));
            }

            return resolve(services.stdout.split("\n").filter(i => i));
        });
    }

    /**
     * read a specific service configuration
     */
    async readServiceConfiguration(serviceId) {
        return new Promise(async (resolve, reject) => {
            let serviceConfig;
            try {
                const suffix = serviceId.endsWith(".yaml") ? "" : ".yaml";
                serviceConfig = await this.sshService.exec("sudo cat /etc/stereum/services/" + serviceId + suffix);
            } catch (err) {
                log.error("Can't read service configuration of " + serviceId, err);
                return reject("Can't read service configuration of " + serviceId + ": " + err);
            }

            if (SSHService.checkExecError(serviceConfig)) {
                return reject("Failed reading service configuration " + serviceId + ": " + SSHService.extractExecError(serviceConfig));
            }

            return resolve(YAML.parse(serviceConfig.stdout));
        });
    }

    /**
     * write a specific service configuration
     *
     * @param serviceConfiguration servicd configuration to write to the node
     */
    async writeServiceConfiguration(serviceConfiguration) {
        return new Promise(async (resolve, reject) => {
            let configStatus;
            try {
                configStatus = await this.sshService.exec(
                    `sudo echo -e ` + StringUtils.escapeStringForShell(YAML.stringify(serviceConfiguration)) + `
                    > /etc/stereum/services/` + serviceConfiguration.id + `.yaml`);
            } catch (err) {
                log.error("Can't write service configuration of " + serviceConfiguration.id, err);
                return reject("Can't write service configuration of " + serviceConfiguration.id + ": " + err);
            }

            if (SSHService.checkExecError(configStatus)) {
                return reject("Failed writing service configuration " + serviceConfiguration.id + ": " + SSHService.extractExecError(configStatus));
            }

            return resolve();
        });
    }

    /**
     * list docker services
     */
    async listServices() {
        return new Promise(async (resolve, reject) => {
            let serviceJsons;
            try {
                serviceJsons = await this.sshService.exec("docker ps --format '{{json .}}' --no-trunc");
            } catch (err) {
                log.error("Can't list services: ", err);
                return reject("Can't list services: " + err);
            }

            if (SSHService.checkExecError(serviceJsons)) {
                return reject("Failed listing services: " + SSHService.extractExecError(serviceJsons));
            }

            return resolve(serviceJsons.stdout.split(/\n/).map(json => {
                log.debug("parsing json: ", json);
                return JSON.parse(json);
            }));
        });
    }

    /**
     * get details of docker service
     *
     * @param serviceId either <docker-container-id> or <'stereum-' + stereum-service-id>
     */
    async getServiceDetails(serviceId) {
        return new Promise(async (resolve, reject) => {
            let serviceJson;
            try {
                serviceJson = await this.sshService.exec("docker inspect " + serviceId);
            } catch (err) {
                log.error("Can't get service details of '" + serviceId + "‘: ", err);
                return reject("Can't get service details of '" + serviceId + "': " + err);
            }

            if (SSHService.checkExecError(serviceJson)) {
                return reject("Failed getting service details of '" + serviceId + "': " + SSHService.extractExecError(serviceJson));
            }

            return resolve(JSON.parse(serviceJson.stdout));
        });
    }
}