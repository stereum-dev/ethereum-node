<template>
  <div
    class="animate__animated animate__fadeIn w-full h-full max-h-[32px] col-start-1 col-span-full rounded-sm flex justify-center items-center cursor-pointer shadow-md shadow-gray-800"
    :class="
      isUploadDisabled || stakingStore.isStakingDisabled ? 'opacity-25 pointer-events-none bg-[#243535]' : 'bg-[#336666] hover:bg-[#234545]'
    "
  >
    <div class="w-full h-full flex justify-evenly items-center" @click="openUploadHandler">
      <input
        ref="fileInput"
        type="file"
        style="display: none"
        class="w-full h-full"
        multiple="true"
        accept="application/json,text/plain"
        @change="getFileValue"
      />
      <span class="text-md font-semibold text-gray-200">{{ t("insertValidator.insertText") }}</span>
      <img class="w-6 h-6" src="/img/icon/staking-page-icons/validator-import.svg" alt="icon" @mousedown.prevent />
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
import i18n from "@/includes/i18n";
import { useServices } from "@/store/services";
import { useStakingStore } from "@/store/theStaking";

const t = i18n.global.t;
const emit = defineEmits(["uploadFile"]);

const serviceStore = useServices();
const stakingStore = useStakingStore();

const fileInput = ref(null);

// Check if there is a doppelganger key processing
const isUploadDisabled = computed(() => {
  return stakingStore.doppelgangerKeys.some((doppelKey) => doppelKey.serviceID === stakingStore.selectedServiceToFilter.config.serviceID);
});

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
