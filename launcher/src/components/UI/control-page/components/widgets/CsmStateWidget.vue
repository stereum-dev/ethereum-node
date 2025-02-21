<template>
  <div
    class="volume-Parent flex w-full h-full justify-center items-center flex-col p-1 gap-1 relative"
  >
    <ServiceLine
      label="Active"
      :value="String(setupStore.runningServicesCount)"
      :hover-text="
        t('csmStateWidget.servceCount', {
          count: setupStore.runningServicesCount,
          isAre: setupStore.runningServicesCount > 1 ? 'are' : 'is',
        })
      "
    />
    <ServiceLine
      label="in queue"
      :value="String(dvtInQueueWithRelatedValidatorCount)"
      :hover-text="
        t('csmStateWidget.nodeStatus', {
          number: String(dvtInQueueWithRelatedValidatorCount),
        })
      "
    />
    <ServiceLine
      label="node status"
      value=""
      hover-text="
         
        "
      :csm-box="props.csmBox"
    />
  </div>
</template>

<script setup>
import i18n from "@/includes/i18n";
import { useSetups } from "@/store/setups";
import { useStakingStore } from "@/store/theStaking";
import { computed } from "vue";
import ServiceLine from "../fragments/ServiceLine.vue";

const t = i18n.global.t;

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
        setup?.services.some(
          (service) =>
            service?.category === "validator" &&
            service?.config?.serviceID === key?.validatorID
        )
      );
    });

    return relatedValidator;
  }).length;
});
</script>
