<template>
  <div
    class="max-h-[165px] col-start-1 col-span-full row-start-1 row-end-5 grid grid-cols-6 justify-normal items-center bg-[#151618] gap-y-0"
    :class="
      stakingStore?.selectedServiceToFilter?.service === 'CharonService' ||
      stakingStore?.selectedServiceToFilter?.service === 'SSVNetworkService'
        ? 'grid-rows-8'
        : 'grid-rows-7'
    "
    @mousedown.prevent
  >
    <EpochSlot />
    <TotalKeys />
    <TotalBalance />
    <StatusInfoRow
      v-if="
        stakingStore.selectedServiceToFilter?.service === 'CharonService' ||
        stakingStore.selectedServiceToFilter?.service === 'SSVNetworkService'
      "
    />
    <PerformanceRow
      v-if="
        stakingStore.selectedServiceToFilter?.service === 'CharonService' ||
        stakingStore.selectedServiceToFilter?.service === 'SSVNetworkService'
      "
    />
    <ParticipationRow v-if="stakingStore.selectedServiceToFilter?.service === 'CharonService'" />
    <IsPrivate v-if="stakingStore.selectedServiceToFilter?.service === 'SSVNetworkService'" />

    <NodeStatus
      v-if="
        stakingStore.selectedServiceToFilter?.service === 'CharonService' ||
        stakingStore.selectedServiceToFilter?.service === 'SSVNetworkService'
      "
    />

    <AttestationReward
      v-if="
        stakingStore.selectedServiceToFilter?.service !== 'CharonService' &&
        stakingStore.selectedServiceToFilter?.service !== 'SSVNetworkService'
      "
    />
    <CommitteeReward
      v-if="
        stakingStore.selectedServiceToFilter?.service !== 'CharonService' &&
        stakingStore.selectedServiceToFilter?.service !== 'SSVNetworkService'
      "
    />
    <BlockReward
      v-if="
        stakingStore.selectedServiceToFilter?.service !== 'CharonService' &&
        stakingStore.selectedServiceToFilter?.service !== 'SSVNetworkService'
      "
    />
  </div>
</template>
<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { useStakingStore } from "../../../../../store/theStaking";
import AttestationReward from "./components/val-rewards/AttestationReward.vue";
import BlockReward from "./components/val-rewards/BlockReward.vue";
import CommitteeReward from "./components/val-rewards/CommitteeReward.vue";
import EpochSlot from "./components/val-rewards/EpochSlot.vue";
import IsPrivate from "./components/val-rewards/IsPrivate.vue";
import NodeStatus from "./components/val-rewards/NodeStatus.vue";
import ParticipationRow from "./components/val-rewards/ParticipationRow.vue";
import PerformanceRow from "./components/val-rewards/PerformanceRow.vue";
import StatusInfoRow from "./components/val-rewards/StatusInfoRow.vue";
import { useObolStats, useSSVStats } from "../../../../../composables/validators";
import TotalBalance from "./components/val-rewards/TotalBalance.vue";
import TotalKeys from "./components/val-rewards/TotalKeys.vue";

const stakingStore = useStakingStore();
const pollingInterval = ref(null);

onMounted(() => {
  pollingInterval.value = setInterval(() => {
    useObolStats();
    useSSVStats();
  }, 120000);
});

onUnmounted(() => {
  clearInterval(pollingInterval.value);
});
</script>
