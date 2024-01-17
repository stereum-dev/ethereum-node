import ServerHeader from './components/ServerHeader.vue';
<template>
  <div
    class="w-full h-full absolute inset-0 grid grid-cols-24 grid-rows-7 bg-gray-700 z-10 p-2 rounded-md divide-y-2 divide-gray-500"
  >
    <ServerHeader />
    <ServerBody
      @select-server="serverHandler"
      @change-password="acceptChangePass"
      @file-upload="addExistingKeyHandler"
      @delete-key="confirmDelete"
    />
    <PasswordModal v-if="serverStore.isPasswordChanged" :res="serverStore.passResponse" />
    <GenerateKey
      v-if="serverStore.isGenerateModalActive"
      @close-modal="closeGenerateModal"
      @generate-key="generateKeyHandler"
    />
  </div>
</template>

<script setup>
import ServerHeader from "./components/ServerHeader.vue";
import ServerBody from "./components/ServerBody.vue";
import PasswordModal from "./components/modals/PasswordModal.vue";
import GenerateKey from "./components/modals/GenerateKey.vue";
import { ref, onMounted } from "vue";
import ControlService from "@/store/ControlService";
import { useControlStore } from "@/store/theControl";
import { useServers } from "@/store/servers";

const controlStore = useControlStore();
const serverStore = useServers();

const keyLocation = ref("");

// const passSSHRow = computed(() => (!selectedConnection.value.useAuthKey ? "pass" : "ssh"));

onMounted(async () => {
  await loadStoredConnections();
  await readSSHKeyFile();
});

//Methods

//Load stored connections

const loadStoredConnections = async () => {
  const savedConnections = await ControlService.readConfig();
  serverStore.selectedServerConnection = savedConnections.savedConnections.find(
    (item) => item.host === controlStore.ipAddress
  );
};

//Click handling on a server in the saved servers list
const serverHandler = (server) => {
  if (serverStore.selectedServerConnection?.name === server.name) {
    serverStore.isServerLoginActive = false;
    serverStore.isServerManagementActive = true;
  } else {
    if (serverStore.addNewServer) {
      serverStore.addNewServer = false;
    }
    serverStore.connectExistingServer = true;
    serverStore.selectedServerToConnect = server;
    serverStore.isServerManagementActive = false;
    serverStore.isServerLoginActive = true;
  }
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

//SSH Key Management

const readSSHKeyFile = async () => {
  serverStore.sshKeys = await ControlService.readSSHKeyFile();
};

const confirmDelete = async (key) => {
  try {
    await ControlService.writeSSHKeyFile(serverStore.sshKeys.filter((item) => item !== key));
    await readSSHKeyFile();
  } catch (err) {
    console.log(err);
  }
};

const addExistingKeyHandler = async (event) => {
  const Path = event.target.files[0].path;
  let pathString = new String(Path);
  let result = pathString.toString();
  keyLocation.value = result;
  console.log(keyLocation.value);
  await ControlService.AddExistingSSHKey(keyLocation.value);
  await readSSHKeyFile();
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

const openDirectoryPicker = async () => {
  try {
    const paths = await ControlService.openDirectoryDialog(
      useDeepClone({ properties: ["openDirectory", "createDirectory"] })
    );
    serverStore.savePath = paths[0];
  } catch (error) {
    // Handle case when user cancels directory picker
    if (error.name === "AbortError") {
      serverStore.savePath = "";
    } else {
      console.error("Error picking directory:", error);
    }
  }
};
</script>
