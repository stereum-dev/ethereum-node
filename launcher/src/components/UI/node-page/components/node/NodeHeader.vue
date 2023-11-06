<template>
  <div class="w-full h-[55px] grid grid-cols-9 gap-1 py-1">
    <ServerDetails />

    <ConfigDetails :list="configsToDisplay" />

    <NetworkDetails />
  </div>
</template>
<script setup>
import { useNodeManage } from "@/store/nodeManage";
import ServerDetails from "./ServerDetails.vue";
import NetworkDetails from "../../../edit-page/components/edit/NetworkDetails.vue";
import ConfigDetails from "../../../edit-page/components/edit/ConfigDetails.vue";
import { computed } from "vue";
import { useRoute } from "vue-router";

const store = useNodeManage();

const route = useRoute();

const configsToDisplay = computed(() => {
  let configs;
  if (route.path === "/node") {
    configs = store.nodeConfigs;
  } else {
    configs = store.nodeConfigs.slice(0, 4);
  }
  return configs;
});
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
