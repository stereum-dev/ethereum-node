<template>
  <div class="col-start-1 col-span-full row-start-1 row-span-full p-2 pr-0 grid grid-cols-12 grid-rows-12 items-center">
    <div class="col-start-1 col-span-full row-start-1 row-span-1 flex justify-start items-center">
      <span class="text-md text-gray-200 text-left font-semibold uppercase">SAVED SERVER CONNECTIONS</span>
    </div>

    <div
      class="w-full h-full max-h-[300px] col-start-1 col-span-full row-start-2 row-end-11 overflow-x-hidden overflow-y-auto flex flex-col justify-start items-center p-3 bg-black rounded-md space-y-2"
    >
      <ServerRow
        v-for="(server, index) in serverStore.savedServers.savedConnections"
        :key="server.name"
        :idx="index"
        :server="server"
        @select-server="selectServer"
      />
    </div>
    <button
      class="w-full h-[50px] col-start-2 col-end-12 row-start-11 row-span-2 bg-gray-200 rounded-md px-4 py-2 flex justify-center items-center shadow-md shadow-[#29292c] hover:scale-105 active:scale-100 cursor-pointer space-x-4 transition-all duration-200 ease-in-out"
      @click="serverLogin"
    >
      <img
        class="w-7 h-7 border border-gray-500 bg-teal-500 rounded-full p-1"
        src="/img/icon/form-setup/plus.png"
        alt="Add Icon"
      />
      <span class="text-sm text-gray-800 text-left uppercase font-bold">ADD A NEW SERVER CONNECTION</span>
    </button>
  </div>
</template>
<script setup>
import ServerRow from "./ServerRow.vue";
import ControlService from "@/store/ControlService";
import { useServers } from "@/store/servers";
import { useControlStore } from "@/store/theControl";
import { onMounted, watch } from "vue";

const emit = defineEmits(["selectServer", "serverLogin"]);

const serverStore = useServers();
const controlStore = useControlStore();

watch(
  () => serverStore.refreshServers,
  async () => {
    await loadStoredConnections();
  }
);

//Lifecycle Hooks

onMounted(async () => {
  await loadStoredConnections();
});

//Methods

const loadStoredConnections = async () => {
  serverStore.savedServers = await ControlService.readConfig();

  serverStore.selectedServerConnection = serverStore.savedServers.savedConnections.find(
    (item) => item.host === controlStore.ipAddress
  );

  serverStore.refreshServers = false;
};

const selectServer = (server) => {
  emit("selectServer", server);
};

const serverLogin = () => {
  emit("serverLogin");
};
</script>

<style scoped>
::-webkit-scrollbar {
  width: 5px;
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: #7d838a;
  border-radius: 5px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #599ce9;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

::-webkit-scrollbar-track-piece {
  background-color: transparent;
}
</style>
