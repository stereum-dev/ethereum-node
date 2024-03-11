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
import { onBeforeMount, onMounted, onUnmounted, ref, defineEmits } from "vue";
import { useControlStore } from "@/store/theControl";
import ControlService from "@/store/ControlService";

const terminalContainer = ref(null);
const controlStore = useControlStore();
const controlsPath = ref("");
// const availablePort = ref(0);
const wsPort = 1234;

// console.log("availabasdkljaPorteeeeeeeee-----------", availablePort.value);

// const findFreePort = async () => {
//   let test = await ControlService.findFreePort(wsPort);

// };
// // let availablePort = findFreePort();

let socket = new WebSocket(`ws://${controlStore.ipAddress}:${wsPort}`);

let terminal = new Terminal({
  allowTransparency: true,
  rightClickSelectsWord: true,
});

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

// Error handling
const handleSocketError = async () => {
  await ControlService.stopShell(`${wsPort}`);
  if (typeof removeOutputListener === "function") {
    removeOutputListener();
  }
  socket.close();
  terminal.reset();
  terminal.writeln("\x1B[31m\x1B[1m>> Terminal connection encountered an error! <<\x1B[0m");
};

// Refresh
const emit = defineEmits(["refresh"]);

const refreshConnection = async () => {
  if (socket.readyState === WebSocket.OPEN) {
    terminal.clear();
  } else if (socket.readyState === WebSocket.CLOSED || socket.readyState === WebSocket.CLOSING) {
    emit("refresh");
  }
};

// Clean up the old connection
let removeOutputListener;

// Exit command handling
socket.onmessage = async (event) => {
  const exitCommand = new RegExp("^\\s*exit\\s*$", "m");
  if (exitCommand.test(event.data)) {
    await ControlService.stopShell(`${wsPort}`);
    if (typeof removeOutputListener === "function") {
      removeOutputListener();
    }
    socket.close();
    terminal.reset();
    terminal.writeln("\x1B[31m\x1B[1m>> Terminal Exited!. Click on REFRESH to connect it again! <<\x1B[0m");
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
  try {
    await ControlService.startShell();
  } catch (error) {
    console.error("Error starting shell:", error);
    return;
  }

  controlsPath.value = await ControlService.controlsPath();
  // availablePort.value = await ControlService.findFreePort(wsPort);
  // console.log("hahahah=========", availablePort.value);

  await ControlService.runWebServer({
    controlsPath: controlsPath.value,
    wsPort: wsPort,
  });
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
  if (socket.readyState === WebSocket.OPEN) {
    await ControlService.stopShell(`${wsPort}`);
  }
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
