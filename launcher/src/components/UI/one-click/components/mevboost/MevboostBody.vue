<template>
  <div class="w-full h-full col-start-1 col-span-full row-start-3 row-end-11 grid grid-cols-12 grid-rows-7 p-2 mx-auto">
    <div class="w-full h-full col-start-3 col-end-11 row-start-1 row-span-full bg-[#1E2429] rounded-md grid grid-cols-12 grid-rows-7 p-4">
      <div class="col-start-1 col-span-full row-start-1 row-span-1 grid grid-cols-12 gap-1">
        <div class="w-full h-10 col-start-1 col-end-7 flex justify-center items-center">
          <div class="w-2/3 h-8 border border-gray-600 rounded-md p-1 flex justify-center items-center mr-[25px]">
            <span class="text-center text-gray-400 text-md font-normal">{{ $t("mevboostConfig.availRelays") }}</span>
          </div>
        </div>
        <div class="w-full h-10 col-start-7 col-end-13 flex justify-center items-center">
          <div class="w-2/3 h-8 border border-gray-600 rounded-md p-1 flex justify-center items-center ml-[25px]">
            <span class="text-center text-gray-400 text-md font-normal">{{ $t("mevboostConfig.usedRelays") }}</span>
          </div>
        </div>
      </div>
      <div class="col-start-1 col-span-full row-start-1 row-span-full grid grid-cols-11 grid-rows-7 gap-1">
        <div class="col-start-1 col-end-6 row-start-2 row-span-full flex justify-center items-center">
          <AvailableRelays :availables="availableBlocks" @add-item="selectItemToAdd" @double-click="doubleClickAdd" />
        </div>
        <div class="col-start-6 col-span-1 row-start-1 row-span-full grid grid-cols-1 grid-rows-5">
          <div
            class="w-8 h-8 justify-self-center self-end col-start-1 row-start-2 row-span-1 bg-[#1b1c1c] rounded-md p-1 cursor-pointer flex justify-center items-center hover:bg-[#383c3f] hover:shadow-lg hover:shadow-gray-950 hover:scale-110 active:scale-100 transition-all duration-300 ease-in-out"
            @click="addBlocksToUse"
          >
            <img class="w-4 h-4" src="/img/icon/one-click-icons/mevboost-icons/arrow-right.png" alt="icon" />
          </div>
          <div
            class="w-8 h-8 justify-self-center self-start col-start-1 row-start-4 row-span-1 bg-[#1b1c1c] rounded-md p-1 cursor-pointer flex justify-center items-center hover:bg-[#383c3f] hover:shadow-lg hover:shadow-gray-950 hover:scale-110 active:scale-100 transition-all duration-300 ease-in-out"
            @click="removeFromUsedBlocks"
          >
            <img class="w-4 h-4" src="/img/icon/one-click-icons/mevboost-icons/arrow-left.png" alt="icon" />
          </div>
        </div>
        <div class="col-start-7 col-span-6 row-start-2 row-span-full flex justify-center items-center">
          <UsedRelays :used-relays="manageStore.usedBlocks" @remove-item="selectItemToRemove" @double-remove="removeFromUsedBlocks" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useClickInstall } from "@/store/clickInstallation";
import { useNodeManage } from "@/store/nodeManage";
import AvailableRelays from "./AvailableRelays.vue";
import UsedRelays from "./UsedRelays.vue";
import { onMounted, computed } from "vue";

const installStore = useClickInstall();
const manageStore = useNodeManage();

const availableBlocks = computed({
  get: () => manageStore.availableBlocks,
  set: () => (manageStore.availableBlocks = shuffleRelaysList(manageStore.relaysList.filter((r) => r[manageStore.currentNetwork.network]))),
});

//Lifecycle Hooks

// Initialize availableBlocks with shuffled relays
onMounted(() => {
  manageStore.availableBlocks = shuffleRelaysList(manageStore.relaysList.filter((r) => r[manageStore.currentNetwork.network]));
  if (installStore.resetMevBoost) {
    removeAll();
    installStore.resetMevBoost = false;
  }
  if (/lidocsm|lidoobol/.test(installStore.selectedPreset.name)) {
    addAll();
  }
  if (installStore.selectedPreset.name === "lidossv") {
    const flashbots = manageStore.availableBlocks.find((r) => r.name.toLowerCase() === "flashbots");
    flashbots.isSelected = true;
    addBlocksToUse();
    flashbots.isSelected = false;
  }
});

// Methods
// Shuffles an array randomly
const shuffleRelaysList = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Add all items from availableBlocks to usedBlocks
const addAll = () => {
  manageStore.availableBlocks.forEach((item) => {
    item.isSelected = true;
  });
  addBlocksToUse();
  manageStore.availableBlocks.forEach((item) => {
    item.isSelected = false;
  });
};

// Remove all items from usedBlocks
const removeAll = () => {
  manageStore.usedBlocks.forEach((item) => {
    item.isRemoved = false;
    item.isSeected = false;
  });
  manageStore.usedBlocks = [];
  installStore.relayURL = "";
};

// Add an item from availableBlocks to usedBlocks
const doubleClickAdd = (el) => {
  manageStore.availableBlocks.forEach((item) => {
    if (item.id == el.id) {
      item.isSelected = true;
    }
  });
  addBlocksToUse();
};

// Select an item from availableBlocks
const selectItemToAdd = (el) => {
  manageStore.availableBlocks.map((item) => {
    if (item.id == el.id) {
      item.isSelected = true;
    }
  });
};

// Select an item from usedBlocks
const selectItemToRemove = (item) => {
  const block = manageStore.usedBlocks.find((e) => e.id == item.id);
  block.isRemoved = true;
};

// Add selected items from availableBlocks to usedBlocks
const addBlocksToUse = () => {
  manageStore.availableBlocks.forEach((i) => {
    if (i.isSelected && !manageStore.usedBlocks.includes(i)) {
      i.isSelected = false;
      manageStore.usedBlocks.push(i);
    }
  });
  installStore.relayURL = manageStore.usedBlocks.map((r) => r[manageStore.currentNetwork.network]).join();
};

// Remove items from usedBlocks that are marked for removal
const removeFromUsedBlocks = () => {
  manageStore.usedBlocks.forEach((item) => {
    if (item.isRemoved) {
      item.isRemoved = false;
      manageStore.usedBlocks.splice(manageStore.usedBlocks.indexOf(item), 1);
    }
  });
  installStore.relayURL = manageStore.usedBlocks.map((r) => r[manageStore.currentNetwork.network]).join();
};
</script>
