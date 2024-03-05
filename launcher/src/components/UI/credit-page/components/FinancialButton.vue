<template>
  <div
    class="finance-credit-btn_parent w-full h-full flex justify-start items-center rounded-md bg-[#387272] cursor-pointer"
    @click="goToStereum"
  >
    <div class="icon-fin-btn w-16 h-full flex justify-center items-center">
      <img src="/img/icon/credit-page-icons/financial-credit.png" alt="" />
    </div>
    <span class="w-3/4 flex justify-center items-center h-full text-base font-serif font-semibold text-[#e6e4e4]">{{
      $t("creditPanel.financialPage")
    }}</span>
  </div>
</template>
<script setup>
const goToStereum = () => {
  let url = "https://stereum.net/donate";
  window.open(url, "_blank");
};
</script>
<style scoped>
.finance-credit-btn_parent:active {
  box-shadow: 1px 1px 10px 1px #171717 inset;
}

.finance-credit-btn_parent:active .icon-fin-btn img {
  transform: scale(0.95);
}
.finance-credit-btn_parent:active span {
  transform: scale(0.97);
}
</style>
