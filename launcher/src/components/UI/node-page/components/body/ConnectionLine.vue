<template>
  <svg style="svgStyles">
    <line :x1="startX" :y1="startY" :x2="endX" :y2="endY" :style="lineStyles" />
  </svg>
</template>

<script>
export default {
  props: {
    startX: { type: Number, required: true },
    startY: { type: Number, required: true },
    endX: { type: Number, required: true },
    endY: { type: Number, required: true },
  },
  computed: {
    svgStyles() {
      return {
        position: "absolute",
        top: this.startX,
        left: this.startY,

        pointerEvents: "none", // So the line doesn't interfere with other elements
      };
    },
    lineStyles() {
      return {
        stroke: "green", // Adjust the color of the line as needed
        strokeWidth: 2, // Adjust the thickness of the line as needed
      };
    },
  },
};
</script>
