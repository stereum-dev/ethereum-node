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
      class="service-ip w-2/3 h-5/6 flex justify-center items-center border border-gray-400 rounded-md text-[55%] bg-gray-900 font-semibold"
      :class="redGreen"
    >
      {{ props.csmBox ? activPassiv : props.value }}
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { useFooter } from "@/store/theFooter";
import { useSetups } from "@/store/setups";
import { computed } from "vue";

const props = defineProps({
  label: String,
  value: String,
  hoverText: {
    type: String,
    default: "",
  },
  csmBox: {
    type: Boolean,
    default: false,
  },
});

const footerStore = useFooter();
const setupStore = useSetups();

const redGreen = computed(() => {
  if (props.csmBox) {
    if (setupStore.selectedLCOMService && setupStore.selectedLCOMService.state) {
      return setupStore.selectedLCOMService.state === "running" ? "text-green-500" : "text-red-500";
    } else {
      return "text-gray-200";
    }
  } else {
    return "text-gray-200";
  }
});

const activPassiv = computed(() => {
  return setupStore.selectedLCOMService.state === "running" ? "ACTIVE" : "DORMANT";
});
</script>
