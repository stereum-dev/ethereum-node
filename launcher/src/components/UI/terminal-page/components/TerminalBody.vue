<template>
  <div class="w-full h-full max-h-[491px]">
    <div class="header flex justify-between text-white">
      <div>SECURE SHELL - SERVER CONNECTION</div>
      <div>{{ controlStore.ServerName }}</div>
      <div>IP: {{ controlStore.ipAddress }}</div>
      <div
        class="w-10 h-7 flex justify-center items-center bg-gray-700 hover:bg-black rounded-sm cursor-pointer transition-all duration-300 ease-in-out active:bg-gray-800 active:shadow-none active:shadow-gray-800"
        @click="refreshConnection"
      >
        <img class="w-6 h-6" src="/img/icon/terminal-page-icons/redo.png" alt="Refresh Icon" />
      </div>
    </div>
    <div ref="terminalContainer" class="terminal"></div>
  </div>
</template>

<script setup>
import "xterm/css/xterm.css";
import { Terminal } from "xterm";
import { AttachAddon } from "xterm-addon-attach";
import { onBeforeMount, onMounted, onUnmounted, ref } from "vue";
import { useControlStore } from "@/store/theControl";
import ControlService from "@/store/ControlService";

const terminalContainer = ref(null);
const controlStore = useControlStore();
const controlsPath = ref("");
let terminal = new Terminal({
  allowTransparency: true,
  rightClickSelectsWord: true,
});
const wsPort = 1234;
let socket = new WebSocket(`ws://${controlStore.ipAddress}:${wsPort}`);

terminal.onSelectionChange(() => {
  if (terminal.hasSelection()) {
    const selection = terminal.getSelection();
    navigator.clipboard
      .writeText(selection)
      .then(() => {
        console.info("Selection copied to clipboard");
      })
      .catch((err) => {
        console.info("Could not copy selection to clipboard", err);
      });
  }
});

const handleSocketError = async () => {
  await stopShell();
  if (typeof removeOutputListener === "function") {
    removeOutputListener();
  }
  terminal.writeln("Terminal connection encountered an error");
};

const refreshConnection = async () => {
  if (socket.readyState === WebSocket.OPEN) {
    terminal.clear();
  }
  // else if (socket.readyState === WebSocket.CLOSED) {
  // socket = new WebSocket(`ws://${controlStore.ipAddress}:1234`); // Create a new socket
  // await ControlService.startShell();
  // connectWebSocket();
  // if (shellStarted === undefined) {
  //   handleSocketError();
  // }
  // console.log("socket");
  // socket.onclose = handleSocketError;
  // }
  // else {
  //   await stopShell();
  //   if (typeof removeOutputListener === "function") {
  //     removeOutputListener();
  //   }
  //   socket.close();
  //   terminal.reset();
  //   connectWebSocket();
  // }
};

let removeOutputListener;

socket.onmessage = async (event) => {
  const exitCommand = new RegExp("^\\s*exit\\s*$", "m");
  if (exitCommand.test(event.data)) {
    await stopShell();
    if (typeof removeOutputListener === "function") {
      removeOutputListener();
    }
    socket.close();
    terminal.reset();
    terminal.writeln("Terminal Connection is closed. Press on REFRESH to connect it again :)");
  }
};

const connectWebSocket = () => {
  if (terminalContainer.value) {
    terminal.open(terminalContainer.value);
    terminal.focus();

    try {
      socket.onerror = handleSocketError;
      socket.onopen = () => {
        terminal.loadAddon(new AttachAddon(socket));

        removeOutputListener = window.promiseIpc.onTerminalOutput((output) => {
          terminal.write(output);
        });
      };
    } catch (error) {
      console.error("Failed to reconnect:", error);
    }
  }
};

const stopShell = async () => {
  await ControlService.stopShell();
};

onBeforeMount(async () => {
  await ControlService.startShell();
  controlsPath.value = await ControlService.controlsPath();
});

onMounted(async () => {
  connectWebSocket();
});

onUnmounted(async () => {
  await stopShell();
  if (typeof removeOutputListener === "function") {
    removeOutputListener();
  }
  socket.close();
  terminal.reset();
});
</script>

<style scoped>
.terminal {
  height: 100%;
  width: 100%;
  max-height: 490px;
  background-color: #1e1e1e;
  padding: 10px;
  color: #ffffff;
  overflow-y: auto;
}
</style>
