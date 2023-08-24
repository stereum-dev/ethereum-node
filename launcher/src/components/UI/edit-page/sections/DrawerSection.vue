<template>
  <div class="w-40 h-full flex flex-col justify-between items-center">
    <DrawerBox />
  </div>
</template>
<script setup>
import DrawerBox from "../components/drawer/DrawerBox";
import { ref } from "vue";


const isOpen = ref(false);

const toggle = () => {
  isOpen.value = !isOpen.value;
};
</script>
