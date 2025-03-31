<template>
  <div class="index-line w-full h-1/2 flex justify-center items-center pl-2">
    <div class="icon-box w-1/4 h-full flex justify-center items-center">
      <img
        class="w-7 h-7"
        :src="props.icon !== '' ? props.icon : serviceStore.getServiceCircleIcon(props.name)"
        :alt="props.name"
        @mouseenter="$emit('mouseenter')"
        @mouseleave="$emit('mouseleave')"
      />
    </div>

    <div
      class="status-box w-3/4 h-full flex justify-center items-center uppercase text-xs font-semibold"
      :class="props.state === 'running' ? 'text-green-500' : 'text-red-500'"
    >
      {{ props.state === "running" ? "online" : "offline" }}
    </div>
  </div>
</template>

<script setup>
import { useServices } from "@/store/services";
const props = defineProps({
  icon: String,
  name: String,
  state: String,
});

const serviceStore = useServices();
</script>
