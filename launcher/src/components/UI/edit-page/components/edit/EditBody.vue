<!-- eslint-disable vue/return-in-computed-property -->
import { mapState, map } from 'pinia';
<template>
  <div
    class="scrollbar scrollbar-rounded-* scrollbar-thumb-teal-800 scrollbar-track-transparent w-full h-full max-h-[430px] rounded-md border border-gray-500 overflow-y-auto mt-1 bg-[#151618] relative"
  >
    <div ref="dropZoneRef" @change="onDrop(el)">Drop files here</div>
  </div>
</template>

<script setup>
import { useDropZone } from "@vueuse/core";
import { ref } from "vue";

const dropZoneRef = ref();
const list = ref([]);

function onDrop(el) {
  list.value.push(el);
  console.log(list.value);
}

const { isOverDropZone } = useDropZone(dropZoneRef, onDrop);

console.log(isOverDropZone);
</script>

<style scoped>
::-webkit-scrollbar {
  width: 3px;
}
</style>
