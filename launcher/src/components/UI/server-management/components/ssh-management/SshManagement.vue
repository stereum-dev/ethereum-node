<template>
  <div
    class="w-full h-full col-start-1 col-span-full row-start-1 row-span-full bg-[#1b1b1d] rounded-md grid grid-cols-12 grid-rows-12 p-2 pt-0"
  >
    <div class="w-full h-full col-start-1 col-span-full row-start-1 row-span-1 flex justify-start items-center py-1">
      <span class="text-md font-semibold text-gray-300">{{ $t("multiServer.sshkeyMang") }}</span>
    </div>
    <div class="w-full h-full col-start-1 col-span-full row-start-2 row-span-2 flex justify-evenly items-center">
      <button
        class="min-w-[170px] h-8 bg-teal-700 hover:bg-teal-900 rounded-full px-2 flex justify-center items-center active:scale-95 active:shadow-none shadow-lg shadow-black transition duration-150 ease-in-out"
        @click="generateModal"
        @mouseenter="footerStore.cursorLocation = `${t('sshManage.genSshKey')}`"
        @mouseleave="footerStore.cursorLocation = ''"
      >
        <span class="text-[12px] font-semibold text-gray-100">{{ $t("multiServer.createNewKey") }}</span>
      </button>
      <label
        for="ssh"
        class="min-w-[170px] h-8 bg-teal-700 hover:bg-teal-900 rounded-full px-2 flex justify-center items-center active:scale-95 active:shadow-none shadow-lg shadow-black transition duration-150 ease-in-out cursor-pointer"
        @mouseenter="footerStore.cursorLocation = `${t('sshManage.addkey')}`"
        @mouseleave="footerStore.cursorLocation = ''"
      >
        <input id="ssh" type="file" name="sshFile" accept=".pub" class="hidden" @change="fileUpload" />
        <span class="text-[12px] font-semibold text-gray-100"> {{ $t("multiServer.addExistingKey") }}</span>
      </label>
    </div>
    <div
      class="w-full h-full max-h-[319px] overflow-x-hidden overflow-y-auto col-start-1 col-span-full row-start-4 row-span-full border border-gray-500 rounded-md flex flex-col justify-start items-center p-1 space-y-1 bg-black"
    >
      <SshRow v-for="key in serverStore.sshKeys" :key="key" :item="key" @delete-key="deleteKey" />
    </div>
  </div>
</template>

<script setup>
import SshRow from "./SshRow.vue";
import { useServers } from "@/store/servers";
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";

const t = i18n.global.t;

const emit = defineEmits(["fileUpload", "deleteKey"]);

const serverStore = useServers();
const footerStore = useFooter();

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
