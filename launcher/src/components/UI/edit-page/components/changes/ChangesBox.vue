<template>
  <div
    class="w-full h-[430px] flex flex-col justify-start items-center px-1 py-2 overflow-y-scroll rounded-md border border-gray-600 bg-[#151618] space-y-1"
  >
    <div
      v-for="item in getChanges"
      :key="item.id"
      class="w-full h-10 border border-gray-500 shadow-md shadow-black flex justify-evenly items-center p-1 rounded-md"
      :class="contentBgColor(item)"
    >
      <div class="w-1/6 flex justify-center items-center">
        <img class="w-6" :src="item.contentIcon" alt="icon" />
      </div>
      <div class="text-sm font-semibold">
        <span>{{ item.content }}</span>
      </div>
      <div class="w-1/6 flex justify-center items-center">
        <img :src="item.service.icon" alt="icon" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { useNodeManage } from "@/store/nodeManage";
import { computed } from "vue";

const editStore = useNodeManage();

const getChanges = computed(() => editStore.confirmChanges);

const contentBgColor = (item) => {
  let bg;
  if (item) {
    const content = item.content;
    if (content === "INSTALL") {
      bg = "bg-green-500 text-gray-800";
    } else if (content === "DELETE") {
      bg = "bg-red-500 text-gray-300";
    } else if (content === "UPDATE") {
      bg = "bg-yellow-500 text-gray-950";
    }
  }
  return bg;
};
</script>
