<template>
  <div
    class="col-start-1 col-span-full overflow-x-hidden overflow-y-auto px-1 flex justify-start items-center space-y-2 border bg-[#151618] rounded-b-sm mb-[1px]"
    :class="[
      stakingStore.isOverDropZone ? 'border-dashed border-blue-500' : 'border-gray-600',
      stakingStore.inputWrongKey ? 'border-red-500' : '',
      stakingStore.isPreviewListActive || stakingStore.isRemoteListActive || stakingStore.isGroupListActive
        ? 'row-start-2 row-end-12'
        : 'row-start-1 row-end-12 rounded-t-md',
    ]"
  >
    <GroupList v-if="stakingStore.isGroupListActive" :is-loading="stakingStore.isSkeletonActive" />
    <RemoteList v-else-if="stakingStore.isRemoteListActive" :is-loading="stakingStore.isSkeletonActive" />

    <div
      v-else
      ref="dropZoneRef"
      class="w-full h-full max-h-[423px] animate__animated animate__fadeIn"
      :class="{ 'cursor-not-allowed': stakingStore.isSkeletonActive }"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
    >
      <span
        v-if="stakingStore.isOverDropZone"
        class="w-full h-full self-center justify-self-center flex justify-center items-center text-2xl"
        :class="[stakingStore.inputWrongKey ? 'text-red-500' : 'text-blue-400', stakingStore.isSkeletonActive ? 'cursor-not-allowed' : '']"
        >+</span
      >
      <div
        v-else
        class="w-full h-full flex flex-col justify-start items-center space-y-2 z-10 scrollbar scrollbar-rounded-* scrollbar-thumb-teal-800 scrollbar-track-transparent overflow-y-auto pt-2"
      >
        <span v-if="shouldShowNoValidators" class="text-lg font-bold text-gray-300 text-center uppercase select-none">{{
          $t("stakingPage.noVal")
        }}</span>
        <span v-if="searchNotFound && getFilteredValidators?.length > 0" class="text-lg font-bold text-gray-300 text-center uppercase">{{
          $t("stakingPage.noMatch")
        }}</span>

        <SkeletonRow v-for="i in 10" v-show="!stakingStore.isPreviewListActive && stakingStore.isSkeletonActive" :key="i" />

        <PreviewKey
          v-for="item in stakingStore.previewKeys"
          v-show="stakingStore.isPreviewListActive && !stakingStore.isSkeletonActive"
          :key="item.pubkey"
          :item="item"
          @delete-preview="emit('deletePreview', $event)"
        />

        <DoppelGCheckRow
          v-for="key in stakingStore.doppelgangerKeys"
          v-show="
            stakingStore.isDoppelgangerProtectionActive &&
            !stakingStore.isSkeletonActive &&
            !stakingStore.isPreviewListActive &&
            !stakingStore.isSkeletonActive
          "
          :key="key"
          :item="key"
          @remove-dplg="removeDoppelGangerManually"
        />

        <GroupRow
          v-for="group in getCorrectValidatorGroups"
          v-show="shouldShowGroups"
          :key="group.groupID"
          :item="group"
          @open-group="emit('openGroup', $event)"
          @rename-group="emit('renameGroup', group)"
          @withdraw-group="emit('withdrawGroup', $event)"
        />

        <KeyRow
          v-for="key in getFilteredValidators"
          v-show="shouldShowKeys(key)"
          :key="key.pubkey"
          :item="key"
          @remove-single="emit('removeSingle', $event)"
          @rename-single="emit('renameSingle', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted, defineAsyncComponent } from "vue";
// import KeyRow from "./rows/KeyRow.vue";
import PreviewKey from "./rows/PreviewKey.vue";
import GroupRow from "./rows/GroupRow.vue";
import SkeletonRow from "./rows/SkeletonRow.vue";
import DoppelGCheckRow from "./rows/DoppelGCheckRow.vue";
import GroupList from "./GroupList.vue";
import RemoteList from "./RemoteList.vue";
import { useStakingStore } from "@/store/theStaking";
import { useSetups } from "@/store/setups";

const KeyRow = defineAsyncComponent(() => import("./rows/KeyRow.vue"));

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
const dropZoneRef = ref(null);

