<template>
  <div class="volume-Parent flex w-full h-full justify-center items-center flex-col p-1 gap-1 relative">
    <ServiceLine
      label="Active"
      :value="setupStore.runningServicesCount"
      hover-text="
        a
        "
    />
    <ServiceLine
      label="in queue"
      :value="dvtInQueueWithRelatedValidatorCount"
      hover-text="
          b
        "
    />
    <ServiceLine
      label="node status"
      value="3"
      hover-text="
         c
        "
      :csm-box="props.csmBox"
    />
  </div>
</template>

<script setup>
import { useSetups } from "@/store/setups";
import ServiceLine from "../fragments/ServiceLine.vue";
import { useStakingStore } from "@/store/theStaking";
import { computed } from "vue";

const setupStore = useSetups();
const stakingStore = useStakingStore();

const props = defineProps({
  csmBox: {
    type: Boolean,
    default: false,
  },
});

const dvtInQueueWithRelatedValidatorCount = computed(() => {
  if (!stakingStore?.keys || !setupStore?.allSetups || !setupStore?.selectedLCOMService) {
    return 0;
  }

  return stakingStore?.keys.filter((key) => {
    if (key?.dvt !== true || key?.status !== "inQueue" || !key?.validatorID) {
      return false;
    }

    const relatedValidator = setupStore?.allSetups.some((setup) => {
      return (
        setup?.setupId === setupStore?.selectedLCOMService?.setupId &&
        setup?.services.some((service) => service?.category === "validator" && service?.validatorID === key?.validatorID)
      );
    });

    return relatedValidator;
  }).length;
});
</script>
