<template>
  <div
    class="scrollbar scrollbar-rounded-* scrollbar-thumb-teal-800 scrollbar-track-transparent w-full h-full max-h-[430px] rounded-md border border-gray-600 overflow-y-auto mt-1 bg-[#151618] relative"
  >
    <div
      class="absolute top-0 w-full mx-auto grid grid-cols-3 h-6 bg-[#33393E] border border-gray-950 rounded-t-[5px] text-gray-200 text-[10px] font-semibold"
    ></div>
    <div class="w-full h-full grid grid-cols-3 pt-8">
      <ClientSkeleton v-for="i in skeletons" v-show="loadingClients" :key="i" />
    </div>
  </div>
</template>

<script setup>
import ClientSkeleton from "./clients/ClientSkeleton.vue";
import { ref } from "vue";
import { useConfigs } from "@/store/multiConfigs";

const configStore = useConfigs();
const skeletons = ref([1, 2, 3, 4, 5, 6, 7, 8, 9]);

console.log(configStore.configs);

const loadingClients = ref(true);
</script>
