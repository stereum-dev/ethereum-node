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
import { FitAddon } from "xterm-addon-fit";
import { useControlStore } from "@/store/theControl";
import ControlService from "@/store/ControlService";
import { onBeforeMount, onMounted, onBeforeUnmount, ref } from "vue";

const terminalContainer = ref(null);
const controlStore = useControlStore();

let terminal = new Terminal({
  allowTransparency: true,
  rightClickSelectsWord: true,
});

let fitAddon = new FitAddon();
terminal.loadAddon(fitAddon);

// start stream
const startShell = async () => {
  try {
    await ControlService.startShell();
  } catch (error) {
    console.error("Error starting shell:", error);
  }
};

// stop stream
const stopShell = async () => {
  try {
    await ControlService.stopShell();
  } catch (error) {
    console.error("Error stopping shell:", error);
  }
};

// setup terminal
const setupTerminal = () => {
  terminal.open(terminalContainer.value);
  terminal.focus();

  terminalContainer.value.addEventListener("contextmenu", async (event) => {
    event.preventDefault();
    const clipboardText = await navigator.clipboard.readText();
    if (clipboardText) {
      terminal.write(clipboardText);
    }
  });

  terminal.onData((data) => {
    ControlService.executeCommand(data);
  });

  window.promiseIpc.onTerminalOutput((data) => {
    terminal.write(data);
  });
};

// copy selected in clipboard
terminal.onSelectionChange(() => {
  const selection = terminal.getSelection();
  if (selection) {
    navigator.clipboard.writeText(selection);
  }
});

// refresh
const refreshConnection = async () => {
  try {
    await ControlService.stopShell();
    terminal.dispose();
    await ControlService.startShell();
    terminal = new Terminal();
    setupTerminal();
  } catch (error) {
    console.error("Error refreshing connection:", error);
  }
};

onBeforeMount(startShell);

onMounted(setupTerminal);

onBeforeUnmount(stopShell);
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
