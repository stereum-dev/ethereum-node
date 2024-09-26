import { ref, computed, watchEffect, watch, onMounted, onUnmounted } from 'vue';
<template>
  <div
    class="col-start-1 col-span-full overflow-x-hidden overflow-y-auto px-1 flex justify-start items-center space-y-2 border bg-[#151618] rounded-b-sm mb-[1px]"
    :class="[
      stakingStore.isOverDropZone ? 'border-dashed  border-blue-500 ' : 'border-gray-600',
      stakingStore.inputWrongKey ? 'border-red-500' : '',
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
      class="w-full h-full max-h-[423px] animate__animated animate__fadeIn"
      :class="{ 'cursor-not-allowed': isDropZoneDisabled }"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
    >
      <span
        v-if="stakingStore.isOverDropZone"
        class="w-full h-full self-center justify-self-center flex justify-center items-center text-2xl"
        :class="[stakingStore.inputWrongKey ? 'text-red-500' : 'text-blue-400', isDropZoneDisabled ? 'cursor-not-allowed ' : '']"
        >+</span
      >
      <div
        v-if="!stakingStore.isOverDropZone"
        class="w-full h-full flex flex-col justify-start items-center space-y-2 z-10 scrollbar scrollbar-rounded-* scrollbar-thumb-teal-800 scrollbar-track-transparent overflow-y-auto pt-2"
      >
        <span
          v-if="
            !getFilteredValidators.length > 0 &&
            !isLoading &&
            !stakingStore.isPreviewListActive &&
            !searchNotFound &&
            !filteredDoppelgangerKeys.length
          "
          class="text-lg font-bold text-gray-300 text-center uppercase select-none"
          >{{ $t("stakingPage.noVal") }}</span
        >
        <span v-if="searchNotFound && getFilteredValidators.length > 0" class="text-lg font-bold text-gray-300 text-center uppercase">{{
          $t("stakingPage.noMatch")
        }}</span>
        <SkeletonRow v-if="!stakingStore.isPreviewListActive && isLoading" />
        <SkeletonRow v-if="!stakingStore.isPreviewListActive && isLoading" />
        <SkeletonRow v-if="!stakingStore.isPreviewListActive && isLoading" />
        <SkeletonRow v-if="!stakingStore.isPreviewListActive && isLoading" />
        <SkeletonRow v-if="!stakingStore.isPreviewListActive && isLoading" />
        <SkeletonRow v-if="!stakingStore.isPreviewListActive && isLoading" />
        <SkeletonRow v-if="!stakingStore.isPreviewListActive && isLoading" />
        <SkeletonRow v-if="!stakingStore.isPreviewListActive && isLoading" />
        <SkeletonRow v-if="!stakingStore.isPreviewListActive && isLoading" />
        <SkeletonRow v-if="!stakingStore.isPreviewListActive && isLoading" />

        <PreviewKey
          v-for="item in stakingStore.previewKeys"
          v-show="stakingStore.isPreviewListActive && !isLoading"
          :key="item.pubkey"
          :item="item"
          @delete-preview="deletePreview"
        />

        <DoppelGCheckRow
          v-for="key in filteredDoppelgangerKeys"
          v-show="
            stakingStore.doppelgangerKeys.length &&
            !stakingStore.isPreviewListActive &&
            !isLoading &&
            stakingStore.selectedServiceToFilter?.config?.serviceID === key.serviceID
          "
          :key="key"
          :item="key"
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
      </div>
    </div>
  </div>
</template>
<script setup>
import KeyRow from "./rows/KeyRow.vue";
import PreviewKey from "./rows/PreviewKey.vue";
import GroupRow from "./rows/GroupRow.vue";
import SkeletonRow from "./rows/SkeletonRow.vue";
import DoppelGCheckRow from "./rows/DoppelGCheckRow.vue";
import GroupList from "./GroupList.vue";
import RemoteList from "./RemoteList.vue";
import { useListGroups } from "@/composables/groups";
import { useStakingStore } from "@/store/theStaking";
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from "vue";
import { useListKeys } from "@/composables/validators";
import { useSetups } from "@/store/setups";

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
const setupStore = useSetups();
const { listGroups } = useListGroups();
const isLoading = ref(true);
const dropZoneRef = ref(null);
const isDropZoneActive = ref(true);

