import { computed } from 'vue';
<template>
  <div
    class="w-full h-8 rounded-full grid grid-cols-24 items-center p-1 cursor-pointer animate__animated animate animate__slideInLeft bg-gray-400"
  >
    <div
      class="w-6 h-6 rounded-full cursor-pointer bg-white col-start-1 col-span-1 self-center overflow-hidden flex justify-center items-center"
    >
      <span class="w-4 h-4 rounded-full animate-spin border border-blue-500 border-b-transparent border-r-transparent"></span>
    </div>
    <div
      class="col-start-2 col-end-16 w-full rounded-full self-center overflow-hidden flex justify-start items-center"
      @mouseenter="footerStore.cursorLocation = `${props.item.pubkey} `"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <span class="text-sm font-semibold text-gray-800 text-left">{{ formattedPubKey }} </span>
    </div>

    <div class="w-full h-full col-start-18 col-span-full flex justify-center items-center">
      <span class="w-full bg-[#1d1e1f] rounded-full px-4 py-[3px] text-xs font-semibold text-red-400 text-center">
        Doppelganger Protection
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useFooter } from "@/store/theFooter";

const footerStore = useFooter();

import { useTruncate } from "@/composables/utils";
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const formattedPubKey = computed(() => {
  return useTruncate(props.item.pubkey, 20, 20);
});
</script>

<style scoped>
.flash {
  animation: flash 2s infinite 0.2s;
}
@keyframes flash {
  0% {
    opacity: 0.2;
  }

  50% {
    opacity: 0.5;
  }

  100% {
    opacity: 0.2;
  }
}
</style>
