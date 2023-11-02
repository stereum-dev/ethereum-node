<template>
  <installation-layout>
    <component :is="currentStepComponent"></component>
  </installation-layout>
</template>

<script setup>
import CustomPath from "./components/CustomPath.vue";
import CustomAnim from "./components/CustomAnim.vue";
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const components = [
  {
    path: "/custom/path",
    component: CustomPath,
  },

  {
    path: "/custom/play",
    component: CustomAnim,
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
