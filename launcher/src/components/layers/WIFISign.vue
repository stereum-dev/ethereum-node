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
  width: 30px;
  height: 30px;

  transform: rotate(-45deg);
  position: relative;
}

.wifi-circle {
  box-sizing: border-box;
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 5px;
  left: 3px;
  border-style: solid;
  border-width: 4px 4px 0 0;
  border-radius: 0 100% 0 0;
  opacity: 1; /* Make circles fully visible */
}

.first {
  margin-bottom: 8% !important;
  margin-left: 2px;
}

.second {
  width: 25px;
  height: 25px;
}

.third {
  width: 18px;
  height: 18px;
}

.fourth {
  width: 10px;
  height: 10px;
  background-color: white !important;
}

.circle-excellent {
  border-top-color: green;
  border-right-color: green;
}

.circle-good {
  border-top-color: lightgreen;
  border-right-color: lightgreen;
}

.circle-fair {
  border-top-color: yellow;
  border-right-color: yellow;
}

.circle-poor {
  border-top-color: orange;
  border-right-color: orange;
}

.circle-very-poor {
  border-top-color: red;
  border-right-color: red;
}
</style>
