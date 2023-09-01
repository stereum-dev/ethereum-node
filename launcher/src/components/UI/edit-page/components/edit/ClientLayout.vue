import { computed } from 'vue';
<template>
  <div
    class="grid-col-1 col-span-1 relative w-full h-full flex justify-center items-center box-border"
    @pointerdown.prevent.stop
    @mousedown.prevent.stop
  >
    <div class="flex flex-col justify-center items-center gap-2">
      <span class="text-xs text-gray-200 font-semibold">{{ client.name }}</span>
      <img class="w-14" :src="client.sIcon" alt="icon" />
      <span class="text-[10px] text-gray-200">ID:{{ serviceId }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
const { client } = defineProps({
  client: {
    type: Object,
    required: true,
  },
});

const serviceId = computed(() => formattedServiceID(client.config.serviceID));

const formattedServiceID = (item) => {
  return item.slice(0, 6) + "..." + item.slice(-6);
};
</script>
