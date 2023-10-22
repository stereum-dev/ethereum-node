<template>
  <installation-layout>
    <WelcomeHeader @logout="logoutModalHandler" />
    <ServerDetails />
    <WelcomeBody />
    <WelcomeFooter />
    <LogoutModal
      v-if="isLogoutModalActive"
      :process="isProcessing"
      @logout-handler="loggingOut"
      @close-window="closeModal"
    />
  </installation-layout>
</template>

<script setup>
import InstallationLayout from "../../base/InstallationLayout.vue";
import LogoutModal from "./components/LogoutModal.vue";
import WelcomeHeader from "./components/WelcomeHeader.vue";
import WelcomeBody from "./components/WelcomeBody.vue";
import WelcomeFooter from "./components/WelcomeFooter.vue";
import ServerDetails from "./components/ServerDetails.vue";
import ControlService from "@/store/ControlService";
import { useRouter } from "vue-router";
import { ref } from "vue";

//Router
const router = useRouter();

//Refs
const refresh = ref(false);
const isLogoutModalActive = ref(false);
const isProcessing = ref(false);

//Methods

const closeModal = () => {
  isLogoutModalActive.value = false;
};

const logoutModalHandler = () => {
  isLogoutModalActive.value = true;
};

const loggingOut = async () => {
  isProcessing.value = true;
  router.push("/login").then(() => {
    location.reload();
  });
  refresh.value = false;
  await ControlService.logout();
};
</script>
