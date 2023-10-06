<template>
  <div v-if="!manageStore.newConfiguration.length > 0" class="mt-4 flex justify-center items-center">
    <p class="text-md text-gray-400 font-semibold">There is no available service</p>
  </div>
  <div v-else class="mt-4">
    <div
      v-if="list.length && list.some((e) => e.category === 'consensus')"
      class="w-2/3 h-5 text-left pl-8 text-md font-semibold text-gray-500 mx-auto grid grid-cols-2 grid-flow-row mt-4"
    >
      <span class="col-start-1 col-span-1">Consensus Clients</span>
    </div>
    <div
      v-if="list.length && list.some((e) => e.category === 'consensus')"
      class="container w-2/3 grid grid-cols-2 grid-flow-row p-2 mx-auto rounded-lg gap-2 mt-4"
    >
      <div
        v-for="option in list.filter((e) => e.category === 'consensus')"
        :key="option.service"
        class="group mx-auto w-[170px] h-[45px] rounded-md cursor-pointer hover:bg-blue-300 m-0 active:scale-95 transition duration-200 shadow-xl shadow-[#141516] active:shadow-none"
        :class="{
          'bg-teal-600 hover:bg-teal-600 text-gray-200': option.isConnected,
          'bg-[#282a2c] text-teal-600 border border-gray-700': !option.isConnected,
        }"
        @click="toggleConnection(option)"
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
              :class="option.isConnected ? 'text-gray-800' : 'text-gray-200'"
            >
              <span> {{ shortID(option) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="list.length && list.some((e) => e.category === 'execution')"
      class="w-2/3 h-5 text-left pl-8 text-md font-semibold text-gray-500 mx-auto grid grid-cols-2 grid-flow-row"
    >
      <span class="col-start-1 col-span-1">Execution Clients</span>
    </div>
    <div
      v-if="list.length && list.some((e) => e.category === 'execution')"
      class="container w-2/3 grid grid-cols-2 grid-flow-row p-2 mx-auto rounded-lg gap-2 mt-4"
    >
      <div
        v-for="option in list.filter((e) => e.category === 'execution')"
        :key="option.service"
        class="group mx-auto w-[170px] h-[45px] rounded-md cursor-pointer hover:bg-blue-300 m-0 active:scale-95 transition duration-200 shadow-xl shadow-[#141516] active:shadow-none"
        :class="{
          'bg-teal-600 hover:bg-teal-600 text-gray-200': option.isConnected,
          'bg-[#282a2c] text-teal-600 border border-gray-700': !option.isConnected,
        }"
        @click="toggleConnection(option)"
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
              <span> {{ shortID(option) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="list.length && list.some((e) => e.category === 'validator')"
      class="w-2/3 h-5 text-left pl-8 text-md font-semibold text-gray-500 mx-auto grid grid-cols-2 grid-flow-row mt-4"
    >
      <span class="col-start-1 col-span-1">Validator Clients</span>
    </div>
    <div
      v-if="list.length && list.some((e) => e.category === 'validator')"
      class="container w-2/3 grid grid-cols-2 grid-flow-row p-2 mx-auto rounded-lg gap-2 mt-4"
    >
      <div
        v-for="option in list.filter((e) => e.category === 'validator')"
        :key="option.service"
        class="group mx-auto w-[170px] h-[45px] rounded-md cursor-pointer hover:bg-blue-300 m-0 active:scale-95 transition duration-200 shadow-xl shadow-[#141516] active:shadow-none"
        :class="{
          'bg-teal-600 hover:bg-teal-600 text-gray-200': option.isConnected,
          'bg-[#282a2c] text-teal-600 border border-gray-700': !option.isConnected,
        }"
        @click="toggleConnection(option)"
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
              <span> {{ shortID(option) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useNodeManage } from "@/store/nodeManage";
import { onMounted, ref } from "vue";

const list = ref([]);

//Props
const props = defineProps({
  client: {
    type: Object,
    default: null,
  },
});

//Stores
const manageStore = useNodeManage();

//Lifecycle Hooks
onMounted(() => {
  console.log(manageStore.newConfiguration.length);
  list.value = getConnectionOptions();
  console.log(list.value);
});
//Methods

const toggleConnection = (option) => {
  if (!option.isConnected) {
    option.isConnected = true;
  } else {
    option.isConnected = false;
  }
};

const getConnectionOptions = () => {
  switch (props.client.category) {
    case "execution":
      return [];
    case "consensus":
      return manageStore.newConfiguration.filter((e) => e.category === "execution");
    case "validator":
      if (props.client.service === "SSVNetworkService") {
        return manageStore.newConfiguration.filter((e) => e.category === "consensus" || e.category === "execution");
      }
      if (props.client.service === "Web3SignerService") {
        return [];
      }
      if (props.client.service === "CharonService") {
        return manageStore.newConfiguration.filter((e) => e.category === "consensus");
      }
      return manageStore.newConfiguration.filter((e) => e.category === "consensus" || e.service === "CharonService");
    case "service":
      if (props.client.service === "FlashbotsMevBoostService") {
        return manageStore.newConfiguration.filter((e) => e.category === "consensus");
      }
      break;
    default:
      return [];
  }
};

const shortID = (client) => {
  if (client?.config?.serviceID) {
    return client.config.serviceID.slice(0, 4) + "..." + client.config.serviceID.slice(-4);
  }
  return client.id;
};
</script>
