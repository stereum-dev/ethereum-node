<template>
  <div class="w-full h-full flex flex-col">
    <div class="h-[60px] self-center w-full flex flex-col justify-center items-center">
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
        @click="confirmHandler"
      >
        {{ $t("changeConfirm.confirm") }}
      </button>
      <button
        v-else
        class="w-full h-[34px] rounded-full bg-[#264744] px-2 text-gray-200 uppercase text-sm opacity-70 pointer-events-none"
      >
        {{ $t("changeConfirm.confirm") }}
      </button>
    </div>
    <ChangesBox @remove-change="removeChange" />
  </div>
</template>

<script setup>
import ControlService from "@/store/ControlService";
import { useNodeManage } from "@/store/nodeManage";
import { useServices } from "@/store/services";
import ChangesBox from "../components/changes/ChangesBox";

const emit = defineEmits(["remove-change"]);

const editStore = useNodeManage();
const serviceStore = useServices();

const confirmHandler = async () => {
  editStore.disableConfirmButton = true;
  await ControlService.handleServiceChanges(JSON.parse(JSON.stringify(editStore.confirmChanges)));
  setTimeout(() => {
    editStore.newConfiguration = structuredClone(serviceStore.installedServices);
  }, 4000);

  editStore.confirmChanges = [];
  editStore.disableConfirmButton = false;
};

const removeChange = (item) => {
  if (!editStore.disableConfirmButton) emit("remove-change", item);
};
</script>
