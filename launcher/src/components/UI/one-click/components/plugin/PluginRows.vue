<template>
  <div
    class="col-start-1 col-end-7 row-start-2 row-span-full border border-gray-600 rounded-md bg-[#14171a] p-2 overflow-x-hidden overflow-y-auto space-y-4"
  >
    <!-- Eth Setup Group -->
    <div v-if="groupedPlugins.ethSetup.length > 0" class="space-y-2">
      <div class="flex items-center px-2">
        <div class="h-px flex-1 bg-gray-700"></div>
        <span class="px-4 text-sm text-gray-300">Eth Setup</span>
        <div class="h-px flex-1 bg-gray-700"></div>
      </div>
      <plugin-item
        v-for="plugin in groupedPlugins.ethSetup"
        :key="plugin.id"
        :plugin="plugin"
        @plugin-click="pluginExchange(plugin)"
      >
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
      </plugin-item>
    </div>

    <!-- Optimism Group -->
    <div v-if="groupedPlugins.optimism.length > 0" class="space-y-2">
      <div class="flex items-center px-2">
        <div class="h-px flex-1 bg-gray-700"></div>
        <span class="px-4 text-sm text-gray-300">Optimism</span>
        <div class="h-px flex-1 bg-gray-700"></div>
      </div>
      <plugin-item
        v-for="plugin in groupedPlugins.optimism"
        :key="plugin.id"
        :plugin="plugin"
        @plugin-click="pluginExchange(plugin)"
      >
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
      </plugin-item>
    </div>

    <!-- Server Services Group -->
    <div v-if="groupedPlugins.serverServices.length > 0" class="space-y-2">
      <div class="flex items-center px-2">
        <div class="h-px flex-1 bg-gray-700"></div>
        <span class="px-4 text-sm text-gray-300">Server Services</span>
        <div class="h-px flex-1 bg-gray-700"></div>
      </div>
      <plugin-item
        v-for="plugin in groupedPlugins.serverServices"
        :key="plugin.id"
        :plugin="plugin"
        @plugin-click="pluginExchange(plugin)"
      >
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
      </plugin-item>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import ChangeModal from "../modals/ChangeModal.vue";
import PluginItem from "./PluginItem.vue";
import { useServices } from "@/store/services";
import { useClickInstall } from "@/store/clickInstallation";

const props = defineProps({
  filteredPlugin: Array,
});

const emit = defineEmits(["changeHandler", "pluginExchange"]);

const clickStore = useClickInstall();
const serviceStore = useServices();

const groupedPlugins = computed(() => {
  const plugins = clickStore.selectedPreset?.includedPlugins || [];

  return {
    serverServices: plugins.filter((p) => p.category === "service"),
    optimism: plugins.filter(
      (p) => p.name.toLowerCase().includes("op") || p.name.toLowerCase().includes("l2")
    ),
    ethSetup: plugins.filter(
      (p) =>
        p.category !== "service" &&
        !p.name.toLowerCase().includes("op") &&
        !p.name.toLowerCase().includes("l2")
    ),
  };
});

const existingPluginsToReplace = computed(() => {
  return props.filteredPlugin.filter((i) => {
    return (
      i.service !== "ExternalExecutionService" && i.service !== "ExternalConsensusService"
    );
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
