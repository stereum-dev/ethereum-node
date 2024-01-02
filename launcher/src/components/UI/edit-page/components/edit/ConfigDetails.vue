<template>
  <div class="col-start-4 col-end-7 h-[55px] grid grid-cols-3 grid-rows-2 gap-1 justify-center items-center">
    <button
      v-if="showAddButton"
      class="w-full h-full rounded-md col-start-1 row-start-1 row-span-2 text-xs text-gray-100 p-1 shadow-md shadow-gray-800 border border-gray-500 font-semibold bg-[#264744]"
      :class="{
        'cursor-not-allowed bg-[#38504e] border-none opacity-25': buttonDisabled,
        ' cursor-pointer': !buttonDisabled,
      }"
      :disabled="buttonDisabled"
    >
      Add Config
    </button>
    <div
      v-for="config in list"
      :key="config.id"
      class="col-span-1 row-span-1 w-full h-full border border-gray-600 rounded-md flex justify-evenly items-center bg-[#151618] cursor-pointer"
    >
      <span
        class="text-[12px] text-left text-gray-100 overflow-hidden whitespace-pre"
        :class="{ 'text-gray-500 cursor-not-allowed': !config.status }"
      >
        {{ config.configName }}<span class="text-[12px] font-semibold ml-1">{{ config.id }}</span>
      </span>
    </div>
  </div>
</template>
<script setup>
import { useRoute } from "vue-router";
import { watchEffect, ref } from "vue";

const { list } = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
  button: {
    type: Boolean,
    default: false,
  },
  status: {
    type: Boolean,
    default: false,
  },
});
const showAddButton = ref(false);
const buttonDisabled = ref(true);
const route = useRoute();

watchEffect(() => {
  if (route.path === "/edit") {
    showAddButton.value = true;
  } else {
    showAddButton.value = false;
  }
});
</script>
<style scoped></style>
