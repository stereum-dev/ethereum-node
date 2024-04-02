<template>
  <div ref="terminalContainer" class="terminalParent"></div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useTerminal } from "@/composables/useTerminal";
import ControlService from "@/store/ControlService";
import { useServers } from "../../../../store/servers";

const serverStore = useServers();
const terminalContainer = ref(null);
let terminalOutputListener = null;
const { getTerminal, getFitAddon, onData } = useTerminal();
let onDataDisposable = null;

watch(
  () => serverStore.terminalForceRefresh,
  (value) => {
    if (value) {
      onRefreshTerminal();
      serverStore.terminalForceRefresh = false;
    }
  }
);

onMounted(() => {
  console.log("Terminal Container:", terminalContainer.value);

  const terminal = getTerminal();
  console.log("Initializing and opening terminal");

  terminal.open(terminalContainer.value);
  getFitAddon().fit();
  terminal.focus();

  onDataDisposable = onData((data) => {
    console.log(data);

    ControlService.executeCommand(data);
  });

  terminalOutputListener = (output) => {
    const terminal = getTerminal();
    terminal.write(output); // Write the backend output directly to the terminal
  };
  window.promiseIpc.onTerminalOutput(terminalOutputListener);
  window.promiseIpc.startShell();
});

onUnmounted(() => {
  if (onDataDisposable) {
    onDataDisposable.dispose(); // Dispose of onData event listener
  }
  // Remove the terminal output listener
  window.promiseIpc.removeListener("terminal-output", terminalOutputListener);
  // Stop the shell session on the backend if needed
  // window.promiseIpc.send("stopShell");
});

const onRefreshTerminal = () => {
  const terminal = getTerminal();
  terminal.clear();
  terminal.focus();
};
</script>

<style scoped>
.terminalParent {
  height: 100%;
  width: 100%;
  grid-column: 2/24;
  grid-row: 2/13;
  background-color: black;
  border-radius: 0 0 5px 5px;
  padding: 10px 10px 0 10px;
  position: relative;
  overflow: hidden;
  margin-bottom: 5px;
  display: flex !important;
  justify-content: center;
  align-items: center;
}

.terminal .xterm-viewport {
  background-color: aqua !important;
}

.terminal .xterm-screen {
  width: 100% !important;
  height: 100% !important;
  margin-bottom: 10px;
  background-color: white !important;
  overflow-x: hidden;
  overflow-y: auto;
}

.terminal .xterm-screen .xterm-rows {
  width: 100% !important;
  background-color: #1e1e1e !important;
  white-space: pre-wrap; /* Wraps the text and preserves whitespace */
  word-break: break-word;
  overflow-y: auto;
}

.terminal .xterm-rows span {
  color: rgb(65, 218, 180) !important;
}
</style>
