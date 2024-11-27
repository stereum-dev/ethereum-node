<template>
  <div
    class="service-line w-full h-1/3 flex justify-start items-center"
    @mouseenter="footerStore.cursorLocation = props.hoverText"
    @mouseleave="footerStore.cursorLocation = ''"
  >
    <div class="service-name w-1/4 h-full text-gray-200 uppercase text-[45%] font-semibold flex justify-start items-center mr-4 ml-1">
      {{ props.label }}
    </div>
    <div
      class="service-ip w-2/3 h-5/6 flex justify-center items-center border border-gray-400 rounded-md text-[55%] bg-gray-900 text-gray-200 font-semibold"
    >
      {{ props.value }}
    </div>
  </div>
</template>

<script setup>
import { useFooter } from "@/store/theFooter";

const props = defineProps({
  label: String,
  value: String,
  hoverText: {
    type: String,
    default: "",
  },
});

const footerStore = useFooter();
</script>
