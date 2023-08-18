<template>
  <div
    class="grid-col-1 col-span-1 relative w-full h-full flex justify-center items-center box-border"
    @pointerdown.prevent.stop
    @mousedown.prevent.stop
  >
    <div
      class="w-[136px] h-5 absolute top-[-18px] -left-[1px] rounded-r-full bg-[#264744] pl-2 flex justify-between items-center text-white text-[10px] capitalize"
    >
      {{ client.name }}
      <span class="w-5 h-5 bg-green-500 border border-green-500 rounded-r-full"></span>
    </div>
    <div class="flex justify-center items-center mt-2">
      <img class="w-2/3" :src="client.sIcon" alt="icon" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    client: {
      type: Object,
      required: true,
    },
  },
  computed: {},
};
</script>
