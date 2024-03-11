<template>
  <base-layout>
    <TerminalBody :key="componentKey" @refresh="refreshComponent" />
  </base-layout>
</template>

<script>
import TerminalBody from "./components/TerminalBody.vue";

export default {
  components: {
    TerminalBody,
  },
  data() {
    return {
      componentKey: Date.now(),
    };
  },
  methods: {
    refreshComponent() {
      this.componentKey = Date.now();
    },
  },
};
</script>
