<template>
  <div class="w-full h-full max-h-[490px] p-8 bg-[#18181a]">
    <div ref="terminalContainer" class="terminal"></div>
  </div>
</template>

<script setup>
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { ref, onMounted } from "vue";

const terminalContainer = ref(null);
const term = new Terminal({ cursorBlink: "block" });
const fitAddon = new FitAddon();

onMounted(() => {
  if (terminalContainer.value) {
    term.open(terminalContainer.value);
    term.loadAddon(fitAddon);
    fitAddon.fit(); // Automatically adjust the terminal size to fit the container
  }

  term.writeln("Welcome to the terminal!");
  term.prompt = () => {
    term.write("\r\n\u001b[32m$ \u001b[37m"); // Example prompt
  };
  term.prompt();

  term.onKey(({ key, domEvent }) => {
    const char = domEvent.key;
    if (domEvent.keyCode === 13) {
      // Enter key
      term.prompt();
    } else if (domEvent.keyCode === 8) {
      // Backspace
      // Prevent the browser from navigating back
      domEvent.preventDefault();
      // Delete the character before the cursor
      term.write("\b \b");
    } else if (char) {
      term.write(char);
    }
  });
});
</script>

<style scoped>
.terminal {
  height: 100%;
  width: 100%;
  max-height: 425px;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: #1e1e1e;
  padding: 0 10px;
  border: 1px solid #7b7b7b;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.xterm {
  font-feature-settings: "liga" 0;
  position: relative;
  user-select: none;
  -ms-user-select: none;
  -webkit-user-select: none;
}

.xterm.focus,
.xterm:focus {
  outline: none;
}
.xterm-dom-renderer-owner-1 {
  max-height: 400px !important;
}

.xterm .xterm-screen {
  position: relative;
  width: 100% !important;
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.xterm .xterm-screen .xterm-helpers {
  display: none !important;
}

.xterm .xterm-helper-textarea {
  /*
     * HACK: to fix IE's blinking cursor
     * Move textarea out of the screen to the far left, so that the cursor is not visible.
     */
  position: absolute;
  opacity: 0;
  left: -9999em;
  top: 0;
  width: 0;
  height: 0;
  z-index: -5;
  /** Prevent wrapping so the IME appears against the textarea at the correct position */
  white-space: nowrap;
  overflow: hidden;
  resize: none;
}

.xterm .composition-view {
  /* TODO: Composition position got messed up somewhere */
  background: #000;
  color: #fff;
  display: none;
  position: absolute;
  white-space: nowrap;
  z-index: 1;
}

.xterm .composition-view.active {
  display: block;
}

.xterm .xterm-viewport {
  /* On OS X this is required in order for the scroll bar to appear fully opaque */
  background-color: #000;
  overflow-y: scroll;
  cursor: default;
  position: absolute;
  right: 0;
  left: 0;
  top: 0;
  bottom: 0;
}

.xterm .xterm-screen {
  position: relative;
}

.xterm .xterm-screen canvas {
  position: absolute;
  left: 0;
  top: 0;
}

.xterm .xterm-scroll-area {
  visibility: hidden;
}

.xterm-char-measure-element {
  display: inline-block;
  visibility: hidden;
  position: absolute;
  top: 0;
  left: -9999em;
  line-height: normal;
}

.xterm {
  cursor: text;
}

.xterm.enable-mouse-events {
  /* When mouse events are enabled (eg. tmux), revert to the standard pointer cursor */
  cursor: default;
}

.xterm.xterm-cursor-pointer {
  cursor: pointer;
}

.xterm.column-select.focus {
  /* Column selection mode */
  cursor: crosshair;
}

.xterm .xterm-accessibility,
.xterm .xterm-message {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 10;
  color: transparent;
}

.xterm .live-region {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.xterm-dim {
  opacity: 0.5;
}

.xterm-underline {
  text-decoration: underline;
}
</style>
