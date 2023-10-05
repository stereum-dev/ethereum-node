import { onMounted, computed } from 'vue';
<template>
  <div v-if="!manageStore.newConfiguration.length > 0" class="mt-4 flex justify-center items-center">
    <p class="text-md text-gray-400 font-semibold">There is no available service</p>
  </div>
  <div v-else class="mt-4">
    <div
      v-if="list.length && list.every((e) => e.category === 'consensus')"
      class="w-2/3 h-5 text-left pl-8 text-md font-semibold text-gray-500 mx-auto grid grid-cols-2 grid-flow-row mt-4"
    >
      <span class="col-start-1 col-span-1">Consensus Clients</span>
    </div>
    <div
      v-if="list.length && list.every((e) => e.category === 'consensus')"
      class="container w-2/3 grid grid-cols-2 grid-flow-row p-2 mx-auto rounded-lg gap-2 mt-4"
    >
      <div
        v-for="option in list"
        :key="option.service"
        class="group mx-auto w-[170px] h-[45px] rounded-md cursor-pointer hover:bg-blue-300 m-0 active:scale-95 transition duration-200 shadow-xl shadow-[#141516] active:shadow-none"
        :class="{
          'bg-teal-600 hover:bg-teal-600 text-gray-200': option.isConnected || option.isConnectedToMevBoost,
          'bg-[#282a2c] text-teal-600 border border-gray-700': !option.isConnected,
          'border-2 border-blue-500': option.isSelected,
        }"
        @click="selectService(option)"
      >
        <div class="flex justify-startitems-center">
          <div class="p-1 flex justify-center items-center">
            <img class="w-9 h-9" :src="option.sIcon" alt="Service Icon" />
          </div>
          <div class="flex flex-col justify-center items-start">
            <div class="text-sm font-semibold capitalize">
              <span> {{ option.name }}</span>
            </div>
            <div
              class="text-xs font-normal group-hover:text-gray-800"
              :class="option.isConnected || option.isConnectedToMevBoost ? 'text-gray-800' : 'text-gray-200'"
            >
              <span> {{ option.clientID }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="list.length && list.every((e) => e.category === 'execution')"
      class="w-2/3 h-5 text-left pl-8 text-md font-semibold text-gray-500 mx-auto grid grid-cols-2 grid-flow-row"
    >
      <span class="col-start-1 col-span-1">Execution Clients</span>
    </div>
    <div
      v-if="list.length && list.every((e) => e.category === 'execution')"
      class="container w-2/3 grid grid-cols-2 grid-flow-row p-2 mx-auto rounded-lg gap-2 mt-4"
    >
      <div
        v-for="option in list"
        :key="option.service"
        class="group mx-auto w-[170px] h-[45px] rounded-md cursor-pointer hover:bg-blue-300 m-0 active:scale-95 transition duration-200 shadow-xl shadow-[#141516] active:shadow-none"
        :class="{
          'bg-teal-600 hover:bg-teal-600 text-gray-200': option.isConnected,
          'bg-[#282a2c] text-teal-600 border border-gray-700': !option.isConnected,
          'border-2 border-blue-500': option.isSelected,
        }"
        @click="selectService(option)"
      >
        <div class="flex justify-startitems-center">
          <div class="p-1 flex justify-center items-center">
            <img class="w-9 h-9" :src="option.sIcon" alt="Service Icon" />
          </div>
          <div class="flex flex-col justify-center items-start">
            <div class="text-sm font-semibold capitalize">
              <span> {{ option.name }}</span>
            </div>
            <div
              class="text-xs group-hover:text-gray-800 font-normal"
              :class="option.isConnected ? 'text-gray-800' : 'text-gray-200'"
            >
              <span> {{ option.clientID }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="list.length && list.every((e) => e.category === 'validator')"
      class="w-2/3 h-5 text-left pl-8 text-md font-semibold text-gray-500 mx-auto grid grid-cols-2 grid-flow-row mt-4"
    >
      <span class="col-start-1 col-span-1">Validator Clients</span>
    </div>
    <div
      v-if="list.length && list.every((e) => e.category === 'validator')"
      class="container w-2/3 grid grid-cols-2 grid-flow-row p-2 mx-auto rounded-lg gap-2 mt-4"
    >
      <div
        v-for="option in list"
        :key="option.service"
        class="group mx-auto w-[170px] h-[45px] rounded-md cursor-pointer hover:bg-blue-300 m-0 active:scale-95 transition duration-200 shadow-xl shadow-[#141516] active:shadow-none"
        :class="{
          'bg-teal-600 hover:bg-teal-600 text-gray-200': option.isConnected,
          'bg-[#282a2c] text-teal-600 border border-gray-700': !option.isConnected,
          'border-2 border-blue-500': option.isSelected,
        }"
        @click="selectService(option)"
      >
        <div class="flex justify-startitems-center">
          <div class="p-1 flex justify-center items-center">
            <img class="w-9 h-9" :src="option.sIcon" alt="Service Icon" />
          </div>
          <div class="flex flex-col justify-center items-start">
            <div class="text-sm font-semibold capitalize">
              <span> {{ option.name }}</span>
            </div>
            <div
              class="text-xs group-hover:text-gray-800"
              :class="option.isConnected ? 'text-gray-800' : 'text-gray-200'"
            >
              <span> {{ option.clientID }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="list.length && list.some((e) => e.category === 'execution') && list.some((e) => e.category === 'consensus')"
      class="w-2/3 h-5 text-left pl-8 text-md font-semibold text-gray-500 mx-auto grid grid-cols-2 grid-flow-row"
    >
      <span class="col-start-1 col-span-1">Execution Clients</span>
      <span class="col-start-2 col-span-1">Consensus Clients</span>
    </div>
    <div
      v-if="list.length && list.some((e) => e.category === 'execution') && list.some((e) => e.category === 'consensus')"
      class="container w-2/3 grid grid-cols-2 grid-flow-row p-2 mx-auto rounded-lg gap-2 mt-4"
    >
      <div
        v-for="(option, idx) in list.filter((e) => e.category === 'execution')"
        :key="option.service"
        class="group col-start-1 col-span-1 mx-auto w-[170px] h-[45px] rounded-md cursor-pointer hover:bg-blue-300 m-0 active:scale-95 transition duration-200 shadow-xl shadow-[#141516] active:shadow-none"
        :class="[
          option.isConnectedToSSVNetwork
            ? 'bg-teal-600 hover:bg-teal-600 text-gray-200'
            : 'bg-[#282a2c] text-teal-600 border border-gray-700',
          'row-start-' + (idx + 1),
          option.isSelected ? 'border-2 border-blue-500' : '',
        ]"
        @click="selectService(option)"
      >
        <div class="flex justify-startitems-center">
          <div class="p-1 flex justify-center items-center">
            <img class="w-9 h-9" :src="option.sIcon" alt="Service Icon" />
          </div>
          <div class="flex flex-col justify-center items-start">
            <div class="text-sm font-semibold capitalize">
              <span> {{ option.name }}</span>
            </div>
            <div
              class="text-xs group-hover:text-gray-800"
              :class="option.isConnectedToSSVNetwork ? 'text-gray-800' : 'text-gray-200'"
            >
              <span> {{ option.clientID }}</span>
            </div>
          </div>
        </div>
      </div>
      <div
        v-for="(option, idx) in list.filter((e) => e.category === 'consensus')"
        :key="option.service"
        class="group col-start-2 col-span-1 mx-auto w-[170px] h-[45px] rounded-md cursor-pointer hover:bg-blue-300 m-0 active:scale-95 transition duration-200 shadow-xl shadow-[#141516] active:shadow-none"
        :class="[
          option.isConnectedToSSVNetwork
            ? 'bg-teal-600 hover:bg-teal-600 text-gray-200'
            : 'bg-[#282a2c] text-teal-600 border border-gray-700',
          'row-start-' + (idx + 1),
          option.isSelected ? 'border-2 border-blue-500' : '',
        ]"
        @click="selectService(option)"
      >
        <div class="flex justify-startitems-center">
          <div class="p-1 flex justify-center items-center">
            <img class="w-9 h-9" :src="option.sIcon" alt="Service Icon" />
          </div>
          <div class="flex flex-col justify-center items-start">
            <div class="text-sm font-semibold capitalize">
              <span> {{ option.name }}</span>
            </div>
            <div
              class="text-xs"
              :class="option.isConnectedToSSVNetwork ? 'text-gray-800' : 'text-gray-200 group-hover:text-gray-800'"
            >
              <span> {{ option.clientID }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useNodeManage } from "@/store/nodeManage";
import { ref, computed } from "vue";

//Props
const { client } = defineProps({
  client: {
    type: Object,
    default: null,
  },
});
//Emits
const emit = defineEmits(["selectService"]);

//Refs
const connectedConsensus = ref(null);
const connectedExecution = ref(null);

//Stores
const manageStore = useNodeManage();

//Computed & Watchers
const list = computed(() => {
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
        connectedConsensus.value =
          client && client.config.dependencies.consensusClients[0]
            ? client.config.dependencies.consensusClients[0]?.id
            : null;
        connectedExecution.value =
          client && client.config.dependencies.executionClients[0]
            ? client.config.dependencies.executionClients[0]?.id
            : null;
        options.forEach((e) => {
          if (connectedConsensus?.value === e.config.serviceID || connectedExecution?.value === e.config.serviceID) {
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

//Lifecycle Hooks

//Methods

const selectService = (option) => {
  option = {
    ...option,
    isSelected: true,
  };
  emit("selectService", option);
};
</script>
