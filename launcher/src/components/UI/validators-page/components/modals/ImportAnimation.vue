<template>
  <div class="flex flex-col items-center gap-1 w-full">
    <div class="relative w-full h-28 overflow-hidden">
      <img class="sliding absolute top-0 h-24" src="/animation/staking/validator-import.gif" alt="" />
    </div>
    <div class="flex items-center text-xl text-amber-500 font-semibold">
      <span>{{ label }}</span>
      <span class="dot">.</span>
      <span class="dot [animation-delay:0.5s]">.</span>
      <span class="dot [animation-delay:1s]">.</span>
    </div>
    <span v-if="detail" class="text-xs text-gray-400">{{ detail }}</span>
  </div>
</template>

<script setup>
// The old staking page's import animation: the validator gif sliding across, with blinking dots
defineProps({ label: { type: String, required: true }, detail: { type: String, default: "" } });
</script>

<style scoped>
.sliding {
  animation: slide-across 5s linear infinite;
}

@keyframes slide-across {
  from {
    left: 0;
    transform: translateX(-100%);
  }
  to {
    left: 100%;
    transform: translateX(0);
  }
}

.dot {
  opacity: 0;
  animation: blink 1.5s infinite;
}

@keyframes blink {
  50% {
    opacity: 1;
  }
}
</style>
