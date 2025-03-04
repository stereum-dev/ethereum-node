<template>
  <div class="credit-header w-full h-full grid grid-cols-3 grid-rows-2 border-b border-[#3e4347]">
    <div class="credit-header_title col-start-1 col-end-4 row-start-1 row-end-3 grid grid-cols-1 grid-rows-3">
      <span class="row-start-1 row-end-2 text-[#e6e4e4] text-2xl font-medium flex justify-center items-center w-full h-full mt-2">{{
        title
      }}</span>
      <div
        class="link-github row-start-2 row-end-3 text-wrap text-[#e6e4e4] text-base font-normal flex justify-center items-center w-full h-full mt-4"
      >
        <span class="cursor-pointer" @click="goToLink">{{ link }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useNodeHeader } from "@/store/nodeHeader";
import { computed } from "vue";
import i18n from "@/includes/i18n";

const t = i18n.global.t;

const headerStore = useNodeHeader();

const title = computed(() => {
  return headerStore.choosedCreditType === "technical contribution"
    ? t("creditPanel.techTitle")
    : headerStore.choosedCreditType === "feedback, testing & suggestions"
      ? t("creditPanel.testTitle")
      : headerStore.choosedCreditType === "translation"
        ? t("creditPanel.translateTitle")
        : "";
});

const link = computed(() => {
  return headerStore.choosedCreditType === "technical contribution"
    ? t("creditPanel.techText")
    : headerStore.choosedCreditType === "feedback, testing & suggestions"
      ? t("creditPanel.testText")
      : headerStore.choosedCreditType === "translation"
        ? t("creditPanel.translateText")
        : "";
});

const goToLink = () => {
  if (headerStore.choosedCreditType === "technical contribution") {
    goToGithub();
  } else if (headerStore.choosedCreditType === "feedback, testing & suggestions") {
    goToIssues();
  } else if (headerStore.choosedCreditType === "translation") {
    goToCrowdin();
  }
};

const goToGithub = () => {
  let url = "https://github.com/stereum-dev/ethereum-node";
  window.open(url, "_blank");
};

const goToIssues = () => {
  let url = "https://github.com/stereum-dev/ethereum-node/issues";
  window.open(url, "_blank");
};

const goToCrowdin = () => {
  let url = "https://crowdin.com/project/stereum";
  window.open(url, "_blank");
};
</script>

<style scoped>
.link-github span:hover {
  color: #115e59;
}
</style>
