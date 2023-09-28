<template>
  <custom-modal
    main-title="Service Modify"
    confirm-text="Confirm"
    click-outside-text="Click outside to cancel"
    @close-window="closeWindow"
    @confirm-action="confirmModify"
  >
    <template #content>
      <div class="w-1/2 p-1 mx-auto flex justify-center items-center">
        <div class="w-1/4 p-1 flex justify-center items-center">
          <img class="w-14" :src="client.sIcon" alt="Service Icon" />
        </div>
        <div class="w-3/4 flex flex-col justify-center items-start">
          <div class="text-lg font-semibold text-gray-200 capitalize">
            <span> {{ client.name }}</span> - <span>{{ client.category }}</span>
          </div>
          <div class="text-lg font-semibold text-gray-400 capitalize"><span>Modify Connection</span></div>
        </div>
      </div>
      <div
        v-if="client.category === 'consensus' && client.service !== 'SSVNetworkService'"
        class="w-2/3 h-5 text-left pl-2 text-md font-semibold text-gray-500 mx-auto"
      >
        Execution Clients
      </div>
      <div
        v-if="client.category === 'validator' && client.service !== 'SSVNetworkService'"
        class="w-2/3 h-5 text-left pl-2 text-md font-semibold text-gray-500 mx-auto"
      >
        Consensus Clients
      </div>
      <div
        v-if="client.service !== 'SSVNetworkService'"
        class="container w-2/3 grid grid-cols-2 grid-flow-row p-2 mx-auto rounded-lg gap-2"
      >
        <div
          v-for="option in options"
          :key="option.config.serviceID"
          class="w-[160px] h-[52px] rounded-md p-1 cursor-pointer hover:border-blue-500 m-0 active:scale-95 transition duration-200 shadow-xl shadow-[#141516] active:shadow-none"
          :class="
            option.isConnectedToConsensus || option.isConnectedToValidator
              ? dynamicClasses
              : 'border border-gray-700 bg-[#2d3748] '
          "
          @click="selectService(option)"
        >
          <div class="flex justify-center items-center">
            <div class="p-1 flex justify-center items-center">
              <img class="w-9 h-9" :src="option.sIcon" alt="Service Icon" />
            </div>
            <div class="flex flex-col justify-center items-start">
              <div class="text-sm font-semibold text-gray-300 capitalize">
                <span> {{ option.name }}</span>
              </div>
              <div class="text-xs text-gray-300 capitalize">
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
        <span>Consensus Clients</span>
        <span>Execution Clients</span>
      </div>
      <div
        v-if="client.service === 'SSVNetworkService'"
        class="container w-2/3 grid grid-cols-2 grid-flow-row p-2 mx-auto rounded-lg gap-2"
      >
        <div class="col-start-1 col-span-1 space-y-2 flex flex-col justify-center items-center">
          <div
            v-for="option in options.filter((e) => e.category === 'consensus')"
            :key="option.config.serviceID"
            class="justify-self-center w-[160px] h-[52px] rounded-md p-1 cursor-pointer hover:border-blue-500 m-0 active:scale-95 transition duration-200 shadow-xl shadow-[#141516] active:shadow-none"
            :class="
              option.isConnectedToConsensus || option.isConnectedToValidator
                ? dynamicClasses
                : 'border border-gray-700 bg-[#2d3748] '
            "
            @click="selectService(option)"
          >
            <div class="flex justify-between items-center">
              <div class="p-1 flex justify-center items-center">
                <img class="w-9 h-9" :src="option.sIcon" alt="Service Icon" />
              </div>
              <div class="flex flex-col justify-center items-start">
                <div class="text-sm font-semibold text-gray-300 capitalize">
                  <span> {{ option.name }}</span>
                </div>
                <div class="text-xs text-gray-300 capitalize">
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
            class="justify-self-center w-[160px] h-[52px] rounded-md p-1 cursor-pointer hover:border-blue-500 m-0 active:scale-95 transition duration-200 shadow-xl shadow-[#141516] active:shadow-none"
            :class="
              option.isConnectedToConsensus || option.isConnectedToValidator
                ? dynamicClasses
                : 'border border-gray-700 bg-[#2d3748] '
            "
            @click="selectService(option)"
          >
            <div class="flex justify-between items-center">
              <div class="p-1 flex justify-center items-center">
                <img class="w-9 h-9" :src="option.sIcon" alt="Service Icon" />
              </div>
              <div class="flex flex-col justify-center items-start">
                <div class="text-sm font-semibold text-gray-300 capitalize">
                  <span> {{ option.name }}</span>
                </div>
                <div class="text-xs text-gray-300 capitalize">
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

import { computed, ref, onMounted } from "vue";

const { client } = defineProps({
  client: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["closeWindow", "confirmModify"]);

const dynamicClasses = ref("");
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
});

//Methods

const getDynamicClasses = () => {
  const element = options.value[0];

  if (options.value.length > 0 && element.category === "execution") {
    manageStore.newConfiguration.forEach((e) => {
      if (e.category === "execution" && e.config.dependencies.executionClients[0]) {
        e.isConnectedToConsensus = true;
        dynamicClasses.value = "border border-green-500 bg-green-500";
      }
    });
  } else if (options.value.length > 0 && element.category === "consensus") {
    manageStore.newConfiguration.forEach((e) => {
      if (e.category === "consensus" && e.config.dependencies.executionClients[0]) {
        e.isConnectedToValidator = true;
        dynamicClasses.value = "border border-green-500 bg-green-500";
      }
    });
  } else if (client.category === "validator " && client.service === "SSVNetworkService") {
    dynamicClasses.value = "border border-green-500 bg-green-500";
  }
};

const confirmModify = () => {
  emit("confirmModify");
};

const closeWindow = () => {
  emit("closeWindow");
};

const selectService = (option) => {
  emit("selectService", option);
};
</script>
