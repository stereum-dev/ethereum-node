<template>
  <div class="w-full h-[55px] grid grid-cols-9 gap-1 py-1">
    <ServerDetails />
    <SetupDetails
      :list="setupsList"
      @rename-setup="renameSetup"
      @confirm-rename="confirmRename"
      @select-setup="selectSetup"
    />
    <NetworkDetails />
  </div>
</template>

<script setup>
import ServerDetails from "./header/ServerDetails.vue";
import NetworkDetails from "./header/NetworkDetails.vue";
import SetupDetails from "./header/SetupDetails.vue";
import { computed } from "vue";
import { useSetups } from "@/store/setups";

const emit = defineEmits(["renameSetup", "confirmRename", "selectSetup"]);
const setupStore = useSetups();

const setupsList = computed(() => {
  const list = setupStore.editSetups.map((setup) => {
    return setup;
  });
  return list;
});

const renameSetup = (setup) => {
  emit("renameSetup", setup);
};

const confirmRename = (setup) => {
  emit("confirmRename", setup);
};

const selectSetup = (setup) => {
  emit("selectSetup", setup);
};
</script>

<style scoped>
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. declare enter from and leave to state */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

/* 3. ensure leaving items are taken out of layout flow so that moving
      animations can be calculated correctly. */
.fade-leave-active {
  position: absolute;
}
</style>
