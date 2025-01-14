<template>
  <div
    class="w-full h-full col-start-1 col-span-full row-start-1 row-span-1 bg-black rounded-md grid grid-cols-6 grid-rows-1 items-center px-2"
  >
    <img
      v-if="getServiceIcon !== null"
      class="w-5 h-5 col-start-1 col-span-1"
      :src="getServiceIcon"
      alt="Service Icon"
      @mousedown.prevent
      @mouseenter="footerStore.cursorLocation = `${valClint}`"
      @mouseleave="footerStore.cursorLocation = ''"
    />
    <img
      v-else
      class="w-5 h-5 col-start-1 col-span-1"
      src="/animation/loading/loading-circle.gif"
      alt="Service Icon"
      @mousedown.prevent
      @mouseenter="footerStore.cursorLocation = `${valClint}`"
      @mouseleave="footerStore.cursorLocation = ''"
    />

    <div
      v-if="getServiceIcon !== null"
      class="col-start-2 col-end-5 flex justify-center items-center space-x-1 relative"
      @mouseenter="footerStore.cursorLocation = `${valStat}`"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <span
        class="relative animate-pulse h-3 w-3 rounded-full col-start-2 col-span-1 flex justify-center items-center"
        :class="getStateColor"
      >
      </span>

      <span
        class="text-xs font-semibold text-center col-start-3 col-end-5 capitalize"
        :class="getTextColor"
        >{{ getServiceState }}</span
      >
    </div>

    <img
      class="w-4 col-start-5 col-span-1 justify-self-center"
      src="/img/icon/staking-page-icons/keyIcon.png"
      alt="Key Icon"
      @mousedown.prevent
    />
    <span
      class="text-[10px] font-semibold text-center col-start-6 col-span-1"
      :class="getTextColor"
      @mouseenter="footerStore.cursorLocation = `${numValidator}`"
      @mouseleave="footerStore.cursorLocation = ''"
      >{{ stakingStore.keyNumbers }}
    </span>
  </div>
</template>

<script setup>
import i18n from "@/includes/i18n";
import { useFooter } from "@/store/theFooter";
import { useStakingStore } from "@/store/theStaking";
import { computed, watch } from "vue";

const t = i18n.global.t;

const footerStore = useFooter();

const valClint = t("displayValidator.valClint");
const valStat = t("displayValidator.valStat");
const numValidator = t("displayValidator.numValidator");

const stakingStore = useStakingStore();

const getServiceIcon = computed(() => {
  return stakingStore.selectedServiceToFilter?.icon ?? null;
});

const getServiceState = computed(() => {
  let state;
  if (stakingStore.selectedServiceToFilter?.state === "running") {
    state = "online";
  } else {
    state = "offline";
  }
  return state;
});

const getTextColor = computed(() => {
  if (getServiceState.value === "online") {
    return "text-green-500";
  } else if (getServiceState.value === "offline") {
    return "text-red-500";
  }

  return "text-gray-500";
});

const getStateColor = computed(() => {
  if (getServiceState.value === "online") {
    return "bg-green-400";
  } else if (getServiceState.value === "offline") {
    return "bg-red-500";
  }

  return "bg-gray-500";
});

watch(
  () => [stakingStore.selectedServiceToFilter, stakingStore.keys],
  ([service, keys]) => {
    if (!service || keys.length === 0) {
      stakingStore.keyNumbers = 0;
      return;
    }
    stakingStore.keyNumbers = stakingStore.keys.filter(
      (key) => key.validatorID === service.config.serviceID
    ).length;
  },
  { immediate: true }
);
</script>
