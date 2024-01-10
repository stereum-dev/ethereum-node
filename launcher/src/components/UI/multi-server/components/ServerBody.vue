<template>
  <div
    class="w-full h-full col-start-1 col-span-full row-start-2 row-span-full grid grid-cols-24 grid-rows-12 p-2 divide-x-2 divide-gray-500"
  >
    <div class="col-start-1 col-end-11 row-start-1 row-span-full p-1 pl-0 grid grid-cols-12 grid-rows-12">
      <LoginBox v-if="serverStore.isServerLoginActive" />
      <ManagementBox v-if="serverStore.isServerManagementActive" @change-password="changePassword" />
    </div>
    <div class="col-start-11 col-span-full row-start-1 row-span-full p-1 grid grid-cols-12 grid-rows-12">
      <SavedServers @select-server="selectServer" @server-login="openLoginForm" />
    </div>
  </div>
</template>

<script setup>
import ManagementBox from "./management/ManagementBox.vue";
import SavedServers from "./saved-servers/SavedServers.vue";
import LoginBox from "./login-form/LoginBox.vue";
import { useServers } from "@/store/servers";

const emit = defineEmits(["selectServer", "serverLogin", "changePassword"]);

const serverStore = useServers();

const selectServer = (server) => {
  emit("selectServer", server);
};

const openLoginForm = () => {
  serverStore.isServerLoginActive = true;
  serverStore.isServerManagementActive = false;
};

const changePassword = (newPassword) => {
  emit("changePassword", newPassword);
};
</script>
