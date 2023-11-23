<template>
  <div
    class="animate__animated animate__slideInLeft w-full h-full max-h-[35px] col-start-1 col-span-full bg-[#17A2B8] hover:bg-[#2c8692] rounded-sm flex justify-center items-center cursor-pointer shadow-md shadow-gray-800"
  >
    <div class="w-full h-full flex justify-evenly items-center" @click="openUploadHandler">
      <input
        ref="fileInput"
        type="file"
        style="display: none"
        class="w-full h-full"
        multiple="true"
        accept="application/json"
        @change="getFileValue"
      />
      <span class="text-md font-semibold text-gray-200">{{ t("insertValidator.insertText") }}</span>
      <img class="w-4 h-5" src="/img/icon/the-staking/black-key.png" alt="icon" @mousedown.prevent />
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import i18n from "@/includes/i18n";
import { useServices } from "@/store/services";

const t = i18n.global.t;
const emit = defineEmits(["uploadFile"]);

const serviceStore = useServices();

const fileInput = ref(null);

const openUploadHandler = () => {
  let validator = serviceStore.installedServices.filter((s) => s.category === "validator");
  if (validator.length && validator.map((e) => e.state).includes("running")) {
    fileInput.value.click();
  }
};

const getFileValue = (event) => {
  emit("uploadFile", event);
};
</script>

<style scoped>
.panelIn {
  animation: slideIn 0.3s ease-in-out 0.8s;
}

@keyframes slideIn {
  0% {
    transform: translateX(500px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
