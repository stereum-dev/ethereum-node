<template>
  <div class="val-client flex h-[90%] w-1/5 flex-col">
    <div
      class="icon-box w-full h-3/4 flex justify-center items-center mb-1"
      @mouseenter="$emit('mouseenter-name')"
      @mouseleave="$emit('mouseleave-name')"
    >
      <img class="w-10 h-10" :src="props.validator.icon" :alt="props.validator.name" />
    </div>
    <div class="key-count w-full h-1/4 flex justify-center items-center">
      <div
        class="status-val h-2 w-2 flex rounded-lg"
        :class="props.validator.state === 'running' ? 'bg-green-500' : 'bg-red-500'"
        @mouseenter="$emit('mouseenter-state')"
        @mouseleave="$emit('mouseleave-state')"
      />
      <span
        class="w-3/4 h-full flex justify-center items-center font-semibold text-gray-200 text-xs"
        @mouseenter="$emit('mouseenter-keyCount')"
        @mouseleave="$emit('mouseleave-keyCount')"
      >
        {{ props.keyCount }}
      </span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  validator: Object,
  keyCount: Number,
});
</script>
