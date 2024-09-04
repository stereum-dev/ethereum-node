<template>
  <div
    class="w-full h-full col-start-1 col-span-full row-start-1 row-span-1 bg-black rounded-md grid grid-cols-6 grid-rows-1 items-center px-2"
  >
    <img
      class="w-5 h-5 col-start-1 col-span-1"
      :src="getServiceIcon"
      alt="Service Icon"
      @mousedown.prevent
      @mouseenter="footerStore.cursorLocation = `${valClint}`"
      @mouseleave="footerStore.cursorLocation = ''"
    />

    <div
      class="col-start-2 col-end-5 flex justify-center items-center space-x-1 relative"
      @mouseenter="footerStore.cursorLocation = `${valStat}`"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <span
        class="relative animate-pulse h-3 w-3 rounded-full col-start-2 col-span-1 flex justify-center items-center"
        :class="getStateColor"
      >
      </span>

      <span class="text-xs font-semibold text-center col-start-3 col-end-5 capitalize" :class="getTextColor">{{ getServiceState }}</span>
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
import { computed, watch } from "vue";
import { useStakingStore } from "@/store/theStaking";
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";

const t = i18n.global.t;

const footerStore = useFooter();

const valClint = t("displayValidator.valClint");
const valStat = t("displayValidator.valStat");
const numValidator = t("displayValidator.numValidator");

const stakingStore = useStakingStore();

const getServiceState = computed(() => {
  return stakingStore.selectedServiceToFilter?.state;
});

const getServiceIcon = computed(() => {
  return stakingStore.selectedServiceToFilter?.icon;
});

const getTextColor = computed(() => {
  if (getServiceState.value === "running") {
    return "text-green-500";
  } else if (getServiceState.value === "off") {
    return "text-red-500";
  } else if (getServiceState.value === "restarting") {
    return "text-amber-400";
  }

  return "text-gray-500";
});

const getStateColor = computed(() => {
  if (getServiceState.value === "running") {
    return "bg-green-400";
  } else if (getServiceState.value === "off") {
    return "bg-red-500";
  } else if (getServiceState.value === "restarting") {
    return "bg-amber-400";
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
    stakingStore.keyNumbers = stakingStore.keys.filter((key) => key.validatorID === service.config.serviceID).length;
  },
  { immediate: true }
);
</script>
