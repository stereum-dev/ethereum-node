<template>
  <div class="w-full h-full flex flex-col">
    <div class="h-[60px] self-center w-full flex flex-col justify-center items-center">
      <button
        v-if="disableBtn"
        type="button"
        class="w-full h-[34px] rounded-full bg-[#264744] hover:bg-[#325e5a] px-2 text-gray-200 flex justify-center items-center"
        disabled
      >
        <svg
          class="animate-spin h-5 w-5 mr-3 border-t border-gray-200 rounded-[100px] border-l"
          viewBox="0 0 24 24"
        ></svg>
        Processing...
      </button>
      <button
        v-else
        class="w-full h-[34px] rounded-full bg-[#264744] hover:bg-[#325e5a] px-2 text-gray-200 active:scale-95 shadow-md shadow-zinc-800 active:shadow-none transition-all duration-200 ease-in-out uppercase"
        @click="confirmHandler"
      >
        {{ $t("changeConfirm.confirm") }}
      </button>
    </div>
    <ChangesBox @remove-change="removeChange" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import ControlService from "@/store/ControlService";
import { useNodeManage } from "@/store/nodeManage";
import { useServices } from "@/store/services";
import ChangesBox from "../components/changes/ChangesBox";

const emit = defineEmits(["remove-change"]);
const disableBtn = ref(false);

const editStore = useNodeManage();
const serviceStore = useServices();

const confirmHandler = async () => {
  disableBtn.value = true;
  await ControlService.handleServiceChanges(JSON.parse(JSON.stringify(editStore.confirmChanges)));
  setTimeout(() => {
    editStore.newConfiguration = structuredClone(serviceStore.installedServices);
  }, 4000);

  editStore.confirmChanges = [];
  disableBtn.value = false;
};

const removeChange = (item) => {
  if (!disableBtn.value) emit("remove-change", item);
};
</script>
