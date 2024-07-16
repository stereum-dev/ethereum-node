<template>
  <div class="col-start-1 col-span-full row-start-1 row-span-full grid grid-cols-24 grid-rows-12">
    <VerifyHeader />
    <VerifyBody />
    <VerifyFooter @start-installing="runInstalltion" />
  </div>
</template>
<script setup>
import VerifyHeader from "../components/verify/VerifyHeader.vue";
import VerifyBody from "../components/verify/VerifyBody.vue";
import VerifyFooter from "../components/verify/VerifyFooter.vue";
import { useNodeHeader } from "@/store/nodeHeader";
import ControlService from "@/store/ControlService";
import { useClickInstall } from "@/store/clickInstallation";
import { useRouter } from "vue-router";

const router = useRouter();
const installStore = useClickInstall();
const headerStore = useNodeHeader();

const runInstalltion = async () => {
  router.push("/oneClick/play");
  try {
    headerStore.refresh = false;
    await ControlService.prepareOneClickInstallation(installStore.installationPath);
    const restarted = await ControlService.restartServer();
    headerStore.refresh = true;
    if (restarted) await new Promise((resolve) => setTimeout(resolve, 5000));
    await ControlService.writeOneClickConfiguration({
      services: installStore.selectedPreset.includedPlugins,
      checkpointURL: installStore.checkPointSync,
      relayURL: installStore.relayURL,
      selectedPreset: installStore.selectedPreset.name,
    });
    installStore.startServicesAfterInstall ? await ControlService.startOneClickServices() : null;

    router.push("/node");
  } catch (err) {
    console.log("Installation Failed: ", err);
    await ControlService.clearTasks();
    await ControlService.destroy();

    loggingOut();
  }
};

const loggingOut = async () => {
  try {
    await ControlService.stopShell();
    await ControlService.logout();
  } catch (e) {}
  router.push("/login").then(() => {
    // do we really need this reaload here?
    // it destroys the error message in the console if the installation failed
    //location.reload();
  });
};
</script>
