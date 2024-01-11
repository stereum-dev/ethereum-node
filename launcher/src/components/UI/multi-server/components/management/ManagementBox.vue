<template>
  <div
    class="w-full h-full col-start-1 col-span-full row-start-1 row-span-full grid grid-cols-12 grid-rows-12 p-2 pl-0 gap-y-1"
  >
    <ServerDetails @change-password="changePassword" @set-avatar="setAvatar" />
    <SshManagement />
  </div>
</template>

<script setup>
import ServerDetails from "./ServerDetails.vue";
import SshManagement from "./SshManagement.vue";

const emit = defineEmits(["changePassword", "setAvatar"]);

const changePassword = (newPassword) => {
  emit("changePassword", newPassword);
};

const setAvatar = (avatar) => {
  emit("setAvatar", avatar);
};
</script>
