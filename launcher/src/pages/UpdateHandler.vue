<template>
  <div class="update-parent rounded-lg w-full h-full flex flex-col justify-center items-center bg-[#336666]">
    <div class="update-page-title w-full h-1/6 flex justify-center items-center text-gray-50 text-3xl font-semibold">
      <span>{{ t("updateModal.updateTo", { version: updateState.version }) }} </span>
    </div>
    <div class="loading-icon w-full flex justify-center items-center h-3/6">
      <img src="/animation/launcher-update/update-loading.gif" class="w-2/4 mt-40" />
    </div>

    <div class="progressbar-box flex justify-center items-center w-full h-1/6">
      <div v-if="updateState.state === 'downloading'" id="progressbar" class="w-full">
        <div :style="{ width: updateState.percent }"></div>
      </div>
    </div>
    <div class="update-text h-1/6 w-full flex justify-center items-center text-2xl text-gray-50 font-semibold">
      <span>{{ `${updateState.message}${updateState.MBps ? "" + updateState.MBps.toFixed(2) + " MBps" : ""}` }}</span>
    </div>
    <UpdateModal v-if="updateModel" :version="serviceStore?.launcherVersion" @update="runUpdate" @close-window="closeUpdateModal" />
  </div>
</template>
<script setup>
import UpdateModal from "../components/UI/server-management/components/modals/UpdateModal.vue";
import ControlService from "@/store/ControlService";
import { ref, onMounted, onUnmounted } from "vue";
import { useServices } from "@/store/services";
import i18n from "@/includes/i18n";
const t = i18n.global.t;

const updateState = ref({
  state: "",
  message: "Starting Update...",
  MBps: 0,
  percent: "0%",
  version: "-",
});

const serviceStore = useServices();
const updateModel = ref(true);

onMounted(() => {
  ControlService.getNewLauncherVersion().then((version) => {
    updateState.value.version = version;
  });
  ControlService.addListener("UpdateEvents", updateHandler);
});

onUnmounted(() => {
  ControlService.removeListener("UpdateEvents", updateHandler);
});

const closeUpdateModal = () => {
  updateModel.value = false;
  ControlService.ignoreUpdate();
};

const runUpdate = () => {
  updateModel.value = false;
  ControlService.updateLauncher();
};

const updateHandler = (event, data) => {
  updateState.value.MBps = data.data?.MBps;
  updateState.value.percent = data.data?.percent + "%";
  updateState.value.state = data.type;
  updateState.value.message = data.message;
};
</script>
<style scoped>
#progressbar {
  width: 80%;
  background-color: black;
  border-radius: 13px;
  padding: 3px;
}

#progressbar > div {
  background-color: orange;
  height: 20px;
  border-radius: 10px;
  transition: all 1s linear;
  width: 10%;
}
</style>
