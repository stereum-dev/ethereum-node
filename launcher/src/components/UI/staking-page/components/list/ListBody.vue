import { ref, computed, watchEffect, watch, onMounted, onUnmounted } from 'vue';
<template>
  <div
    class="col-start-1 col-span-full overflow-x-hidden overflow-y-auto px-1 py-2 flex justify-start items-center space-y-2 border border-gray-600 bg-[#151618] rounded-b-sm mb-[1px]"
    :class="[
      stakingStore.isOverDropZone ? 'border-dashed border border-blue-500 ' : '',
      stakingStore.isPreviewListActive || stakingStore.isRemoteListActive || stakingStore.isGroupListActive
        ? 'row-start-2 row-end-12'
        : 'row-start-1 row-end-12 rounded-t-md',
    ]"
  >
    <GroupList v-if="stakingStore.isGroupListActive" :is-loading="isLoading" />
    <RemoteList v-else-if="stakingStore.isRemoteListActive" :is-loading="isLoading" />

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
          @delete-preview="deletePreview"
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
          @remove-single="removeSingle"
          @rename-single="renameSingle"
        />
        <span
          v-if="!getFilteredValidators.length > 0 && !isLoading && !stakingStore.isPreviewListActive && !searchNotFound"
          class="text-lg font-bold text-gray-300 text-center uppercase select-none"
          >No Validator key imported.</span
        >
        <span
          v-if="searchNotFound && getFilteredValidators.length > 0"
          class="text-lg font-bold text-gray-300 text-center uppercase"
          >No Matches.</span
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
import GroupList from "./GroupList.vue";
import RemoteList from "./RemoteList.vue";
import { useListGroups } from "@/composables/groups";
import { useStakingStore } from "@/store/theStaking";
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from "vue";
import { useListKeys } from "@/composables/validators";

const emit = defineEmits([
  "onDrop",
  "removeSingle",
  "openGroup",
  "renameGroup",
  "withdrawGroup",
  "removeGroup",
  "deletePreview",
  "renameSingle",
]);
const stakingStore = useStakingStore();
const { listGroups } = useListGroups();
const isLoading = ref(true);
const noKey = ref(false);
// const searchNotFound = ref(false);

// Computed
stakingStore.filteredKeys = computed(() => {
  if (stakingStore.searchContent === "") {
    return stakingStore.keys;
  }
  return stakingStore.keys.filter(
    (key) =>
      (key.key && key.key.toLowerCase().includes(stakingStore.searchContent.toLowerCase())) ||
      (key.displayName &&
        key.displayName !== "" &&
        key.displayName.toLowerCase().includes(stakingStore.searchContent.toLowerCase()))
  );
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

const searchNotFound = computed(() => {
  return (
    !stakingStore.isPreviewListActive &&
    !isLoading.value &&
    stakingStore.searchContent !== "" &&
    stakingStore.filteredKeys.length === 0
  );
});

watchEffect(() => {
  if (stakingStore.keys.length === 0) {
    isLoading.value = true;
  } else if (stakingStore.keys.length > 0) {
    isLoading.value = false;
  }
  setTimeout(() => {
    if (stakingStore.keys.length === 0) {
      isLoading.value = false;
      noKey.value = true;
    }
  }, 5000);
});

watch(
  () => stakingStore.selectedServiceToFilter,
  async () => {
    await listGroups();
  }
);
watchEffect(() => {
  if (!stakingStore.isPreviewListActive) {
    isLoading.value = true;
    setTimeout(() => {
      isLoading.value = false;
    }, 6000);
  }
});

// Lifecycle Hooks
onMounted(async () => {
  stakingStore.forceRefresh = true;
  await listKeys();
  if (getFilteredValidators.value.length > 0 && stakingStore.searchContent === "") {
    await listGroups();
  }
});
onUnmounted(() => {
  stakingStore.setActivePanel(null);
});

// Methods

// const checkKeysAndSearchContent = () => {
//   if (!stakingStore.searchContent === "") {
//     stakingStore.filteredKeys = stakingStore.keys;
//   } else if (stakingStore.searchContent !== "" && stakingStore.filteredKeys.length > 0) {
//     searchNotFound.value = true;
//   } else {
//     stakingStore.filteredKeys = stakingStore.keys.filter((key) =>
//       key.key.toLowerCase().includes(stakingStore.searchContent.toLowerCase())
//     );
//   }
// };

const listKeys = async () => {
  await useListKeys(stakingStore.forceRefresh);
};

const isKeyInGroup = (key) => {
  return stakingStore.validatorKeyGroups.some((group) => group.keys.some((groupKey) => groupKey.key === key.key));
};

const onDrop = (event) => {
  emit("onDrop", event);
};

const deletePreview = (item) => {
  emit("deletePreview", item);
};

const removeSingle = (item) => {
  emit("removeSingle", item);
};

const renameSingle = (item) => {
  emit("renameSingle", item);
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
