<template>
  <div class="h-full col-start-1 col-span-full row-start-2 row-span-full grid grid-cols-1 grid-rows-5 py-1 px-2">
    <ButtonRow v-for="button in buttonState" :key="button.text" :button="button" />
  </div>
</template>
<script setup>
import ButtonRow from "./ButtonRow.vue";
import { ref } from "vue";

const buttonState = ref([
  {
    text: "CHANGE ALL GRAFFITI",
    icon: "/img/icon/the-staking/option-graffiti.png",
  },
  {
    text: "REMOVE ALL KEYS",
    icon: "/img/icon/the-staking/option-remove.png",
  },
  {
    text: "WITHDRAW & EXIT ALL KEYS",
    icon: "/img/icon/the-staking/withdraw.png",
  },
  {
    text: "Import Remote Keys",
    icon: "/img/icon/the-staking/remotekey.svg",
  },
]);
</script>
