<template>
  <div class="item-parent w-full h-12 bg-[#242529] rounded-xl shadow-2xl mt-2 flex justify-between items-center p-1">
    <span class="ml-4 font-semibold uppercase">{{ props.title }}</span>
    <div class="mr-4 w-1/3 rounded-md h-full flex flex-col justify-center items-center">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
});
</script>

<style scoped>
.item-parent {
  border: 1px solid #363434;
}
.item-parent span {
  color: #eee;
  transition: 0.3s;
}
</style>
