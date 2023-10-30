import { useServices } from '@/store/services';
<template>
  <div
    class="w-full h-full absolute inset-0 bg-[#505f6d] z-10 py-1 px-2 grid grid-cols-6 grid-rows-1 mx-auto rounded-md"
    @mouseleave="client.openReplaceModal = false"
  >
    <slot></slot>
  </div>
</template>
<script setup>
const { client } = defineProps({
  client: Object,
});
</script>
<style scoped>
.exchange-box {
  width: 100%;
  height: 43px;
  border-radius: 10px 10px 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
}
.exchange-plugins {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  overflow-y: hidden;
  overflow-x: auto;
}
</style>
