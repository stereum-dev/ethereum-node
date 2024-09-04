<template>
  <div
    class="w-full h-full col-start-1 col-span-full row-start-1 row-span-full bg-[#1b1b1d] rounded-md grid grid-cols-12 grid-rows-12 p-2 pt-0"
  >
    <div class="w-full h-full col-start-1 col-span-full row-start-1 row-span-1 flex justify-start items-center">
      <span class="text-md font-semibold text-gray-300 uppercase">Login to server</span>
    </div>
    <form
      class="w-full h-full col-start-1 col-span-full row-start-3 row-span-full grid grid-cols-12 grid-rows-6 space-y-1"
      @submit.prevent="internalLogin"
    >
      <div class="col-start-1 col-span-full row-start-1 row-span-1 grid grid-cols-12 grid-rows-3">
        <label
          for="servername"
          class="col-start-1 col-span-full row-start-1 row-span-1 block text-xs font-bold"
          :class="serverNameError ? 'text-red-500' : 'text-gray-300'"
          >{{ serverNameError ? serverNameError : `${t("multiServer.serverName")}` }}</label
        >
        <input
          id="servername"
          v-model="serverStore.loginState.hostName"
          type="text"
          :placeholder="`${t('multiServer.serverName')}`"
          class="h-8 self-center col-start-1 col-end-10 row-start-2 row-span-2 shadow appearance-none border rounded w-full py-1 px-2 text-gray-800 text-sm font-semibold leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
          required
          @change="serverNameChanged = true"
          @mouseenter="footerStore.cursorLocation = `${t('loginForm.addServerName')}`"
          @mouseleave="footerStore.cursorLocation = ''"
        />

        <div class="w-full h-full col-start-10 col-span-full row-start-2 row-span-2 flex justify-evenly items-center relative">
          <img
            class="w-7 hover:scale-110 active:scale-100 transition-all ease-in-out duration-200 cursor-pointer self-center border-4 border-gray-400 rounded-full shadow-md shadow-[#141414]"
            :src="getTrashImg"
            alt="Trash Icon"
            :class="removeButtonDisabled ? 'opacity-50 pointer-events-none ' : ''"
            @mousedown.prevent
            @mouseenter="(removeHovered = true), (footerStore.cursorLocation = `${t('loginForm.rem')}`)"
            @mouseleave="(removeHovered = false), (footerStore.cursorLocation = '')"
            @click="removeServer"
          />

          <div
            v-if="removeHovered"
            class="absolute -top-11 right-5 w-36 rounded-sm bg-[#202632] px-3 py-2 text-center text-xs font-medium text-white outline-none capitalize"
          >
            {{ $t("loginServer.removeServer") }}
          </div>

          <img
            class="w-7 hover:scale-110 active:scale-100 transition-all ease-in-out duration-200 cursor-pointer self-center border-4 border-gray-400 rounded-full shadow-md shadow-[#141414]"
            :class="addButtonDisabled ? 'opacity-50 pointer-events-none ' : ''"
            src="/img/icon/server-management-icons/plus-icon.png"
            alt="icon"
            @mousedown.prevent
            @mouseenter="(addHovered = true), (footerStore.cursorLocation = `${t('loginForm.save')}`)"
            @mouseleave="(addHovered = false), (footerStore.cursorLocation = '')"
            @click="saveServer"
          />
          <div
            v-if="addHovered"
            class="absolute -top-11 -right-5 w-28 rounded-sm uppercase bg-[#202632] px-3 py-2 text-center text-xs font-medium text-white outline-none"
          >
            {{ $t("multiServer.saveServer") }}
          </div>
        </div>
      </div>
      <div class="col-start-1 col-end-7 row-start-2 row-span-1 grid grid-cols-12 grid-rows-3 mr-1">
        <label
          for="hostname"
          class="col-start-1 col-span-full row-start-1 row-span-1 block text-gray-300 text-xs font-bold mb-2"
          :class="ipError ? 'text-red-500' : 'text-gray-300'"
          >{{ ipError ? ipError : $t("multiServer.ipOrHost") }}</label
        >
        <div
          class="w-full h-fit col-start-1 col-span-full row-start-2 row-span-2 bg-gray-200 rounded-md grid grid-cols-12 items-center self-center"
        >
          <input
            id="hostname"
            v-model="serverStore.loginState.ip"
            type="text"
            placeholder="114.72.86.90"
            class="h-8 self-center col-start-1 col-end-11 shadow appearance-none border rounded w-full py-1 px-2 text-gray-800 text-sm font-semibold leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
            required
            @mouseenter="footerStore.cursorLocation = `${t('loginForm.ipOrHost')}`"
            @mouseleave="footerStore.cursorLocation = ''"
            @change="serverIPChanged = true"
          />
          <img
            v-if="!serverStore.isIpScannerModalActive"
            class="w-6 h-6 col-start-11 col-span-full self-center p-[2px] cursor-pointer hover:scale-110 active:scale-100 transition-all ease-in-out duration-200 justify-self-center"
            src="/img/icon/server-management-icons/local-lan.png"
            alt="Scanner Icon"
            @click="IpScanner"
          />
          <span
            v-else
            class="animate-spin w-6 h-6 col-start-11 col-span-full border-4 border-gray-300 border-t-4 border-t-[#88b79a] border-r-4 border-r-[#88b79a] rounded-full self-center justify-self-center"
          ></span>
        </div>
      </div>
      <div class="col-start-7 col-span-full row-start-2 row-span-1 grid grid-cols-12 grid-rows-3">
        <label for="port" class="col-start-1 col-span-full row-start-1 row-span-1 block text-gray-300 text-xs font-bold mb-2">{{
          $t("multiServer.port")
        }}</label>

        <input
          id="port"
          v-model="serverStore.loginState.port"
          type="text"
          placeholder="22"
          class="h-8 self-center col-start-1 col-span-full row-start-2 row-span-2 shadow appearance-none border rounded w-full py-1 px-2 text-gray-800 text-sm font-semibold leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
          @mouseenter="footerStore.cursorLocation = `${t('loginForm.port')}`"
          @mouseleave="footerStore.cursorLocation = ''"
        />
      </div>
      <div class="col-start-1 col-end-7 row-start-3 row-span-1 grid grid-cols-12 grid-rows-3">
        <label
          for="username"
          class="col-start-1 col-span-full row-start-1 row-span-1 block text-xs font-bold mb-2"
          :class="usernameError ? 'text-red-500' : 'text-gray-300'"
          >{{ usernameError ? usernameError : `${$t("multiServer.userName")}` }}</label
        >
        <input
          id="username"
          v-model="serverStore.loginState.username"
          type="text"
          placeholder="root"
          class="h-8 self-center col-start-1 col-span-full row-start-2 row-span-2 shadow appearance-none border rounded w-full py-1 px-2 text-gray-800 text-sm font-semibold leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
          required
          @change="serverUsernameChanged = true"
          @mouseenter="footerStore.cursorLocation = `${t('loginForm.uName')}`"
          @mouseleave="footerStore.cursorLocation = ''"
        />
      </div>
      <div class="col-start-7 col-span-full row-start-3 row-span-1 grid grid-cols-12 grid-rows-3">
        <span
          class="w-full col-start-1 col-span-full row-start-1 row-span-1 text-gray-300 font-semibold text-xs ml-1 capitalize text-center"
          >{{ $t("formsetup.usessh") }}</span
        >

        <label
          for="AcceptConditions"
          class="col-start-6 col-end-9 row-start-2 row-span-full self-center relative h-6 w-12 cursor-pointer [-webkit-tap-highlight-color:_transparent] flex justify-center items-center"
          @mouseenter="footerStore.cursorLocation = `${t('loginForm.tgll')}`"
          @mouseleave="footerStore.cursorLocation = ''"
        >
          <input
            id="AcceptConditions"
            v-model="serverStore.loginState.useAuth"
            type="checkbox"
            class="peer sr-only [&:checked_+_span_svg[data-checked-icon]]:block [&:checked_+_span_svg[data-unchecked-icon]]:hidden bg-gray-200"
            @input="toggleSSH"
          />

          <span
            class="absolute inset-y-0 start-0 z-10 m-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-gray-400 transition-all peer-checked:start-6 peer-checked:text-green-600"
          >
            <svg data-unchecked-icon xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>

            <svg data-checked-icon xmlns="http://www.w3.org/2000/svg" class="hidden h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </span>

          <span class="absolute inset-0 rounded-full bg-gray-300 transition peer-checked:bg-green-500"></span>
        </label>
      </div>

      <div v-if="useSSHKey && !usePassword" class="col-start-1 col-span-full row-start-4 row-span-1 grid grid-cols-12 grid-rows-3">
        <label
          for="keypath"
          class="col-start-1 col-end-12 row-start-1 row-span-1 block text-xs font-bold"
          :class="sshError ? 'text-red-500' : 'text-gray-300'"
          >{{ sshError ? sshError : `${$t("multiServer.keyPath")}` }}</label
        >
        <input
          id="keypath"
          v-model="serverStore.loginState.keyPath"
          type="text"
          placeholder="/user/.ssh/id_rsa"
          class="h-8 self-center col-start-1 col-end-12 row-start-2 row-span-2 overflow-hidden appearance-none border rounded-l-md w-full py-1 px-2 text-gray-800 text-sm font-semibold leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
          required
          @input="validateSSHKeyPath"
        />
        <label
          for="keypath-file"
          class="h-8 col-start-12 col-span-full row-start-2 row-span-2 self-center w-full flex justify-center items-center cursor-pointer bg-gray-200 rounded-r-md"
        >
          <div class="w-6 h-6 border-2 border-gray-400 rounded-full flex justify-center items-center">
            <span
              class="text-xl text-teal-700 text-center font-bold hover:scale-125 active:scale-100 transition-all duration-150 ease-in-out"
              >+</span
            >
          </div>
          <input id="keypath-file" type="file" class="hidden" @change="handleFileSelect" />
        </label>
      </div>
      <div v-if="useSSHKey && !usePassword" class="col-start-1 col-span-full row-start-5 row-span-1 grid grid-cols-12 grid-rows-3">
        <label for="password" class="col-start-1 col-span-full row-start-1 row-span-1 block text-gray-300 text-xs font-bold">{{
          $t("multiServer.pass")
        }}</label>
        <input
          id="password"
          v-model="serverStore.loginState.passphrase"
          type="password"
          class="h-8 self-center col-start-1 col-span-full row-start-2 row-span-2 shadow appearance-none border rounded w-full py-1 px-2 text-gray-800 text-sm font-semibold leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
          placeholder="******************"
          @mouseenter="footerStore.cursorLocation = `${t('loginForm.pass')}`"
          @mouseleave="footerStore.cursorLocation = ''"
        />
      </div>
      <div v-if="usePassword && !useSSHKey" class="col-start-1 col-span-full row-start-4 row-span-1 grid grid-cols-12 grid-rows-3">
        <label
          for="password"
          class="col-start-1 col-span-full row-start-1 row-span-1 block text-gray-300 text-xs font-bold"
          :class="passwordError ? 'text-red-500' : 'text-gray-300'"
          >{{ passwordError ? passwordError : $t("multiServer.pass") }}</label
        >
        <input
          id="password"
          v-model="serverStore.loginState.password"
          type="password"
          class="h-8 self-center col-start-1 col-span-full row-start-2 row-span-2 shadow appearance-none border rounded w-full py-1 px-2 text-gray-800 text-sm font-semibold leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
          placeholder="******************"
          required
          @input="validatePassword"
          @mouseenter="footerStore.cursorLocation = `${t('loginForm.pass')}`"
          @mouseleave="footerStore.cursorLocation = ''"
        />
      </div>

      <div class="col-start-1 col-span-full row-start-6 row-span-1 flex justify-center items-center">
        <button
          v-if="!serverStore.connectingProcess"
          class="w-full h-[50px] hover:bg-teal-700 text-gray-800 hover:text-white font-bold py-1 px-4 rounded-md focus:outline-none focus:shadow-outline active:scale-95 transition-all ease-in-out duration-100 shadow-lg shadow-black active:shadow-none text-md uppercase"
          :class="serverStore.isIpScannerModalActive || buttonDisabled ? 'bg-gray-400 opacity-50 pointer-events-none ' : 'bg-gray-200'"
          type="submit"
          :disabled="buttonDisabled"
        >
          {{ $t("multiServer.login") }}
        </button>

        <div
          v-else
          class="w-full h-[50px] bg-teal-700 text-gray-200 font-semibold py-1 px-4 rounded-md pointer-events-none flex justify-center items-center text-md"
        >
          <svg class="animate-spin h-6 w-6 mr-3 border-2 border-gray-400 border-tr-2 border-r-white rounded-full" viewBox="0 0 24 24"></svg>
          {{ $t("multiServer.conecting") }}
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed, ref, onUnmounted, watchEffect, watch, onMounted } from "vue";

