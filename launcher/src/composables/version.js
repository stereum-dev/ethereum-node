import ControlService from '@/store/ControlService'
import { useNodeHeader } from "@/store/nodeHeader";
import { useServices } from "@/store/services";
import { useBackendServices } from '@/composables/services';

export async function useUpdateCheck() {
    const serviceStore = useServices();
    const nodeHeaderStore = useNodeHeader();
    if (!nodeHeaderStore.updating) {
        nodeHeaderStore.searchingForUpdates = true;

        let services = await useBackendServices() //get configurations of all services in backend format

        // fetch all version information
        let versions = {}
        try {
            versions.latest = await ControlService.checkUpdates();
            versions.currentStereum = await ControlService.getCurrentStereumVersion();
            versions.currentLauncher = await ControlService.getCurrentLauncherVersion();

            serviceStore.versions = versions.latest;
            serviceStore.stereumVersion = versions.currentStereum;
            serviceStore.launcherVersion = versions.currentLauncher;
        } catch (err) {
            console.log("Couldn't fetch versions...\nError:", err.message);
        }
        nodeHeaderStore.isUpdateAvailable = false;

        //compare service versions
        let newAvailableUpdates = [];
        if (versions.latest && services?.length > 0) {
            services.forEach((service) => {
                if (!versions.latest[service.network] || !versions.latest[service.network][service.service]) service.network = "mainnet";
                if (!versions.latest[service.network] || !versions.latest[service.network][service.service]) service.network = "prater";
                if (versions.latest[service.network] && versions.latest[service.network][service.service]) {
                    if (service.service === "ErigonService" && !service.imageVersion.startsWith("v")) {
                        service.imageVersion = "v" + service.imageVersion;
                        service.imageVersion = service.imageVersion.replace("-arm64", "");
                    }
                    if (
                        service.imageVersion !=
                        versions.latest[service.network][service.service][versions.latest[service.network][service.service].length - 1]
                    ) {
                        nodeHeaderStore.isUpdateAvailable = true;
                        newAvailableUpdates.push({
                            id: service.id,
                            name: service.service.replace(/(Beacon|Validator|Service)/gm, ""),
                            version:
                                versions.latest[service.network][service.service][versions.latest[service.network][service.service].length - 1],
                        });
                        console.log("Service Update Available!");
                    }
                }
            });
        }
        serviceStore.newUpdates = newAvailableUpdates;

        //compare stereum versions
        if (versions.latest && versions.currentStereum) {
            if (versions.currentStereum != versions.latest.stereum[versions.latest.stereum.length - 1].commit) {
                nodeHeaderStore.isUpdateAvailable = true;
                console.log("Stereum Update Available!");
            }

            const currentVersion = versions.latest.stereum.find((v) => v.commit === versions.currentStereum);
            nodeHeaderStore.stereumUpdate = {
                commit: versions.latest.stereum[versions.latest.stereum.length - 1].commit,
                name: "Stereum",
                version: versions.latest.stereum[versions.latest.stereum.length - 1].name,
                current: currentVersion ? currentVersion.name : "-",
                current_commit: currentVersion ? currentVersion.commit : "-",
            };
        }

        nodeHeaderStore.searchingForUpdates = false;
    }
}

