<template>
  <nav class="main-nav1">
    <pages-nav></pages-nav>
    <service-links></service-links>
    <icons-nav></icons-nav>
  </nav>
</template>
<script setup>
import PagesNav from "./PagesNav.vue";
import IconsNav from "./IconsNav.vue";
import ServiceLinks from "./ServiceLinks.vue";
import { useFrontendServices } from "@/composables/services";
import { onBeforeUnmount, onMounted } from "vue";
import { useServices } from "@/store/services";
let intervalID;

const serviceStore = useServices();

onMounted(() => {
  if (serviceStore.installedServices.length) {
    useFrontendServices();
  }

  intervalID = setInterval(useFrontendServices, 2000); //refresh services
});

onBeforeUnmount(() => {
  clearInterval(intervalID);
});
</script>
<style scoped>
.main-nav1 {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
