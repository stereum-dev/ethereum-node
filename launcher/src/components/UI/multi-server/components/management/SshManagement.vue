<template>
  <div
    class="w-full h-full col-start-1 col-span-full row-start-6 row-span-full bg-[#1b1b1d] rounded-md grid grid-cols-12 grid-rows-12 p-2"
  >
    <div class="w-full h-full colstart-1 col-span-full row-start-1 row-span-1 flex justify-start items-center">
      <span class="text-sm font-semibold text-gray-300">SSH KEY MANAGEMENT</span>
    </div>
    <div class="w-full h-full colstart-1 col-span-full row-start-2 row-span-2 flex justify-evenly items-center">
      <button
        class="min-w-[150px] h-7 bg-teal-700 hover:bg-teal-800 border-2 border-gray-500 rounded-full px-2 flex justify-center items-center hover:scale-105 active:scale-100 shadow-lg shadow-black transition duration-150 ease-in-out"
      >
        <span class="text-xs font-semibold text-gray-300">CREATE A NEW KEY</span>
      </button>
      <button
        class="min-w-[150px] h-7 bg-teal-700 hover:bg-teal-800 border-2 border-gray-500 rounded-full px-2 flex justify-center items-center hover:scale-105 active:scale-100 shadow-lg shadow-black ransition duration-150 ease-in-out"
      >
        <span class="text-xs font-semibold text-gray-300"> ADD AN EXISTING KEY</span>
      </button>
    </div>
    <div
      class="w-full h-full colstart-1 col-span-full row-start-4 row-span-full border border-gray-500 rounded-md flex flex-col justify-start items-center p-1 space-y-1"
    >
      <SshRow v-for="key in sshKeys" :key="key.pubkey" :pubkey="key.pubkey" />
    </div>
  </div>
</template>

<script setup>
import SshRow from "./SshRow.vue";
import { ref } from "vue";

const sshKeys = ref([
  {
    pubkey: "adsf876sf86q8fg6q9e8rgq90e7rg9q08er7gqewrgqergqeg",
  },

  {
    pubkey: "v98qf7v68q6erg8qt8er7gtv89q7ertg786ergqegrqegr",
  },

  {
    pubkey: "vbq90e8r6v0bqe0r9g87q09ew8rg79q67e0r78g6gqergqergqer",
  },
]);
</script>
