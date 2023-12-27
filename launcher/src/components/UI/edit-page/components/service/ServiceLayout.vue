<template>
  <div
    class="grid-col-1 col-span-1 relative w-full h-full flex justify-center items-center box-border mx-auto"
    @pointerdown.prevent.stop
    @mousedown.prevent.stop
  >
    <div
      class="w-[155px] h-4 absolute top-[-18px] -left-[1px] rounded-r-full bg-[#264744] pl-2 flex justify-between items-center text-gray-300 font-semibold text-[10px] capitalize"
    >
      {{ client.name }}
      <span class="w-5 h-4 bg-green-500 border border-green-500 rounded-r-full"></span>
    </div>
    <div class="w-full flex justify-center items-center mt-1">
      <img class="w-10" :src="client.sIcon" alt="icon" />
    </div>
  </div>
</template>
<script setup>
const { client } = defineProps({
  client: {
    type: Object,
    required: true,
  },
});
</script>
