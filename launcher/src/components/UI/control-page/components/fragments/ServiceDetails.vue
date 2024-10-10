<template>
  <div :class="`${props.serviceType}-info w-1/2 h-full flex justify-center items-center flex-col`">
    <div class="service-name w-full h-1/2 flex justify-center items-center text-2xs text-gray-200 font-semibold">
      {{ props.service?.name || "" }}
    </div>
    <div class="service-id w-full h-1/2 flex justify-center items-center text-[60%] text-gray-200">
      {{ formatServiceId(props.service?.id || "") }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  service: Object,
  serviceType: String,
});

const formatServiceId = (id) => {
  return id && id.length >= 7 ? `${id.slice(0, 5)}...${id.slice(-5)}` : id;
};
</script>
