import { ref } from 'vue';
<template>
  <div
    class="col-start-1 col-span-full row-start-2 row-end-12 overflow-x-hidden overflow-y-auto px-1 py-2 flex flex-col justify-start items-center space-y-2"
  >
    <KeyRow v-for="item in keys" :key="item.pubkey" :item="item" />
  </div>
</template>
<script setup>
import { ref } from "vue";
import KeyRow from "./rows/KeyRow.vue";

const keys = ref([
  {
    pubkey: "1321w6r5g46q5er4g65eqrg4",
    service: "/img/icon/plugin-icons/validator/Lighthouse-Validator-Circle.png",
    since: "657 d",
    balance: 32.025998982,
    state: "active",

    options: {
      1: "1",
      2: "2",
      3: "3",
      4: "4",
    },
  },
  {
    pubkey: "1321w6r5g46q5er4g65eqrg4",
    service: "/img/icon/plugin-icons/validator/Lighthouse-Validator-Circle.png",
    since: "657 d",
    balance: 32.025998982,
    state: "active",

    options: {
      1: "1",
      2: "2",
      3: "3",
      4: "4",
    },
  },
  {
    pubkey: "1321w6r5g46q5er4g65eqrg4",
    service: "/img/icon/plugin-icons/validator/Lighthouse-Validator-Circle.png",
    since: "657 d",
    balance: 32.025998982,
    state: "active",

    options: {
      1: "1",
      2: "2",
      3: "3",
      4: "4",
    },
  },
  {
    pubkey: "1321w6r5g46q5er4g65eqrg4",
    service: "/img/icon/plugin-icons/validator/Lighthouse-Validator-Circle.png",
    since: "657 d",
    balance: 32.025998982,
    state: "active",

    options: {
      1: "1",
      2: "2",
      3: "3",
      4: "4",
    },
  },
]);
</script>
