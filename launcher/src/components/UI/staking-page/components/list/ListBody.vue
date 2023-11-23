import { ref, computed, watchEffect, watch } from 'vue';
<template>
  <div
    class="col-start-1 col-span-full row-start-2 row-end-12 overflow-x-hidden overflow-y-auto px-1 py-2 flex justify-start items-center space-y-2 bg-[#151618] rounded-b-sm mb-[1px]"
    :class="stakingStore.isOverDropZone ? 'border-dashed border border-blue-500 ' : ''"
  >
    <div
      ref="dropZoneRef"
      class="w-full h-full"
      @drop.prevent="onDrop($event)"
      @dragover.prevent="stakingStore.isOverDropZone = true"
      @dragleave.prevent="stakingStore.isOverDropZone = false"
    >
      <span
        v-if="stakingStore.isOverDropZone"
        class="w-full h-full self-center justify-self-center flex justify-center items-center text-2xl"
        :class="stakingStore.inputWrongKey ? 'text-red-500' : 'text-blue-400'"
        >+</span
      >
      <div
        v-if="!stakingStore.isOverDropZone"
        class="w-full h-full flex flex-col justify-start items-center space-y-2 z-10 scrollbar scrollbar-rounded-* scrollbar-thumb-teal-800 scrollbar-track-transparent overflow-y-auto"
      >
        <PreviewKey
          v-for="item in stakingStore.previewKeys"
          v-show="stakingStore.isPreviewListActive"
          :key="item.pubkey"
          :item="item"
        />

        <KeyRow
          v-for="item in nonGroupedKeys"
          v-show="!stakingStore.isPreviewListActive && stakingStore.keys.length > 0"
          :key="item.pubkey"
          :item="item"
        />
        <GroupRow
          v-for="item in stakingStore.validatorKeyGroups"
          v-show="!stakingStore.isPreviewListActive && stakingStore.validatorKeyGroups.length > 0"
          :key="item.pubkey"
          :item="item"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import KeyRow from "./rows/KeyRow.vue";
import PreviewKey from "./rows/PreviewKey.vue";
import GroupRow from "./rows/GroupRow.vue";
import { useStakingStore } from "@/store/theStaking";
import { computed, watchEffect } from "vue";

const emit = defineEmits(["onDrop"]);
const stakingStore = useStakingStore();

const nonGroupedKeys = computed(() => {
  return stakingStore.keys.filter(
    (key) => !stakingStore.validatorKeyGroups.find((group) => group.keys.find((groupKey) => groupKey === key))
  );
});
watchEffect(() => {
  console.log("KEYSSSSS", stakingStore.keys);
});

const onDrop = (event) => {
  emit("onDrop", event);
};
</script>
