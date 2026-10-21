<template>
  <!-- all icons in one row, they get smaller instead of scrolling -->
  <div class="col-start-2 col-end-12 h-full min-w-0 flex items-center gap-1">
    <div
      v-for="(slide, index) in slides"
      :key="index"
      class="relative min-w-0 max-w-10 aspect-square flex-[0_1_2.5rem] cursor-pointer border border-transparent hover:border-gray-100 transition-all duration-300 ease-in-out rounded-md"
      @click="handleModal(slide)"
      @mouseenter="footerStore.cursorLocation = `${slide.name}`"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <img class="w-full h-full z-0" :src="slide.sIcon" alt="Service Icon" />
      <span
        v-if="slide.marker"
        class="absolute top-0 right-0 w-2.5 h-2.5 rounded-full border border-[#0D0D12] pointer-events-none"
        :class="slide.marker === 'red' ? 'bg-red-500' : 'bg-amber-400'"
      />
    </div>
  </div>
</template>

<script setup>
import { useNodeHeader } from "@/store/nodeHeader";
import { useFooter } from "@/store/theFooter";

const footerStore = useFooter();

const { slides } = defineProps({
  slides: Array,
});

const headerStore = useNodeHeader();

// Modal handler
const handleModal = (slide) => {
  headerStore.setServiceModal(slide.service);
};
</script>
