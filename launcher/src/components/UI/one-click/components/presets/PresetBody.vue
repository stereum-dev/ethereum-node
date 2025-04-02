import { ref, onMounted, watch } from 'vue';
<template>
  <div class="w-full h-full col-start-1 col-span-full row-start-3 row-end-11 grid grid-cols-12 grid-rows-7 p-2 mx-auto">
    <div class="w-full h-full col-start-3 col-end-11 row-start-1 row-span-full bg-[#1E2429] rounded-md grid grid-cols-12 grid-rows-7 p-2">
      <div class="col-start-1 col-span-full row-start-1 row-span-1 flex justify-center items-center">
        <span class="text-center text-gray-200 text-sm uppercase">{{ $t("oneClick.chooseNetwork") }}</span>
      </div>
      <div class="col-start-1 col-span-full row-start-2 row-span-full grid grid-cols-12 grid-rows-7 pt-5">
        <div
          class="col-start-4 col-span-6 row-start-1 row-span-1 bg-gray-200 rounded-md grid grid-cols-6 cursor-pointer"
          @click="dropdownHandler"
        >
          <img
            v-if="displayItem?.icon"
            class="col-start-1 col-span-1 w-7 h-7 justify-self-center self-center"
            :src="displayItem?.icon"
            alt="Arrow icon"
          />
          <span class="col-start-2 col-end-6 justify-self-center self-center text-center text-gray-800 text-lg font-semibold">{{
            displayItem?.name ? displayItem?.name : displayItem
          }}</span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="col-start-6 col-span-1 justify-self-center self-center w-5 h-5 text-gray-900"
            :class="{ 'transform rotate-180': openDropdown }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-width="2" d="M5 10l7 7 7-7"></path>
          </svg>
        </div>
        <Transition name="slide-fade">
          <ul
            v-if="openDropdown"
            class="col-start-4 col-span-6 row-start-2 row-span-full transition-all max-h-[200px] duration-400 ease-in-out bg-gray-700 rounded-lg shadow-lg pb-1 w-full z-10 divide-y overflow-y-auto flex flex-col justify-start items-center mt-2"
          >
            <li
              v-for="item in manageStore.networkList"
              :key="item.name"
              class="w-full min-h-[40px] max-h-[40px] grid grid-cols-6 px-4 hover:bg-blue-400"
              :class="item?.state === 'disabled' ? 'pointer-events-none opacity-50' : ''"
              @click="getNetwork(item)"
            >
              <img class="h-[30px] col-start-1 col-end-2 self-center justify-self-center" :src="item.icon" alt="service Icon" />
              <span
                class="col-start-3 col-end-6 px-4 py-1 flex justify-start items-center outline-0 whitespace-nowrap cursor-pointer text-lg text-gray-200 font-semibold"
                >{{ item.name }}</span
              >
            </li>
          </ul>
        </Transition>
        <div
          class="col-start-1 col-span-full row-start-2 row-span-full py-4 px-8 grid grid-cols-6 grid-rows-3 overflow-x-hidden overflow-y-auto"
        >
          <div
            v-for="preset in clickStore.presets"
            :key="preset.name"
            class="col-span-1 row-span-1 justify-self-center self-center hover:border hover:border-teal-500 rounded-md hover:shadow-lg hover:shadow-[#050505] transition-all duration-300 ease-in-out active:scale-100 active:shadow-none cursor-pointer"
            :class="{
              hidden: !manageStore.currentNetwork?.support?.includes(preset.name) || !displayItem?.name,
            }"
            @click="getPreset(preset)"
          >
            <img
              class="w-16"
              :class="
                preset.selected
                  ? 'scale-125 border-2 border-blue-400 rounded-md hover:scale-125 shadow-xl shadow-[#101010] transition-all duration-300 ease-in-out'
                  : ''
              "
              :src="preset.icon"
              alt="Preset Icon"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useNodeManage } from "@/store/nodeManage";
import { useClickInstall } from "@/store/clickInstallation";
import { ref, onMounted, watch } from "vue";

const emit = defineEmits(["installPreset"]);
//Store
const manageStore = useNodeManage();
const clickStore = useClickInstall();

//Refs
let displayItem = ref(null);
const openDropdown = ref(false);

//watchers

watch(displayItem, () => {
  if (displayItem.value === "Click to select a network") {
    clickStore.selectedPreset = null;
  }
});

//Lifecycle

onMounted(() => {
  clickStore.installMonitoring = false;
  displayItem.value = "Click to select a network";
  clickStore.presets.forEach((p) => (p.selected = false));
});

//Methods
const dropdownHandler = () => {
  openDropdown.value = !openDropdown.value;
};

const getNetwork = (network) => {
  openDropdown.value = false;
  clickStore.presets.forEach((p) => (p.selected = false));
  manageStore.currentNetwork = network;
  clickStore.selectedNetwork = network;
  displayItem.value = network;
};

const getPreset = (preset) => {
  if (displayItem?.value.name) {
    clickStore.resetMevBoost = true;
    preset.selected = true;
    emit("installPreset", preset);
  }
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
