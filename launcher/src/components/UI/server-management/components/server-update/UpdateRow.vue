import { useServers } from '@/store/servers';
<template>
  <div
    class="w-full h-7 min-h-7 grid grid-cols-12 mx-auto bg-[#334d4d]"
    :class="serverStore.isMajorUpgradeActive ? 'pointer-events-none opacity-50 ' : ''"
  >
    <div class="w-full h-full col-start-1 col-end-7 flex justify-start items-center pl-2">
      <span class="text-xs text-gray-200">{{ props.item.packageName }}</span>
    </div>
    <div class="w-full h-full col-start-7 col-end-11 flex justify-center items-center">
      <span class="text-xs text-amber-400 font-semibold">{{ props.item.newVersion }}</span>
    </div>
    <div
      v-if="serverStore.isUpdateProcessing"
      class="w-full h-full col-start-11 col-span-full flex justify-center items-center bg-gray-700 rounded-sm user-select-none pointer-events-none cursor-not-allowed"
    >
      <img class="w-5" src="/img/icon/base-header-icons/update-modal-download-disabled.png" alt="icon" />
    </div>
    <div
      v-else
      class="w-full h-full col-start-11 col-span-full self-center flex justify-center items-center bg-[#4d7575] hover:bg-[#243535] active:border-none active:shadow-none border border-transparent hover:border-[#4d7575] rounded-sm cursor-pointer transition-colors shadow-sm shadow-[#182020]"
      @click="updatePackage"
      @mouseenter="footerStore.cursorLocation = `${update} `"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <img class="w-4" src="/img/icon/base-header-icons/update-modal-download.png" alt="icon" />
    </div>
  </div>
</template>

<script setup>
import { useServers } from "@/store/servers";
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";

const t = i18n.global.t;

const emit = defineEmits(["updatePackage"]);
const serverStore = useServers();
const footerStore = useFooter();

const props = defineProps({
  item: Object,
});

const update = t("osUpdate.updateBtn", {
  name: props.item.packageName,
  version: props.item.newVersion,
});

const updatePackage = () => {
  emit("updatePackage", props.item);
};
</script>
