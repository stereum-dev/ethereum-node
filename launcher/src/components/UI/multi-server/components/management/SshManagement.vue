<template>
  <div
    class="w-full h-full col-start-1 col-span-full row-start-8 row-span-full bg-[#1b1b1d] rounded-md grid grid-cols-12 grid-rows-12 p-2"
  >
    <div class="w-full h-full col-start-1 col-span-full row-start-1 row-span-1 flex justify-start items-center">
      <span class="text-xs font-semibold text-gray-300">SSH KEY MANAGEMENT</span>
    </div>
    <div class="w-full h-full col-start-1 col-span-full row-start-2 row-span-3 flex justify-evenly items-center">
      <button
        class="min-w-[150px] h-6 bg-teal-700 hover:bg-teal-800 border-2 border-gray-300 rounded-full px-2 flex justify-center items-center active:scale-95 shadow-lg shadow-black transition duration-150 ease-in-out"
        @click="generateModalHandler"
      >
        <span class="text-xs font-semibold text-gray-300">CREATE A NEW KEY</span>
      </button>
      <label
        for="ssh"
        class="min-w-[150px] h-6 bg-teal-700 hover:bg-teal-800 border-2 border-gray-300 rounded-full px-2 flex justify-center items-center active:scale-95 shadow-lg shadow-black transition duration-150 ease-in-out"
      >
        <input id="ssh" type="file" name="sshFile" class="hidden" @change="fileUpload" />
        <span class="text-xs font-semibold text-gray-300"> ADD AN EXISTING KEY</span>
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

const emit = defineEmits(["fileUpload", "deleteKey"]);

const serverStore = useServers();

const uniqueSshKeys = computed(() => {
  const uniqueKeys = new Set();
  serverStore.sshKeys.forEach((keyString) => {
    if (typeof keyString !== "string") {
      console.warn("Non-string SSH key encountered:", keyString);
      return;
    }

    const regex = /ssh-(?:rsa|dss|ed25519|ecdsa) ([A-Za-z0-9+/]+={0,3})/;
    const matches = keyString.match(regex);
    if (matches && matches[1]) {
      uniqueKeys.add(matches[1]);
    }
  });
  return Array.from(uniqueKeys);
});

const generateModalHandler = () => {
  serverStore.isGenerateModalActive = true;
};

const fileUpload = (e) => {
  emit("fileUpload", e);
};

const deleteKey = (key) => {
  emit("deleteKey", key);
};
</script>
