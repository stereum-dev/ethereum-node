import { V2_MetaFunction } from "@remix-run/react"; import { computed, onMounted, watch, watchEffect } from 'vue';
<template>
  <div class="w-full h-full col-start-1 col-span-full row-start-1 row-span-full flex justify-center items-center">
    <form class="w-full h-full grid grid-cols-12 grid-rows-7 space-y-1">
      <div class="col-start-1 col-span-full row-start-1 row-span-1 grid grid-cols-12 grid-rows-3">
        <label
          for="servername"
          class="col-start-1 col-span-full row-start-1 row-span-1 block text-xs font-bold"
          :class="serverNameError ? 'text-red-500' : 'text-gray-300'"
          >{{ serverNameError ? serverNameError : "Server Name" }}</label
        >
        <input
          id="servername"
          v-model="serverStore.loginState.hostName"
          type="text"
          placeholder="Server Name"
          class="h-8 self-center col-start-1 col-end-10 row-start-2 row-span-2 shadow appearance-none border rounded w-full py-1 px-2 text-gray-800 text-sm font-semibold leading-tight focus:outline-none focus:shadow-outline"
        />

        <div
          class="w-full h-full col-start-10 col-span-full row-start-2 row-span-2 flex justify-evenly items-center relative"
        >
          <img
            class="w-8 hover:scale-110 active:scale-100 transition-all ease-in-out duration-200 cursor-pointer self-center border-4 border-gray-400 rounded-full shadow-md shadow-[#141414]"
            :src="getTrashImg"
            alt=""
            @mousedown.prevent
            @mouseenter="(hovered = true), (removeHovered = true)"
            @mouseleave="(hovered = false), (removeHovered = false)"
            @click="removeServer"
          />

          <div
            v-if="removeHovered"
            class="absolute -top-11 right-5 w-28 break-words rounded bg-[#202632] px-3 py-2 text-center text-xs font-medium text-white outline-none"
          >
            <span
              class="bg-dark dark:bg-dark-2 absolute top-5 left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rotate-45"
            ></span>
            Remove Server
          </div>

          <img
            class="w-8 hover:scale-110 active:scale-100 transition-all ease-in-out duration-200 cursor-pointer self-center border-4 border-gray-400 rounded-full shadow-md shadow-[#141414]"
            :class="addButtonDisabled ? 'opacity-50 pointer-events-none ' : ''"
            src="/img/icon/PLUS_ICON.png"
            alt="icon"
            @mousedown.prevent
            @mouseenter="addHovered = true"
            @mouseleave="addHovered = false"
            @click="saveServer"
          />
          <div
            v-if="addHovered"
            class="absolute -top-11 -right-5 w-28 rounded bg-[#202632] px-3 py-2 text-center text-xs font-medium text-white outline-none"
          >
            <span
              class="bg-dark dark:bg-dark-2 absolute top-5 left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rotate-45"
            ></span>
            Save Server
          </div>
        </div>
      </div>
      <div class="col-start-1 col-end-7 row-start-2 row-span-1 grid grid-cols-12 grid-rows-3 mr-1">
        <label
          for="hostname"
          class="col-start-1 col-span-full row-start-1 row-span-1 block text-gray-300 text-xs font-bold mb-2"
          >IP or Hostname</label
        >
        <input
          id="hostname"
          v-model="serverStore.loginState.ip"
          type="text"
          placeholder="114.72.86.90"
          class="h-8 self-center col-start-1 col-span-full row-start-2 row-span-2 shadow appearance-none border rounded w-full py-1 px-2 text-gray-800 text-sm font-semibold leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div class="col-start-7 col-span-full row-start-2 row-span-1 grid grid-cols-12 grid-rows-3">
        <label
          for="port"
          class="col-start-1 col-span-full row-start-1 row-span-1 block text-gray-300 text-xs font-bold mb-2"
          >Port</label
        >
        <input
          id="port"
          v-model="serverStore.loginState.port"
          type="text"
          placeholder="22"
          class="h-8 self-center col-start-1 col-span-full row-start-2 row-span-2 shadow appearance-none border rounded w-full py-1 px-2 text-gray-800 text-sm font-semibold leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div class="col-start-1 col-end-7 row-start-3 row-span-1 grid grid-cols-12 grid-rows-3">
        <label
          for="username"
          class="col-start-1 col-span-full row-start-1 row-span-1 block text-xs font-bold mb-2"
          :class="usernameError ? 'text-red-500' : 'text-gray-300'"
          >{{ usernameError ? usernameError : "Username" }}</label
        >
        <input
          id="username"
          v-model="serverStore.loginState.username"
          type="text"
          placeholder="root"
          class="h-8 self-center col-start-1 col-span-full row-start-2 row-span-2 shadow appearance-none border rounded w-full py-1 px-2 text-gray-800 text-sm font-semibold leading-tight focus:outline-none focus:shadow-outline"
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
        >
          <input
            id="AcceptConditions"
            v-model="serverStore.loginState.useAuth"
            type="checkbox"
            class="peer sr-only [&:checked_+_span_svg[data-checked-icon]]:block [&:checked_+_span_svg[data-unchecked-icon]]:hidden"
            @change="changeLabel"
          />

          <span
            class="absolute inset-y-0 start-0 z-10 m-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-gray-400 transition-all peer-checked:start-6 peer-checked:text-green-600"
          >
            <svg
              data-unchecked-icon
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>

            <svg
              data-checked-icon
              xmlns="http://www.w3.org/2000/svg"
              class="hidden h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
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

      <div v-if="!useSSHKey" class="col-start-1 col-span-full row-start-4 row-span-1 grid grid-cols-12 grid-rows-3">
        <label
          for="password"
          class="col-start-1 col-span-full row-start-1 row-span-1 block text-gray-300 text-xs font-bold"
          >Password</label
        >
        <input
          id="password"
          v-model="serverStore.loginState.password"
          type="password"
          class="h-8 self-center col-start-1 col-span-full row-start-2 row-span-2 shadow appearance-none border rounded w-full py-1 px-2 text-gray-800 text-sm font-semibold leading-tight focus:outline-none focus:shadow-outline"
          placeholder="******************"
          :disabled="useSSHKey"
        />
      </div>
      <div v-if="useSSHKey" class="col-start-1 col-span-full row-start-4 row-span-1 grid grid-cols-12 grid-rows-3">
        <label
          for="keypath"
          class="col-start-1 col-end-12 row-start-1 row-span-1 block text-xs font-bold"
          :class="message ? 'text-red-500' : 'text-gray-300'"
          >{{ message ? message : "Key Path" }}</label
        >
        <input
          id="keypath"
          v-model="serverStore.loginState.keyPath"
          type="text"
          placeholder="/user/.ssh/id_rsa"
          class="h-8 self-center col-start-1 col-span-full row-start-2 row-span-2 shadow appearance-none border rounded w-full py-1 px-2 text-gray-800 text-sm font-semibold leading-tight focus:outline-none focus:shadow-outline"
          :disabled="!useSSHKey"
        />
        <label
          for="keypath-file"
          class="col-start-12 col-span-full row-start-2 row-span-2 w-full h-full flex justify-center items-center cursor-pointer"
        >
          <div class="w-6 h-6 border border-gray-400 rounded-full flex justify-center items-center">
            <span
              class="text-xl text-teal-700 text-center font-bold hover:scale-125 active:scale-100 transition-all duration-150 ease-in-out"
              >+</span
            >
          </div>
          <input id="keypath-file" type="file" class="hidden" :disabled="!useSSHKey" @change="handleFileSelect" />
        </label>
      </div>
      <div v-if="useSSHKey" class="col-start-1 col-span-full row-start-5 row-span-1 grid grid-cols-12 grid-rows-3">
        <label
          for="password"
          class="col-start-1 col-span-full row-start-1 row-span-1 block text-gray-300 text-xs font-bold"
          >Password</label
        >
        <input
          id="password"
          v-model="serverStore.loginState.passphrase"
          type="password"
          class="h-8 self-center col-start-1 col-span-full row-start-2 row-span-2 shadow appearance-none border rounded w-full py-1 px-2 text-gray-800 text-sm font-semibold leading-tight focus:outline-none focus:shadow-outline"
          placeholder="******************"
        />
      </div>

      <div class="col-start-1 col-span-full row-start-7 row-span-1 flex justify-center items-center px-2 py-1">
        <button
          v-if="!serverStore.connectingProcess"
          class="w-full h-8 bg-gray-200 hover:bg-teal-700 text-gray-700 hover:text-white font-bold py-1 px-4 rounded-md focus:outline-none focus:shadow-outline active:scale-95 transition-all ease-in-out duration-100"
          type="button"
          @click="internalLogin"
        >
          Login
        </button>
        <div
          v-else
          class="w-full h-8 bg-teal-700 text-gray-200 font-semibold py-1 px-4 rounded-md pointer-events-none flex justify-center items-center"
        >
          <svg
            class="animate-spin h-5 w-5 mr-3 border-2 border-gray-400 border-tr-2 border-r-white rounded-full"
            viewBox="0 0 24 24"
          ></svg>
          Connecting . . .
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watchEffect } from "vue";
import { useServers } from "@/store/servers";
import ControlService from "@/store/ControlService";
import { useServerLogin } from "@/composables/useLogin";

