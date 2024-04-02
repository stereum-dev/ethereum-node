<template>
  <div ref="terminalContainer" class="terminal"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import ControlService from "@/store/ControlService";
import "xterm/css/xterm.css";

const terminalContainer = ref(null);

let terminal = new Terminal({
  allowTransparency: true,
  rightClickSelectsWord: true,
});

terminal.onSelectionChange(() => {
  const selection = terminal.getSelection();
  if (selection) {
    navigator.clipboard.writeText(selection);
  }
});

let fitAddon = new FitAddon();
terminal.loadAddon(fitAddon);

// onBeforeMount(async () => {
//   try {
//     await ControlService.startShell();
//   } catch (error) {
//     console.error("Error starting shell:", error);
//     return;
//   }
// });

onMounted(() => {
  terminal.open(terminalContainer.value);
  terminal.focus();

  terminal.onData((data) => {
    ControlService.executeCommand(data);
  });

  window.Promise.onTerminalOutput((data) => {
    terminal.write(data);
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
