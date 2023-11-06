<template>
  <div
    class="w-full h-full border border-gray-600 rounded-md bg-[#14171a] p-2 space-y-2 z-0 overflow-x-hidden overflow-y-auto flex flex-col justify-start items-start"
  >
    <div
      v-for="item in manageStore.usedBlocks"
      :key="item.id"
      :class="item.isRemoved ? 'border border-red-500 rounded-md ' : 'border border-[#2c3136] rounded-md '"
      class="w-full h-10 flex justify-start items-center bg-[#2c3136] rounded-md py-1 px-2 cursor-pointer hover:bg-[#3c434a] relative"
      @click="removeItem(item)"
      @dblclick="doubleRemove(item)"
    >
      <img class="w-8 mr-2" :src="item.icon" alt="Client Icon" />
      <div class="w-full flex flex-col justify-center items-start">
        <span class="text-sm text-gray-300 font-semibold">{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useNodeManage } from "@/store/nodeManage";

const emit = defineEmits(["removeItem", "doubleRemove"]);

const manageStore = useNodeManage();

const removeItem = (item) => {
  item.isRemoved = true;
  emit("removeItem", item);
};

const doubleRemove = (item) => {
  item.isRemoved = true;
  emit("doubleRemove", item);
};
</script>
