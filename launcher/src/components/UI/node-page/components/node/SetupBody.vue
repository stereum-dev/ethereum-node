<template>
  <div class="w-full h-full max-h-full rounded-md grid grid-cols-24 grid-rows-12">
    <div
      class="col-start-1 col-span-full row-start-1 row-span-1 w-full mx-auto grid grid-cols-3 h-6 bg-[#33393E] border border-gray-950 rounded-t-[5px]"
    ></div>
    <div
      class="w-full h-full col-start-1 col-span-full row-start-2 row-span-full grid grid-cols-3 auto-rows-fr scrollbar scrollbar-rounded-* scrollbar-thumb-teal-800 scrollbar-track-transparent overflow-y-auto overflow-x-hidden items-start"
    >
      <ClientSkeleton v-for="i in skeletonRunning" :key="i" />
      <SingleSetup
        v-for="setup in setupsRunning"
        :key="setup.name"
        :setup="setup"
        @open-setup="openSetup"
        @export-setup="exportSetup"
        @setup-state="setupState"
      />
    </div>
  </div>
</template>

<script setup>
import ClientSkeleton from "./clients/ClientSkeleton.vue";
import SingleSetup from "./setups/SingleSetup.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useSetups } from "@/store/setups";

const emit = defineEmits(["openSetup", "exportSetup", "setupState"]);
const setupStore = useSetups();
const skeletons = ref([1, 2, 3, 4, 5, 6, 7, 8, 9]);

const loadingSetupSkeleton = ref(false);

// Computed

const skeletonRunning = computed(() => {
  let items = [];

  if (loadingSetupSkeleton.value && setupStore.isConfigViewActive) {
    items = skeletons.value;
  }
  return items;
});

const setupsRunning = computed(() => {
  let items = [];

  if (!loadingSetupSkeleton.value && !setupStore.isConfigViewActive) {
    items = setupStore.allSetups;
  }
  return items;
});

// Watchers

watch(
  () => setupStore.allSetups.length,
  () => {
    if (setupStore.allSetups.length > 0) {
      setTimeout(() => {
        loadingSetupSkeleton.value = false;
        setupStore.isConfigViewActive = false;
      }, 3000);
    } else {
      loadingSetupSkeleton.value = true;
    }
  }
);

// Lifecycle

onMounted(() => {
  if (setupStore.allSetups.length > 0) {
    setTimeout(() => {
      loadingSetupSkeleton.value = false;
      setupStore.isConfigViewActive = false;
    }, 3000);
  } else {
    loadingSetupSkeleton.value = true;
  }
});

// Methods

const openSetup = (item) => {
  emit("openSetup", item);
};

const exportSetup = (item) => {
  emit("exportSetup", item);
};

const setupState = (item) => {
  emit("setupState", item);
};
</script>