import { useServers } from "@/store/servers";
import { useServerLogin } from "@/composables/useLogin";
import ControlService from "@/store/ControlService";
import { useRouter } from "vue-router";
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";

const t = i18n.global.t;

const emit = defineEmits(["serverLogin"]);

const footerStore = useFooter();
const serverStore = useServers();
const router = useRouter();

const { add } = useServerLogin();

//Refs

const serverNameError = ref("");
const ipError = ref("");
const usernameError = ref("");
const passwordError = ref("");
const sshError = ref("");
const devices = ref([]);
const removeHovered = ref(false);
const addHovered = ref(false);
const isFormValid = ref(false);
const useSSHKey = ref(false);
const usePassword = ref(false);
const serverNameChanged = ref(false);
const serverIPChanged = ref(false);
const serverUsernameChanged = ref(false);

//*********** Computed ***********//

const buttonDisabled = computed(() => {
  return !!(serverNameError.value || ipError.value || usernameError.value);
});

const getTrashImg = computed(() => {
  if (removeHovered.value) {
    return "./img/icon/server-management-icons/trash-can-2.png";
  } else {
    return "./img/icon/server-management-icons/trash-can.png";
  }
});

const addButtonDisabled = computed(() => {
  if (
    !ipError.value &&
    !usernameError.value &&
    !serverNameError.value &&
    serverStore.loginState.hostName &&
    serverStore.loginState.ip &&
    serverStore.loginState.username
  ) {
    return false;
  } else {
    return true;
  }
});