stakingStore.filteredKeys = computed(() => {
  let filteredKeys = stakingStore.keys;
  if (stakingStore.searchContent) {
    filteredKeys = stakingStore.keys.filter(
      (key) =>
        key.key?.toLowerCase().includes(stakingStore.searchContent.toLowerCase()) ||
        (key.displayName && key.displayName.toLowerCase()?.includes(stakingStore.searchContent.toLowerCase()))
    );
  }

  const uniqueKeys = [];
  const seenKeys = new Set();

  for (const key of filteredKeys) {
    if (key.key && !seenKeys.has(key.key)) {
      uniqueKeys.push(key);
      seenKeys.add(key.key);
    }
  }

  return uniqueKeys;
});

const getFilteredValidators = computed(() => {
  if (!setupStore.selectedSetup && !stakingStore.selectedServiceToFilter) {
    return stakingStore.filteredKeys;
  }

  if (!setupStore.selectedSetup && stakingStore.selectedServiceToFilter) {
    return stakingStore.filteredKeys.filter((key) => key.validatorID === stakingStore.selectedServiceToFilter?.config?.serviceID);
  }

  if (setupStore.selectedSetup && !stakingStore.selectedServiceToFilter) {
    const serviceIds = setupStore.selectedSetup?.services?.map((service) => service.config?.serviceID);
    return stakingStore.filteredKeys.filter((key) => serviceIds?.includes(key.validatorID));
  }

  const selectedServiceId = stakingStore.selectedServiceToFilter.config?.serviceID;
  return stakingStore.filteredKeys.filter((key) => key.validatorID === selectedServiceId);
});

const getCorrectValidatorGroups = computed(() =>
  stakingStore.validatorKeyGroups.filter(
    (group) => group.keys.length > 0 && group.validatorClientID === stakingStore.selectedServiceToFilter?.config?.serviceID
  )
);

const searchNotFound = computed(
  () =>
    !stakingStore.isPreviewListActive &&
    !stakingStore.isSkeletonActive &&
    stakingStore.searchContent !== "" &&
    stakingStore.filteredKeys.length === 0
);

const shouldShowNoValidators = computed(
  () =>
    !getFilteredValidators.value?.length &&
    !stakingStore.isSkeletonActive &&
    !stakingStore.isPreviewListActive &&
    !searchNotFound.value &&
    !stakingStore.doppelgangerKeys?.length
);

const shouldShowGroups = computed(
  () => !stakingStore.isPreviewListActive && stakingStore.validatorKeyGroups?.length > 0 && !stakingStore.isSkeletonActive
);

onUnmounted(() => {
  stakingStore.setActivePanel(null);
});

function normalizeKey(key) {
  return key?.startsWith("0x") ? key.substring(2) : key;
}

const removeDuplicatedDoppelgangerKeys = async () => {
  try {
    const normalizedKeysSet = new Set(stakingStore.keys.filter((k) => k.key).map((k) => normalizeKey(k.key)));

    const filteredKeys = stakingStore.doppelgangerKeys.filter((doppelKey) => {
      if (!doppelKey?.pubkey) {
        return false;
      }

      const normalizedPubkey = normalizeKey(doppelKey.pubkey);
      const isDuplicate = normalizedKeysSet.has(normalizedPubkey);
      return !isDuplicate;
    });

    if (filteredKeys.length !== stakingStore.doppelgangerKeys.length) {
      stakingStore.doppelgangerKeys = filteredKeys;
    }
  } catch (error) {
    console.log("Error in removeDuplicatedDoppelgangerKeys:", error);
  }
};

watch(
  () => stakingStore.keys,
  async () => {
    removeDuplicatedDoppelgangerKeys();
  },
  {
    deep: true,
    immediate: true,
  }
);

const removeDoppelGangerManually = (pubkey) => {
  stakingStore.doppelgangerKeys = stakingStore.doppelgangerKeys.filter((item) => item.pubkey !== pubkey);
};

function isKeyInGroup(key) {
  return stakingStore.validatorKeyGroups.some((group) => group.keys.some((groupKey) => groupKey.key === key.key));
}
function shouldShowKeys(key) {
  return !isKeyInGroup(key) && !stakingStore.isPreviewListActive && stakingStore.keys?.length > 0 && !stakingStore.isSkeletonActive;
}

function onDragOver() {
  if (!stakingStore.isSkeletonActive) {
    stakingStore.isOverDropZone = true;
  }
}

function onDragLeave() {
  stakingStore.isOverDropZone = false;
}

function onDrop(event) {
  stakingStore.isOverDropZone = false;
  emit("onDrop", event);
}
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
  width: 5px;
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
