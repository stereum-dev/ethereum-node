import { ref } from 'vue';
<template>
  <div
    class="col-start-1 col-span-full row-start-2 row-end-12 overflow-x-hidden overflow-y-auto px-1 py-2 flex justify-start items-center space-y-2"
  >
    <div
      ref="dropZoneRef"
      class="w-full h-full max-h-[428px]"
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
          v-for="item in stakingStore.keyFiles"
          v-show="stakingStore.isPreviewListActive"
          :key="item.pubkey"
          :item="item"
        />

        <KeyRow
          v-for="item in stakingStore.keys"
          v-show="!stakingStore.isPreviewListActive"
          :key="item.pubkey"
          :item="item"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import KeyRow from "./rows/KeyRow.vue";
import { useStakingStore } from "@/store/theStaking";

const emit = defineEmits(["onDrop"]);
const stakingStore = useStakingStore();

const onDrop = (event) => {
  emit("onDrop", event);
};
</script>
