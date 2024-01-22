<template>
  <div
    class="w-full h-full col-start-1 col-span-full row-start-8 row-span-full bg-[#1b1b1d] rounded-md grid grid-cols-12 grid-rows-12 p-2 pt-0"
  >
    <div class="w-full h-full col-start-1 col-span-full row-start-1 row-span-1 flex justify-start items-center">
      <span class="text-xs font-semibold text-gray-300">SSH KEY MANAGEMENT</span>
    </div>
    <div class="w-full h-full col-start-1 col-span-full row-start-2 row-span-3 flex justify-evenly items-center">
      <button
        class="min-w-[150px] h-6 bg-teal-700 hover:bg-teal-900 rounded-full px-2 flex justify-center items-center active:scale-95 shadow-lg shadow-black transition duration-150 ease-in-out"
        @click="generateModal"
      >
        <span class="text-2xs font-semibold text-gray-300">CREATE A NEW KEY</span>
      </button>
      <label
        for="ssh"
        class="min-w-[150px] h-6 bg-teal-700 hover:bg-teal-900 rounded-full px-2 flex justify-center items-center active:scale-95 shadow-lg shadow-black transition duration-150 ease-in-out cursor-pointer"
      >
        <input id="ssh" type="file" name="sshFile" class="hidden" @change="fileUpload" />
        <span class="text-2xs font-semibold text-gray-300"> ADD AN EXISTING KEY</span>
      </label>
    </div>
    <div
      class="w-full h-full max-h-[105px] overflow-x-hidden overflow-y-auto col-start-1 col-span-full row-start-5 row-span-full border border-gray-500 rounded-md flex flex-col justify-start items-center p-1 space-y-1 bg-black"
    >
      <SshRow v-for="key in uniqueSshKeys" :key="key" :item="key" @delete-key="deleteKey" />
    </div>
  </div>
</template>

<script setup>
import SshRow from "./SshRow.vue";
import { useServers } from "@/store/servers";
import { computed } from "vue";
import { useTruncate } from "@/composables/utils";

const emit = defineEmits(["fileUpload", "deleteKey"]);

const serverStore = useServers();

const uniqueSshKeys = computed(() => {
  const uniqueKeys = new Set();
  serverStore.sshKeys.forEach((keyString) => {
    if (typeof keyString !== "string") {
      console.warn("Non-string SSH key encountered:", keyString);
      return;
    }

    // Extract the last 50 characters of the key
    const keyEnd = keyString.length >= 50 ? useTruncate(keyString, 0, 40) : keyString;

    uniqueKeys.add(keyEnd);
  });

  return Array.from(uniqueKeys);
});

const generateModal = () => {
  serverStore.isGenerateModalActive = true;
};

const fileUpload = (e) => {
  emit("fileUpload", e);
};

const deleteKey = (key) => {
  emit("deleteKey", key);
};
</script>
