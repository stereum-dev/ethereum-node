<template>
  <div class="w-full h-full col-start-1 col-span-full row-start-2 row-span-full grid grid-cols-24 grid-rows-12 p-2 gap-x-1">
    <div class="col-start-14 col-span-full row-start-1 row-span-full p-1 grid grid-cols-12 grid-rows-12 bg-[#1b3231] rounded-md">
      <LoginPanel v-if="isLoginActive" @server-login="serverLogin" />
      <DetailsPanel v-if="isDetailsActive" @change-password="changePassword" @set-avatar="setServerAvatar" />
      <UpdatePanel v-if="isUpdateActive" />
      <SshPanel v-if="isSSHActive" @file-upload="fileUpload" @delete-key="deleteKey" />
      <SettingsPanel v-if="isSettingsActive" />
      <TwoFAPanel v-if="isTwoFactorAuthActive" />
    </div>
    <div class="col-start-1 col-end-14 row-start-1 row-span-full p-3 grid grid-cols-12 grid-rows-12 bg-[#1b3231] rounded-md">
      <ServerPanel @select-server="selectServer" @server-login="addNewServer" @quick-login="quickLogin" />
    </div>
  </div>
</template>

<script setup>
import ServerPanel from "./saved-servers/ServerPanel.vue";
import LoginPanel from "./login-form/LoginPanel.vue";
import DetailsPanel from "./server-details/DetailsPanel.vue";
import UpdatePanel from "./server-update/UpdatePanel.vue";
import SshPanel from "./ssh-management/SshPanel.vue";
import TwoFAPanel from "./two-factor-auth/TwoFAPanel.vue";
import SettingsPanel from "./server-settings/SettingsPanel.vue";
import ControlService from "@/store/ControlService";
import { useServers } from "@/store/servers";
import { useControlStore } from "@/store/theControl";
import { computed, onUnmounted, watch } from "vue";
import { useRoute } from "vue-router";

const emit = defineEmits(["selectServer", "serverLogin", "changePassword", "fileUpload", "deleteKey", "quickLogin"]);

const serverStore = useServers();
const controlStore = useControlStore();
const route = useRoute();

const isLoginActive = computed(() => route.path === "/login" || serverStore.isServerLoginActive);
const isSSHActive = computed(() => route.path !== "/login" && serverStore.isServerSSHActive);
const isDetailsActive = computed(() => route.path !== "/login" && serverStore.isServerDetailsActive);
const isUpdateActive = computed(() => route.path !== "/login" && serverStore.isServerUpdateActive);
const isSettingsActive = computed(() => route.path !== "/login" && serverStore.isServerSettingsActive);
const isTwoFactorAuthActive = computed(() => route.path !== "/login" && serverStore.isTwoFactorAuthActive);

watch(
  () => serverStore.selectedServerConnection,
  async (newVal) => {
    if (newVal) {
      serverStore.isServerLoginActive = false;
      serverStore.isServerManagementActive = true;
    }
  }
);

onUnmounted(() => {
  serverStore.isServerLoginActive = false;
  serverStore.isServerManagementActive = false;
  serverStore.isServerDetailsActive = false;
  serverStore.isServerSSHActive = false;
  serverStore.isServerUpdateActive = false;
  serverStore.isServerSettingsActive = false;
  serverStore.isTwoFactorAuthActive = false;
});

//Methods

const setServerAvatar = async (avatar) => {
  serverStore.selectedAvatar = avatar;
  serverStore.isAvatarModalActive = false;
  const savedServers = await ControlService.readConfig();

  // Update the avatar in the savedConnections array
  const updatedConnections = savedServers.savedConnections.map((item) => {
    if (item.host === controlStore.ipAddress) {
      return { ...item, avatar: avatar };
    }
    return item;
  });

  // Update the config with the new connections array
  const updatedConfig = {
    ...savedServers,
    savedConnections: updatedConnections,
  };
  serverStore.refreshServers = true;
  await ControlService.writeConfig(updatedConfig);
};

const selectServer = (server) => {
  emit("selectServer", server);
};

const addNewServer = () => {
  serverStore.savedServers.savedConnections.forEach((s) => {
    if (s.isSelected) s.isSelected = false;
  });
  if (serverStore.connectExistingServer) {
    serverStore.addNewServer = false;
    serverStore.connectExistingServer = false;
    serverStore.selectServerToConnect = null;
  }
  serverStore.addNewServer = true;
  serverStore.isServerLoginActive = true;
  serverStore.isServerDetailsActive = false;
  serverStore.setActiveTab("login");
  serverStore.isServerManagementActive = false;
  serverStore.isServerSettingsActive = false;
};

const changePassword = (newPassword) => {
  emit("changePassword", newPassword);
};

const fileUpload = (file) => {
  emit("fileUpload", file);
};

const deleteKey = (key) => {
  emit("deleteKey", key);
};

const serverLogin = () => {
  emit("serverLogin");
};

const quickLogin = (server) => {
  emit("quickLogin", server);
};
</script>
