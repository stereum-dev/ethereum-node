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
  () => serverStore.terminalForceClear,
  (value) => {
    if (value) {
      onClearTerminal();
      serverStore.terminalForceClear = false;
    }
  }
);
watch(
  () => serverStore.terminalForceRefresh,
  (value) => {
    if (value) {
      onRefreshTerminal();
      serverStore.terminalForceRefresh = false;
    }
  }
);
watch(
  () => serverStore.isTerminalStopped,
  (value) => {
    if (value) {
      stopRunningTerminal();
      serverStore.isTerminalStopped = false;
    }
  }
);

onMounted(() => {
  const terminal = getTerminal();
  terminal.open(terminalContainer.value);
  getFitAddon().fit();
  terminal.focus();

  onDataDisposable = onData((data) => {
    ControlService.executeCommand(data);
  });

  terminalOutputListener = (output) => {
    const terminal = getTerminal();
    terminal.write(output);
  };
  window.promiseIpc.onTerminalOutput(terminalOutputListener);
  window.promiseIpc.startShell();
});

onUnmounted(() => {
  if (onDataDisposable) {
    onDataDisposable.dispose();
  }
  window.promiseIpc.removeListener("terminal-output", terminalOutputListener);
});

const onClearTerminal = () => {
  const terminal = getTerminal();
  terminal.clear();
  terminal.focus();
};

const onRefreshTerminal = async () => {
  try {
    await ControlService.stopShell();
    await ControlService.startShell();
    console.log("Terminal Reconnected");
  } catch (error) {
    console.error("Error refreshing terminal:", error);
  }
};

const stopRunningTerminal = async () => {
  try {
    await ControlService.stopShell();
    console.log("Terminal Stopped");
  } catch (error) {
    console.error("Error stopping terminal:", error);
  }
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
  color: rgb(65, 218, 180) !important;
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
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
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
