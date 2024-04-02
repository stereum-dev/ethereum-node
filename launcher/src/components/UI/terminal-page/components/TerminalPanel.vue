<template>
  <div ref="terminalContainer" class="terminal"></div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { useTerminal } from "@/composables/useTerminal";
import ControlService from "@/store/ControlService";

const terminalContainer = ref(null);
let onDataDisposable = null;
const { getTerminal, getFitAddon } = useTerminal();

onMounted(() => {
  const terminal = getTerminal();
  const fitAddon = getFitAddon();

  // Always open the terminal in the new container element
  terminal.open(terminalContainer.value);
  terminal.focus();
  fitAddon.fit(); // Resize the terminal to fit the new container

  // Reattach onData handler
  if (onDataDisposable) {
    onDataDisposable.dispose(); // Dispose of the previous onData handler if it exists
  }
  onDataDisposable = terminal.onData((data) => {
    ControlService.executeCommand(data);
  });

  // Handle backend output
  window.promiseIpc.onTerminalOutput((data) => {
    terminal.write(data);
  });
});

// Cleanup on unmount
onUnmounted(() => {
  if (onDataDisposable) {
    onDataDisposable.dispose();
    onDataDisposable = null;
  }
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
  padding: 10px 10px 0 10px;
  position: relative;
  overflow: hidden;
}

.terminal .xterm-viewport {
  background-color: aqua !important;
}

.terminal .xterm-screen {
  width: 100% !important;
  height: 100% !important;
  margin-bottom: 10px;
  background-color: white !important;
  overflow-y: auto;
}

.terminal .xterm-rows {
  background-color: #1e1e1e !important;
  overflow-y: auto;
}
</style>
