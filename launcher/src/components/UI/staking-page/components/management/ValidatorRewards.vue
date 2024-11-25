<template>
  <div
    class="max-h-[165px] col-start-1 col-span-full row-start-1 row-end-5 grid grid-cols-6 space-y-1"
    :class="
      stakingStore?.selectedServiceToFilter?.service === 'CharonService' ||
      stakingStore?.selectedServiceToFilter?.service === 'SSVNetworkService'
        ? 'grid-rows-5'
        : 'grid-rows-4'
    "
    @mousedown.prevent
  >
    <EpochSlot />
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
    <ParticipationRow
      v-if="stakingStore.selectedServiceToFilter?.service === 'CharonService'"
    />
    <IsPrivate
      v-if="stakingStore.selectedServiceToFilter?.service === 'SSVNetworkService'"
    />

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

const stakingStore = useStakingStore();
</script>
