<template>
  <circle-progress
    :fill-color="color"
    :size="43"
    :border-width="3"
    :border-bg-width="2"
    :percent="parseInt(syncPercent)"
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
      type: [Number, String],
      required: true,
    },
  },
};
</script>
