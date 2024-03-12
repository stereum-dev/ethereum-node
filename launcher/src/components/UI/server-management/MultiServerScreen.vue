import ServerHeader from './components/ServerHeader.vue';
<template>
  <div
    class="w-full h-full absolute inset-0 grid grid-cols-24 grid-rows-7 bg-[#336666] z-10 p-2 rounded-md divide-y-2 divide-gray-300"
  >
    <div v-if="serverStore.connectingProcess" class="w-full h-full fixed inset-0 z-20 flex justify-center items-center">
      <div class="w-full h-full grid grid-cols-24 grid-rows-12 items-center relative z-30">
        <SwitchAnimation />

        <button
          class="absolute col-start-9 col-end-18 row-start-10 row-span-full w-full h-[50px] bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded-md shadow-lg shadow-black active:shadow-none text-md uppercase z-50 cursor-pointer"
          type="button"
          @click="cancelLoginHandler"
        >
          {{ $t("multiServer.cancel") }}
        </button>
      </div>
    </div>
    <ServerHeader @tab-picker="tabPicker" />
    <ServerBody
      @server-login="loginHandler"
      @select-server="serverHandler"
      @change-password="acceptChangePass"
      @file-upload="addExistingKeyHandler"
      @delete-key="confirmDelete"
      @quick-login="quickLoginHandler"
      @cancel-login="cancelLoginHandler"
    />
    <PasswordModal v-if="serverStore.isPasswordChanged" :res="serverStore.passResponse" />
    <GenerateKey
      v-if="serverStore.isGenerateModalActive"
      @close-modal="closeGenerateModal"
      @generate-key="generateKeyHandler"
    />
    <RemoveModal
      v-if="serverStore.isRemoveModalActive"
      @remove-handler="removeServerHandler"
      @close-window="closeWindow"
    />
    <ErrorModal v-if="serverStore.errorMsgExists" :description="serverStore.error" @close-window="closeErrorDialog" />
  </div>
</template>

<script setup>
import ServerHeader from "./components/ServerHeader.vue";
import ServerBody from "./components/ServerBody.vue";
import PasswordModal from "./components/modals/PasswordModal.vue";
import SwitchAnimation from "./components/SwitchAnimation.vue";
import GenerateKey from "./components/modals/GenerateKey.vue";

import { ref, onMounted, watchEffect, onUnmounted } from "vue";
import ControlService from "@/store/ControlService";
import { useServers } from "@/store/servers";
import RemoveModal from "./components/modals/RemoveModal.vue";
import ErrorModal from "./components/modals/ErrorModal.vue";
import { useServerLogin } from "@/composables/useLogin";
import { useRouter } from "vue-router";
import { useNodeStore } from "@/store/theNode";

const serverStore = useServers();
const nodeStore = useNodeStore();
const { login, remove, loadStoredConnections } = useServerLogin();
const router = useRouter();
const keyLocation = ref("");
const abortController = new AbortController();

watchEffect(() => {
  serverStore.setActiveState("isServerDetailsActive");
});

watchEffect(() => {
  switch (serverStore.selectedTab) {
    case "login":
      serverStore.setActiveState("isServerLoginActive");
      break;
    case "info":
      serverStore.setActiveState("isServerDetailsActive");
      break;
    case "ssh":
      serverStore.setActiveState("isServerSSHActive");
      break;
    case "update":
      serverStore.setActiveState("isServerUpdateActive");
      break;
    case "settings":
      serverStore.setActiveState("isServerSettingsActive");
      break;
    case null:
      serverStore.setActiveState("isServerDetailsActive");
      break;
  }
});
// const passSSHRow = computed(() => (!selectedConnection.value.useAuthKey ? "pass" : "ssh"));

onMounted(async () => {
  await loadStoredConnections();
  await readSSHKeyFile();
});

onUnmounted(() => {
  serverStore.setActiveState(null);
});

//Methods

//Server Management Login Handler

const loginHandler = async () => {
  nodeStore.skeletonLoading = true;
  if (router.currentRoute.value.path === "/login") {
    await login(abortController.signal);
  } else {
    serverStore.isServerAnimationActive = true;
    await ControlService.logout();
    await login(abortController.signal);
    setTimeout(() => {
      serverStore.isServerAnimationActive = false;
      nodeStore.skeletonLoading = false;
    }, 5000);
  }
};