const serverStore = useServers();

const { login, add, loadStoredConnections } = useServerLogin();

const hovered = ref(false);
const removeHovered = ref(false);
const addHovered = ref(false);
const message = ref("");
const serverNameError = ref("");
const ipError = ref("");
const usernameError = ref("");

const getTrashImg = computed(() => {
  if (hovered.value) {
    return "./img/icon/TRASH_CAN2.png";
  } else {
    return "./img/icon/TRASH_CAN.png";
  }
});

const useSSHKey = computed(() => {
  if (serverStore.loginState.useAuth) {
    return true;
  } else {
    return false;
  }
});

const addButtonDisabled = computed(() => {
  const existingServer = serverStore.savedServers.savedConnections.some(
    (item) => item.host === serverStore.selectedServerToConnect?.host
  );

  if (existingServer) {
    return true;
  } else {
    return false;
  }
});

watchEffect(() => {
  if (serverStore.connectExistingServer) {
    serverStore.loginState.hostName = serverStore.selectedServerToConnect.name;
    serverStore.loginState.ip = serverStore.selectedServerToConnect.host;
    serverStore.loginState.port = serverStore.selectedServerToConnect.port;
    serverStore.loginState.username = serverStore.selectedServerToConnect.user;
    serverStore.loginState.useAuth = serverStore.selectedServerToConnect.useAuthKey;
    serverStore.loginState.keyPath = serverStore.selectedServerToConnect.keylocation;
    serverStore.loginState.password = "";
    serverStore.loginState.passphrase = "";
  } else {
    serverStore.selectedServerToConnect = null;
    serverStore.loginState.hostName = "";
    serverStore.loginState.ip = "";
    serverStore.loginState.port = "";
    serverStore.loginState.username = "";
    serverStore.loginState.useAuth = false;
    serverStore.loginState.keyPath = "";
    serverStore.loginState.password = "";
    serverStore.loginState.passphrase = "";
  }
});

