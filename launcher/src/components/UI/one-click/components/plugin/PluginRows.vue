<template>
  <div
    class="col-start-1 col-end-7 row-start-2 row-span-full border border-gray-600 rounded-md bg-[#14171a] p-2 overflow-x-hidden overflow-y-auto space-y-2 z-0"
  >
    <div
      v-for="(plugin, index) in clickStore.selectedPreset.includedPlugins"
      :key="index"
      class="w-full h-10 flex justify-start items-center bg-[#2c3136] rounded-md py-1 px-2 cursor-pointer hover:bg-[#3c434a] transition-all duration-300 ease-in-out relative"
      @click="pluginExchange(plugin)"
    >
      <img class="w-8 mr-2" :src="plugin.sIcon" alt="Client Icon" />
      <div class="w-full flex flex-col justify-center items-start">
        <span class="text-sm text-gray-300 font-semibold">{{ plugin.name }}</span>
        <span class="text-xs text-teal-500 font-normal"> {{ plugin.category }}</span>
      </div>
      <change-modal v-if="plugin.openReplaceModal" :client="plugin">
        <div
          v-for="(item, idx) in existingPluginsToReplace"
          :key="idx"
          class="col-span-1 w-9 h-9 flex justify-center items-center relative rounded-md p-1 justify-self-center self-center hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer active:scale-100"
          :class="item.replacePanel ? 'bg-teal-500' : 'bg-[#191c21]'"
          @mouseover="runningTooltip(item)"
          @mouseleave="item.displayTooltip = false"
          @click="changeHandler(plugin, item, idx)"
        >
          <img :src="item.icon" alt="icon" class="w-5" />
          <span
            class="absolute -bottom-8 -right-4 text-xs text-[#14171a] font-semibold bg-gray-300 rounded-md px-2 py-1 z-50"
            :class="item.displayTooltip ? 'block' : 'invisible'"
            >{{ item.name }}</span
          >
        </div>
      </change-modal>
    </div>
  </div>
</template>

<script setup>
import ChangeModal from "../modals/ChangeModal.vue";
import { useServices } from "@/store/services";
import { useClickInstall } from "@/store/clickInstallation";
import { computed } from "vue";

const props = defineProps({
  filteredPlugin: Array,
});

const emit = defineEmits(["changeHandler", "pluginExchange"]);

const clickStore = useClickInstall();
const serviceStore = useServices();

const existingPluginsToReplace = computed(() => {
  return props.filteredPlugin.filter((i) => {
    return i.service !== "ExternalExecutionService" && i.service !== "ExternalConsensusService";
  });
});

const runningTooltip = (el) => {
  serviceStore.allServices.filter((i) => {
    i.category === el.category && i.id == el.id;
    el.displayTooltip = true;
  });
};

const changeHandler = (plugin, item, idx) => {
  clickStore.selectedPreset.includedPlugins.forEach((i) => {
    i.replacePanel = false;
  });
  item.replacePanel = true;
  emit("changeHandler", plugin, item, idx);
};

const pluginExchange = (plugin) => {
  emit("pluginExchange", plugin);
};
</script>
