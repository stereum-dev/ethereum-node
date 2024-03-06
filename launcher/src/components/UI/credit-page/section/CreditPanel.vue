<template>
  <div class="credit-panel_parent h-full">
    <div class="credit-panel_box w-full h-full">
      <div
        class="credit-header col-start-1 col-end-3 row-start-1 row-end-4 flex w-full h-full justify-center items-center"
      >
        <CreditHeader />
      </div>
      <div class="credit-container">
        <ContributorsList />
      </div>
    </div>
  </div>
</template>
<script setup>
import ContributorsList from "./ContributorsList.vue";
import CreditHeader from "./CreditHeader.vue";
</script>
<style scoped>
.credit-panel_box {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto repeat(10, 1fr);
}
.credit-container {
  grid-area: 4/ 1 / 9 / 3;
}

.credit-panel_parent {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;

  border-radius: 10px;
  z-index: 0;
  box-sizing: border-box;
  cursor: default;
}
</style>
