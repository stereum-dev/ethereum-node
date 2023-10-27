<template>
  <installation-layout>
    <component :is="currentStepComponent"></component>
  </installation-layout>
</template>

<script setup>
import SelectPreset from "./sections/SelectPreset.vue";
import ConfigPlugins from "./sections/ConfigPlugins.vue";
import MevboostRelays from "./sections/MevboostRelays.vue";
import SelectSync from "./sections/SelectSync.vue";
import VerifyCheck from "./sections/VerifyCheck.vue";
import AnimationSection from "./sections/AnimationSection.vue";
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const components = [
  {
    path: "/oneClick/preset",
    component: SelectPreset,
  },
  {
    path: "/oneClick/config",
    component: ConfigPlugins,
  },
  {
    path: "/oneClick/mevboost",
    component: MevboostRelays,
  },
  {
    path: "/oneClick/sync",
    component: SelectSync,
  },
  {
    path: "/oneClick/verify",
    component: VerifyCheck,
  },
  {
    path: "/oneClick/play",
    component: AnimationSection,
  },
];

const currentStepComponent = computed(() => {
  let current;
  components.forEach((step) => {
    if (step.path === router.currentRoute.value.path) {
      current = step.component;
    }
  });
  return current;
});
</script>
