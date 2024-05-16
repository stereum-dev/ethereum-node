<template>
  <div class="w-full h-[55px] grid grid-cols-9 gap-1 py-1">
    <ServerDetails />
    <SetupDetails :list="setupsList" @select-setup="selectSetup" @server-view="serverView" />
    <NetworkDetails />
  </div>
</template>
<script setup>
import SetupDetails from "../../../edit-page/components/edit/header/SetupDetails.vue";
import ServerDetails from "../../../edit-page/components/edit/header/ServerDetails.vue";
import NetworkDetails from "../../../edit-page/components/edit/header/NetworkDetails.vue";
import { useSetups } from "@/store/setups";
import { computed } from "vue";

const setupStore = useSetups();

const setupsList = computed(() => {
  let list;
  list = setupStore.allSetups.map((setup) => {
    return setup;
  });
  return list;
});

const selectSetup = (setup) => {
  setupStore.selectNodeConfigView(setup);
};

const serverView = () => {
  setupStore.selectNodeServerView();
};

// End of script
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
