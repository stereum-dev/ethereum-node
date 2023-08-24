<template>
  <div class="w-full h-[55px] grid grid-cols-9 gap-1 py-1">
    <div
      class="col-start-1 col-span-3 flex flex-col justify-between items-center border border-gray-600 rounded-md bg-[#151618]"
    >
      <div class="w-full flex justify-start items-center px-2 h-[25px]">
        <span class="text-xs text-gray-100 overflow-hidden whitespace-pre ml-5">Server :</span>
        <span class="text-sm ml-1 text-yellow-500 overflow-hidden whitespace-pre">{{ ServerName }}</span>
      </div>
      <div class="w-full flex justify-start items-center px-2 h-[25px]">
        <span class="text-xs text-left text-gray-100 overflow-hidden whitespace-pre ml-[5px]">Server IP :</span>
        <span class="text-sm pl-2 text-yellow-500 overflow-hidden whitespace-pre">{{ ipAddress }}</span>
      </div>
    </div>

    <div class="col-start-4 col-end-7 grid grid-cols-3 grid-rows-2 gap-1 justify-center items-center">
      <button
        class="w-full h-full rounded-md col-start-1 row-start-1 row-span-2 text-xs text-gray-100 p-1 shadow-md shadow-gray-800 border border-gray-500 font-semibold bg-[#264744]"
        :class="{
          'cursor-not-allowed bg-[#38504e] border-none': !disabledButton,
          ' cursor-pointer': !btnStatus,
        }"
        :disabled="!disabledButton"
      >
        Add Config
      </button>
      <div
        v-for="config in configs"
        :key="config.id"
        class="col-span-1 row-span-1 w-full h-full border border-gray-600 rounded-md flex justify-evenly items-center bg-[#151618] cursor-pointer"
      >
        <p
          class="text-[12px] text-left text-gray-100 overflow-hidden whitespace-pre"
          :class="{ 'text-gray-500': !config.status }"
        >
          {{ config.configName }}<span class="text-[12px] font-semibold">{{ config.id }}#</span>
        </p>
      </div>
    </div>

    <div
      class="col-start-7 col-span-3 flex flex-col justify-between items-center bg-[#151618] border h-full border-gray-600 rounded-md px-2 py-1"
    >
      <div class="w-full self-start text-xs font-semibold text-teal-700">Current Network</div>
      <div class="w-full flex justify-center items-center">
        <img :src="currentNetwork.icon" alt="Networks" class="w-5 mr-1" />
        <span class="text-md text-gray-300 text-left overflow-hidden whitespace-pre">{{ currentNetwork.name }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapWritableState } from "pinia";
import { useNodeManage } from "@/store/nodeManage";
import { useControlStore } from "@/store/theControl";
export default {
  name: "NodeHeader",
  components: {},
  props: {},
  data() {
    return {
      disabledButton: false,
      configs: [
        { id: 1, configName: "config", status: true },
        { id: 2, configName: "config", status: false },
        { id: 3, configName: "config", status: false },
        {
          id: 4,
          configName: "config",
          status: false,
        },
      ],
    };
  },
  computed: {
    ...mapWritableState(useNodeManage, {
      currentNetwork: "currentNetwork",
    }),
    ...mapWritableState(useControlStore, {
      ServerName: "ServerName",
      ipAddress: "ipAddress",
    }),
  },
  mounted() {},
  methods: {},
};
</script>
