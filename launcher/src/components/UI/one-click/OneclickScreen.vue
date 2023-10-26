<template>
  <installation-layout>
    <component :is="currentStepComponent"></component>
  </installation-layout>
</template>

<script setup>
import SelectPreset from "./sections/SelectPreset.vue";
import ConfigPlugins from "./sections/ConfigPlugins.vue";
import SelectSync from "./sections/SelectSync.vue";
import VerifyCheck from "./sections/VerifyCheck.vue";
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const stepComponents = [
  { component: SelectPreset, path: "/oneClick/preset" },
  { component: ConfigPlugins, path: "/oneClick/config" },
  { component: SelectSync, path: "/oneClick/sync" },
  { component: VerifyCheck, path: "/oneClick/verify" },
];

const currentStepComponent = computed(() => {
  let current;
  stepComponents.forEach((step) => {
    if (step.path === router.currentRoute.value.fullPath) {
      current = step.component;
    }
  });
  return current;
});
</script>
