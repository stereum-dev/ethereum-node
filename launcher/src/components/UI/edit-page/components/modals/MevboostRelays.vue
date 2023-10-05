<template>
  <div class="w-10/12 h-full grid grid-cols-2 grid-flow-row p-2 mx-auto -mt-6 trasnform duration-200">
    <RelaysCheckbox
      v-for="relay in manageStore.relaysList"
      :key="relay.id"
      :label="relay.name"
      :field-id="relay.id"
      :icon="relay.icon"
      :relay="relay"
      @get-relays="getRelays"
    />
  </div>
</template>
<script setup>
import RelaysCheckbox from "./RelaysCheckbox.vue";
import { useNodeManage } from "@/store/nodeManage";
import { ref } from "vue";

const checkedRelays = ref([]);
const manageStore = useNodeManage();

const getRelays = (relay) => {
  if (relay.isSelected) {
    checkedRelays.value.push(relay);
  } else {
    const element = checkedRelays.value.find((item) => item.id === relay.id);
    checkedRelays.value.splice(checkedRelays.value.indexOf(element), 1);
  }
  console.log(checkedRelays.value);
};
</script>
