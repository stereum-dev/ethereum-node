import { computed } from 'vue';
<template>
  <router-link
    :to="props.item.path"
    class="w-1/4 bg-[#336666] rounded-xl p-4 flex justify-center items-center hover:scale-110 hover:shadow-xl hover:shadow-[#1a1b1b] active:scale-100 transition-all duration-300 ease-in-out"
  >
    <div class="" @mouseover="isHovered = true" @mouseleave="isHovered = false">
      <img
        class="w-full h-full border border-[#336666] rounded-xl"
        :src="getImage"
        alt="Card Item"
        @mousedown.prevent
      />
    </div>
  </router-link>
</template>
<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const isHovered = ref(false);

const getImage = computed(() => {
  if (isHovered.value) return props.item.imgHover;
  return props.item.img;
});

// const isCompatible = computed((el) => {
//   if (process.env.NODE_ENV == "development") return !el.display;
//   return !el.display;
//   return false;
// });
</script>
