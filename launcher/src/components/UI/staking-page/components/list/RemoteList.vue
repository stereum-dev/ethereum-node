<template>
  <div class="w-full h-full animate__animated animate__fadeIn space-y-2">
    <SkeletonRow v-if="props.isLoading" />
    <SkeletonRow v-if="props.isLoading" />
    <SkeletonRow v-if="props.isLoading" />

    <RemoteRow
      v-for="item in stakingStore.previewRemoteKeys"
      v-show="
        !stakingStore.isPreviewListActive &&
        !stakingStore.isGroupListActive &&
        stakingStore.keys.length > 0 &&
        !props.isLoading
      "
      :key="item.pubkey"
      :item="item"
      @click="pickRemoteKey(item)"
    />
  </div>
</template>
<script setup>
import SkeletonRow from "./rows/SkeletonRow.vue";
import RemoteRow from "./rows/RemoteRow.vue";
import { onMounted, onUnmounted } from "vue";
import { useStakingStore } from "@/store/theStaking";
import { useServices } from "@/store/services";

const props = defineProps({
  isLoading: {
    type: Boolean,
    required: true,
  },
});

const stakingStore = useStakingStore();
const serviceStore = useServices();

onMounted(() => {
  localKeys();
});

onUnmounted(() => {
  stakingStore.previewRemoteKeys = [];
});

const localKeys = () => {
  const service = serviceStore.installedServices.find(
    (s) => s.category === "validator" && s.service === "Web3SignerService"
  );
  if (service) {
    const keys = stakingStore.keys.filter((key) => key.validatorID === service.config?.serviceID);
    if (keys.length > 0) {
      keys.forEach((key) => {
        stakingStore.previewRemoteKeys.push(key);
      });
    }
  }
};

const pickRemoteKey = (item) => {
  item.selected = !item.selected;

  if (item.selected) {
    if (!stakingStore.selectedRemoteKeys.includes(item)) {
      stakingStore.selectedRemoteKeys.push(item);
    }
  } else {
    const index = stakingStore.selectedRemoteKeys.indexOf(item);
    if (index > -1) {
      stakingStore.selectedRemoteKeys.splice(index, 1);
    }
  }
};
</script>
