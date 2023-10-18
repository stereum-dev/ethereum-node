<template>
  <div
    class="col-start-1 col-span-3 h-[55px] flex flex-col justify-between items-center border border-gray-600 rounded-md bg-[#151618]"
  >
    <div class="w-full flex justify-center items-center px-2 h-[25px]">
      <span class="text-md font-semibold ml-1 text-yellow-500 overflow-hidden whitespace-pre text-center">{{
        props.serverName
      }}</span>
    </div>
    <div class="w-full flex justify-center items-center px-2 h-[25px]">
      <span v-if="props.serverIp" class="text-xs text-left text-gray-100 overflow-hidden whitespace-pre ml-[5px]"
        >IP :</span
      >
      <span class="text-sm pl-2 text-yellow-500 overflow-hidden whitespace-pre">{{ props.serverIp }}</span>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  disabledButton: Boolean,
  serverName: String,
  serverIp: String,
});
</script>
