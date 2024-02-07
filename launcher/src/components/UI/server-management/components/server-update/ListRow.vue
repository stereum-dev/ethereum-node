<template>
  <div class="w-full h-7 min-h-6 grid grid-cols-12 mx-auto bg-gray-700 p-[2px] items-center">
    <div class="col-start-1 col-span-full flex justify-center items-center overflow-hidden">
      <span class="text-sm text-gray-300 font-normal uppercase">{{ props.task?.action }}</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  task: Object,
});
</script>
