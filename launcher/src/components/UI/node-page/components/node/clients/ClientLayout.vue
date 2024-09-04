<template>
  <div
    class="grid-col-1 col-span-1 relative w-full h-full flex justify-center items-center box-border"
    style="cursor: default"
    @pointerdown.prevent.stop
    @mousedown.prevent.stop
    @mouseenter="footerStore.cursorLocation = `${props.client.name} ${clientClient}`"
    @mouseleave="footerStore.cursorLocation = ''"
  >
    <div
      class="w-[178px] h-[16px] absolute top-[-18px] -left-[1px] rounded-r-full pl-2 flex justify-between items-center text-[10px] font-semibold capitalize"
      :class="[setupStore.getBGColor(setupStore.selectedSetup?.color), setupStore.getTextColor(setupStore.selectedSetup?.color)]"
    >
      <span> {{ props.client.name }}</span>

      <span :class="clientStatus"></span>
    </div>
    <div class="flex flex-col gap-2">
      <img class="w-10" :src="props.client.sIcon" alt="icon" />
      <div
        v-if="props.client.category !== 'validator'"
        class="h-1/3 flex justify-evenly items-center"
        @mouseenter="footerStore.cursorLocation = `${syncStatusPer} ${syncPercent}`"
        @mouseleave="footerStore.cursorLocation = ''"
      >
        <img class="w-4" :src="syncIcon" alt="icon" />
        <span class="text-xs text-gray-100">{{ syncPercent }}</span>
      </div>
      <div
        v-else
        class="h-1/3 flex justify-center items-center"
        @mouseenter="footerStore.cursorLocation = ` ${getKeyNumbers} ${keyMsg}`"
        @mouseleave="footerStore.cursorLocation = ''"
      >
        <img class="w-5" src="/img/icon/node-page-icons/validator-key-icon.png" alt="icon" />
        <span class="text-md font-semibold" :class="props.client.state === 'running' ? 'text-green-500' : 'text-red-600 '">{{
          getKeyNumbers
        }}</span>
      </div>
    </div>

    <div
      v-if="getConnectedMevboost?.config.serviceID === props.client.config.serviceID"
      class="flex justify-evenly items-center absolute -bottom-2 -right-24"
    >
      <img class="w-5" src="/img/icon/service-icons/Other/mev-sIcon.png" alt="icon" />
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted } from "vue";
import { useServices } from "@/store/services";
import { useControlStore } from "@/store/theControl";
import { useDeepClone } from "@/composables/utils";
import { ref } from "vue";
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";
import { useSetups } from "../../../../../../store/setups";

const t = i18n.global.t;

const clientClient = t("clientLay.client");
const keyMsg = t("clientLay.keyMsg");
const syncStatusPer = t("clientLay.syncStatus");

const footerStore = useFooter();

const props = defineProps({
  client: Object,
});

const serviceStore = useServices();
const controlStore = useControlStore();
const setupStore = useSetups();

const syncPercent = ref("-");
const refreshSync = ref(null);

const syncIcons = ref([
  {
    id: 1,
    name: "error",
    icon: "/animation/synchronisation/synchronisation-icon-error.gif",
  },
  {
    id: 2,
    name: "active",
    icon: "/animation/synchronisation/synchronisation-icon-active.gif",
  },
  {
    id: 3,
    name: "synched",
    icon: "/animation/synchronisation/synchronisation-icon-sucess.gif",
  },
  {
    id: 4,
    name: "unknown",
    icon: "/animation/synchronisation/synchronisation-icon-unknown.gif",
  },
]);

const syncIcon = ref(syncIcons.value[3].icon);

//Computed

//Lifecycle hooks

onMounted(() => {
  if (props.client.category !== "validator") {
    getPercent();
    refreshSync.value = setInterval(() => {
      getPercent();
    }, 10000);
  }
});

onUnmounted(() => {
  if (props?.client?.category !== "validator") {
    clearInterval(refreshSync.value);
  }
});

//Methods

const getPercent = () => {
  const syncResult = useDeepClone(controlStore.syncstatus);
  if (syncResult?.code === 0) {
    const flatArray = syncResult.data.flat();
    let data = flatArray.find((e) => e.title.toLowerCase() === props.client.name.toLowerCase());

    if (data) {
      const lo = parseInt(data.frstVal);
      const hi = parseInt(data.scndVal);
      const percent = Math.floor((parseInt(lo) / parseInt(hi)) * 100);

      if (isNaN(percent)) {
        syncPercent.value = "-";
      } else {
        syncPercent.value = percent + "%";
      }

      if (lo > hi) {
        //fonts.orange.push(k);
        syncIcon.value = syncIcons.value[0].icon;
        controlStore.synchronizationError = true;
        return;
      }
      if (lo < 1 && hi < 1) {
        //fonts.grey.push(k);
        syncIcon.value = syncIcons.value[3].icon;
        controlStore.synchronizationError = false;
        return;
      }
      if (lo < hi) {
        //fonts.blue.push(k);
        syncIcon.value = syncIcons.value[1].icon;
        controlStore.synchronizationError = false;
        return;
      }
      if (lo == hi) {
        //fonts.green.push(k);
        syncIcon.value = syncIcons.value[2].icon;
        controlStore.synchronizationError = false;
        return;
      }
    }
  }
  syncPercent.value = "-";
};

const clientStatus = computed(() => {
  if (props.client.state === "running") {
    return "w-5 h-[16px] bg-green-500 border border-green-500 rounded-r-full";
  } else if (props.client.state === "restarting") {
    return "w-5 h-[16px] bg-orange-500 border border-orange-500 rounded-r-full";
  } else if (props.client.service === "ExternalExecutionService" || props.client.service === "ExternalConsensusService") {
    return "w-5 h-[16px] bg-gray-400 border border-gray-400 rounded-r-full";
  }
  return "w-5 h-[16px] bg-red-600 border border-red-600 rounded-r-full";
});

const getKeyNumbers = computed(() => {
  return props.client?.config?.keys?.length ? props.client.config.keys.length : 0;
});

const getConnectedMevboost = computed(() => {
  let connectedMevboost;
  connectedMevboost = serviceStore.installedServices
    .filter((e) => e.category == "consensus")
    .find((e) => e.config.dependencies.mevboost[0]);
  return connectedMevboost;
});
</script>
