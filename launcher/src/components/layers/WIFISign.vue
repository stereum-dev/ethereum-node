<template>
  <div
    class="col-start-1 col-span-1 w-[50px] h-[40px] flex flex-col-reverse justify-center items-center self-center overflow-hidden mx-auto relative"
  >
    <div v-for="circle in circles" :key="circle" :class="['circle', circleClass(circle)]"></div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
});

const circleClass = (circle) => {
  switch (props.status) {
    case "excellent":
      return circle <= 5 ? "circle-excellent" : "circle-dark";
    case "good":
      return circle <= 4 ? "circle-good" : "circle-dark";
    case "fair":
      return circle <= 3 ? "circle-fair" : "circle-dark";
    case "poor":
      return circle <= 2 ? "circle-poor" : "circle-dark";
    case "very poor":
      return circle === 1 ? "circle-very-poor" : "circle-dark";
    default:
      return "circle-dark";
  }
};

const circles = [1, 2, 3, 4, 5];
</script>

<style scoped>
.circle {
  position: absolute;
  border-radius: 50%;
  border-top: 3px solid;
  border-bottom: 3px solid #151618;
  border-left: 3px solid #151618;
  border-right: 3px solid #151618;
}

.circle:nth-child(1) {
  height: 20%;
  width: 20%;
  top: 60%;
  border-width: 3px !important;
  border-style: solid !important;
}

.circle:nth-child(2) {
  height: 40%;
  width: 40%;
  top: 50%;
}

.circle:nth-child(3) {
  height: 60%;
  width: 60%;
  top: 40%;
}

.circle:nth-child(4) {
  height: 80%;
  width: 80%;
  top: 30%;
}

.circle:nth-child(5) {
  height: 100%;
  width: 100%;
  top: 20%;
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

.circle-dark {
  border-top-color: rgb(68, 68, 68);
}
</style>
