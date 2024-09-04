<template>
  <div class="h-full grid grid-cols-1 grid-rows-8">
    <div class="col-start-1 col-span-full row-start-1 row-span-1 h-[60px] self-center w-full flex flex-col justify-center items-center">
      <button
        v-if="editStore.disableConfirmButton"
        type="button"
        class="w-full h-[34px] rounded-full bg-[#264744] hover:bg-[#325e5a] px-2 text-sm text-gray-200 flex justify-center items-center capitalize"
        disabled
      >
        <svg
          class="animate-spin h-4 w-4 mr-3 border-y border-gray-200 rounded-full border-l border-l-gray-200 border-r border-r-[#264744]"
          viewBox="0 0 24 24"
        ></svg>
        <span class="animate-pulse">{{ $t("changeConfirm.process") }}</span>
      </button>
      <button
        v-else-if="editStore.confirmChanges.length"
        class="w-full h-[34px] rounded-full bg-[#264744] hover:bg-[#325e5a] px-2 text-gray-200 active:scale-95 shadow-md shadow-zinc-800 active:shadow-none transition-all duration-200 ease-in-out uppercase text-sm"
        @click="confirmChanges"
        @mouseenter="footerStore.cursorLocation = `${clkConfirm}`"
      >
        {{ $t("changeConfirm.confirm") }}
      </button>
      <button v-else class="w-full h-[34px] rounded-full bg-[#264744] px-2 text-gray-200 uppercase text-sm opacity-70 pointer-events-none">
        {{ $t("changeConfirm.confirm") }}
      </button>
    </div>
    <ChangesBox @remove-change="removeChange" />
  </div>
</template>

<script setup>
import { useNodeManage } from "@/store/nodeManage";
import ChangesBox from "../components/changes/ChangesBox";
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";

const t = i18n.global.t;

const clkConfirm = t("changeSect.clkConfirm");

const footerStore = useFooter();
const emit = defineEmits(["remove-change", "confirm-changes"]);

const editStore = useNodeManage();

const confirmChanges = () => {
  emit("confirm-changes");
};

const removeChange = (item) => {
  if (!editStore.disableConfirmButton) emit("remove-change", item);
};
</script>
