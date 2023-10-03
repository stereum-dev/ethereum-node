<template>
  <custom-modal
    :main-title="`${client.name} - ${client.category}`"
    :icon="client.sIcon"
    sub-title="Modify Connection"
    confirm-text="Confirm"
    click-outside-text="Click outside to cancel"
    @close-window="closeWindow"
    @confirm-action="confirmModify"
  >
    <template #content>
      <ModifyContent :client="client" :list="options" @select-service="selectService" />
    </template>
  </custom-modal>
</template>
<script setup>
import CustomModal from "./CustomModal.vue";
import ModifyContent from "./ModifyContent.vue";
import { useNodeManage } from "@/store/nodeManage";
import { useServices } from "@/store/services";

import { computed, ref, onMounted } from "vue";

const { client } = defineProps({
  client: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["closeWindow", "confirmModify"]);

const connectedConsensus = ref(null);
const connectedExecution = ref(null);

const serviceStore = useServices();
const manageStore = useNodeManage();

const options = computed(() => {
  let options = [];
  if (client.category === "consensus") {
    manageStore.newConfiguration.forEach((i) => {
      if (i.category === "execution") {
        options.push({
          ...i,
          isConnected: false,
          clientID: i.config?.serviceID.slice(0, 6) + "..." + i.config?.serviceID.slice(-6),
        });
      }
      if (options.length > 0) {
        connectedConsensus.value = client.config.dependencies.consensusClients[0]?.id;
        connectedExecution.value = client.config.dependencies.executionClients[0]?.id;
        options.forEach((e) => {
          if (connectedConsensus.value === e.config.serviceID || connectedExecution.value === e.config.serviceID) {
            e.isConnected = true;
          }
        });
      }
    });
  } else if (client.service === "SSVNetworkService") {
    manageStore.newConfiguration.forEach((i) => {
      if (i.category === "execution" || i.category === "consensus") {
        options.push({
          ...i,
          isConnectedToSSVNetwork: false,
          clientID: i.config?.serviceID.slice(0, 6) + "..." + i.config?.serviceID.slice(-6),
        });
        if (options.length > 0) {
          connectedConsensus.value = client.config.dependencies.consensusClients[0]?.id;
          connectedExecution.value = client.config.dependencies.executionClients[0]?.id;
          options.forEach((e) => {
            if (connectedConsensus.value === e.config.serviceID || connectedExecution.value === e.config.serviceID) {
              e.isConnectedToSSVNetwork = true;
            }
          });
        }
      }
    });
  } else if (client.category === "validator") {
    manageStore.newConfiguration.forEach((i) => {
      if (i.category === "consensus") {
        options.push({
          ...i,
          isConnected: false,
          clientID: i.config?.serviceID.slice(0, 6) + "..." + i.config?.serviceID.slice(-6),
        });
      }
      if (options.length > 0) {
        connectedConsensus.value = client.config.dependencies.consensusClients[0]?.id;
        connectedExecution.value = client.config.dependencies.executionClients[0]?.id;
        options.forEach((e) => {
          if (connectedConsensus.value === e.config.serviceID || connectedExecution.value === e.config.serviceID) {
            e.isConnected = true;
          }
        });
      }
    });
  } else if (client.service === "FlashbotsMevBoostService") {
    manageStore.newConfiguration.forEach((i) => {
      if (i.category === "consensus") {
        options.push({
          ...i,
          clientID: i.config?.serviceID.slice(0, 6) + "..." + i.config?.serviceID.slice(-6),
        });
      }
      if (options.length > 0) {
        options.forEach((e) => {
          if (e.category === "consensus" && e.config.dependencies.mevboost[0]) {
            console.log(e);
            e.isConnectedToMevBoost = true;
          }
        });
      }
    });
  }
  return options;
});

//life cycle hooks

onMounted(() => {
  getConnectedClient();
  getConnectedServicesToSSV();
});

//Methods

const getConnectedClient = () => {
  if (client.category === "consensus") {
    manageStore.newConfiguration.forEach((e) => {
      if (e.category === "execution" && e.config.dependencies.executionClients[0]) {
        e.isConnected = true;
      }
    });
  } else if (client.category === "validator" && client.service !== "SSVNetworkService") {
    manageStore.newConfiguration.forEach((e) => {
      if (e.category === "consensus" && e.config.dependencies.consensusClients[0]) {
        e.isConnected = true;
      }
    });
  }
};

const getConnectedServicesToSSV = () => {
  connectedConsensus.value = client.config.dependencies.consensusClients[0]?.id;
  connectedExecution.value = client.config.dependencies.executionClients[0]?.id;
  manageStore.newConfiguration.forEach((e) => {
    if (connectedConsensus.value === e.config.serviceID || connectedExecution.value === e.config.serviceID) {
      return {
        ...e,
        isConnectedToSSVNetwork: true,
      };
    }
  });
};

// const selectedItems = () => {
//   let selectedItems = [];
//   const commonElements = manageStore.newConfiguration.filter((element) => array2.includes(element));

//   return selectedItems;
// };

const confirmModify = () => {
  emit("confirmModify", client);
};

const closeWindow = () => {
  emit("closeWindow");
};

const selectService = (option) => {
  serviceStore.selectedServiceToConnect.push(option);
  console.log(serviceStore.selectedServiceToConnect);
};
</script>
