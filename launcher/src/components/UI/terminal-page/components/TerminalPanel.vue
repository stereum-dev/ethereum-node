<template>
  <div ref="terminalContainer" class="terminalParent"></div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useTerminal } from "@/composables/useTerminal";
import ControlService from "@/store/ControlService";
import { useServers } from "../../../../store/servers";

const serverStore = useServers();
const { getTerminal, getFitAddon, onData } = useTerminal();

const terminalContainer = ref(null);
let terminalOutputListener = null;
let onDataDisposable = null;
const isNewTerminalPanel = ref(false);
let isTerminalRunning = ref(false);

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
  () => serverStore.newTerminalActive,
  (value) => {
    if (value) {
      onNewTerminal();
      serverStore.newTerminalActive = false;
      isNewTerminalPanel.value = true;
    }
  }
);
watch(
  () => serverStore.killTerminalActive,
  (value) => {
    if (value) {
      onKillTerminal();
      serverStore.killTerminalActive = false;
    }
  }
);

onMounted(() => {
  if (!isTerminalRunning.value) {
    openTerminal();
  }
  runningTerminal();
});

onUnmounted(() => {
  disposeTerminal();
});

//Methods

const openTerminal = () => {
  const terminal = getTerminal();
  terminal.open(terminalContainer.value);
  getFitAddon().fit();
  if (isNewTerminalPanel.value) {
    terminal.clear();
    isNewTerminalPanel.value = false;
  }
  terminal.focus();

  terminal.onSelectionChange(() => {
    const selection = terminal.getSelection();
    if (selection) {
      navigator.clipboard.writeText(selection);
    }
  });

  terminalContainer.value.addEventListener("contextmenu", async (event) => {
    event.preventDefault();
    const clipboardText = await navigator.clipboard.readText();
    terminal.write(clipboardText);
    terminal.focus();
  });
};

const runningTerminal = () => {
  isTerminalRunning.value = true;
  onDataDisposable = onData((data) => {
    ControlService.executeCommand(data);
  });

  terminalOutputListener = (output) => {
    const terminal = getTerminal();
    terminal.write(output);
  };
  window.promiseIpc.onTerminalOutput(terminalOutputListener);
};

const disposeTerminal = () => {
  isTerminalRunning.value = false;
  if (onDataDisposable) {
    onDataDisposable.dispose();
  }
  window.promiseIpc.removeListener("terminal-output", terminalOutputListener);
};

// Create new terminal
const onNewTerminal = async () => {
  if (!isTerminalRunning.value) {
    await ControlService.startShell();

    setTimeout(() => {
      openTerminal();
      runningTerminal();
    }, 1000);
  }
};

//Clear terminal
const onClearTerminal = () => {
  const terminal = getTerminal();
  terminal.clear();
  terminal.focus();
};

//Kill or Stop current terminal
const onKillTerminal = async () => {
  disposeTerminal();
  if (terminalContainer.value) {
    terminalContainer.value.innerHTML = "";
  }
  await ControlService.stopShell();
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
  padding-bottom: 40px;
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
