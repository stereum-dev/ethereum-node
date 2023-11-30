import { ref, computed, watchEffect, watch, onMounted } from 'vue';
<template>
  <div
    class="col-start-1 col-span-full row-end-12 overflow-x-hidden overflow-y-auto px-1 py-2 flex justify-start items-center space-y-2 border border-gray-600 bg-[#151618] rounded-b-sm mb-[1px]"
    :class="[
      stakingStore.isOverDropZone ? 'border-dashed border border-blue-500 ' : '',
      stakingStore.isPreviewListActive || stakingStore.isGroupListActive ? 'row-start-2 ' : 'row-start-1 rounded-t-md',
    ]"
  >
    <div v-if="stakingStore.isGroupListActive" class="w-full h-full animate__animated animate__fadeIn space-y-2">
      <SkeletonRow v-if="isLoading" />
      <SkeletonRow v-if="isLoading" />
      <SkeletonRow v-if="isLoading" />

      <KeyRow
        v-for="item in getKeysInsideGroup"
        v-show="!stakingStore.isPreviewListActive && stakingStore.keys.length > 0 && !isLoading"
        :key="item.pubkey"
        :item="item"
      />
    </div>

    <div
      v-else
      ref="dropZoneRef"
      class="w-full h-full animate__animated animate__fadeIn"
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
        <SkeletonRow v-if="!stakingStore.isPreviewListActive && isLoading && !noKey" />
        <SkeletonRow v-if="!stakingStore.isPreviewListActive && isLoading && !noKey" />
        <SkeletonRow v-if="!stakingStore.isPreviewListActive && isLoading && !noKey" />
        <PreviewKey
          v-for="item in stakingStore.previewKeys"
          v-show="stakingStore.isPreviewListActive && !isLoading"
          :key="item.pubkey"
          :item="item"
          @delete-key="deleteKey"
        />
        <GroupRow
          v-for="group in getCorrectValidatorGroups"
          v-show="!stakingStore.isPreviewListActive && stakingStore.validatorKeyGroups.length > 0 && !isLoading"
          :key="group.groupID"
          :item="group"
          @open-group="openGroup"
          @rename-group="renameGroup(group)"
          @withdraw-group="withdrawGroup"
        />

        <KeyRow
          v-for="key in getFilteredValidators"
          v-show="!isKeyInGroup(key) && !stakingStore.isPreviewListActive && stakingStore.keys.length > 0 && !isLoading"
          :key="key.pubkey"
          :item="key"
        />
        <span v-if="noKey" class="text-lg font-bold text-gray-300 text-center uppercase"
          >No Validator key imported.</span
        >
      </div>
    </div>
  </div>
</template>
<script setup>
import KeyRow from "./rows/KeyRow.vue";
import PreviewKey from "./rows/PreviewKey.vue";
import GroupRow from "./rows/GroupRow.vue";
import SkeletonRow from "./rows/SkeletonRow.vue";
import { useListGroups } from "@/composables/groups";
import { useStakingStore } from "@/store/theStaking";
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import { useListKeys } from "@/composables/validators";

const emit = defineEmits(["onDrop", "deleteKey", "openGroup", "renameGroup", "withdrawGroup", "removeGroup"]);
const stakingStore = useStakingStore();
const { listGroups } = useListGroups();
const isLoading = ref(true);
const noKey = ref(false);

stakingStore.filteredKeys = computed(() => {
  if (!stakingStore.searchContent) {
    return stakingStore.keys;
  }
  return stakingStore.keys.filter((key) => key.key.toLowerCase().includes(stakingStore.searchContent.toLowerCase()));
});

const getKeysInsideGroup = computed(() => {
  return stakingStore.currentGroup.keys;
});

const getFilteredValidators = computed(() => {
  return stakingStore.filteredKeys.filter(
    (key) => key.validatorID === stakingStore.selectedServiceToFilter?.config?.serviceID
  );
});

const getCorrectValidatorGroups = computed(() => {
  return stakingStore.validatorKeyGroups.filter(
    (group) =>
      group.keys.length > 0 && group.validatorClientID === stakingStore.selectedServiceToFilter?.config?.serviceID
  );
});
console.log(getCorrectValidatorGroups.value);
console.log(stakingStore.validatorKeyGroups);

watch(
  () => getFilteredValidators,
  async (newVal) => {
    if (newVal.length > 0) {
      await listGroups(getFilteredValidators.value);
    }
  }
);
watch(
  () => stakingStore.selectedServiceToFilter,
  async () => {
    await listGroups(getFilteredValidators.value);
    await listKeys();
  }
);

watchEffect(() => {
  if (stakingStore.isPreviewListActive) {
    isLoading.value = false;
    noKey.value = false;
  } else if (!stakingStore.isPreviewListActive && getFilteredValidators.value.length === 0) {
    isLoading.value = true;
    setTimeout(() => {
      if (getFilteredValidators.value.length === 0) {
        isLoading.value = false;
        noKey.value = true;
      }
    }, 10000);
  } else if (!stakingStore.isPreviewListActive && getFilteredValidators.value.length > 0) {
    isLoading.value = false;
    noKey.value = false;
  }
});

// Lifecycle Hooks
onMounted(async () => {
  await listKeys();
  if (getFilteredValidators.value.length > 0) {
    await listGroups(getFilteredValidators.value);
  }
});

// Methods

const listKeys = async () => {
  await useListKeys();
};

const isKeyInGroup = (key) => {
  return stakingStore.validatorKeyGroups.some((group) => group.keys.some((groupKey) => groupKey.key === key.key));
};

const onDrop = (event) => {
  emit("onDrop", event);
};

const deleteKey = (item) => {
  emit("deleteKey", item);
};

const openGroup = (item) => {
  emit("openGroup", item);
};

const renameGroup = (item) => {
  emit("renameGroup", item);
};

const withdrawGroup = (item) => {
  emit("withdrawGroup", item);
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
