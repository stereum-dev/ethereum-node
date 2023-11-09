import { ref } from 'vue';
<template>
  <div class="col-start-1 col-span-full row-start-9 row-span-full flex justify-center items-center">
    <div
      class="w-full h-full border border-gray-600 rounded-md grid grid-cols-12 grid-rows-8 items-center bg-[#151618]"
    >
      <DutyHeader />
      <DutyBody :epochs="epochs" />
      <DutyFooter :client="{ name: 'nimbus' }" />
    </div>
  </div>
</template>
<script setup>
import DutyHeader from "./components/epoch-duty/DutyHeader.vue";
import DutyBody from "./components/epoch-duty/DutyBody.vue";
import DutyFooter from "./components/epoch-duty/DutyFooter.vue";
import { ref } from "vue";

const epochs = ref([
  {
    state: "pending",
    keyNumber: 1,
  },
  {
    state: "missed",
    keyNumber: 2,
  },
  {
    state: "attested",
    keyNumber: 0,
  },
]);
</script>
