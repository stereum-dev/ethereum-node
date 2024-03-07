<template>
  <div class="credit-panel_box w-full grid grid-cols-2 grid-rows-12">
    <div class="credit-header flex w-full h-full justify-center items-center">
      <CreditHeader />
    </div>
    <div class="credit-container">
      <ContributorsList />
    </div>
  </div>
</template>
<script setup>
import ContributorsList from "./ContributorsList.vue";
import CreditHeader from "./CreditHeader.vue";
</script>
<style scoped>
.credit-header {
  grid-area: 1/ 1 / 3 / 3;
}
.credit-container {
  grid-area: 3/ 1 / 11 / 3;
}

.credit-panel_box {
  max-height: 488px;
  cursor: default;
}
</style>
