<template>
  <div
    class="h-full w-[154px] col-start-1 col-span-full row-start-1 row-span-1 rounded-r-full bg-[#264744] pl-2 flex justify-between items-center text-white text-[10px] capitalize"
  >
    {{ props.client.name }}
    <span class="w-5 h-[18px]" :class="clientStatus"></span>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  client: { type: Object, required: true },
});

const clientStatus = computed(() => {
  if (props.client.state === "running") {
    return "bg-green-500 border border-green-500 rounded-r-full";
  } else if (props.client.state === "restarting") {
    return "bg-orange-500 border border-orange-500 rounded-r-full";
  }
  return "bg-red-600 border border-red-600 rounded-r-full";
});
</script>
