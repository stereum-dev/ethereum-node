<template>
  <div
    class="w-full h-[430px] flex flex-col justify-start items-center px-1 py-2 overflow-y-scroll rounded-md border border-gray-600 bg-[#151618] space-y-1"
  >
    <div
      v-for="item in getChanges"
      :key="item.id"
      class="w-full h-10 border border-gray-500 shadow-md shadow-black p-1 rounded-md grid grid-cols-6"
      :class="contentBgColor(item)"
    >
      <div class="col-start-1 col-span-1 w-full self-center flex justify-center items-center">
        <img class="w-6" :src="item.contentIcon" alt="icon" />
      </div>
      <div class="col-start-2 col-span-5 flex justify-center items-center overflow-hidden">
        <span>{{ item.content }}</span>
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
      bg = "bg-green-500 text-gray-800 text-sm font-semibold";
    } else if (content === "DELETE") {
      bg = "bg-red-500 text-gray-300 text-sm font-semibold";
    } else if (content === "UPDATE") {
      bg = "bg-yellow-500 text-gray-950 text-sm font-semibold";
    } else if (content === "SWITCH NETWORK") {
      bg = "bg-gray-500 text-gray-900 text-[12px] font-semibold min-w-[100px]";
    }
  }
  return bg;
};
</script>
