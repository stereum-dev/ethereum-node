<template>
  <div class="w-full h-full max-h-[491px]">
    <div ref="terminalContainer" class="terminal"></div>
  </div>
</template>

<script setup>
import { Terminal } from "xterm";
import { onMounted, ref } from "vue";

const terminalContainer = ref(null);
const terminal = new Terminal();

onMounted(() => {
  if (terminalContainer.value) {
    terminal.open(terminalContainer.value);
    terminal.writeln("Welcome to the Vue xterm terminal!");
    terminal.writeln("Type something and press Enter:");
  }

  terminal.onData(handleTerminalInput);
});

const handleTerminalInput = (data) => {
  // For simplicity, assume Enter is pressed after the command
  if (data.charCodeAt(0) === 13) {
    // 13 is the ASCII code for Enter
    terminal.writeln("\r\nYou typed: " + data);
    // Here you can add the logic to process the command and display the response
    const response = processCommand(data); // Implement this function based on your needs
    terminal.writeln(response + "\r\n");
  } else {
    // This is a simple echo functionality, remove or modify as per your requirement
    terminal.write(data);
  }
};

const processCommand = (command) => {
  // This is a placeholder function. Implement your command processing logic here.
  // For example, if user types "hello", respond with "Hello World!"
  if (command.trim() === "hello") {
    return "Hello World!";
  }
  return "Unknown command: " + command.trim();
};
</script>

<style scoped>
.terminal {
  height: 100%;
  width: 100%;
  max-height: 490px;
  background-color: #1e1e1e;
}
</style>
