// useTerminal.js
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

let terminalInstance = null;
let fitAddonInstance = null;

function createTerminal() {
  terminalInstance = new Terminal({
    allowTransparency: true,
    convertEol: true,
    cursorBlink: true,
    theme: {
      background: "#000000",
    },
  });
  fitAddonInstance = new FitAddon();
  terminalInstance.loadAddon(fitAddonInstance);
}

function ensureTerminal() {
  if (!terminalInstance || terminalInstance._disposed) {
    createTerminal();
  }
}

export function useTerminal() {
  const getTerminal = () => {
    ensureTerminal();
    return terminalInstance;
  };

  const getFitAddon = () => {
    ensureTerminal();
    return fitAddonInstance;
  };

  const resetTerminal = () => {
    if (terminalInstance) {
      terminalInstance.dispose();
    }
    createTerminal();
  };

  const clearTerminalRefs = () => {
    terminalInstance = null;
    fitAddonInstance = null;
  };

  const onData = (cb) => getTerminal().onData(cb);

  return {
    getTerminal,
    getFitAddon,
    onData,
    resetTerminal,
    clearTerminalRefs,
  };
}
