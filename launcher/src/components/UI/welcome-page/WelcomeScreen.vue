<template>
  <installation-layout>
    <WelcomeHeader @logout="logoutModal" />
    <ServerDetails />
    <WelcomeBody />
    <WelcomeFooter />
    <LogoutModal @logout-handler="loggingOut" @close-window="closeModal" />
  </installation-layout>
</template>

<script setup>
import LogoutModal from "./components/LogoutModal.vue";
import WelcomeHeader from "./components/WelcomeHeader.vue";
import WelcomeBody from "./components/WelcomeBody.vue";
import WelcomeFooter from "./components/WelcomeFooter.vue";
import ServerDetails from "./components/ServerDetails.vue";
import ControlService from "@/store/ControlService";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useServers } from "@/store/servers";

const serverStore = useServers();
//Router
const router = useRouter();

//Refs
const refresh = ref(false);
const isLogoutModalActive = ref(false);

//Methods

const closeModal = () => {
  isLogoutModalActive.value = false;
};

const logoutModal = () => {
  isLogoutModalActive.value = true;
};

const loggingOut = async () => {
  serverStore.connectingAnimActive = false;
  serverStore.isUpdateProcessing = true;
  router.push("/login").then(() => {
    location.reload();
  });
  refresh.value = false;
  await ControlService.logout();
};
</script>
