<template>
  <div class="w-full h-[55px] grid grid-cols-9 gap-1 py-1">
    <ServerDetails />
    <SetupDetails :list="setupsList" />
    <NetworkDetails />
  </div>
</template>

<script setup>
import ServerDetails from "./ServerDetails.vue";
import NetworkDetails from "./NetworkDetails.vue";
import SetupDetails from "./setups/SetupDetails.vue";
import { computed } from "vue";
import { useSetups } from "../../../../../store/setups";

const setupStore = useSetups();

const setupsList = computed(() => {
  let list;
  list = setupStore.allSetups.map((setup) => {
    return {
      name: setup.setupName,
      color: setup.color,
    };
  });
  return list;
});

console.log(setupsList.value);
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
