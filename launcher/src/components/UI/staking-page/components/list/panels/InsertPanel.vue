<template>
  <div
    class="w-full h-8 bg-[#17A2B8] hover:bg-[#2c8692] rounded-full flex justify-center items-center cursor-pointer shadow-md shadow-gray-800"
  >
    <div class="w-full h-full flex justify-evenly items-center" @click="openUploadHandler">
      <input
        ref="fileInput"
        type="file"
        style="display: none"
        multiple="true"
        accept="application/json"
        @change="signalChangeHandler"
      />
      <span class="text-md font-semibold text-gray-200">{{ t("insertValidator.insertText") }}</span>
      <img class="w-5 h-5" src="/img/icon/the-staking/white-key.svg" alt="icon" />
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import i18n from "@/includes/i18n";

const t = i18n.global.t;
const emit = defineEmits(["uploadFile"]);
const props = defineProps({
  services: {
    type: Array,
    default: () => [],
  },
});

const fileInput = ref(null);

function openUploadHandler() {
  let validator = props.services.filter((s) => s.category === "validator");
  if (validator && validator.map((e) => e.state).includes("running")) {
    fileInput.value.click();
  }
}

function signalChangeHandler(event) {
  emit("uploadFile", event);
}
</script>
