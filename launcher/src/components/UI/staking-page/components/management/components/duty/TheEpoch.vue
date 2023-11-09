import { computed } from 'vue';
<template>
  <div class="w-10 h-10 rounded-md flex flex-col justify-center items-center p-1" :class="getStateColor">
    <span class="text-[7px] font-semibold text-center uppercase" :class="getTextColor">{{ props.state }}</span>
    <span class="text-[10px] font-semibold text-center text-gray-300">{{ props.keyNumber }} </span>
    <img class="w-4 h-2" src="/img/icon/the-staking/keyIcon.png" alt="Key Icon" />
  </div>
</template>
<script setup>
import { computed } from "vue";

const props = defineProps({
  state: {
    type: String,
    required: true,
  },
  keyNumber: {
    type: Number,
    required: true,
  },
});

const getTextColor = computed(() => {
  let textColor;
  if (props.state === "pending") {
    textColor = "text-amber-400";
  } else if (props.state === "missed") {
    textColor = "text-red-800";
  } else if (props.state === "attested") {
    textColor = "text-green-400";
  }
  return textColor;
});
const getStateColor = computed(() => {
  let stateColor;
  if (props.state === "pending") {
    stateColor = "bg-gray-500 ";
  } else if (props.state === "missed") {
    stateColor = "bg-red-400 ";
  } else if (props.state === "attested") {
    stateColor = "bg-teal-800 ";
  }
  return stateColor;
});
</script>
