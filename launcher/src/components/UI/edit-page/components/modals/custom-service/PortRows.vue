<template>
  <div
    class="w-full h-8 col-start-1 col-span-full row-span-1 grid grid-cols-12 items-center bg-[#1d1d1e] border border-gray-700 rounded-sm p-[2px]"
  >
    <span class="col-start-1 col-span-10 text-center text-gray-200 font-normal text-md">{{ props.port }}</span>

    <div
      class="w-full h-6 col-start-12 col-span-1 bg-red-500 rounded-sm flex justify-center items-center cursor-pointer hover:bg-red-600 transition-all duration-300 ease-in-out"
      @click="removePorts"
    >
      <span class="text-lg text-center text-gray-100 font-normal self-center">-</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  port: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["removePorts"]);

const removePorts = () => {
  emit("removePorts", props.port);
};
</script>
