<template>
  <div
    class="grid-col-1 col-span-1 relative w-full h-full flex justify-center items-center box-border"
    @pointerdown.prevent.stop
    @mousedown.prevent.stop
  >
    <div
      class="w-[178px] h-[16px] absolute top-[-18px] -left-[1px] rounded-r-full pl-2 flex justify-between items-center text-white text-[10px] font-mono font-medium capitalize bg-[#264744]"
    >
      <span> {{ client.name }}</span>

      <span :class="clientStatus"></span>
    </div>
    <div class="flex flex-col gap-2">
      <img class="w-10" :src="client.sIcon" alt="icon" />
      <div v-if="client.category !== 'validator'" class="h-1/3 flex justify-evenly items-center">
        <img class="w-4" src="/img/icon/arrows/SynchronisationIconActive.gif" alt="icon" />
        <span class="text-xs text-gray-100">99%</span>
      </div>
      <div v-else class="h-1/3 flex justify-center items-center">
        <img class="w-5" src="/img/icon/node-icons/key.png" alt="icon" />
        <span class="text-md font-semibold" :class="client.state === 'running' ? 'text-green-500' : 'text-red-600 '">{{
          getKeyNumbers
        }}</span>
      </div>
    </div>

    <div
      v-if="getConnectedMevboost?.config.serviceID === client.config.serviceID"
      class="h-1/3 flex justify-evenly items-center absolute -start-3 -bottom-3"
    >
      <img class="w-8" src="/img/icon/plugin-icons/Other/mev-sIcon.png" alt="icon" />
    </div>
  </div>
</template>
<script setup>
import { useStakingStore } from "@/store/theStaking";
import { computed } from "vue";
import { useServices } from "@/store/services";

const { client } = defineProps({
  client: Object,
});

// const syncItemsShow = ref(false);
// const syncIcoUnknown = ref(true);
// const syncIcoSituation = ref(false);
// const syncIcoError = ref(false);
// const syncIco = ref([
//   {
//     id: 1,
//     name: "error",
//     icon: "/img/icon/arrows/SynchronisationIconError.gif",
//   },
//   {
//     id: 2,
//     name: "active",
//     icon: "/img/icon/arrows/SynchronisationIconActive.gif",
//   },
//   {
//     id: 3,
//     name: "synched",
//     icon: "/img/icon/arrows/SynchronisationIconSynchronized.gif",
//   },
//   {
//     id: 4,
//     name: "unknown",
//     icon: "/img/icon/arrows/SynchronisationIconUnknown.gif",
//   },
// ]);

const stakingStore = useStakingStore();
const serviceStore = useServices();

const clientStatus = computed(() => {
  if (client.state === "running") {
    return "w-5 h-[16px] bg-green-500 border border-green-500 rounded-r-full";
  } else if (client.state === "restarting") {
    return "w-5 h-[16px] bg-orange-500 border border-orange-500 rounded-r-full";
  }
  return "w-5 h-[16px] bg-red-600 border border-red-600 rounded-r-full";
});

const getKeyNumbers = computed(() => {
  return stakingStore.keys.length;
});

const getConnectedMevboost = computed(() => {
  let connectedMevboost;
  connectedMevboost = serviceStore.installedServices
    .filter((e) => e.category == "consensus")
    .find((e) => e.config.dependencies.mevboost[0]);
  return connectedMevboost;
});
</script>
