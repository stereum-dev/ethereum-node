<template>
  <div
    class="w-full h-full col-start-1 col-span-full row-start-1 row-span-full bg-[#1b1b1d] rounded-md grid grid-cols-12 grid-rows-12 p-2 pt-0 gap-y-2"
  >
    <div class="w-full h-full col-start-1 col-span-full row-start-1 row-span-1 flex justify-start items-center py-1">
      <span class="text-md font-semibold text-gray-300">{{ t("updateServer.opSysUpdate") }}</span>
    </div>
    <div class="w-full h-full col-start-1 col-span-full row-start-2 row-end-4 grid grid-cols-12 grid-rows-2 items-center gap-x-1">
      <div class="w-full h-full col-start-1 col-end-3 row-start-1 row-span-full flex justify-center items-center">
        <img class="w-full" src="/img/icon/control-page-icons/ubuntuIco.svg" />
      </div>
      <div class="w-full h-full col-start-3 col-end-10 row-start-1 row-span-1 flex justify-start items-center ml-2">
        <span class="text-lg font-semibold text-gray-400 uppercase">{{ t("updateServer.ubuntu") }}</span>
      </div>
      <!-- <div class="w-full h-full col-start-10 col-span-full row-start-1 row-span-1 flex justify-center items-center">
        <div
          v-if="serverStore.isMajorUpgradeButtonActive"
          class="w-full h-full bg-[#336666] rounded-sm max-h-6 shadow-md shadow-black hover:bg-teal-700 active:shadow-none hover:scale-105 transition-all duration-100 ease-in-out cursor-pointer active:scale-100 flex justify-center items-center text-xs font-normal font-sans text-gray-200 uppercase p-1"
          @click="runUpdateToNoble"
        >
          24.04 Update
        </div>
      </div> -->

      <div class="w-full h-full col-start-3 col-span-full row-start-2 row-span-1 ml-2 grid grid-cols-3 items-center">
        <span class="col-start-1 col-end-3 text-sm font-semibold text-gray-400 uppercase">{{ t("updateServer.opSysVersion") }}</span>
        <span class="col-start-3 col-span-full justify-self-center text-sm font-semibold text-amber-400 uppercase">{{
          osVersionCurrent
        }}</span>
      </div>
    </div>
    <div
      class="w-full h-full col-start-1 col-span-full row-start-4 row-span-full border-t border-gray-500 grid grid-cols-12 grid-rows-12 items-center p-1"
    >
      <div class="w-full h-full col-start-1 col-span-full row-start-1 row-span-2 grid grid-cols-6 items-center gap-x-2 px-1">
        <img
          v-if="searchingForUpdatablePackages"
          class="w-5 h-5 spinner self-center justify-self-center"
          src="/animation/loading/loading-circle.gif"
        />
        <div v-else class="w-full col-start-1 col-span-1 bg-red-700 rounded-sm flex justify-center item-center">
          <span class="text-sm font-semibold text-gray-300 text-center">{{ serverStore.numberOfUpdatablePackages }}</span>
        </div>

        <span class="col-start-2 col-span-full text-md font-semibold text-gray-300">{{ t("updateServer.availServerOsUpdate") }}</span>
      </div>

      <div
        class="w-full h-full max-h-[200px] col-start-1 col-span-full row-start-3 row-end-11 border border-gray-500 rounded-md flex flex-col justify-start items-center p-1 space-y-1 bg-black overflow-x-hidden overflow-y-auto"
      >
        <UpdateRow v-for="item in newUpdates" v-show="newUpdates.length > '0'" :key="item" :item="item" @update-package="updatePackage" />
      </div>
      <div class="col-start-1 col-span-full row-start-11 row-span-full w-full h-full grid grid-cols-12 py-2">
        <div class="w-full h-full col-start-1 col-end-6 flex justify-center items-center">
          <div
            class="w-full h-full flex justify-evenly items-center bg-[#4d7575] hover:bg-[#243535] rounded-sm active:scale-90 shadow-md shadow-black active:shadow-none transition-all duration-100 ease-in-out cursor-pointer"
            :class="{
              'opacity-40 pointer-events-none bg-[#3d4244] scale-95': serverStore.isUpdateProcessing || serverStore.isMajorUpgradeActive,
            }"
            @mouseenter="footerStore.cursorLocation = `${t('osUpdate.updateAll')} `"
            @mouseleave="footerStore.cursorLocation = ''"
            @click.prevent="updateAll"
          >
            <span class="text-gray-100 text-sm font-semibold uppercase">{{ t("updatePanel.all") }}</span>
            <img class="w-4" src="/img/icon/base-header-icons/update-modal-download.png" alt="icon" />
          </div>
        </div>
        <div class="w-full h-full col-start-7 col-span-full flex justify-center items-center p-1">
          <span class="text-gray-200 text-md font-semibold"
            >{{ t("updatePanel.auto") }} :
            <span class="text-md uppercase font-semibold" :class="onOff">{{ stereumApp.autoUpdate }}</span></span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import UpdateRow from "./UpdateRow.vue";
