<template>
  <div class="w-full h-full col-start-1 col-span-full row-start-1 row-span-full grid grid-cols-12 grid-rows-12 p-2 gap-y-1 relative">
    <LoginForm @server-login="serverLogin" />
  </div>
</template>

<script setup>
import LoginForm from "./LoginForm.vue";

const emit = defineEmits(["serverLogin"]);

const serverLogin = () => {
  emit("serverLogin");
};
</script>
