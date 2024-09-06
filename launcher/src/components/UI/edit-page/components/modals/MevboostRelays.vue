<template>
  <div class="w-10/12 h-full grid grid-cols-2 grid-flow-row p-2 mx-auto trasnform duration-200 mt-6">
    <RelaysCheckbox
      v-for="relay in availableBlocks"
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
import { onMounted, computed } from "vue";
import { useSetups } from "@/store/setups";

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

const setupsStore = useSetups();

const availableBlocks = computed({
  get: () => manageStore.availableBlocks,
  set: () => (manageStore.availableBlocks = shuffleRelaysList(manageStore.relaysList.filter((r) => r[setupsStore.selectedSetup.network]))),
});

onMounted(() => {
  props.properties.relays = [];
  manageStore.relaysList.map((relay) => {
    relay.isSelected = false;
  });
  manageStore.availableBlocks = shuffleRelaysList(manageStore.relaysList.filter((r) => r[setupsStore.selectedSetup.network]));
});

// Shuffles an array randomly
const shuffleRelaysList = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const getRelays = (relay) => {
  if (relay.isSelected) {
    props.properties.relays.push(relay);
  } else {
    const element = manageStore.checkedRelays.find((item) => item.id === relay.id);
    props.properties.relays.splice(props.properties.relays.indexOf(element), 1);
  }
};
</script>
