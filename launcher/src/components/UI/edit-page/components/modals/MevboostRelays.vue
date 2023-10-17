<template>
  <div class="w-10/12 h-full grid grid-cols-2 grid-flow-row p-2 mx-auto trasnform duration-200 mt-6">
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
import { onMounted } from "vue";

const manageStore = useNodeManage();

const props = defineProps({
  client: {
    type: Object,
    default: null,
  },
  properties: {
    type: Object,
    default: null,
  },
});

onMounted(() => {
  props.properties.relays = [];
  manageStore.relaysList.map((relay) => {
    relay.isSelected = false;
  });
});

const getRelays = (relay) => {
  if (relay.isSelected) {
    props.properties.relays.push(relay);
  } else {
    const element = manageStore.checkedRelays.find((item) => item.id === relay.id);
    props.properties.relays.splice(props.properties.relays.indexOf(element), 1);
  }
};
</script>
