<template>
  <div class="w-full h-full animate__animated animate__fadeIn space-y-2">
    <SkeletonRow v-if="props.isLoading" />
    <SkeletonRow v-if="props.isLoading" />
    <SkeletonRow v-if="props.isLoading" />

    <KeyRow
      v-for="item in getKeysInsideGroup"
      v-show="!stakingStore.isPreviewListActive && stakingStore.keys.length > 0 && !props.isLoading"
      :key="item.pubkey"
      :item="item"
    />
  </div>
</template>
<script setup>
import SkeletonRow from "./rows/SkeletonRow.vue";
import KeyRow from "./rows/KeyRow.vue";
import { computed } from "vue";
import { useStakingStore } from "@/store/theStaking";

const props = defineProps({
  isLoading: {
    type: Boolean,
    required: true,
  },
});

const stakingStore = useStakingStore();

const getKeysInsideGroup = computed(() => {
  return stakingStore.currentGroup.keys;
});
</script>
