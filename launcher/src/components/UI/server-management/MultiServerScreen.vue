import ServerHeader from './components/ServerHeader.vue';
<template>
  <div class="w-full h-[95.5%] absolute inset-0 grid grid-cols-24 grid-rows-7 bg-[#336666] z-10 p-2 rounded-md divide-y-2 divide-gray-300">
    <SwitchAnimation
      v-if="(serverStore.isServerAnimationActive || serverStore.connectingProcess) && !serverStore.errorMsgExists && !isTwoFactorAuthActive"
      @cancel-login="cancelLoginHandler"
    />
    <ServerHeader @tab-picker="tabPicker" />
    <ServerBody
      :key="serverBodyComponentKey"
      @server-login="loginHandler"
      @select-server="serverHandler"
      @change-password="acceptChangePass"
      @file-upload="addExistingKeyHandler"
      @delete-key="confirmDelete"
      @quick-login="quickLoginHandler"
    />
    <PasswordModal v-if="serverStore.isPasswordChanged" :res="serverStore.passResponse" />
    <GenerateKey v-if="serverStore.isGenerateModalActive" @close-modal="closeGenerateModal" @generate-key="generateKeyHandler" />
    <RemoveModal v-if="serverStore.isRemoveModalActive" @remove-handler="removeServerHandler" @close-window="closeWindow" />
    <TwofactorModal v-if="isTwoFactorAuthActive" @submit-auth="submitAuthHandler" @close-window="closeAndCancel" />
    <ChangeOTPModal v-if="serverStore.isOTPActive" @submit-password="submitPasswordHandler" @close-window="closeAndCancel" />
    <ErrorModal v-if="serverStore.errorMsgExists" :description="serverStore.error" @close-window="closeErrorDialog" />
    <QRcodeModal v-if="authStore.isBarcodeModalActive" @close-window="closeBarcode" />
  </div>
</template>

<script setup>
import QRcodeModal from "./components/modals/QRcodeModal.vue";
import ServerHeader from "./components/ServerHeader.vue";
import ServerBody from "./components/ServerBody.vue";
import PasswordModal from "./components/modals/PasswordModal.vue";
import SwitchAnimation from "./components/SwitchAnimation.vue";
import TwofactorModal from "./components/modals/TwofactorModal.vue";
import GenerateKey from "./components/modals/GenerateKey.vue";
import ChangeOTPModal from "./components/modals/ChangeOTPModal.vue";

import { ref, onMounted, watchEffect, onUnmounted } from "vue";
import ControlService from "@/store/ControlService";
import { useServers } from "@/store/servers";
import { useTwoFactorAuth } from "@/store/twoFactorAuth";
import RemoveModal from "./components/modals/RemoveModal.vue";
import ErrorModal from "./components/modals/ErrorModal.vue";
import { useServerLogin } from "@/composables/useLogin";
import { useRouter } from "vue-router";

const serverStore = useServers();
const authStore = useTwoFactorAuth();

const { login, remove, loadStoredConnections } = useServerLogin();
const router = useRouter();
const keyLocation = ref("");
let loginAbortController = new AbortController();
const serverBodyComponentKey = ref(0);
const isTwoFactorAuthActive = ref(false);

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

    case "2fa":
      serverStore.setActiveState("isTwoFactorAuthActive");
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

  if (serverStore.isUpdatePanelActive) {
    tabPicker("update");
    serverStore.isUpdatePanelActive = false;
  }
  ControlService.addListener("require2FA", openTwoFactorModal);
});

onUnmounted(() => {
  serverStore.setActiveState(null);
  ControlService.removeListener("require2FA", openTwoFactorModal);
});

//Methods

const openTwoFactorModal = () => {
  cancelLoginHandler();
  isTwoFactorAuthActive.value = true;
};

const closeAndCancel = async () => {
  closeWindow();
  await ControlService.cancelVerification();
};

// authentification handling
const submitAuthHandler = async (val) => {
  loginHandler(val);
};

const submitPasswordHandler = async (pass) => {
  serverStore.isOTPActive = false;
  serverStore.isServerAnimationActive = true;
  serverStore.connectingProcess = true;
  loginAbortController = new AbortController();
  try {
    await ControlService.handleOTPChange({ newPassword: pass });
  } catch (error) {
    console.error("Couldn't Change Password:", error);
    serverStore.isServerAnimationActive = false;
    serverStore.errorMsgExists = true;
    serverStore.error = "Couldn't Change Password. Please try again.\n" + error;
    return;
  }
  serverStore.loginState.password = pass;
  await loginHandler();
};

//Server Management Login Handler

const loginHandler = async (authCode) => {
  loginAbortController = new AbortController();
  serverStore.isServerAnimationActive = true;
  serverStore.connectingProcess = true;
  try {
    if (router.currentRoute.value.path === "/login") {
      await login(loginAbortController.signal, authCode);
    } else {
      serverStore.connectingProcess = true;
      serverStore.isServerAnimationActive = true;
      await ControlService.logout();
      // serverStore.selectedServerToConnect
      await ControlService.stopShell();
      await login(loginAbortController.signal, authCode);

      setTimeout(() => {
        serverStore.isServerAnimationActive = false;
        serverStore.connectingProcess = false;
      }, 5000);
    }
  } catch (error) {
    console.error("Login failed:", error);
  }
  loginAbortController = null;
};

const quickLoginHandler = async (server) => {
  serverHandler(server);
  loginHandler();
};

const cancelLoginHandler = () => {
  if (loginAbortController.signal) {
    loginAbortController.abort();
    loginAbortController = null;
  }

  serverStore.isServerAnimationActive = false;
  serverStore.connectingProcess = false;
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
  isTwoFactorAuthActive.value = false;
  serverStore.isOTPActive = false;
};

const closeErrorDialog = () => {
  serverStore.errorMsgExists = false;
  serverStore.connectingProcess = false;
  closeAndCancel();
};

const closeBarcode = () => {
  authStore.isBarcodeModalActive = false;
};

const removeServerHandler = async () => {
  serverStore.isRemoveProcessing = true;
  serverStore.savedServers.savedConnections = serverStore.savedServers.savedConnections.filter(
    (item) => item.host !== serverStore.selectedServerToConnect?.host && item.name !== serverStore.selectedServerToConnect?.name
  );

  await remove();
  serverStore.selectedServerToConnect = null;
  serverStore.loginState.hostName = "";
  serverStore.loginState.ip = "";
  serverStore.loginState.port = "";
  serverStore.loginState.username = "";
  serverStore.loginState.useAuth = false;
  serverStore.isRemoveProcessing = false;
  serverStore.isRemoveModalActive = false;
  serverBodyComponentKey.value++;
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
  setTimeout(() => {
    readSSHKeyFile();
  }, 1000);
};
</script>
