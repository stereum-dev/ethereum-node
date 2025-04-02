import { onMounted, computed } from 'vue';
<template>
  <div v-if="!manageStore.newConfiguration.length > 0" class="mt-4 flex justify-center items-center">
    <p class="text-md text-gray-400 font-semibold">
      {{ $t("editModals.noAvailService") }}
    </p>
  </div>
  <div v-else class="w-full mt-4 flex justify-center items-center box-border">
    <div
      v-if="list.length && list.some((e) => e.category === 'consensus' && e.setupId === setupStore.selectedSetup.setupId)"
      class="w-1/3 h-[250px] flex flex-col justify-start items-center"
    >
      <div class="w-full h-5 flex justify-center items-center">
        <span class="text-lg font-semibold text-gray-500">{{ $t("editModals.consensusClients") }}</span>
      </div>
      <div
        class="w-full h-[210px] overflow-y-auto overflow-x-hidden flex flex-col justify-start items-center mx-auto rounded-lg space-y-2 mt-4"
      >
        <div
          v-for="option in list.filter((e) => e.category === 'consensus' && e.setupId === setupStore.selectedSetup.setupId)"
          :key="option.service"
          class="group mx-auto rounded-md cursor-pointer transition duration-200 shadow-xl shadow-[#141516] p-2"
          :class="{
            'bg-teal-600 hover:bg-teal-600 text-gray-200 border-2 border-teal-700': option.isConnected,
            'bg-[#282a2c] text-teal-600 border-2 border-gray-600 hover:border-teal-600': !option.isConnected,
            ' w-[190px] h-[55px]': props.client.service === 'SSVNetworkService',
            'w-[200px] h-[65px] text-md': props.client.service !== 'SSVNetworkService',
          }"
          @click="toggleConnection(option)"
        >
          <div class="w-full h-full flex justify-start items-center">
            <div class="p-1 flex justify-center items-center">
              <img class="w-9 h-9" :src="option.sIcon" alt="Service Icon" />
            </div>
            <div class="flex flex-col justify-center items-start space-y-1">
              <div class="font-semibold capitalize">
                <span> {{ option.name }}</span>
              </div>
              <div class="text-xs font-normal overflow-x-hidden" :class="option.isConnected ? 'text-gray-800' : 'text-gray-400'">
                <span class="min-w-[120px] min-h-[18px]"> {{ shortID(option) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="list.length && list.some((e) => e.category === 'execution')"
      class="w-1/3 h-[250px] flex flex-col justify-start items-center"
    >
      <div class="w-full h-5 flex justify-center items-center">
        <span class="text-lg font-semibold text-gray-500">{{ $t("editModals.executionClients") }}</span>
      </div>
      <div
        class="w-full h-[210px] overflow-y-auto overflow-x-hidden flex flex-col justify-start items-center mx-auto rounded-lg space-y-2 mt-4"
      >
        <div
          v-for="option in list.filter((e) => e.category === 'execution' && e.setupId === setupStore.selectedSetup.setupId)"
          :key="option.service"
          class="group mx-auto rounded-md cursor-pointer transition duration-200 shadow-xl shadow-[#141516] p-2"
          :class="{
            'bg-teal-600 hover:bg-teal-600 text-gray-200 border-2 border-teal-700': option.isConnected,
            'bg-[#282a2c] text-teal-600 border-2 border-gray-600 hover:border-teal-600': !option.isConnected,
            ' w-[190px] h-[55px]': props.client.service === 'SSVNetworkService',
            'w-[200px] h-[65px] text-md': props.client.service !== 'SSVNetworkService',
          }"
          @click="toggleConnection(option)"
        >
          <div class="w-full h-full flex justify-start items-center">
            <div class="p-1 flex justify-center items-center">
              <img class="w-9 h-9" :src="option.sIcon" alt="Service Icon" />
            </div>
            <div class="flex flex-col justify-center items-start space-y-1">
              <div class="font-semibold capitalize">
                <span> {{ option.name }}</span>
              </div>
              <div class="text-xs font-normal overflow-x-hidden" :class="option.isConnected ? 'text-gray-800' : 'text-gray-400'">
                <span> {{ shortID(option) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="list.length && list.some((e) => e.category === 'validator')"
      class="w-1/3 h-[250px] flex flex-col justify-start items-center"
    >
      <div class="w-full h-5 flex justify-center items-center">
        <span class="text-lg font-semibold text-gray-500">{{ $t("editModals.validatorClients") }}</span>
      </div>
      <div
        class="w-full h-[210px] overflow-y-auto overflow-x-hidden flex flex-col justify-start items-center mx-auto rounded-lg space-y-2 mt-4"
      >
        <div
          v-for="option in list.filter((e) => e.category === 'validator' && e.setupId === setupStore.selectedSetup.setupId)"
          :key="option.service"
          class="group mx-auto rounded-md cursor-pointer transition duration-200 shadow-xl shadow-[#141516] p-2"
          :class="{
            'bg-teal-600 hover:bg-teal-600 text-gray-200 border-2 border-teal-700': option.isConnected,
            'bg-[#282a2c] text-teal-600 border-2 border-gray-600 hover:border-teal-600': !option.isConnected,
            ' w-[190px] h-[55px]': props.client.service === 'SSVNetworkService',
            'w-[200px] h-[65px] text-md': props.client.service !== 'SSVNetworkService',
          }"
          @click="toggleConnection(option)"
        >
          <div class="w-full h-full flex justify-start items-center">
            <div class="p-1 flex justify-center items-center">
              <img class="w-9 h-9" :src="option.sIcon" alt="Service Icon" />
            </div>
            <div class="flex flex-col justify-center items-start space-y-1">
              <div class="font-semibold capitalize">
                <span> {{ option.name }}</span>
              </div>
              <div class="text-xs font-normal overflow-x-hidden" :class="option.isConnected ? 'text-gray-800' : 'text-gray-400'">
                <span> {{ shortID(option) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="list.length && list.some((e) => e.category === 'service')" class="w-1/3 h-[250px] flex flex-col justify-start items-center">
      <div class="w-full h-5 flex justify-center items-center">
        <span class="text-lg font-semibold text-gray-500">{{ "Other Services" }}</span>
      </div>
      <div
        class="w-full h-[210px] overflow-y-auto overflow-x-hidden flex flex-col justify-start items-center mx-auto rounded-lg space-y-2 mt-4"
      >
        <div
          v-for="option in list.filter((e) => e.category === 'service')"
          :key="option.service"
          class="group mx-auto rounded-md cursor-pointer transition duration-200 shadow-xl shadow-[#141516] p-2"
          :class="{
            'bg-teal-600 hover:bg-teal-600 text-gray-200 border-2 border-teal-700': option.isConnected,
            'bg-[#282a2c] text-teal-600 border-2 border-gray-600 hover:border-teal-600': !option.isConnected,
            ' w-[190px] h-[55px]': props.client.service === 'SSVNetworkService',
            'w-[200px] h-[65px] text-md': props.client.service !== 'SSVNetworkService',
          }"
          @click="toggleConnection(option)"
        >
          <div class="w-full h-full flex justify-start items-center">
            <div class="p-1 flex justify-center items-center">
              <img class="w-9 h-9" :src="option.sIcon" alt="Service Icon" />
            </div>
            <div class="flex flex-col justify-center items-start space-y-1">
              <div class="font-semibold capitalize">
                <span> {{ option.name }}</span>
              </div>
              <div class="text-xs font-normal overflow-x-hidden" :class="option.isConnected ? 'text-gray-800' : 'text-gray-400'">
                <span> {{ shortID(option) }}</span>
              </div>
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
import { useSetups } from "../../../../../store/setups";
import { useDeepClone } from "@/composables/utils";

const list = ref([]);

//Props
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

//Stores
const manageStore = useNodeManage();
const setupStore = useSetups();

//Lifecycle Hooks
onMounted(() => {
  manageStore.newConfiguration.forEach((e) => {
    e.isConnected = false;
  });
  list.value = getConnectionOptions();
  getConnectedClient();
});
//Methods
const updateProperties = () => {
  props.properties.executionClients = useDeepClone(list.value.filter((e) => e.category === "execution" && e.isConnected));
  props.properties.consensusClients = useDeepClone(
    list.value.filter((e) => (e.category === "consensus" || e.service === "CharonService") && e.isConnected)
  );

  props.properties.otherServices = list.value.filter((e) => e.category === "service" && e.isConnected);
};

const getConnectedClient = () => {
  list.value.forEach((service) => {
    if (service.config?.dependencies) {
      const allDependencies = props.client.config.dependencies?.consensusClients.concat(
        props.client.config.dependencies.executionClients,
        props.client.config.dependencies.otherServices
      );

      if (allDependencies && allDependencies.map((s) => s.id).includes(service.config.serviceID)) {
        service.isConnected = true;
      }
      if (props.client.service === "FlashbotsMevBoostService") {
        if (service.config.dependencies.mevboost.map((s) => s.id).includes(props.client.config.serviceID)) {
          service.isConnected = true;
        }
      }
    }
    updateProperties();
  });
};

const toggleConnection = (option) => {
  if (!option.isConnected) {
    option.isConnected = true;
  } else {
    option.isConnected = false;
  }
  updateProperties();
};

const getConnectionOptions = () => {
  switch (props.client.category) {
    case "execution":
      if (["OpGeth", "OpErigon"].includes(props.client.name)) {
        return manageStore.newConfiguration.filter((e) => e.service === "L2GethService");
      }
      return [];
    case "consensus":
      if (props.client.service === "OpNodeBeaconService") {
        return manageStore.newConfiguration.filter(
          (e) => (e.category === "execution" && e.name !== "L2Geth") || (e.category === "consensus" && !e.service.includes("Op"))
        );
      }
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
      if (props.client.service === "LidoObolExitService") {
        return manageStore.newConfiguration.filter((e) => /ValidatorEjector|Charon/.test(e.service) || e.category === "consensus");
      }
      if (props.client.service === "ValidatorEjectorService") {
        return manageStore.newConfiguration.filter((e) => /consensus|execution/.test(e.category));
      }
      if (props.client.service === "KeysAPIService") {
        return manageStore.newConfiguration.filter((e) => /consensus|execution/.test(e.category));
      }
      if (props.client.service === "SSVDKGService") {
        return manageStore.newConfiguration.filter((e) => /execution/.test(e.category));
      }
      break;
    default:
      return [];
  }
};

const shortID = (client) => {
  if (client?.config?.serviceID) {
    return client.config.serviceID.slice(0, 8) + "..." + client.config.serviceID.slice(-8);
  }
  return client.id;
};
</script>
