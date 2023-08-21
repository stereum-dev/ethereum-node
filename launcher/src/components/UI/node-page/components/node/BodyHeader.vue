<template>
  <div class="w-full h-[55px] grid grid-cols-9 gap-1 py-1">
    <div class="col-start-1 col-span-3 flex flex-col justify-between items-center">
      <div class="w-full border border-gray-500 rounded-md flex justify-start items-center bg-[#151618] px-2 h-[25px]">
        <span class="text-xs text-gray-100 overflow-hidden whitespace-pre pl-3">Server Name :</span>
        <span class="text-sm pl-2 text-yellow-500 overflow-hidden whitespace-pre">{{ ServerName }}</span>
      </div>
      <div class="w-full border border-gray-500 rounded-md flex justify-start items-center bg-[#151618] px-2 h-[25px]">
        <span class="text-xs text-left text-gray-100 overflow-hidden whitespace-pre pl-3">Server IP :</span>
        <span class="text-sm pl-2 text-yellow-500 overflow-hidden whitespace-pre">{{ ipAddress }}</span>
      </div>
    </div>

    <div class="col-start-4 col-end-7 grid grid-cols-3 gap-1 justify-center items-center">
      <div
        v-for="config in configs"
        :key="config.id"
        class="col-span-1 w-full border border-gray-500 rounded-md flex justify-evenly items-center bg-[#151618] px-2 h-[25px] cursor-pointer"
      >
        <p class="text-[10px] text-left text-gray-100 overflow-hidden whitespace-pre">
          {{ config.configName }}<span class="text-[16px] ml-1 font-semibold">{{ config.id }}#</span>
        </p>
      </div>
    </div>

    <div class="col-start-7 col-span-3">
      <div class="w-full border h-[25px] border-gray-500 rounded-md flex justify-center items-center bg-[#151618]">
        <img :src="currentNetwork.icon" alt="Networks" class="w-4 mr-1" />
        <span class="text-[12px] text-left text-gray-100 overflow-hidden whitespace-pre">{{
          currentNetwork.name
        }}</span>
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
      configs: [
        { id: 1, configName: "config" },
        { id: 2, configName: "config" },
        { id: 3, configName: "config" },
        { id: 4, configName: "config" },
        { id: 5, configName: "config" },
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