const removeButtonDisabled = computed(() => {
  return !serverStore.selectedServerToConnect;
});

//*********** Watchers ***********//

watch(
  () => serverStore.loginState.useAuth,
  () => {
    toggleSSH();
  }
);

watchEffect(() => {
  if (serverStore.addNewServer) {
    serverStore.selectedServerToConnect = null;
    serverStore.loginState.hostName = "";
    serverStore.loginState.ip = "";
    serverStore.loginState.port = "";
    serverStore.loginState.username = "";
    serverStore.loginState.keyPath = "";
    serverStore.loginState.useAuth = false;
  }
});

watchEffect(() => {
  if (serverStore.selectedServerToConnect) {
    serverStore.loginState.hostName = serverStore.selectedServerToConnect.name;
    serverStore.loginState.ip = serverStore.selectedServerToConnect.host;
    serverStore.loginState.port = serverStore.selectedServerToConnect.port;
    serverStore.loginState.username = serverStore.selectedServerToConnect.user;
    serverStore.loginState.useAuth = serverStore.selectedServerToConnect.useAuthKey;

    if (serverStore.loginState.useAuth) {
      useSSHKey.value = true;
      usePassword.value = false;
      serverStore.loginState.keyPath = serverStore.selectedServerToConnect.keylocation;
      serverStore.loginState.passphrase = serverStore.selectedServerToConnect?.passphrase;
      serverStore.loginState.password = "";
    } else {
      useSSHKey.value = false;
      usePassword.value = true;
      serverStore.loginState.keyPath = "";
      serverStore.loginState.passphrase = "";
      serverStore.loginState.password = serverStore.selectedServerToConnect.password;
    }
  }
});

