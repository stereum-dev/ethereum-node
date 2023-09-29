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
      <div
        v-if="client.category === 'consensus' && client.service !== 'SSVNetworkService'"
        class="w-2/3 h-5 text-left pl-8 text-md font-semibold text-gray-500 mx-auto"
      >
        Execution Clients
      </div>
      <div
        v-if="client.category === 'validator' && client.service !== 'SSVNetworkService'"
        class="w-2/3 h-5 text-left pl-8 text-md font-semibold text-gray-500 mx-auto"
      >
        Consensus Clients
      </div>
      <div
        v-if="client.service !== 'SSVNetworkService'"
        class="container w-2/3 grid grid-cols-2 grid-flow-row p-2 mx-auto rounded-lg gap-2"
      >
        <div
          v-for="option in options"
          :key="option.service"
          class="mx-auto w-[170px] h-[52px] rounded-md p-1 cursor-pointer hover:bg-blue-300 m-0 active:scale-95 transition duration-200 shadow-xl shadow-[#141516] active:shadow-none"
          :class="{
            'bg-green-200': option.isConnectedToConsensus,
            'bg-green-200': option.isConnectedToValidator,
            'bg-stone-200': !option.isConnectedToConsensus,
            'bg-stone-200': !option.isConnectedToValidator,
          }"
          @click="selectService(option)"
        >
          <div class="flex justify-startitems-center">
            <div class="p-1 flex justify-center items-center">
              <img class="w-9 h-9" :src="option.sIcon" alt="Service Icon" />
            </div>
            <div class="flex flex-col justify-center items-start">
              <div class="text-sm font-semibold text-teal-800 capitalize">
                <span> {{ option.name }}</span>
              </div>
              <div class="text-xs text-gray-800 capitalize">
                <span> {{ option.clientID }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="client.service === 'SSVNetworkService'"
        class="w-2/3 h-5 flex justify-around items-center text-md font-semibold text-gray-500 mx-auto"
      >
        <span class="mr-2">Consensus Clients</span>
        <span class="mr-2">Execution Clients</span>
      </div>
      <div
        v-if="client.service === 'SSVNetworkService'"
        class="container w-2/3 grid grid-cols-2 grid-flow-row p-2 mx-auto rounded-lg gap-2"
      >
        <div class="col-start-1 col-span-1 space-y-2 flex flex-col justify-center items-center">
          <div
            v-for="option in options.filter((e) => e.category === 'consensus')"
            :key="option.config.serviceID"
            class="mx-auto w-[170px] h-[52px] rounded-md p-1 cursor-pointer hover:bg-blue-300 m-0 active:scale-95 transition duration-200 shadow-xl shadow-[#141516] active:shadow-none border border-gray-500"
            :class="{
              'bg-green-200': option.isConnectedToSSVNetwork,
              'bg-stone-200': !option.isConnectedToSSVNetwork,
            }"
            @click="selectService(option)"
          >
            <div class="flex justify-start items-center">
              <div class="p-1 flex justify-center items-center">
                <img class="w-9 h-9" :src="option.sIcon" alt="Service Icon" />
              </div>
              <div class="flex flex-col justify-center items-start">
                <div class="text-sm font-semibold text-teal-800 capitalize">
                  <span> {{ option.name }}</span>
                </div>
                <div class="text-xs text-gray-800 capitalize">
                  <span> {{ option.clientID }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-start-2 col-span-1 space-y-2 flex flex-col justify-center items-center">
          <div
            v-for="option in options.filter((e) => e.category === 'execution')"
            :key="option.config.serviceID"
            class="justify-self-center w-[170px] h-[52px] rounded-md p-1 cursor-pointer hover:bg-blue-300 m-0 active:scale-95 transition duration-200 shadow-xl shadow-[#141516] active:shadow-none"
            :class="{ 'bg-green-200': option.isConnectedToSSVNetwork, 'bg-stone-200': !option.isConnectedToSSVNetwork }"
            @click="selectService(option)"
          >
            <div class="flex justify-start items-center">
              <div class="p-1 flex justify-center items-center">
                <img class="w-9 h-9" :src="option.sIcon" alt="Service Icon" />
              </div>
              <div class="flex flex-col justify-center items-start">
                <div class="text-sm font-semibold text-teal-800 capitalize">
                  <span> {{ option.name }}</span>
                </div>
                <div class="text-xs text-gray-800 capitalize">
                  <span> {{ option.clientID }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </custom-modal>
</template>
<script setup>
import CustomModal from "./CustomModal.vue";
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
          clientID: i.config?.serviceID.slice(0, 6) + "..." + i.config?.serviceID.slice(-6),
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
      }
    });
  } else if (client.category === "validator") {
    manageStore.newConfiguration.forEach((i) => {
      if (i.category === "consensus") {
        options.push({
          ...i,
          clientID: i.config?.serviceID.slice(0, 6) + "..." + i.config?.serviceID.slice(-6),
        });
      }
    });
  }
  return options;
});

//life cycle hooks

onMounted(() => {
  getDynamicClasses();
  getConnectedServicesToSSV();
});

//Methods

const getDynamicClasses = () => {
  if (client.category === "consensus") {
    manageStore.newConfiguration.forEach((e) => {
      if (e.category === "execution" && e.config.dependencies.executionClients[0]) {
        e.isConnectedToConsensus = true;
      }
    });
  } else if (client.category === "validator" && client.service !== "SSVNetworkService") {
    manageStore.newConfiguration.forEach((e) => {
      if (e.category === "consensus" && e.config.dependencies.consensusClients[0]) {
        e.isConnectedToValidator = true;
      }
    });
  } else if (client.service === "SSVNetworkService") {
    manageStore.newConfiguration.forEach((e) => {
      if (e.category === "consensus" && e.config.dependencies.consensusClients[0]) {
        e.isConnectedToSSVNetwork = true;
      }
      if (e.category === "execution" && e.config.dependencies.executionClients[0]) {
        e.isConnectedToSSVNetwork = true;
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
  emit("confirmModify");
};

const closeWindow = () => {
  emit("closeWindow");
};

const selectService = (option) => {
  serviceStore.selectedServiceToConnect.push(option);
  emit("selectService", option);
};
</script>
