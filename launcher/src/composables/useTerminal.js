// useTerminal.js
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

let terminalInstance = null;
let fitAddonInstance = null;

export function useTerminal() {
  if (!terminalInstance) {
    terminalInstance = new Terminal({
      allowTransparency: true,
      rightClickSelectsWord: true,
    });
    fitAddonInstance = new FitAddon();
    terminalInstance.loadAddon(fitAddonInstance);
  }

  const onData = (callback) => {
    const disposable = terminalInstance.onData(callback);
    return disposable; // Return this disposable to the caller
  };

  // Add a method to remove the onData event listener if necessary
  const offData = (callback) => {
    if (terminalInstance.removeListener) {
      terminalInstance.removeListener("data", callback);
    } else if (terminalInstance.removeEventListener) {
      terminalInstance.removeEventListener("data", callback);
    }
  };

  const getTerminal = () => terminalInstance;
  const getFitAddon = () => fitAddonInstance;

  return { getTerminal, getFitAddon, onData, offData };
}
