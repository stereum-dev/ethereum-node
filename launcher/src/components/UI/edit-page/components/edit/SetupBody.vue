<template>
  <div
    class="w-full h-full max-h-[430px] rounded-md border border-gray-600 overflow-hidden mt-1 bg-[#151618] relative"
    :class="manageStore.disableConfirmButton ? 'opacity-70 pointer-events-none' : ''"
  >
    <div class="w-full h-full max-h-full rounded-md grid grid-cols-24 grid-rows-12">
      <div
        class="col-start-1 col-span-full row-start-1 row-span-1 w-full mx-auto grid grid-cols-3 h-6 bg-[#33393E] border border-gray-950 rounded-t-[5px]"
      ></div>
      <div
        class="w-full h-full col-start-1 col-span-full row-start-2 row-span-full grid grid-cols-3 auto-rows-fr scrollbar scrollbar-rounded-* scrollbar-thumb-teal-800 scrollbar-track-transparent overflow-y-auto overflow-x-hidden items-start"
      >
        <SingleSetup
          v-for="setup in setupsRunning"
          :key="setup.name"
          :setup="setup"
          @delete-setup="deleteSetup"
          @connect-setup="connectSetup"
          @info-modal="infoModal"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import SingleSetup from "./setups/SingleSetup.vue";
import { computed, onMounted, watch } from "vue";
import { useNodeManage } from "@/store/nodeManage";
import { useSetups } from "../../../../../store/setups";

const emit = defineEmits(["deleteSetup", "connectSetup", "infoModal"]);

const manageStore = useNodeManage();
const setupStore = useSetups();

// Computed

const setupsRunning = computed(() => {
  let items = [];

  if (!setupStore.isEditConfigViewActive) {
    items = setupStore.editSetups;
  }
  return items;
});

// Watchers

watch(
  () => setupStore.allSetups.length,
  () => {
    if (setupStore.allSetups.length > 0) {
      setTimeout(() => {
        setupStore.isEditConfigViewActive = false;
      }, 3000);
    }
  }
);

// Lifecycle

onMounted(() => {
  if (setupStore.allSetups.length > 0) {
    setTimeout(() => {
      setupStore.isEditConfigViewActive = false;
    }, 3000);
  }
});

// Methods

const deleteSetup = (item) => {
  emit("deleteSetup", item);
};

const connectSetup = (item) => {
  emit("connectSetup", item);
};

const infoModal = (item) => {
  emit("infoModal", item);
};
</script>
