<template>
  <div class="w-full h-full max-h-[491px] grid grid-cols-24 grid-rows-12 items-center">
    <TerminalHeader @refresh-terminal="refreshTerminal" />
    <TerminalPanel />
  </div>
</template>

<script setup>
import TerminalHeader from "./TerminalHeader.vue";
import TerminalPanel from "./TerminalPanel.vue";

const emit = defineEmits(["refreshTerminal"]);

const refreshTerminal = () => {
  emit("refreshTerminal");
};
</script>
