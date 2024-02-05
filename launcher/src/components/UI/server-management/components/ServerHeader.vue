import { ref } from 'vue';
<template>
  <div class="col-start-1 col-span-full row-start-1 row-span-1 grid grid-cols-24 items-center">
    <span class="col-start-4 col-end-14 text-3xl text-gray-200 font-bold">SERVER MANAGEMENT</span>
    <div class="col-start-14 col-span-full w-full h-full grid grid-cols-12 grid-rows-5 items-center pr-2 pl-1">
      <div
        class="col-start-1 col-span-full row-start-2 row-end-5 h-full bg-[#1b1b1d] rounded-md grid grid-cols-8 items-center px-2"
      >
        <div
          v-for="icon in icons"
          :key="icon"
          class="col-span-1 w-9 h-9 bg-gray-500 hover:text-teal-500 border border-gray-500 hover:border-teal-200 rounded-md shadow-md shadow-black flex justify-center items-center cursor-pointer active:scale-95 transition-all duration-200 active:shadow-none"
          @click="tabPicker"
        >
          <img class="w-8 h-8 mx-auto hover:scale-110 transition-all duration-200" :src="icon.img" alt="Server Icon" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const icons = ref([
  { img: "/img/icon/form-setup/infos.png", name: "infos" },
  { img: "/img/icon/form-setup/lock.png", name: "lock" },
  { img: "/img/icon/form-setup/download.png", name: "update" },
]);
</script>