const quickLoginHandler = async () => {
  serverStore.connectingProcess = true;
  if (router.currentRoute.value.path === "/login") {
    await login(abortController.signal);
  } else {
    serverStore.isServerAnimationActive = true;
    await ControlService.logout();
    await login(abortController.signal);
    setTimeout(() => {
      serverStore.isServerAnimationActive = false;
      serverStore.connectingProcess = false;
    }, 5000);
  }
};

const cancelLoginHandler = () => {
  serverStore.connectingProcess = false;
  abortController.abort();
  location.reload();
};

//Server State Management

//Server Management Tab Picker
const tabPicker = (tab) => {
  serverStore.setActiveTab(tab);
};

//Click handling on a server in the saved servers list
const serverHandler = (server) => {
  serverStore.tabs.forEach((tab) => {
    tab.isActive = false;
  });

  // Reset isSelected for all servers before setting the selected one
  serverStore.savedServers.savedConnections.forEach((s) => {
    if (s.isSelected) s.isSelected = false;
  });

  if (serverStore.selectedServerConnection?.name === server.name) {
    serverStore.isServerLoginActive = false;
    serverStore.isServerSettingsActive = false;
    serverStore.setActiveTab("info");
    serverStore.isServerDetailsActive = true;
    server.isSelected = true;
  } else {
    if (serverStore.addNewServer) {
      serverStore.addNewServer = false;
    }
    serverStore.setActiveTab("login");
    serverStore.connectExistingServer = true;
    serverStore.selectedServerToConnect = server;
    serverStore.isServerDetailsActive = false;
    serverStore.isServerSettingsActive = false;
    serverStore.isServerLoginActive = true;
    server.isSelected = true;
  }

  serverStore.savedServers.savedConnections = [...serverStore.savedServers.savedConnections];
};

//Change password handling

const acceptChangePass = async (pass) => {
  try {
    serverStore.passResponse = await ControlService.changePassword(pass);
    if (serverStore.passResponse !== "") {
      serverStore.isPasswordChanged = true;
    }
    serverStore.newPassword = "";
    serverStore.verifyPassword = "";
  } catch (err) {
    console.log(err);
  }
};
//Remove server handling

const closeWindow = () => {
  serverStore.isRemoveModalActive = false;
};

const closeErrorDialog = () => {
  serverStore.errorMsgExists = false;
  serverStore.connectingProcess = false;
};

const removeServerHandler = async () => {
  serverStore.isRemoveProcessing = true;
  serverStore.savedServers.savedConnections = serverStore.savedServers.savedConnections.filter(
    (item) =>
      item.host !== serverStore.selectedServerToConnect?.host && item.name !== serverStore.selectedServerToConnect?.name
  );

  await remove();
  serverStore.isRemoveProcessing = false;
  serverStore.isRemoveModalActive = false;
};

//SSH Key Management

const readSSHKeyFile = async () => {
  serverStore.sshKeys = await ControlService.readSSHKeyFile();
};

const confirmDelete = async (key) => {
  serverStore.sshKeys = serverStore.sshKeys.filter((item) => item !== key);
  try {
    await ControlService.writeSSHKeyFile(serverStore.sshKeys.filter((item) => item !== key));
    await readSSHKeyFile();
  } catch (err) {
    console.log(err);
  }
};

const addExistingKeyHandler = async (event) => {
  const file = event.target.files[0];

  if (file) {
    const filePath = file.path;
    const fileExtension = filePath.split(".").pop();

    if (fileExtension.toLowerCase() === "pub") {
      let pathString = new String(filePath);
      let result = pathString.toString();
      keyLocation.value = result;
      console.log(keyLocation.value);
      await ControlService.AddExistingSSHKey(keyLocation.value);
      await readSSHKeyFile();
    } else {
      console.error("The selected file does not have a .pub extension.");
    }
  }
};

const closeGenerateModal = () => {
  serverStore.isGenerateModalActive = false;
};

const generateKeyHandler = async () => {
  const data = {
    keyType: serverStore.selectedKeyType,
    pickPath: serverStore.savePath,
    passphrase: serverStore.sshPassword,
    bits: serverStore.bitAmount,
    cipher: serverStore.selectedCyper,
  };
  const keys = await ControlService.generateSSHKeyPair(data);
  await ControlService.writeSSHKeyFile(keys);
  serverStore.isGenerateModalActive = false;
};
</script>
