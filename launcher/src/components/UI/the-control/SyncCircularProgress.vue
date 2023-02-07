<template>
  <circle-progress
    :fill-color="color"
    size="50"
    border-width="5"
    border-bg-width="0"
    :percent="syncPercent"
  />
</template>

<script>
import "vue3-circle-progress/dist/circle-progress.css";
import CircleProgress from "vue3-circle-progress";
export default {
  components: { CircleProgress },
  props: ["color", "syncPercent"],
};
</script>
