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
import { onMounted, onUnmounted, ref } from "vue";
import { useControlStore } from "@/store/theControl";
import ControlService from "@/store/ControlService";
import { useClickInstall } from "@/store/clickInstallation";

const clickStore = useClickInstall();

console.log("install pathhhhhh", clickStore.installationPath);

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
  // Close the existing WebSocket connection if it's open
  if (socket.readyState === WebSocket.OPEN) {
    socket.close();
  }
  //location.reload();

  // // Clear the terminal
  // terminal.clear();
  // terminal.reset();

  // // Create a new WebSocket connection
  // socket = new WebSocket(`ws://${controlStore.ipAddress}:1234`);

  // // Re-attach the WebSocket connection to the terminal
  // socket.onopen = () => {
  //   terminal.loadAddon(new AttachAddon(socket));
  // };

  // // Set up the WebSocket error handler
  // socket.onerror = handleSocketError;

  // // Set up the WebSocket message handler
  // socket.onmessage = async (event) => {
  //   const exitCommand = new RegExp("^\\s*exit\\s*$", "m");
  //   if (exitCommand.test(event.data)) {
  //     await stopShell();
  //     if (typeof removeOutputListener === "function") {
  //       removeOutputListener();
  //     }
  //     socket.close();
  //     terminal.reset();
  //     terminal.writeln("Terminal Connection is closed. Press on REFRESH to connect it again :)");
  //   }
  // };
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

onMounted(async () => {
  await ControlService.startShell();
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
