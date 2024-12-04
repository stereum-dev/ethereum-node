<template>
  <div class="volume-Parent flex w-full h-full justify-center items-center flex-col p-1 gap-1 relative">
    <ServiceLine
      label="Active"
      value="1"
      hover-text="
        a
        "
    />
    <ServiceLine
      label="in queue"
      value="2"
      hover-text="
          b
        "
    />
    <ServiceLine
      label="node status"
      value="3"
      hover-text="
         c
        "
      :csm-box="props.csmBox"
    />
  </div>
</template>

<script setup>
import ServiceLine from "../fragments/ServiceLine.vue";

const props = defineProps({
  csmBox: {
    type: Boolean,
    default: false,
  },
});
</script>
