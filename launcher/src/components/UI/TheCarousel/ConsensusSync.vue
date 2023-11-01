<template>
  <div class="h-full w-full grid grid-cols-12 space-x-2">
    <div class="col-start-1 col-end-4 grid grid-cols-3 gap-1 bg-[#33393e] rounded-md py-1 px-2">
      <img class="w-9 h-9 col-start-1 col-span-1 self-center" :src="client.icon" alt="icon" />

      <div class="col-start-2 col-span-full self-center flex flex-col justify-start items-start">
        <span class="text-xs text-gray-300 font-semibold">{{ client.name }}</span>
        <span class="text-xs text-teal-500 font-semibold">{{ client.category }}</span>
      </div>
    </div>

    <div
      class="h-14 col-start-4 col-span-full rounded-md py-1 pl-1 pr-4 flex justify-start items-center z-10 bg-[#33393e] relative"
    >
      <TheCarousel :client="props.client" />
    </div>
  </div>
</template>

<script setup>
import TheCarousel from "./components/TheCarousel.vue";

const props = defineProps({
  client: {
    type: Object,
    required: true,
  },
});
</script>
