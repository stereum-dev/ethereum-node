import { computed } from 'vue';
<template>
  <router-link
    :to="props.item.path"
    class="w-1/4 min-h-[146px] bg-[#336666] rounded-xl p-4 flex justify-center items-center hover:scale-110 active:scale-100 transition-all duration-300 ease-in-out border border-gray-500 shadow-lg shadow-black hover:shadow-2xl hover:shadow-black"
  >
    <div class="" @mouseover="isHovered = true" @mouseleave="isHovered = false">
      <img class="w-full h-full border border-[#336666] rounded-3xl" :src="getImage" alt="Card Item" @mousedown.prevent />
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
