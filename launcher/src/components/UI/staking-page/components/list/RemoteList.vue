<template>
  <div class="w-full h-full animate__animated animate__fadeIn space-y-2">
    <SkeletonRow v-if="props.isLoading" />
    <SkeletonRow v-if="props.isLoading" />
    <SkeletonRow v-if="props.isLoading" />

    <RemoteRow
      v-for="item in stakingStore.previewRemoteKeys"
      v-show="!stakingStore.isPreviewListActive && !stakingStore.isGroupListActive && stakingStore.keys.length > 0 && !props.isLoading"
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
import ControlService from "@/store/ControlService";

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

const localKeys = async () => {
  const service = serviceStore.installedServices.find((s) => s.service === "Web3SignerService");
  const remoteSignerStats = await ControlService.checkRemoteKeys({
    serviceID: stakingStore.remoteUrl ? undefined : service?.config?.serviceID,
    url: stakingStore.remoteUrl,
  });
  if (remoteSignerStats.error) {
    console.log(remoteSignerStats.error);
  } else {
    stakingStore.previewRemoteKeys = remoteSignerStats.keys.map((k) => {
      return {
        pubkey: k,
        selected: false,
        url: remoteSignerStats.url,
        serviceID: stakingStore.remoteUrl ? undefined : service?.config?.serviceID,
      };
    });
  }
};

const pickRemoteKey = (item) => {
  item.selected = !item.selected;
};
</script>
