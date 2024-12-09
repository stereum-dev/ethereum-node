<template>
  <div class="arrow w-1/10 h-full flex justify-center items-center cursor-pointer" @click="emitDirection">
    <svg
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      class="h-3 w-3 text-white self-center col-span-1 transform transition-transform duration-200 ease-in-out"
      :class="directionClass"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  direction: String,
});

const emit = defineEmits(["prev", "next"]);

const directionClass = computed(() => {
  return props.direction === "next" ? "rotate-[270deg]" : "rotate-90";
});

const emitDirection = () => {
  if (props.direction === "prev") {
    emit("prev");
  } else if (props.direction === "next") {
    emit("next");
  }
};
</script>