import ControlService from "@/store/ControlService";
import { ref, onMounted, computed, reactive, watchEffect } from "vue";
import { useServers } from "@/store/servers";
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";
import { useUpgradablePackages } from "@/composables/version.js";

const t = i18n.global.t;

const footerStore = useFooter();
const serverStore = useServers();
const { getUpgradablePackages } = useUpgradablePackages();

const osVersionCurrent = ref("");
const updateStatus = reactive({
  message: "",
  color: "",
});
const stereumApp = ref({
  current: "alpha",
  latest: "2.0",
  autoUpdate: "",
});

const searchingForUpdatablePackages = ref(false);

const newUpdates = computed(() => serverStore.upgradablePackages.value);
const onOff = computed(() => (stereumApp.value.autoUpdate == "on" ? "text-green-700" : "text-red-700"));

//Watchers

watchEffect(() => {
  if (osVersionCurrent.value.includes("24.04")) {
    serverStore.isMajorUpgradeButtonActive = false;
  } else {
    serverStore.isMajorUpgradeButtonActive = true;
  }
});

//Lifecycle
onMounted(async () => {
  searchingForUpdatablePackages.value = true;

  if (serverStore.numberOfUpdatablePackages === null || serverStore.upgradablePackages.value.length === 0) {
    await getUpgradablePackages();
  }

  await getOsVersion();
  await getSettings();

  searchingForUpdatablePackages.value = false;
});

//Methods

/*const runUpdateToNoble = async () => {
  serverStore.isMajorUpgradeActive = true;
  await ControlService.upgradeToNoble();
  setTimeout(() => {
    serverStore.isMajorUpgradeButtonActive = false;
  }, 3000);
};*/

const getSettings = async () => {
  const settings = await ControlService.getStereumSettings();
  stereumApp.value.autoUpdate = settings.stereum?.settings.updates.unattended.install ? "on" : "off";
};

const getOsVersion = async () => {
  try {
    const osVersion = await ControlService.getCurrentOsVersion();
    osVersionCurrent.value = osVersion;
  } catch (error) {
    console.error("Failed to fetch OS version:", error);
  }
};

const updateAll = async () => {
  serverStore.isUpdateProcessing = true;
  try {
    await ControlService.updateOS();
    await getUpgradablePackages();

    updateStatus.message = "All packages updated successfully!";
    updateStatus.color = "text-green-500";
  } catch (error) {
    console.error("Failed to update all packages:", error);
    updateStatus.message = "Failed to update all packages.";
    updateStatus.color = "text-red-500";
  } finally {
    serverStore.isUpdateProcessing = false;
  }
};

const updatePackage = async (item) => {
  serverStore.isUpdateProcessing = true;
  const pkgName = item.packageName;

  updateUIWithInProgressMessage(pkgName);

  try {
    await ControlService.updatePackage([pkgName]);
    await getUpgradablePackages();

    updateStatus.message = `${pkgName} updated successfully.`;
    updateStatus.color = "text-green-500";
  } catch (error) {
    console.error(`Failed to update ${pkgName}:`, error);
    updateStatus.message = `Error occurred while updating ${pkgName}.`;
    updateStatus.color = "text-red-500";
  } finally {
    serverStore.isUpdateProcessing = false;
  }
};

// UI update functions
function updateUIWithInProgressMessage(packageName) {
  updateStatus.message = `Updating ${packageName}...`;
  updateStatus.color = "text-amber-400";
}
</script>
