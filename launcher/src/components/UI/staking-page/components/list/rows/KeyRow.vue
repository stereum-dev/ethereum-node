import { computed } from 'vue';
<template>
  <div
    class="w-full h-8 rounded-full grid grid-cols-24 items-center p-1 cursor-pointer"
    :class="props.item?.selected ? 'bg-blue-400 ' : 'bg-gray-700 '"
    @click="selectKey(props.item)"
  >
    <div class="col-start-1 col-span-1 self-center overflow-hidden flex justify-start items-center">
      <span class="w-5 h-5 rounded-full cursor-pointer bg-white"></span>
    </div>
    <div class="col-start-2 col-end-9 self-center overflow-hidden flex justify-start items-center">
      <span
        class="text-center font-semibold text-sm ml-1"
        :class="props.item?.selected ? 'text-gray-800' : 'text-gray-300'"
        >{{ props.item?.displayName ? props.item?.displayName : formattedPubKey }}</span
      >
    </div>

    <img class="w-6 h-6 col-start-9 col-end-11 self-center mx-auto" :src="props.item?.icon" alt="Client Icon" />
    <span
      class="col-start-11 col-end-13 self-center text-center text-xs text-gray-300 overflow-hidden"
      :class="props.item.selected ? 'text-gray-800' : 'text-gray-300'"
      >{{ props.item.activeSince }}</span
    >
    <div class="w-full col-start-13 col-end-15 self-center overflow-hidden flex justify-center items-center">
      <img class="w-6 h-6" :src="stateIconHandler" alt="icon" />
    </div>

    <span
      class="col-start-15 col-end-18 self-center text-left text-xs text-gray-300 overflow-hidden"
      :class="props.item.selected ? 'text-gray-800' : 'text-gray-300'"
      >{{ props.item.balance }}</span
    >

    <div class="h-full col-start-18 col-span-full bg-[#151618] rounded-full grid grid-cols-4 items-center">
      <div class="col-start-1 col-span-1 w-4 h-4 bg-teal-800 rounded-md justify-self-center"></div>
      <div class="col-start-2 col-span-1 w-4 h-4 bg-teal-800 rounded-md justify-self-center"></div>
      <div class="col-start-3 col-span-1 w-4 h-4 bg-teal-800 rounded-md justify-self-center"></div>
      <div class="col-start-4 col-span-1 w-4 h-4 bg-teal-800 rounded-md justify-self-center"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStakingStore } from "@/store/theStaking";

const props = defineProps({
  item: {
    type: Object || String,
    required: true,
  },
});

const stakingStore = useStakingStore();

const activeStatusIcon = "/img/icon/the-staking/Validatorkey_Status_Active.png";
const slashedStatusIcon = "/img/icon/the-staking/Validatorkey_Status_Slashed.png";
const depositStatusIcon = "/img/icon/the-staking/Validatorkey_Status_Deposit.png";
const offlineStatusIcon = "/img/icon/the-staking/Validatorkey_Status_Offline.png";
const pendingStatusIcon = "/img/icon/the-staking/Validatorkey_Status_Pending_alternative.png";
const exitedStatusIcon = "/img/icon/the-staking/Validatorkey_Status_Exited.png";
const apiProblems = "/img/icon/the-staking/State_Icon.png";
const apiLoading = "/img/icon/task-manager-icons/turning_circle.gif";

const formattedPubKey = computed(() => {
  const pubkey = props.item.key;
  if (pubkey && pubkey.length > 20) {
    return `${pubkey.substring(0, 10)} . . . ${pubkey.substring(pubkey.length - 10)}`;
  }
  return pubkey;
});

const stateIconHandler = computed(() => {
  switch (props.item.status) {
    case "active_online":
      return activeStatusIcon;
    case "active":
      return activeStatusIcon;
    case "active_offline":
      return offlineStatusIcon;
    case "slashed":
      return slashedStatusIcon;
    case "pending":
      return pendingStatusIcon;
    case "exited":
      return exitedStatusIcon;
    case "withdrawal":
      return exitedStatusIcon;
    case "NA":
      return apiProblems;
    case "loading":
      return apiLoading;
    default:
      return depositStatusIcon;
  }
});

const selectKey = (key) => {
  if (stakingStore.isGroupingAllowed) {
    stakingStore.keys.forEach((item) => {
      if (item.key === key.key) {
        item.selected = !item.selected;
      }
    });
    stakingStore.selectedValidatorKeys = stakingStore.keys.filter((item) => item.selected);
  }
};
</script>
<style scoped>
* {
  box-sizing: border-box;
}
</style>
