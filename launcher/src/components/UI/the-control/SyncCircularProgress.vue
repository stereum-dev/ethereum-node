<template>
  <circle-progress
    :fill-color="color"
    size="40"
    border-width="2"
    border-bg-width="3"
    :percent="syncPercent"
    empty-color="black"
  />
</template>

<script>
import "vue3-circle-progress/dist/circle-progress.css";
import CircleProgress from "vue3-circle-progress";
export default {
  components: { CircleProgress },
  props: {
    color: {
      type: String,
      required: true,
    },
    syncPercent: {
      type: String,
      required: true,
    },
  },
};
</script>
