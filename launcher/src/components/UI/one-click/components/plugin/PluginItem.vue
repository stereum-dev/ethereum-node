<template>
  <div
    class="w-full h-10 flex justify-start items-center bg-[#2c3136] rounded-md py-1 px-2 cursor-pointer hover:bg-[#3c434a] transition-all duration-300 ease-in-out relative"
    @click="$emit('plugin-click')"
  >
    <img class="w-8 mr-2" :src="plugin.sIcon" alt="Client Icon" />
    <div class="w-full flex flex-col justify-center items-start">
      <span class="text-sm text-gray-300 font-semibold">{{ plugin?.name }}</span>
      <span class="text-xs text-teal-500 font-normal">{{ plugin.category }}</span>
    </div>
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  plugin: {
    type: Object,
    required: true,
  },
});

defineEmits(["plugin-click"]);
</script>
