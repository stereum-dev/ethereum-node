<template>
  <div
    class="w-full h-full max-h-full rounded-md grid grid-cols-24 grid-rows-12"
    :class="
      setupStore.isConfigViewActive
        ? 'animate__animated animate__fadeOut animate__faster'
        : 'animate__animated animate__fadeIn animate__faster'
    "
  >
    <div
      class="col-start-1 col-span-full row-start-1 row-span-1 w-full mx-auto h-6 bg-[#33393E] border border-gray-950 rounded-t-[5px] flex justify-center items-center overflow-hidden"
    >
      <span class="text-xs text-gray-300 text-center font-sans">All Setups</span>
    </div>
    <div
      v-if="allNodeSetups.filter((s) => s.setupName !== 'commonServices').length > 0"
      class="w-full h-full col-start-1 col-span-full row-start-2 row-span-full grid grid-cols-3 grid-rows-3 scrollbar scrollbar-rounded-* scrollbar-thumb-teal-800 scrollbar-track-transparent overflow-y-auto overflow-x-hidden items-start"
    >
      <SingleSetup
        v-for="setup in allNodeSetups.filter((s) => s.setupName !== 'commonServices')"
        :key="setup.name"
        :setup="setup"
        @open-setup="openSetup"
        @export-setup="exportSetup"
        @setup-state="setupState"
      />
    </div>
    <div
      v-else
      class="w-full h-full col-start-1 col-span-full row-start-2 row-span-full grid grid-cols-3 auto-rows-fr scrollbar scrollbar-rounded-* scrollbar-thumb-teal-800 scrollbar-track-transparent overflow-y-auto overflow-x-hidden items-start"
    >
      <ClientSkeleton v-for="i in skeletons" :key="i" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import ClientSkeleton from "./clients/ClientSkeleton.vue";
import SingleSetup from "./setups/SingleSetup.vue";
import { useSetups } from "@/store/setups";

const emit = defineEmits(["openSetup", "exportSetup", "setupState"]);
const setupStore = useSetups();
const skeletons = ref([1, 2, 3, 4, 5, 6, 7, 8, 9]);

const allNodeSetups = computed(() => {
  return setupStore.allSetups;
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
