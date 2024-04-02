<template>
  <div ref="terminalContainer" class="terminal"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import ControlService from "@/store/ControlService";
import "xterm/css/xterm.css";

const terminalContainer = ref(null);

onMounted(() => {
  const terminal = new Terminal({
    allowTransparency: true,
    rightClickSelectsWord: true,
  });

  const fitAddon = new FitAddon();
  terminal.loadAddon(fitAddon);

  // Open the terminal in the container
  terminal.open(terminalContainer.value);
  terminal.focus();
  fitAddon.fit(); // Adjust size

  // Add event listener for right-click paste
  terminalContainer.value.addEventListener("contextmenu", async (event) => {
    event.preventDefault();
    const clipboardText = await navigator.clipboard.readText();
    if (clipboardText) {
      terminal.write(clipboardText);
    }
  });

  // Send input to remote server
  terminal.onData((data) => {
    ControlService.executeCommand(data);
  });

  // Copy selected text to clipboard
  terminal.onSelectionChange(() => {
    const selection = terminal.getSelection();
    if (selection) {
      navigator.clipboard.writeText(selection);
    }
  });

  // Get and show output onto terminal
  window.promiseIpc.onTerminalOutput((data) => {
    terminal.write(data);
  });

  onUnmounted(() => {
    terminal.dispose();
  });
});
</script>

<style scoped>
.terminal {
  height: 100%;
  width: 100%;
  grid-column: 3/23;
  grid-row: 2/13;
  background-color: black;
  border-radius: 5px;
}

.terminal .xterm-viewport {
  background-color: aqua !important;
  overflow-y: auto;
}

.terminal .xterm-screen {
  background-color: white !important;
  overflow-y: auto;
}

.terminal .xterm-rows {
  background-color: #1e1e1e !important;
  overflow-y: auto;
}
</style>
