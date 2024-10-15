import { onMounted, watch, onUnmounted, ref } from 'vue';
<template>
  <div class="w-full h-full flex flex-col justify-evenly items-center mx-auto px-4 py-2 space-y-2 mt-6 relative">
    <div class="w-full flex justify-center items-center">
      <div class="w-full grid grid-cols-12 items-center text-md">
        <img class="col-start-1 w-8" src="/img/icon/edit-node-icons/service-save-path.png" alt="Path Icon" />
        <span class="col-start-2 col-span-3 text-gray-400 text-left">{{ $t("editModals.installationPath") }}</span>
        <input
          v-model="props.properties.installDir"
          class="col-start-6 col-span-7 min-h-[30px] border border-gray-500 px-2 py-1 text-left text-gray-400 text-xs rounded bg-[#141516] focus:border-teal-500"
          type="text"
          autofocus
        />
      </div>
    </div>
    <div
      v-if="client.category === 'consensus' && client.service !== 'ExternalConsensusService'"
      class="w-full flex justify-center items-center"
    >
      <div class="w-full grid grid-cols-12 items-center text-md">
        <img class="w-8 col-start-1" src="/animation/synchronisation/synchronisation-icon-active.gif" alt="Sync Icon" />
        <span class="col-start-2 col-span-3 text-gray-400 text-md text-left">{{ $t("editModals.syncMode") }}</span>
        <SyncCarousel :cat="client.category" />
      </div>
    </div>

    <div
      v-if="props.client.service === 'ExternalExecutionService' || props.client.service === 'ExternalConsensusService'"
      class="w-full flex justify-center items-center"
    >
      <div class="w-full grid grid-cols-12 items-center text-md">
        <img class="col-start-1 w-8" src="/img/icon/edit-node-icons/service-category.png" alt="Path Icon" />
        <span class="col-start-2 col-span-3 text-gray-400 text-md text-left">EXTERNAL SOURCE</span>

        <div
          class="col-start-6 col-span-full w-full relative bg-[#141516] border border-gray-500 rounded-md grid grid-cols-12 items-center"
          @click="dropdown"
        >
          <div class="col-start-1 col-span-full flex justify-center items-center overflow-hidden">
            <div class="w-3/4 px-2 py-1 text-sm text-gray-400 capitalize flex justify-start items-center space-x-4">
              <img v-if="selectedSource.icon ? selectedSource.icon : null" :src="selectedSource.icon" class="w-5" />
              <span>{{ selectedSource.name ? selectedSource.name : "Select Source" }}</span>
            </div>

            <button class="w-1/4 h-full p-1 text-gray-500 hover:text-gray-200 flex justify-end items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div
            v-if="isOpen"
            class="absolute top-8 left-0 z-10 mt-2 max-h-[160px] w-64 rounded-md bg-gray-700 shadow-lg overflow-x-hidden overflow-y-auto"
            @mouseleave="isOpen = false"
          >
            <div class="divide-y divide-gray-500">
              <div
                v-for="source in sources"
                :key="source"
                class="w-full flex justify-center items-center space-x-4 px-4 py-2 text-sm text-gray-300 hover:text-gray-100 hover:bg-blue-500 uppercase cursor-pointer"
                @click="pickSource(source)"
              >
                <img v-if="source.icon" :src="source.icon" class="w-6" />
                <span>{{ source.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="
        (props.client.service === 'ExternalExecutionService' || props.client.service === 'ExternalConsensusService') &&
        selectedSource.name === 'custom'
      "
      class="w-full flex justify-center items-center"
    >
      <div class="w-full grid grid-cols-12 items-center text-md">
        <img class="col-start-1 w-8" src="/img/icon/edit-node-icons/service-external-source.png" alt="Path Icon" />
        <span class="col-start-2 col-span-3 text-gray-400 text-left">ADDRESS</span>
        <input
          v-model="addressLink"
          class="col-start-6 col-span-7 min-h-[30px] border border-gray-500 px-2 py-1 text-left text-gray-400 text-xs rounded bg-[#141516] focus:border-teal-500"
          type="text"
          autofocus
        />
      </div>
    </div>

    <div
      v-if="client.service === 'ExternalExecutionService' && client.category == 'execution'"
      class="w-full flex justify-center items-center"
    >
      <div class="w-full grid grid-cols-12 items-center text-md">
        <img class="col-start-1 w-8" src="/img/icon/edit-node-icons/service-jwt-token-connection.png" alt="Path Icon" />
        <span class="col-start-2 col-span-3 text-gray-400 text-left">JWT TOKEN</span>
        <input
          v-model="jwtToken"
          class="col-start-6 col-span-7 min-h-[30px] border border-gray-500 px-2 py-1 text-left text-gray-400 text-xs rounded bg-[#141516] focus:border-teal-500"
          type="text"
          autofocus
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watchEffect } from "vue";
import SyncCarousel from "../edit/SyncCarousel";
import ControlService from "@/store/ControlService";
import { useNodeManage } from "@/store/nodeManage";

const props = defineProps({
  client: {
    type: Object,
    default: null,
  },
  properties: {
    type: Object,
    default: null,
  },
});

const manageStore = useNodeManage();
const addressLink = ref("");
const jwtToken = ref("");
const gateway = ref("");
const selectedSource = ref("");
const isOpen = ref(false);
const sources = [
  { name: "custom", icon: null },
  { name: "stereumplus 1", icon: "/img/icon/stereumplus-icons/stereumplus-icon.png" },
  { name: "stereumplus 2", icon: "/img/icon/stereumplus-icons/stereumplus-icon.png" },
  { name: "stereumplus 3", icon: "/img/icon/stereumplus-icons/stereumplus-icon.png" },
];

//Computed & Watcher

//Replace Sources by a computed source like below then remove the source above
// const sources = computed(() => {
//   return logic to get source
// });

watchEffect(() => {
  props.client.config.source = selectedSource.value.name;
  props.client.config.address = addressLink.value;
  props.client.config.jwtToken = jwtToken.value;
});

//Lifecycle Hooks

onMounted(() => {
  addressLink.value = "";
  jwtToken.value = "";
  props.properties.installDir = "";
  gateway.value = "";
  selectedSource.value = "";
  getInstallPath();
});

//Methods

const dropdown = () => {
  isOpen.value = !isOpen.value;
};

const pickSource = (source) => {
  isOpen.value = false;
  selectedSource.value = source;
  manageStore.ExternalConsensusSelectedService = source;
};

const getInstallPath = async () => {
  let largestVolumePath = await ControlService.getLargestVolumePath();
  if (largestVolumePath === "/") largestVolumePath = largestVolumePath + "opt";
  const stereumInstallationPath = [largestVolumePath, "/stereum"].join("/").replace(/\/{2,}/, "/");
  props.properties.installDir = stereumInstallationPath;
};
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.4s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
}
</style>