// Computed
stakingStore.filteredKeys = computed(() => {
  if (stakingStore.searchContent === "") {
    return stakingStore.keys;
  }
  return stakingStore.keys.filter(
    (key) =>
      (key.key && key.key.toLowerCase().includes(stakingStore.searchContent.toLowerCase())) ||
      (key.displayName && key.displayName !== "" && key.displayName.toLowerCase().includes(stakingStore.searchContent.toLowerCase()))
  );
});

const getFilteredValidators = computed(() => {
  if (!setupStore.selectedSetup) {
    // If selectedSetup is null, return all keys
    return stakingStore.filteredKeys;
  } else {
    const serviceIds = setupStore.selectedSetup.services.map((service) => service.config.serviceID);
    // Filter keys by checking if validatorID exists in serviceIds
    return stakingStore.filteredKeys.filter((key) => serviceIds.includes(key.validatorID));
  }
});

const getCorrectValidatorGroups = computed(() => {
  return stakingStore.validatorKeyGroups.filter(
    (group) => group.keys.length > 0 && group.validatorClientID === stakingStore.selectedServiceToFilter?.config?.serviceID
  );
});

const searchNotFound = computed(() => {
  return (
    !stakingStore.isPreviewListActive && !isLoading.value && stakingStore.searchContent !== "" && stakingStore.filteredKeys.length === 0
  );
});

const filteredDoppelgangerKeys = computed(() => {
  return stakingStore.doppelgangerKeys;
});

const isDropZoneDisabled = computed(() => {
  return isLoading.value;
});

// Watchers

watchEffect(() => {
  if (stakingStore.inputWrongKey) {
    setTimeout(() => {
      stakingStore.inputWrongKey = false;
    });
  }
});

watchEffect(() => {
  if (stakingStore.keys.length === 0) {
    isLoading.value = true;
  } else if (stakingStore.keys.length > 0) {
    isLoading.value = false;
  }

  setTimeout(() => {
    if (isLoading.value) {
      isLoading.value = false;
    }
  }, 2000);
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

watch(
  () => stakingStore.keys.length,
  async (newLength, oldLength) => {
    if (newLength !== oldLength) {
      await listKeys();
      removeDuplicatedDoppelgangerKeys();
    }
  }
);

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

//Methods

const onDragOver = () => {
  if (!isDropZoneDisabled.value) {
    stakingStore.isOverDropZone = true;
  }
};

const onDragLeave = () => {
  if (isDropZoneActive.value) {
    stakingStore.isOverDropZone = false;
  }
};

const normalizeKey = (key) => {
  return key.startsWith("0x") ? key.substring(2) : key;
};

const removeDuplicatedDoppelgangerKeys = () => {
  const normalizedKeysSet = new Set(stakingStore.keys.map((k) => normalizeKey(k.key)));
  let removed = false;

  const filteredDoppelgangerKeys = stakingStore.doppelgangerKeys.filter((doppelKey) => {
    const isDuplicate = normalizedKeysSet.has(normalizeKey(doppelKey.pubkey));
    if (isDuplicate) {
      removed = true;
    }
    return !isDuplicate;
  });

  if (removed) {
    stakingStore.doppelgangerKeys = filteredDoppelgangerKeys;
  }

  return removed;
};

const listKeys = async () => {
  await useListKeys(stakingStore.forceRefresh);
};

const isKeyInGroup = (key) => {
  return stakingStore.validatorKeyGroups.some((group) => group.keys.some((groupKey) => groupKey.key === key.key));
};

const onDrop = (event) => {
  if (!isDropZoneDisabled.value) {
    stakingStore.isOverDropZone = false;
  }
  if (isDropZoneActive.value) {
    emit("onDrop", event);
  }
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
::-webkit-scrollbar {
  width: 10px;
  height: 5px;
  cursor: pointer;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #2c9c9e;
  border-radius: 10px;
}
</style>
