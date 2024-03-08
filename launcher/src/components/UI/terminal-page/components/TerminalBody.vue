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

// Copy selected text
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
  await ControlService.stopShell();
  if (typeof removeOutputListener === "function") {
    removeOutputListener();
  }
  terminal.writeln("\x1B[31m\x1B[1m>> Terminal connection encountered an error! <<\x1B[0m");
};

const refreshConnection = async () => {
  if (socket.readyState === WebSocket.OPEN) {
    terminal.clear();
  }
  // else if (socket.readyState === WebSocket.CLOSED) {
  //   terminal.reset();
  //   console.log(terminal.buffer.active.length);
  //   // Re-establish the connection
  //   console.log("Starting shell...");
  //   await ControlService.startShell();
  //   console.log("Shell started");

  //   console.log("Getting controls path...");
  //   controlsPath.value = await ControlService.controlsPath();
  //   console.log("Controls path:", controlsPath.value);

  //   console.log("Running WebSocket...");
  //   await ControlService.runWebsocket(controlsPath.value);
  //   console.log("WebSocket run");

  //   const maxAttempts = 20;
  //   let attempts = 0;
  //   const connect = async () => {
  //     try {
  //       await connectWebSocket();
  //     } catch (error) {
  //       if (attempts < maxAttempts) {
  //         attempts++;
  //         setTimeout(connect, 300);
  //       } else {
  //         console.error("Failed to connect to WebSocket server");
  //         await ControlService.stopShell();
  //         if (typeof removeOutputListener === "function") {
  //           removeOutputListener();
  //         }
  //         socket.close();
  //         terminal.reset();
  //       }
  //     }
  //   };
  //   connect();
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
    await ControlService.stopShell();
    if (typeof removeOutputListener === "function") {
      removeOutputListener();
    }
    socket.close();
    terminal.reset();
    terminal.writeln("\x1B[31m\x1B[1m>> Terminal Exited!. Click on REFRESH to connect again! <<\x1B[0m");
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
        terminal.writeln("\x1B[32m\x1B[1m>> Connection established successfully! <<\x1B[0m");
      };
    } catch (error) {
      console.error("Failed to reconnect:", error);
    }
  }
};

onBeforeMount(async () => {
  await ControlService.startShell();
  controlsPath.value = await ControlService.controlsPath();
  await ControlService.runWebsocket(controlsPath.value);
});

onMounted(async () => {
  const maxAttempts = 20;
  let attempts = 0;
  const connect = async () => {
    try {
      await connectWebSocket();
    } catch (error) {
      if (attempts < maxAttempts) {
        attempts++;
        setTimeout(connect, 300);
      } else {
        console.error("Failed to connect to WebSocket server");
      }
    }
  };
  connect();
});

onUnmounted(async () => {
  await ControlService.stopShell();
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
