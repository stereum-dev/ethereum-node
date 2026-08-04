<template>
  <!-- Self-contained SVG ring (replaces vue3-circle-progress, whose bundled
       `new Function("return this")` globalThis-polyfill is blocked by the CSP). -->
  <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" class="sync-circular-progress">
    <circle :cx="center" :cy="center" :r="radius" fill="none" :stroke="emptyColor" :stroke-width="bgWidth" />
    <circle
      :cx="center"
      :cy="center"
      :r="radius"
      fill="none"
      :stroke="color"
      :stroke-width="borderWidth"
      stroke-linecap="round"
      :stroke-dasharray="circumference"
      :stroke-dashoffset="dashOffset"
      :transform="`rotate(-90 ${center} ${center})`"
    />
  </svg>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  color: {
    type: String,
    required: true,
  },
  syncPercent: {
    type: [Number, String],
    required: true,
  },
});

const size = 43;
const borderWidth = 3;
const bgWidth = 2;
const emptyColor = "black";
const center = size / 2;
const radius = (size - borderWidth) / 2;
const circumference = 2 * Math.PI * radius;

const percent = computed(() => {
  const p = parseInt(props.syncPercent);
  return isNaN(p) ? 0 : Math.min(100, Math.max(0, p));
});
const dashOffset = computed(() => circumference * (1 - percent.value / 100));
</script>
