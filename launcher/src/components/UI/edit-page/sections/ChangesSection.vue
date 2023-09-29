<template>
  <div class="w-full h-full flex flex-col">
    <div class="h-[60px] self-center w-full flex flex-col justify-center items-center">
      <button
        class="w-full h-[34px] rounded-full bg-[#264744] hover:bg-[#325e5a] px-2 text-gray-200 active:scale-95 shadow-md shadow-zinc-800 active:shadow-none transition-all duration-200 ease-in-out uppercase"
        :class="{ disabled: disableBtn }"
        @click="confirmHandler"
      >
        {{ $t("changeConfirm.confirm") }}
      </button>
    </div>
    <ChangesBox />
  </div>
</template>

<script setup>
import { ref } from "vue";
import ControlService from "@/store/ControlService";
import { useNodeManage } from "@/store/nodeManage";
import { useServices } from "@/store/services";
import ChangesBox from "../components/changes/ChangesBox";

const disableBtn = ref(false);

const editStore = useNodeManage();
const serviceStore = useServices();

const confirmHandler = async () => {
  disableBtn.value = true;
  await ControlService.handleServiceChanges(structuredClone(editStore.confirmChanges));
  setTimeout(() => {
    editStore.newConfiguration = structuredClone(serviceStore.installedServices);
  }, 4000);

  editStore.confirmChanges = [];
  disableBtn.value = false;
};
</script>