watch(
  () => serverStore.loginState.hostName,
  () => {
    if (serverNameChanged.value) {
      validateServerName();
    }
  }
);

watch(
  () => serverStore.loginState.ip,
  () => {
    if (serverIPChanged.value) {
      validateIP();
    }
  }
);

watch(
  () => serverStore.loginState.username,
  () => {
    if (serverUsernameChanged.value) {
      validateUsername();
    }
  }
);

watchEffect(() => {
  if (!serverNameError.value && !ipError.value && !usernameError.value) {
    isFormValid.value = true;
  } else {
    isFormValid.value = false;
  }
});

//*********** Lifecycle Hooks ***********//

onMounted(() => {
  ipError.value = "";
  usernameError.value = "";
  serverNameError.value = "";

  serverStore.loginState = {};
});

onUnmounted(() => {
  serverStore.loginState = {};
});

//*********** Methods ***********//

// Validation functions
const validateServerName = () => {
  const serverName = serverStore.loginState.hostName || ""; // Default to empty string if undefined or null
  serverNameError.value = serverName.trim() ? "" : "Server name is required.";
};

const validateIP = () => {
  const ipOrHostname = serverStore.loginState.ip || "";

  ipError.value = ipOrHostname.trim().length > 0 ? "" : "IP address or hostname is required.";
};

