<template>
  <div class="w-full mt-4 mx-auto px-4">
    <div
      class="w-full h-[240px] bg-[#101111] rounded-md overflow-y-auto overflow-x-hidden p-2"
    >
      <!-- Genesis Config Section -->
      <div class="w-full mb-4">
        <h3 class="text-yellow-500 font-bold text-sm uppercase mb-2">Config</h3>
        <div
          v-for="(value, key) in genesisConfig.config"
          :key="key"
          class="flex items-center justify-between w-full py-2 border-b border-gray-700 space-x-4"
        >
          <div class="flex items-center">
            <img
              src="/img/icon/edit-node-icons/setting.png"
              alt="Gear Icon"
              class="w-5 h-5 mr-2"
            />
            <span class="text-sm text-gray-300 font-semibold">{{
              formatLabel(key)
            }}</span>
          </div>
          <div class="text-right">
            <span class="text-sm font-semibold text-gray-300 truncate overflow-x-auto">{{
              typeof value === "object" && value !== null ? "Object" : value
            }}</span>
          </div>
        </div>
      </div>

      <!-- Allocations Section -->
      <div class="w-full mb-4">
        <h3 class="text-yellow-500 font-bold text-sm uppercase mb-2">Allocations</h3>
        <div
          v-for="(alloc, address) in genesisAlloc"
          :key="address"
          class="flex items-center justify-between w-full py-2 border-b border-gray-700 space-x-2"
        >
          <div class="flex items-center">
            <img
              src="/img/icon/edit-node-icons/setting.png"
              alt="Gear Icon"
              class="w-5 h-5 mr-2"
            />
            <span class="text-sm text-gray-300 font-semibold truncate overflow-x-auto">{{
              address
            }}</span>
          </div>
          <div class="text-right truncate overflow-x-auto">
            <span class="text-sm font-semibold text-gray-300"> {{ alloc.balance }}</span>
          </div>
        </div>
      </div>

      <!-- Other Fields  -->
      <div class="w-full mb-4">
        <h3 class="text-yellow-500 font-bold text-sm uppercase mb-2">Other Fields</h3>
        <div
          v-for="(value, key) in otherGenesisFields"
          :key="key"
          class="flex items-center justify-between w-full py-2 border-b border-gray-700 space-x-2"
        >
          <div class="w-2/6 flex items-center">
            <img
              src="/img/icon/edit-node-icons/setting.png"
              alt="Gear Icon"
              class="w-5 h-5 mr-2"
            />
            <span class="text-sm text-gray-300 font-semibold">{{
              formatLabel(key)
            }}</span>
          </div>
          <div class="w-4/6 max-w-[300px] text-right truncate">
            <span class="text-sm font-semibold text-gray-300 truncate overflow-x-auto">{{
              value
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGenesis } from "@/store/genesis"; // Adjust the path to your store
import { computed } from "vue";
import { useSetups } from "../../../../../../../store/setups";

const genesisStore = useGenesis();
const setupStore = useSetups();

// get the config
const genesisConfig = computed(() => {
  let config;
  if (setupStore.uploadedGenesisConfig) {
    config = setupStore.uploadedGenesisConfig;
  } else {
    config = genesisStore.genesis;
  }
  return config;
});

// get the alloc
const genesisAlloc = computed(() => genesisConfig.value.alloc);

// other fields
const otherGenesisFields = computed(() => {
  // eslint-disable-next-line no-unused-vars
  const { config, alloc, ...rest } = genesisConfig.value;
  return rest;
});

const formatLabel = (key) => {
  return key.replace(/([A-Z])/g, " $1").toUpperCase();
};
</script>
