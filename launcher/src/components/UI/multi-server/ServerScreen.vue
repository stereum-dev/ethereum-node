import ServerHeader from './components/ServerHeader.vue';
<template>
  <div
    class="w-full h-full absolute inset-0 grid grid-cols-24 grid-rows-7 bg-gray-700 z-10 p-2 rounded-md divide-y-2 divide-gray-500"
  >
    <ServerHeader />
    <ServerBody @select-server="serverHandler" @change-password="changePassword" />
  </div>
</template>

<script setup>
import ServerHeader from "./components/ServerHeader.vue";
import ServerBody from "./components/ServerBody.vue";
import { ref, onMounted, computed } from "vue";
import ControlService from "@/store/ControlService";
import { useControlStore } from "@/store/theControl";
import { useServers } from "@/store/servers";

const controlStore = useControlStore();
const serverStore = useServers();

const keys = ref([]);
const confirmIndexDelete = ref([]);
const chngPassword = ref(false);
const newPass = ref("");
const comparePass = ref([]);
const keyLocation = ref("");
const acceptedPass = ref("");
const passChk = ref(false);

const passSSHRow = computed(() => (!selectedConnection.value.useAuthKey ? "pass" : "ssh"));
const controlPass = computed(() => (passChk.value ? "denyPass" : ""));

onMounted(async () => {
  await loadStoredConnections();
  await readSSHKeyFile();
});

const serverHandler = (server) => {
  if (serverStore.selectedServerConnection?.name === server.name) {
    serverStore.isServerLoginActive = false;
    serverStore.isServerManagementActive = true;
  } else {
    serverStore.isServerManagementActive = false;
    serverStore.isServerLoginActive = true;
  }
};

const readSSHKeyFile = async () => {
  keys.value = await ControlService.readSSHKeyFile();
};

const formatKey = (key) => {
  let keyArray = key.split(" ");
  return `${keyArray[0]} ... ${keyArray.pop()}`;
};

const loadStoredConnections = async () => {
  const savedConnections = await ControlService.readConfig();
  serverStore.selectedServerConnection = savedConnections.savedConnections.find(
    (item) => item.host === controlStore.ipAddress
  );
};

const setServerAvatar = async () => {
  const savedServers = await ControlService.readConfig();
  savedServers.savedConnections.map((item) => {
    if (item.host === controlStore.ipAddress) {
      return {
        ...item,
        avatar: serverStore.selectedAvatar.avatar,
      };
    }
  });
};

const addKey = (newKeys) => {
  keys.value = newKeys;
};

const confirmDelete = async (key) => {
  await ControlService.writeSSHKeyFile(keys.value.filter((item) => item !== key));
  await readSSHKeyFile();
  confirmIndexDelete.value = [];
  confirmIndex.value = null;
};

const confirmKeyIndex = (index) => {
  confirmIndexDelete.value[index] = true;
  confirmIndex.value = index;
};

const cancelKeyIndex = (index) => {
  confirmIndexDelete.value[index] = false;
  confirmIndex.value = null;
};

const generateModal = () => {
  controlStore.generateModalShow = !controlStore.generateModalShow;
};

const changePassword = (newPassword) => {
  console.log(newPassword);
  serverStore.newPassword = "";
};

const acceptChangePass = async () => {
  if (newPass.value === "") {
    passmessage.value = t("serverManagement.passmessage");
  } else {
    if (comparePass.value.length < 1) {
      comparePass.value.push(newPass.value);
      newPass.value = "";
      passmessage.value = t("serverManagement.confirmPass");
      passChk.value = false;
    } else {
      const passwordEqual = comparePass.value.every((item) => item === newPass.value);
      if (passwordEqual) {
        acceptedPass.value = newPass.value;
        chngPassword.value = false;
        newPass.value = "";
        comparePass.value = [];
        passChk.value = false;
        await ControlService.changePassword(acceptedPass.value);
      } else {
        newPass.value = "";
        passmessage.value = "The passwords do not match";
        comparePass.value = [];
        passChk.value = true;
      }
    }
  }
};

const previewFiles = async (event) => {
  const Path = event.target.files[0].path;
  let pathString = new String(Path);
  let result = pathString.toString();
  keyLocation.value = result;
  await ControlService.AddExistingSSHKey(keyLocation.value);
  await readSSHKeyFile();
};

const openUploadHandler = () => {
  document.querySelector('input[type="file"]').click();
};
</script>
