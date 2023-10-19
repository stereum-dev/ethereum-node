<template>
  <welcome-layouts>
    <WelcomeHeader />
    <ServerDetails />
    <WelcomeBody />
    <WelcomeFooter />
  </welcome-layouts>
</template>

<script setup>
import WelcomeLayouts from "./components/WelcomeLayouts.vue";
import WelcomeHeader from "./components/WelcomeHeader.vue";
import WelcomeBody from "./components/WelcomeBody.vue";
import WelcomeFooter from "./components/WelcomeFooter.vue";
import ServerDetails from "./components/ServerDetails.vue";
import ControlService from "@/store/ControlService";
import { useRoute } from "vue-router";
import { ref } from "vue";

const route = useRoute();
const refresh = ref(false);

const loggingOut = async () => {
  refresh.value = false;
  await ControlService.logout();
  route.push("/").then(() => {
    location.reload();
  });
};
</script>
