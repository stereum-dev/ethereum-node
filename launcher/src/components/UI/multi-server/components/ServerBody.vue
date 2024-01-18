<template>
  <div
    class="w-full h-full col-start-1 col-span-full row-start-2 row-span-full grid grid-cols-24 grid-rows-12 p-2 gap-x-1"
  >
    <div
      class="col-start-14 col-span-full row-start-1 row-span-full p-1 pl-0 grid grid-cols-12 grid-rows-12 bg-[#1b1b1d] rounded-md"
    >
      <LoginBox v-if="serverStore.isServerLoginActive" />
      <ManagementBox
        v-if="serverStore.isServerManagementActive"
        @change-password="changePassword"
        @set-avatar="setServerAvatar"
        @file-upload="fileUpload"
        @delete-key="deleteKey"
      />
    </div>
    <div
      class="col-start-1 col-end-14 row-start-1 row-span-full p-1 grid grid-cols-12 grid-rows-12 bg-[#1b1b1d] rounded-md"
    >
      <SavedServers @select-server="selectServer" @server-login="addNewServer" />
    </div>
  </div>
</template>

<script setup>
import ManagementBox from "./management/ManagementBox.vue";
import SavedServers from "./saved-servers/SavedServers.vue";
import LoginBox from "./login-form/LoginBox.vue";
import ControlService from "@/store/ControlService";
import { useServers } from "@/store/servers";
import { useControlStore } from "@/store/theControl";
import { watch } from "vue";

const emit = defineEmits(["selectServer", "serverLogin", "changePassword", "fileUpload", "deleteKey"]);

const serverStore = useServers();
const controlStore = useControlStore();

watch(
  () => serverStore.selectedServerConnection,
  async (newVal) => {
    if (newVal) {
      serverStore.isServerLoginActive = false;
      serverStore.isServerManagementActive = true;
    }
  }
);

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
  if (serverStore.connectExistingServer) {
    serverStore.connectExistingServer = false;
    serverStore.selectServerToConnect = null;
  }
  serverStore.addNewServer = true;
  serverStore.isServerLoginActive = true;
  serverStore.isServerManagementActive = false;
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
</script>
