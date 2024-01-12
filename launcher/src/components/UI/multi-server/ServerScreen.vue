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
  </div>
</template>

<script setup>
import ServerHeader from "./components/ServerHeader.vue";
import ServerBody from "./components/ServerBody.vue";
import PasswordModal from "./components/modals/PasswordModal.vue";
import { ref, onMounted, computed } from "vue";
import ControlService from "@/store/ControlService";
import { useControlStore } from "@/store/theControl";
import { useServers } from "@/store/servers";

const controlStore = useControlStore();
const serverStore = useServers();

const keys = ref([]);
const confirmIndexDelete = ref([]);
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

const formatKey = (key) => {
  let keyArray = key.split(" ");
  return `${keyArray[0]} ... ${keyArray.pop()}`;
};

const confirmDelete = async (key) => {
  console.log(key);
  // await ControlService.writeSSHKeyFile(keys.value.filter((item) => item !== key));
  // await readSSHKeyFile();
};

const confirmKeyIndex = (index) => {
  confirmIndexDelete.value[index] = true;
  confirmIndex.value = index;
};

const cancelKeyIndex = (index) => {
  confirmIndexDelete.value[index] = false;
  confirmIndex.value = null;
};

const addExistingKeyHandler = async (event) => {
  const Path = event.target.files[0].path;
  console.log(Path);
  let pathString = new String(Path);
  let result = pathString.toString();
  keyLocation.value = result;
  console.log(keyLocation.value);
  await ControlService.AddExistingSSHKey(keyLocation.value);
  await readSSHKeyFile();
};

// const deleteKey = async (key) => {
//   await ControlService.writeSSHKeyFile(keys.value.filter((item) => item !== key));
//   await readSSHKeyFile();
// };

const generateKey = async () => {
  if (this.sshPass !== this.reEnterSshPass) {
    alert("The passwords do not match");
    this.sshPass = "";
    this.reEnterSshPass = "";
    this.passControl = true;
  } else {
    const data = {
      keyType: this.keyType,
      pickPath: this.pickPath,
      passphrase: this.sshPass,
      bits: this.bitAmount,
      cipher: this.specifyCipher,
    };
    const keys = await ControlService.generateSSHKeyPair(data);
    this.$emit("generate-key", keys);
    this.generateModalShow = false;
  }
};

const openDirectoryPicker = async () => {
  try {
    const paths = await ControlService.openDirectoryDialog(
      useDeepClone({ properties: ["openDirectory", "createDirectory"] })
    );
    this.pickPath = paths[0];
  } catch (error) {
    // Handle case when user cancels directory picker
    if (error.name === "AbortError") {
      this.pickPath = "";
    } else {
      console.error("Error picking directory:", error);
    }
  }
};
</script>
