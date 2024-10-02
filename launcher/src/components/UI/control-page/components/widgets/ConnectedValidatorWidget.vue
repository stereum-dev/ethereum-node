<template>
  <div class="connected-val-parent flex w-full h-full flex-col p-1">
    <div class="val-box flex w-full h-5/6 justify-start items-center gap-1">
      <!-- items start -->
      <div v-for="validator in setupStore.relatedValidators" :key="validator" class="val-client flex h-[90%] w-1/5 flex-col">
        <div class="icon-box w-full h-3/4 flex justify-center items-center mb-1">
          <img class="w-10 h-10" :src="validator.icon" :alt="validator.name" />
        </div>
        <div class="key-count w-full h-1/4 flex justify-center items-center">
          <div class="status-val h-2 w-2 flex rounded-lg" :class="validator.state == 'running' ? 'bg-green-500' : 'bg-red-500'" />
          <span class="w-3/4 h-full flex justify-center items-center font-semibold text-gray-200 text-xs">0</span>
        </div>
      </div>
      <!-- items end -->
    </div>
    <div class="widget-name flex w-full h-1/6 justify-center items-center uppercase text-gray-200 text-[50%] font-semibold">
      {{ $t("controlPage.connectValWidg") }}
    </div>
  </div>
</template>

<script setup>
import { useSetups } from "@/store/setups";
import { watch } from "vue";

const setupStore = useSetups();

watch(
  () => setupStore.relatedValidators,
  () => {
    console.log(setupStore.relatedValidators);
  }
);
</script>

<style scoped></style>
