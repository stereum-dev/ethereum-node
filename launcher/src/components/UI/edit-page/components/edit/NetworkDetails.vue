import { useNodeManage } from '@/store/nodeManage';
<template>
  <div
    class="col-start-7 col-span-3 flex flex-col justify-between items-center bg-[#151618] border h-full border-gray-600 rounded-md px-2 py-1"
  >
    <div class="w-full self-start text-xs font-semibold text-teal-700">Current Network</div>
    <div class="w-full flex justify-center items-center">
      <img v-if="network.icon" :src="network.icon" alt="Networks" class="w-5 mr-1" />
      <span class="text-md text-gray-300 text-left overflow-hidden whitespace-pre">{{ network.name }}</span>
    </div>
  </div>
</template>
<script setup>
import { useNodeManage } from "@/store/nodeManage";
import { watchEffect, ref } from "vue";

const manageStore = useNodeManage();
const network = ref({});

watchEffect(() => {
  network.value = manageStore.configNetwork.id ? manageStore.configNetwork : manageStore.currentNetwork;
});
</script>
<style scoped>
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. declare enter from and leave to state */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

/* 3. ensure leaving items are taken out of layout flow so that moving
      animations can be calculated correctly. */
.fade-leave-active {
  position: absolute;
}
</style>
