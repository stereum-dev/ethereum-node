import { onMounted } from 'vue';
<template>
  <div class="w-full flex flex-col justify-evenly items-center mx-auto px-4 py-2 space-y-2 mt-6">
    <div class="w-full flex justify-center items-center">
      <div class="w-full grid grid-cols-12 items-center text-md">
        <img class="col-start-1 w-8" src="/img/icon/manage-node-icons/folder.png" alt="Path Icon" />
        <span class="col-start-2 col-span-3 text-gray-400 text-left">Installation Path</span>
        <input
          v-model="client.path"
          class="col-start-6 col-span-7 min-h-[30px] border border-gray-500 px-2 py-1 text-left text-gray-400 text-xs rounded bg-[#141516] focus:border-teal-500"
          type="text"
          autofocus
        />
      </div>
    </div>
    <div class="w-full flex justify-center items-center">
      <div class="w-full grid grid-cols-12 items-center text-md">
        <img class="col-start-1 w-8" src="/img/icon/manage-node-icons/newPort.png" alt="Path Icon" />
        <span class="col-start-2 col-span-3 text-gray-400 text-left">Port</span>
        <input
          v-model="client.port"
          class="col-start-6 col-span-7 min-h-[30px] border border-gray-500 px-2 py-1 text-left text-gray-400 text-xs rounded bg-[#141516] focus:border-teal-500 placeholder:text-gray-700"
          type="text"
          placeholder="9000"
          autofocus
        />
      </div>
    </div>
    <div v-if="client.category === 'consensus'" class="w-full flex justify-center items-center">
      <div class="w-full grid grid-cols-12 items-center text-md">
        <img class="w-8 col-start-1" src="/img/icon/manage-node-icons/sync.gif" alt="Sync Icon" />
        <span class="col-start-2 col-span-3 text-gray-400 text-md text-left">Sync Mode</span>
        <SyncCarousel :client="client" />
      </div>
    </div>
  </div>
</template>
<script setup>
import SyncCarousel from "../edit/SyncCarousel.vue";

const { client } = defineProps({
  client: {
    type: Object,
    default: null,
  },
});
</script>
