<template>
  <div class="connected-val-parent flex w-full h-full flex-col p-1">
    <div class="val-box flex flex-col w-full h-5/6 justify-start items-center gap-2 p-1">
      <!-- Consensus Client Section -->
      <div class="client-type w-full h-1/2 flex">
        <span class="w-1/2 h-full flex justify-start items-center text-gray-200 font-semibold uppercase text-2xs"> CONSENSUS CLIENT </span>
        <div class="icon-bar h-full w-6 flex justify-center items-center">
          <img
            v-if="setupStore.relatedValidatorPairs?.pairs[0]?.consensusService.icon"
            class="w-5 h-5"
            :src="setupStore.relatedValidatorPairs?.pairs[0]?.consensusService.icon || '/path/to/default-icon.png'"
            alt=""
          />
        </div>
        <span class="client-name w-24 text-gray-200 uppercase text-[50%] flex justify-start items-center pl-2">
          {{ setupStore.relatedValidatorPairs?.pairs[0]?.consensusService.name || "No Client" }}
        </span>
      </div>

      <!-- Execution Client Section -->
      <div class="client-type w-full h-1/2 flex">
        <span class="w-1/2 h-full flex justify-start items-center text-gray-200 font-semibold uppercase text-2xs"> EXECUTION CLIENT </span>
        <div class="icon-bar h-full w-6 flex justify-center items-center">
          <img
            v-if="setupStore.relatedValidatorPairs?.pairs[0]?.executionService.icon"
            class="w-5 h-5"
            :src="setupStore.relatedValidatorPairs?.pairs[0]?.executionService.icon || '/path/to/default-icon.png'"
            alt=""
          />
        </div>
        <span class="client-name w-24 text-gray-200 uppercase text-[50%] flex justify-start items-center pl-2">
          {{ setupStore.relatedValidatorPairs?.pairs[0]?.executionService.name || "No Client" }}
        </span>
      </div>
    </div>
    <div class="widget-name flex w-full h-1/6 justify-center items-center uppercase text-gray-200 text-[50%] font-semibold">
      CONNECTED CLIENT PAIR
    </div>
  </div>
</template>

<script setup>
import { useSetups } from "@/store/setups";

const setupStore = useSetups();
</script>

<style scoped></style>
