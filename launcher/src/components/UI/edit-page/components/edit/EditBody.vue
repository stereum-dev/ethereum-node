<template>
  <div class="w-full h-full flex flex-col justify-between items-center">
    <EditHeader />
    <div
      class="scrollbar scrollbar-rounded-* scrollbar-thumb-teal-800 scrollbar-track-transparent w-full h-full max-h-[430px] rounded-md border border-gray-500 overflow-y-auto mt-1 bg-[#151618] relative"
    >
      <slot></slot>
    </div>
  </div>
</template>
<script setup>
import EditHeader from "./EditHeader.vue";
  </script>

<style scoped>
::-webkit-scrollbar {
  width: 3px;
}
</style>
