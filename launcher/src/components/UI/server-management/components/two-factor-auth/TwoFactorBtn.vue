<template>
  <button
    class="two-factor-btn_parent min-w-[170px] h-8 bg-teal-700 hover:bg-teal-900 rounded-full px-2 flex justify-center items-center active:scale-95 active:shadow-none shadow-lg shadow-black transition duration-150 ease-in-out row-span-1"
    @click="btnClick"
  >
    <span class="text-[12px] font-semibold text-gray-100 uppercase">{{ props.btnName }}</span>
  </button>
</template>

<script setup>
// Defining props
const props = defineProps({
  btnName: String,
});

// Defining emits
const emit = defineEmits(["btnClick"]);

// Function to handle button click and emit the event
const btnClick = () => {
  emit("btnClick");
};
</script>
