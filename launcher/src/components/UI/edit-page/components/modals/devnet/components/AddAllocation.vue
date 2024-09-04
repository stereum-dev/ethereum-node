<template>
  <div class="w-full mt-4 mx-auto px-4">
    <div class="w-full h-[240px]">
      <div class="flex flex-col justify-start space-y-1 p-2 items-center">
        <div class="w-full h-[180px] overflow-y-auto bg-[#101111] rounded-md p-2 flex flex-col justify-start items-center space-y-2">
          <div v-for="(item, address) in allocData" :key="address" class="w-full max-h-8 p-1 flex justify-between items-center space-x-1">
            <div class="w-1/2 flex items-center bg-slate-600 rounded-full p-1 overflow-hidden">
              <span class="text-sm font-normal text-gray-200 truncate">{{ address }} </span>
            </div>
            <div class="w-1/2 flex items-center bg-slate-600 rounded-full p-1 overflow-hidden">
              <span class="text-sm font-normal text-gray-200 truncate">{{ item.balance }}</span>
            </div>
          </div>
        </div>

        <div class="w-full max-h-[60px] col-start-1 col-span-full grid grid-cols-12 items-center gap-x-2 py-2">
          <div class="h-full col-start-1 col-end-6 flex flex-col justify-between items-center">
            <input
              v-model="newAddress"
              type="text"
              class="h-[35px] w-full text-sm font-semibold pl-2 text-gray-800 rounded-md overflow-hidden truncate border"
              :class="{ 'border-red-500': isInputEmpty }"
              placeholder="Account"
            />
          </div>
          <div class="h-full col-start-6 col-end-11 flex flex-col justify-between items-center">
            <input
              v-model="newBalance"
              type="text"
              class="h-[35px] w-full text-sm font-semibold rounded-md pl-2 text-gray-800 overflow-hidden truncate border"
              :class="{ 'border-red-500': isInputEmpty }"
              placeholder="Balance"
            />
          </div>
          <div
            class="h-[35px] w-full col-start-11 col-span-full bg-[#336666] rounded-md shadow-sm shadow-[#101111] cursor-pointer active:scale-95 active:shadow-none hover:bg-[#407d7d] flex justify-center items-center"
            @click="addAccount"
          >
            <span class="text-xs text-center text-gray-200 font-normal">Add Account</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGenesis } from "@/store/genesis";
import { ref, watch } from "vue";

const genesisStore = useGenesis();

const newAddress = ref("");
const newBalance = ref("");
const allocData = ref({});
const isInputEmpty = ref(false);

// Update allocation data in genesis store
const updateAllocData = () => {
  allocData.value = genesisStore.genesis.alloc;
};

watch(
  () => genesisStore.genesis.alloc,
  () => {
    updateAllocData();
  },
  { immediate: true }
);

// Add new allocation
const addAccount = () => {
  isInputEmpty.value = newAddress.value === "" || newBalance.value === "";
  if (newAddress.value && newBalance.value) {
    const newAlloc = {
      [newAddress.value]: { balance: newBalance.value },
    };

    genesisStore.updateGenesisAlloc(newAlloc);
    newAddress.value = "";
    newBalance.value = "";
  }
};
</script>
