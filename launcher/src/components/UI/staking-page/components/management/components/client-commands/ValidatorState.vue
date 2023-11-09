<template>
  <div
    class="w-full h-full col-start-1 col-span-full row-start-2 row-span-1 bg-black rounded-md grid grid-cols-6 grid-rows-1 items-center px-2"
  >
    <span class="relative h-3 w-3 rounded-full col-start-1 col-span-1 flex justify-center items-center">
      <span
        class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
        :class="getStateColor"
      ></span>
      <span class="relative inline-flex rounded-full h-3 w-3" :class="getStateColor"></span>
    </span>
    <span class="text-xs font-semibold text-center col-start-2 col-end-5 capitalize" :class="getTextColor">{{
      props.state === "running" ? "running" : "off"
    }}</span>
    <img class="w-4 col-start-5 col-span-1" src="/img/icon/the-staking/keyIcon.png" alt="Key Icon" />
    <span
      class="text-[10px] font-semibold text-center col-start-6 col-span-1"
      :class="stakingStore.keyCounter > 0 ? 'text-green-600' : 'text-red-500'"
      >{{ stakingStore.keyCounter }}
    </span>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStakingStore } from "@/store/theStaking";

const props = defineProps({
  state: {
    type: String,
    required: true,
  },
});

const stakingStore = useStakingStore();

const getTextColor = computed(() => {
  let textColor;
  if (props.state === "off") {
    textColor = "text-red-500";
  } else if (props.state === "running") {
    textColor = "text-green-600";
  }
  return textColor;
});

const getStateColor = computed(() => {
  let stateColor;
  if (props.state === "off") {
    stateColor = "bg-red-500";
  } else if (props.state === "running") {
    stateColor = "bg-green-600";
  }
  return stateColor;
});
</script>
