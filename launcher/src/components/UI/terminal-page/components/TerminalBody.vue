<template>
  <div class="w-full h-full max-h-[491px]">
    <div class="header flex justify-between text-white">
      <div>SECURE SHELL - SERVER CONNECTION</div>
      <div>{{ controlStore.ServerName }}</div>
      <div>IP: {{ controlStore.ipAddress }}</div>
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="refreshConnection">
        REFRESH
      </button>
    </div>
    <div ref="terminalContainer" class="terminal"></div>
  </div>
</template>

<script setup>
import "xterm/css/xterm.css";
import { Terminal } from "xterm";
import { AttachAddon } from "xterm-addon-attach";
import { onMounted, onUnmounted, ref } from "vue";
import { useControlStore } from "@/store/theControl";
import ControlService from "@/store/ControlService";

const terminalContainer = ref(null);
const controlStore = useControlStore();
let terminal = new Terminal({
  allowTransparency: true,
  rightClickSelectsWord: true,
});
let socket = new WebSocket(`ws://${controlStore.ipAddress}:1234`);

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
  console.log("handleSocketError--------");
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

const stopShell = async () => {
  await ControlService.stopShell();
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

onMounted(() => {
  connectWebSocket();

  onUnmounted(async () => {
    await stopShell();
    if (typeof removeOutputListener === "function") {
      removeOutputListener();
    }
    socket.close();
    terminal.reset();
  });
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