// Lifecycle

onMounted(async () => {
  await loadStoredConnections();
});

// Methods
const handleFileSelect = (event) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    if (selectedFile.size > 0) {
      serverStore.loginState.keyPath = selectedFile.path;
    } else {
      serverStore.loginState.keyPath = "";
      message.value = "Selected file is empty.";
    }
  } else {
    serverStore.loginState.keyPath = "";
  }
};

const validateServerName = () => {
  if (!serverStore.loginState.hostName) {
    serverNameError.value = "Server name is required.";
    return false;
  }
  serverNameError.value = "";
  return true;
};

const validateIPorHostname = () => {
  const ipRegex =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  const hostnameRegex = /^[a-zA-Z0-9.-]+$/;

  const input = serverStore.loginState.ip;

  if (ipRegex.test(input) || hostnameRegex.test(input)) {
    ipError.value = "";
    return true;
  } else {
    ipError.value = "Invalid IP address or hostname.";
    return false;
  }
};

const validateUsername = () => {
  if (!serverStore.loginState.username) {
    usernameError.value = "Username is required.";
    return false;
  }
  usernameError.value = "";
  return true;
};

const changeLabel = () => {
  if (serverStore.loginState.useAuth) {
    serverStore.loginState.password = "";
  }
};

const internalLogin = async () => {
  serverStore.connectingProcess = true;
  if (!validateServerName() || !validateIPorHostname() || !validateUsername()) {
    return;
  }

  await ControlService.logout();
  await login();
  serverStore.connectingProcess = false;
  serverStore.isServerAccessManagementActive = false;
};

const saveServer = async () => {
  await add();
};

const removeServer = () => {
  serverStore.isRemoveModalActive = true;
};
</script>
