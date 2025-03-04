import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

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
    return terminalInstance.onData(callback); // Return the disposable directly
  };

  const getTerminal = () => terminalInstance;
  const getFitAddon = () => fitAddonInstance;

  return { getTerminal, getFitAddon, onData };
}
