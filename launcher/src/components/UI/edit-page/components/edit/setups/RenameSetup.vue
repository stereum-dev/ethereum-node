<template>
  <div class="w-full h-full col-start-6 col-span-full flex justify-center items-center">
    <div
      v-if="setupStore.isRenameSetupActive"
      class="w-full h-full col-start-6 col-span-1 flex justify-center items-center bg-teal-800 border border-gray-600 rounded-sm p-[2px]"
      @click="confirmRename"
      @mouseenter="footerStore.cursorLocation = 'Rename Node Setup'"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <img
        class="w-5 hover:scale-105 active:scale-95 cursor-pointer transition-all duration-150"
        src="/img/icon/service-setting-icons/confirm.png"
        alt="Avatar"
      />
    </div>
    <div
      v-else
      class="w-full h-full col-start-6 col-span-1 flex justify-center items-center bg-[#333539] border border-gray-600 rounded-sm p-[2px]"
      :class="{
        'pointer-events-none opacity-45 ': setupStore.selectedSetup === null,
      }"
      @click="renameSetup"
      @mouseenter="footerStore.cursorLocation = 'Rename Node Setup'"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <img
        class="w-5 hover:scale-105 active:scale-95 cursor-pointer transition-all duration-150"
        src="/img/icon/edit-node-icons/rename.png"
        alt="Icon"
        @mousedown.prevent
      />
    </div>
  </div>
</template>

<script setup>
import { useFooter } from "@/store/theFooter";
import { useSetups } from "@/store/setups";

const emit = defineEmits(["renameSetup", "confirmRename"]);

const setupStore = useSetups();
const footerStore = useFooter();

const renameSetup = () => {
  emit("renameSetup");
};

const confirmRename = () => {
  if (setupStore.setupToRename.trim() === "" || setupStore.setupToRename.trim() === "commonServices") return;
  emit("confirmRename");
};
</script>
