// TerminalPanel.vue
<template>
  <div ref="terminalContainer" class="terminalParent"></div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useTerminal } from "@/composables/useTerminal";
import ControlService from "@/store/ControlService";
import { useServers } from "@/store/servers";

const serverStore = useServers();
const { getTerminal, getFitAddon, onData, clearTerminalRefs } = useTerminal();

const terminalContainer = ref(null);
let terminalOutputListener = null;
let onDataDisposable = null;
let hasAttachedListeners = false;

const isNewTerminalPanel = ref(false);
let isTerminalRunning = ref(false);

onMounted(() => {
  const terminal = getTerminal();
  const container = terminalContainer.value;

  if (!terminal || !container) return;

  if (!terminal.element) {
    terminal.open(container);
    getFitAddon().fit();
    terminal.focus();
  } else if (terminal.element.parentNode !== container) {
    container.innerHTML = "";
    container.appendChild(terminal.element);
    getFitAddon().fit();
    terminal.focus();
  }

  attachListenersOnce();
});

onUnmounted(() => {
  if (terminalContainer.value) {
    terminalContainer.value.innerHTML = "";
  }
  if (onDataDisposable) {
    onDataDisposable.dispose();
    onDataDisposable = null;
  }
  if (terminalOutputListener) {
    window.promiseIpc.removeListener("terminal-output", terminalOutputListener);
    terminalOutputListener = null;
  }
  hasAttachedListeners = false;
});

const attachListenersOnce = () => {
  if (hasAttachedListeners) return;
  hasAttachedListeners = true;

  isTerminalRunning.value = true;

  onDataDisposable = onData((data) => {
    ControlService.executeCommand(data);
  });

  terminalOutputListener = (output) => {
    getTerminal().write(output);
  };
  window.promiseIpc.onTerminalOutput(terminalOutputListener);
};

const onClearTerminal = () => {
  const terminal = getTerminal();
  terminal.clear();
  terminal.focus();
};

const onKillTerminal = async () => {
  if (onDataDisposable) {
    onDataDisposable.dispose();
    onDataDisposable = null;
  }
  if (terminalOutputListener) {
    window.promiseIpc.removeListener("terminal-output", terminalOutputListener);
    terminalOutputListener = null;
  }
  isTerminalRunning.value = false;
  hasAttachedListeners = false;

  if (terminalContainer.value) {
    terminalContainer.value.innerHTML = "";
  }

  const terminal = getTerminal();
  if (terminal) {
    terminal.dispose();
  }

  clearTerminalRefs();
  await ControlService.stopShell();
};

const onNewTerminal = async () => {
  if (!isTerminalRunning.value) {
    await ControlService.startShell();
    setTimeout(() => {
      const terminal = getTerminal();
      terminal.clear();
      terminal.focus();
      getFitAddon().fit();
      if (terminalContainer.value && terminal.element && terminal.element.parentNode !== terminalContainer.value) {
        terminalContainer.value.innerHTML = "";
        terminalContainer.value.appendChild(terminal.element);
      }
      attachListenersOnce();
    }, 500);
  }
};

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
</script>

<style scoped>
.terminalParent {
  height: 100%;
  width: 100%;
  grid-column: 2/24;
  grid-row: 2/13;
  background-color: rgb(35, 35, 35);
  border-radius: 0 0 5px 5px;
  padding: 40px 0 !important;
  position: relative;
  overflow: hidden;
  margin-bottom: 5px;
  display: flex !important;
  justify-content: center;
  align-items: center;
  color: rgb(65, 218, 180) !important;
  border: 4px solid rgb(0, 0, 0) !important;
  box-shadow: inset 0 0 5px rgb(0, 0, 0);
}

.terminal {
  padding: 20px !important;
}

.terminal .xterm-viewport {
  background-color: aqua !important;
}

.terminal .xterm-screen {
  width: 100% !important;
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
  white-space: pre-wrap;
  word-break: break-word;
  overflow-y: auto;
}

.terminal .xterm-rows span {
  color: rgb(65, 218, 180) !important;
  font-weight: normal !important;
}
</style>
