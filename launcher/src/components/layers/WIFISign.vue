<template>
  <div class="wifi-symbol">
    <div class="wifi-circle first" :class="circleClass"></div>
    <div class="wifi-circle second" :class="circleClass"></div>
    <div class="wifi-circle third" :class="circleClass"></div>
    <div class="wifi-circle fourth" :class="circleClass"></div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
});

const circleClass = computed(() => {
  switch (props.status) {
    case "excellent":
      return "circle-excellent";
    case "good":
      return "circle-good";
    case "fair":
      return "circle-fair";
    case "poor":
      return "circle-poor";
    case "very poor":
      return "circle-very-poor";
    default:
      return "";
  }
});
</script>

<style scoped>
.wifi-symbol {
  display: block;
  position: relative;
  width: 45px;
  height: 45px;
  transform: rotate(-45deg) translate(-100px);
}

.wifi-circle {
  box-sizing: border-box;
  display: block;
  width: 100%;
  height: 100%;
  font-size: 21.4285714286px;
  position: absolute;
  bottom: 0;
  left: 0;
  border-style: solid;
  border-width: 5px 5px 0 0;
  border-radius: 0 100% 0 0;
  opacity: 1; /* Make circles fully visible */
}

.first {
  margin-bottom: 5px;
  margin-left: 3px;
}

.second {
  width: 35px;
  height: 35px;
}

.third {
  width: 20px;
  height: 20px;
}

.fourth {
  width: 6px;
  height: 6px;
}

.circle-excellent {
  border-top-color: green;
}

.circle-good {
  border-top-color: lightgreen;
}

.circle-fair {
  border-top-color: yellow;
}

.circle-poor {
  border-top-color: orange;
}

.circle-very-poor {
  border-top-color: red;
}
</style>
