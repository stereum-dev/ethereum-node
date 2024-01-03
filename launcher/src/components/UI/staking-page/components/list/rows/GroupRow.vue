import { useStakingStore } from '@/store/theStaking';
<template>
  <div
    class="w-full h-8 bg-[#336666] rounded-full grid grid-cols-12 p-1 animate__animated"
    :class="isRemoveActive ? 'animate__slideOutRight animate__faster ' : 'animate__slideInLeft animate__delay-0.5s'"
  >
    <div class="col-start-1 col-end-5 self-center overflow-hidden flex justify-start items-center">
      <img class="w-6" src="/img/icon/the-staking/newfolder-icon.png" alt="Folder Icon" @mousedown.prevent />
      <span class="text-center text-xs text-gray-300 ml-1 overflow-hidden">{{ groupName }}</span>
    </div>
    <div
      class="col-start-5 col-end-8 self-center text-center text-sm text-gray-300 overflow-hidden flex justify-center items-center"
    >
      <span class="">{{ `Contains ${getkeyNumbers} key (s)` }}</span>
    </div>

    <div class="col-start-8 col-end-10 self-center overflow-hidden flex justify-start items-center">
      <span class="text-left ml-2 text-xs text-gray-300">{{ getBalanceSum }}</span>
    </div>
    <div class="col-start-10 col-span-full bg-[#151618] rounded-full grid grid-cols-3 items-center">
      <div class="col-start-1 col-span-1 justify-self-center">
        <img
          class="w-5 h-5 hover:scale-105 active:scale-95 cursor-pointer transition-all duration-150"
          src="/img/icon/the-staking/open-group.png"
          alt="Icon"
          @mousedown.prevent
          @click="openGroup(props.item)"
        />
      </div>
      <div class="col-start-2 col-span-1 justify-self-center">
        <img
          class="w-5 h-5 hover:scale-105 active:scale-95 cursor-pointer transition-all duration-150"
          src="/img/icon/the-staking/rename-group.png"
          alt="Icon"
          @mousedown.prevent
          @click="renameGroup(props.item)"
        />
      </div>

      <!-- <div class="col-start-3 col-span-1 justify-self-center">
        <img
          class="w-5 h-5 hover:scale-105 active:scale-95 cursor-pointer transition-all duration-150 opacity-30 pointer-events-none"
          src="/img/icon/the-staking/withdraw.png"
          alt="Icon"
          @mousedown.prevent
        />
      </div> -->
      <div class="col-start-3 col-span-1 justify-self-center">
        <img
          class="w-5 h-5 hover:scale-105 active:scale-95 cursor-pointer transition-all duration-150"
          src="/img/icon/the-staking/RemoveGroup.png"
          alt="Icon"
          @mousedown.prevent
          @click="removeGroup"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStakingStore } from "@/store/theStaking";

const props = defineProps({
  item: {
    type: Object || String,
    required: true,
  },
});

const stakingStore = useStakingStore();

const isRemoveActive = ref(false);

const getBalanceSum = computed(() => {
  return props.item.keys.reduce((acc, key) => {
    if (key.balance === "-") {
      return acc;
    }
    return acc + key.balance;
  }, 0);
});

const getkeyNumbers = computed(() => {
  return props.item.keys.length;
});

const groupName = computed(() => {
  return props.item.name;
});

const emit = defineEmits(["openGroup", "renameGroup", "withdrawGroup", "removeGroup"]);

const openGroup = (item) => {
  emit("openGroup", item);
};

const renameGroup = (item) => {
  emit("renameGroup", item);
};

const removeGroup = (item) => {
  stakingStore.currentGroup = item;
  stakingStore.setActiveModal("removeGroup");
};
</script>
