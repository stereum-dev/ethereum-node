<template>
  <div
    class="grid-col-1 col-span-1 relative w-full h-full flex justify-center items-center box-border"
    style="cursor: default"
    @pointerdown.prevent.stop
    @mousedown.prevent.stop
    @mouseenter="footerStore.cursorLocation = `${props.client.name} service`"
    @mouseleave="footerStore.cursorLocation = ''"
  >
    <div
      class="w-[160px] h-[16px] absolute top-[-18px] -left-[1px] rounded-r-full bg-[#264744] pl-2 flex justify-between items-center text-white text-[10px] capitalize"
    >
      {{ props.client.name }}
      <span :class="clientStatus"></span>
    </div>
    <div class="flex justify-center items-center">
      <img class="w-3/5" :src="props.client.sIcon" alt="icon" />
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue";
import { useFooter } from "@/store/theFooter";

const footerStore = useFooter();

const props = defineProps({
  client: { type: Object, required: true },
});
const clientStatus = computed(() => {
  if (props.client.state === "running") {
    return "w-5 h-[16px] bg-green-500 border border-green-500 rounded-r-full";
  } else if (props.client.state === "restarting") {
    return "w-5 h-[16px] bg-orange-500 border border-orange-500 rounded-r-full";
  }
  return "w-5 h-[16px] bg-red-600 border border-red-600 rounded-r-full";
});
</script>
