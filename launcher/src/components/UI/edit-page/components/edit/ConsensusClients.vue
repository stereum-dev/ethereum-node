<template>
  <div class="col-start-2 col-end-3 gap-y-5 pt-4 pb-2 grid grid-flow-row auto-rows-max relative">
    <div
      v-for="item in getConsensus"
      :key="item.config.serviceID"
      ref="consensusRefs"
      class="h-[110px] w-[110px] flex justify-center items-center py-1 rounded-md shadow-md hover:bg-[#374045] self-center justify-self-center cursor-pointer border bg-[#212629] border-gray-700 relative"
      :class="getDynamicClasses(item)"
      @click="displayMenu(item)"
      @mouseleave="hideMenu(item)"
    >
      <ClientLayout :client="item" />
      <TransitionGroup name="slide-fade">
        <GeneralMenu
          v-if="item.displayPluginMenu"
          :item="item"
          @switch-client="switchClient"
          @connect-client="connectClient"
          @delete-service="deleteService"
        />
        <MevboostMenu
          v-else-if="item.isNotConnectedToMevboost"
          :item="item"
          @hide-mevboost="hideMevboostMenu"
          @confirm-mevboost="confirmMevboostConnection"
        />

        <ConsensusMenu
          v-else-if="item.isNotConnectedToValidator"
          :item="item"
          @hide-connection="hideConnectionMenu"
          @confirm-consensus="confirmConsensusConnection"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup>
import { useNodeStore } from "@/store/theNode";
import { useNodeManage } from "@/store/nodeManage";
import ClientLayout from "./ClientLayout.vue";
import MevboostMenu from "./MevboostMenu.vue";
import ConsensusMenu from "./ConsensusMenu.vue";
import GeneralMenu from "./GeneralMenu.vue";

import { computed, ref, watchEffect, watch } from "vue";

//Props & Emits
const emit = defineEmits(["deleteService", "switchClient", "connectClient"]);

//Refs

const executionRefs = ref([]);
const nodeStore = useNodeStore();
const manageStore = useNodeManage();
const isConfirmLoading = ref(false);
const isMouseOverClient = ref(false);
const isMousePassedClient = ref(false);

// computed & watchers properties
const getConsensus = computed(() => {
  return manageStore.newConfiguration
    .filter((e) => e.category == "consensus")
    .sort((a, b) => {
      let fa = a.name.toLowerCase(),
        fb = b.name.toLowerCase();

      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    });
});

const getExecutionRef = computed(() => {
  return executionRefs.value.map((el, index) => {
    return {
      ref: el,
      refId: getConsensus.value[index].config.serviceID,
    };
  });
});
watch(isMouseOverClient, () => {
  if (isMouseOverClient.value) {
    isMousePassedClient.value = true;
  } else {
    isMousePassedClient.value = false;
  }
});

watchEffect(() => {
  nodeStore.executionRef = getExecutionRef.value;
});

// watchEffect(() => {
//   let connectedConsensus;
//   manageStore.newConfiguration
//     .filter((e) => e.category === "consensus")
//     .forEach((e) => {
//       if (e.config.dependencies.executionClients.length > 0) {
//         connectedExecution = e.config.dependencies.executionClients[0];
//         manageStore.newConfiguration.map((service) => {
//           if (service.service === connectedExecution.service) {
//             service.serviceIsConnected = true;
//             service.connectedToExecution = true;
//           }
//         });
//       }
//     });
// });

// methods

const getDynamicClasses = (item) => {
  if (item.hasOwnProperty("isNotConnectedToMevboost") && item.isNotConnectedToMevboost) {
    return "border border-blue-400 bg-blue-600 hover:bg-blue-600";
  } else if (item.hasOwnProperty("isRemoveProcessing") && item.isRemoveProcessing) {
    return "bg-red-600 ";
  } else if (item.hasOwnProperty("isNotConnectedToValidator") && item.isNotConnectedToValidator) {
    return "border border-blue-400 bg-blue-600 hover:bg-blue-600";
  } else if (
    item.hasOwnProperty("connectedToValidator") &&
    item.connectedToValidator &&
    manageStore.newConfiguration.filter((e) => e.category === "consensus").length > 1
  ) {
    return "border border-green-500 bg-green-500 hover:bg-green-500 ";
  } else if (item.hasOwnProperty("isConnectedToMevboost") && item.isConnectedToMevboost) {
    return "border border-green-500 bg-green-500 hover:bg-green-500 ";
  }
};

const displayMenu = (item) => {
  manageStore.newConfiguration.forEach((service) => {
    service.displayPluginMenu = false;
    service.isConnectedToMevboost = false;
  });
  if (!item.isNotConnectedToMevboost && !item.isNotConnectedToValidator) {
    item.displayPluginMenu = true;
  }
};

const hideMenu = (item) => {
  item.displayPluginMenu = false;
};

const hideConnectionMenu = (item) => {
  item.displayPluginMenu = false;
  manageStore.newConfiguration.forEach((service) => {
    if (service.connectedToValidator) {
      service.connectedToValidator = false;
    }
  });
  setTimeout(() => {
    item.isNotConnectedToValidator = false;
  });
};

const hideMevboostMenu = (item) => {
  item.displayPluginMenu = false;
  manageStore.newConfiguration.forEach((service) => {
    if (service.isConnectedToMevboost) {
      service.isConnectedToMevboost = false;
    }
  });
  setTimeout(() => {
    item.isNotConnectedToMevboost = false;
  });
};

const deleteService = (item) => {
  emit("deleteService", item);
};

const confirmMevboostConnection = (item) => {
  isConfirmLoading.value = true;
  setTimeout(() => {
    isConfirmLoading.value = false;
    item.isNotConnectedToMevboost = false;
    item.isConnectedToMevboost = true;
  }, 5000);
};

const switchClient = (item) => {
  emit("switchClient", item);
};

const connectClient = (item) => {
  emit("connectClient", item);
};
const confirmConsensusConnection = (item) => {
  console.log("Connection confirmed", item);
};
</script>
<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