const validateUsername = () => {
  const username = serverStore.loginState.username || ""; // Default to empty string if undefined or null
  usernameError.value = username.trim() ? "" : "Username is required.";
};

const validateSSHKeyPath = () => {
  const keyPath = serverStore.loginState.keyPath || ""; // Default to empty string if undefined or null
  sshError.value = keyPath.trim() ? "" : "SSH key path is required.";
};

const validatePassword = () => {
  const password = serverStore.loginState.password || ""; // Default to empty string if undefined or null
  passwordError.value = password.trim() ? "" : "Password is required.";
};

const validateForm = () => {
  validateServerName();
  validateIP();
  validateUsername();

  if (!serverNameError.value && !ipError.value && !usernameError.value) {
    isFormValid.value = true;
  } else {
    isFormValid.value = false;
  }
};

const toggleSSH = () => {
  if (serverStore.loginState.useAuth) {
    useSSHKey.value = true;
    usePassword.value = false;
  } else {
    useSSHKey.value = false;
    usePassword.value = true;
  }
};

// Lifecycle

onUnmounted(() => {
  serverStore.loginState.hostName = "";
  serverStore.loginState.ip = "";
  serverStore.loginState.port = "";
  serverStore.loginState.username = "";
  serverStore.loginState.useAuth = false;
  serverStore.loginState.keyPath = "";
  serverStore.loginState.password = "";
  serverStore.loginState.passphrase = "";
  serverStore.connectExistingServer = false;
  serverStore.selectedServerToConnect = null;
});

const handleFileSelect = (event) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    if (selectedFile.size > 0) {
      serverStore.loginState.keyPath = selectedFile.path;
    } else {
      serverStore.loginState.keyPath = "";
    }
  } else {
    serverStore.loginState.keyPath = "";
  }
};

const IpScanner = async () => {
  serverStore.isIpScannerModalActive = true;
  try {
    let res = await ControlService.IpScanLan();
    devices.value = res;
    if (devices.value.length > 0) {
      const ip = devices.value[0].ip;
      serverStore.loginState.ip = ip;
      serverStore.isIpScannerModalActive = false;
    } else {
      serverStore.isIpScannerModalActive = false;
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

const saveServer = async () => {
  if (isFormValid.value) {
    await add();
    serverStore.selectedServerToConnect = null;
    serverStore.loginState.hostName = "";
    serverStore.loginState.ip = "";
    serverStore.loginState.port = "";
    serverStore.loginState.username = "";
    serverStore.loginState.useAuth = false;
  }
};

const removeServer = () => {
  serverStore.isRemoveModalActive = true;
};

const internalLogin = () => {
  validateForm();
  if (isFormValid.value) {
    serverStore.isServerAnimationActive = true;
    serverStore.connectingProcess = true;
    emit("serverLogin");
  } else {
    router.push("/login");
  }
};
</script>
