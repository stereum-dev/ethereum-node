import { onMounted } from 'vue';
<template>
  <div class="mt-4">
    <div
      v-if="list.every((e) => e.category === 'consensus')"
      class="w-2/3 h-5 text-left pl-8 text-md font-semibold text-gray-500 mx-auto grid grid-cols-2 grid-flow-row mt-4"
    >
      <span class="col-start-1 col-span-1">Consensus Clients</span>
    </div>
    <div
      v-if="list.every((e) => e.category === 'consensus')"
      class="container w-2/3 grid grid-cols-2 grid-flow-row p-2 mx-auto rounded-lg gap-2"
    >
      <div
        v-for="option in list"
        :key="option.service"
        class="group mx-auto w-[170px] h-[45px] rounded-md cursor-pointer hover:bg-blue-300 m-0 active:scale-95 transition duration-200 shadow-xl shadow-[#141516] active:shadow-none"
        :class="{
          'bg-teal-600 hover:bg-teal-600 text-gray-200': option.isConnected || option.isConnectedToMevBoost,
          'bg-[#282a2c]': !option.isConnected,
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
              class="text-xs group-hover:text-gray-800 capitalize"
              :class="option.isConnected || option.isConnectedToMevBoost ? 'text-gray-800' : 'text-gray-200'"
            >
              <span> {{ option.clientID }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="list.every((e) => e.category === 'execution')"
      class="w-2/3 h-5 text-left pl-8 text-md font-semibold text-gray-500 mx-auto grid grid-cols-2 grid-flow-row"
    >
      <span class="col-start-1 col-span-1">Execution Clients</span>
    </div>
    <div
      v-if="list.every((e) => e.category === 'execution')"
      class="container w-2/3 grid grid-cols-2 grid-flow-row p-2 mx-auto rounded-lg gap-2"
    >
      <div
        v-for="option in list"
        :key="option.service"
        class="group mx-auto w-[170px] h-[45px] rounded-md cursor-pointer hover:bg-blue-300 m-0 active:scale-95 transition duration-200 shadow-xl shadow-[#141516] active:shadow-none"
        :class="{
          'bg-teal-600 hover:bg-teal-600 text-gray-200': option.isConnected,
          'bg-[#282a2c] text-teal-600': !option.isConnected,
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
              class="text-xs font-semibold group-hover:text-gray-800 capitalize"
              :class="option.isConnected ? 'text-gray-800' : 'text-gray-200'"
            >
              <span> {{ option.clientID }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="list.every((e) => e.category === 'validator')"
      class="w-2/3 h-5 text-left pl-8 text-md font-semibold text-gray-500 mx-auto grid grid-cols-2 grid-flow-row mt-4"
    >
      <span class="col-start-1 col-span-1">Validator Clients</span>
    </div>
    <div
      v-if="list.every((e) => e.category === 'validator')"
      class="container w-2/3 grid grid-cols-2 grid-flow-row p-2 mx-auto rounded-lg gap-2 mt-4"
    >
      <div
        v-for="option in list"
        :key="option.service"
        class="group mx-auto w-[170px] h-[45px] rounded-md cursor-pointer hover:bg-blue-300 m-0 active:scale-95 transition duration-200 shadow-xl shadow-[#141516] active:shadow-none"
        :class="{
          'bg-teal-600 hover:bg-teal-600 text-gray-200': option.isConnected,
          'bg-[#282a2c] text-teal-600': !option.isConnected,
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
              class="text-xs font-semibold text-gray-200 group-hover:text-gray-800 capitalize"
              :class="option.isConnected ? 'text-gray-800' : 'text-gray-200'"
            >
              <span> {{ option.clientID }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="list.some((e) => e.category === 'execution') && list.some((e) => e.category === 'consensus')"
      class="w-2/3 h-5 text-left pl-8 text-md font-semibold text-gray-500 mx-auto grid grid-cols-2 grid-flow-row"
    >
      <span class="col-start-1 col-span-1">Execution Clients</span>
      <span class="col-start-2 col-span-1">Consensus Clients</span>
    </div>
    <div
      v-if="list.some((e) => e.category === 'execution') && list.some((e) => e.category === 'consensus')"
      class="container w-2/3 grid grid-cols-2 grid-flow-row p-2 mx-auto rounded-lg gap-2"
    >
      <div
        v-for="(option, idx) in list.filter((e) => e.category === 'execution')"
        :key="option.service"
        class="group col-start-1 col-span-1 mx-auto w-[170px] h-[45px] rounded-md cursor-pointer hover:bg-blue-300 m-0 active:scale-95 transition duration-200 shadow-xl shadow-[#141516] active:shadow-none"
        :class="[
          option.isConnectedToSSVNetwork ? 'bg-teal-600 hover:bg-teal-600 text-gray-200' : 'bg-[#282a2c] text-teal-600',
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
              class="text-xs font-semibold group-hover:text-gray-800 capitalize"
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
          option.isConnectedToSSVNetwork ? 'bg-teal-600 hover:bg-teal-600 text-gray-200' : 'bg-[#282a2c] text-teal-600',
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
              class="text-xs font-semibold capitalize"
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
const { list } = defineProps({
  list: {
    type: Array,
    default: null,
  },
  client: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["selectService"]);

const selectService = (option) => {
  option = {
    ...option,
    isSelected: true,
  };
  emit("selectService", option);
};
</script>
