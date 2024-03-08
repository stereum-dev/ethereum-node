<template>
  <div
    class="animate__animated animate__fadeIn w-full h-full max-h-[32px] col-start-1 col-span-full rounded-sm flex justify-center items-center cursor-pointer border border-[#3e4347] px-[1px]"
  >
    <div class="w-full h-7 grid grid-cols-12 bg-[#171D22] space-x-1 cursor-default">
      <div
        class="col-start-1 col-end-3 w-full h-full flex justify-start items-center bg-[#a7aeb5] hover:bg-slate-300 rounded-sm space-x-1 cursor-pointer transition-all duration-150 px-1"
        :class="getLocalWeb3Signer?.config?.serviceID ? 'cursor-pointer' : 'pointer-events-none opacity-50'"
        @click="openLocalList"
      >
        <img class="w-5 h-5" :src="web3SignerAssets.icon" alt="Service Icon" @mousedown.prevent />
        <span class="text-[10px] text-gray-700 font-semibold">{{ web3SignerAssets.name }}</span>
      </div>
      <input
        id="input1"
        v-model="stakingStore.remoteUrl"
        class="col-start-3 col-end-11 w-full h-full bg-[#171D22] border px-4 rounded-sm outline-none text-xs text-gray-400 border-gray-500 placeholder:text-gray-400"
        type="text"
        autofocus
        placeholder="Add URL to import remote keys"
        @change="changeActive"
      />
      <div class="col-start-11 col-span-1 h-full flex justify-center items-center px-1">
        <div
          class="w-6 h-6 rounded-md bg-[#3e4347] p-1 flex justify-center items-center hover:scale-110 border border-[#171D22] active:scale-100 hover:shadow-md hover:shadow-[#101214] hover:border-[#3f4851] active:shadow-none transition-all duration-150 cursor-pointer"
          @click="closePanel"
        >
          <img class="w-4 h-4" src="/img/icon/staking-page-icons/close.png" alt="Close Icon" @mousedown.prevent />
        </div>
      </div>
      <div class="col-start-12 col-span-1 h-full flex justify-center items-center px-1">
        <div
          class="w-6 h-6 rounded-md bg-[#3e4347] p-1 flex justify-center items-center hover:scale-110 border border-[#171D22] active:scale-100 hover:shadow-md hover:shadow-[#101214] hover:border-[#3f4851] active:shadow-none transition-all duration-150"
          :class="stakingStore.remoteUrl !== '' ? 'cursor-pointer' : 'pointer-events-none opacity-50'"
          @click="getRemoteList"
        >
          <img class="w-4 h-4" src="/img/icon/staking-page-icons/check.png" alt="Check Icon" @mousedown.prevent />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue";
import { useServices } from "@/store/services";
import { useStakingStore } from "@/store/theStaking";

const serviceStore = useServices();
const stakingStore = useStakingStore();
const web3SignerAssets = serviceStore.allServices.find((s) => s.service === "Web3SignerService");

const getLocalWeb3Signer = computed(() => {
  return serviceStore.installedServices.find((s) => s.service === "Web3SignerService");
});

const openLocalList = () => {
  stakingStore.isRemoteListActive = true;
  stakingStore.setActivePanel("manualRemote");
};

const closePanel = () => {
  stakingStore.setActivePanel(null);
  stakingStore.isRemoteListActive = false;
};

const getRemoteList = async () => {
  if (stakingStore.remoteUrl !== "") {
    stakingStore.isRemoteListActive = true;
    stakingStore.setActivePanel("manualRemote");
  }
};
</script>
