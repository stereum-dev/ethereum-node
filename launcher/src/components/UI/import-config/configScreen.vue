<template>
  <installation-layout>
    <div class="col-start-1 col-span-full row-start-1 row-span-1 p-1 bg-[#264744] rounded-t-md flex justify-center items-center">
      <span class="text-xl font-bold text-gray-200 uppercase tracking-wider">Config Import </span>
    </div>
    <ImportHeader v-if="router.currentRoute.value.fullPath !== '/config/upload' && router.currentRoute.value.fullPath !== '/config/play'" />
    <component :is="currentStepComponent" @install-handler="installHandler"></component>
    <ImportFooter v-if="router.currentRoute.value.fullPath !== '/config/play'" @run-installer="installHandler" />
  </installation-layout>
</template>
<script setup>
import UploadConfig from "./components/UploadConfig.vue";
import ImportingSyncing from "./components/ImportingSyncing.vue";
import ImportingList from "./components/ImportingList.vue";
import ImportingVerify from "./components/ImportingVerify.vue";
import ImportingAnimation from "./components/ImportingAnimation.vue";
import ImportFooter from "./components/footer/ImportFooter.vue";
import ImportHeader from "./components/header/ImportHeader.vue";
import ControlService from "@/store/ControlService";
import { useClickInstall } from "@/store/clickInstallation";
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const installStore = useClickInstall();

const components = [
  {
    path: "/config/upload",
    component: UploadConfig,
  },
  {
    path: "/config/list",
    component: ImportingList,
  },

  {
    path: "/config/sync",
    component: ImportingSyncing,
  },

  {
    path: "/config/verify",
    component: ImportingVerify,
  },
  {
    path: "/config/play",
    component: ImportingAnimation,
  },
];

const currentStepComponent = computed(() => {
  let current;
  components.forEach((step) => {
    if (step.path === router.currentRoute.value.fullPath) {
      current = step.component;
    }
  });
  return current;
});

const installHandler = async () => {
  router.push({ path: "/config/play" });

  try {
    const configData = {
      configServices: JSON.parse(JSON.stringify(installStore.configServices)),
      removedServices: JSON.parse(JSON.stringify(installStore.removedServices)),
      checkPointSync: installStore.checkPointSync,
    };

    await ControlService.importConfig(configData);

    router.push({ path: "/node" });
  } catch (error) {
    console.log(error);
    router.push({ path: "/config/verify" });
  }
};
</script>
