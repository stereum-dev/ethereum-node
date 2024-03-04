<template>
  <div class="credit-header w-full h-full grid grid-cols-3 grid-rows-2">
    <div class="credit-header_title col-start-1 col-end-3 row-start-1 row-end-3 grid grid-cols-1 grid-rows-2">
      <span
        class="row-start-1 row-end-2 text-[#e6e4e4] text-xl font-medium flex justify-start items-end pl-8 w-full h-full"
        >{{ $t("creditPanel.techTitle") }}</span
      >
      <span
        class="row-start-2 row-end-3 text-left pl-6 cursor-pointer text-wrap text-[#e6e4e4] text-sm font-normal flex justify-start items-center w-full h-full"
        @click="goToGithub"
        >{{ $t("creditPanel.techText") }}</span
      >
    </div>
  </div>
</template>
<script setup>
const goToGithub = () => {
  let url = "https://github.com/stereum-dev/ethereum-node";
  window.open(url, "_blank");
};
</script>

<style scoped></style>
