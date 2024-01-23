<template>
  <div
    class="w-full h-full col-start-1 col-span-full row-start-1 row-span-full grid grid-cols-12 grid-rows-12 p-2 gap-y-1"
  >
    <ServerDetails @change-password="changePassword" @set-avatar="setAvatar" />
    <SshManagement @file-upload="fileUpload" @delete-key="deleteKey" />
  </div>
</template>

<script setup>
import ServerDetails from "./ServerDetails.vue";
import SshManagement from "./SshManagement.vue";

const emit = defineEmits(["changePassword", "setAvatar", "fileUpload", "deleteKey"]);

const changePassword = (newPassword) => {
  emit("changePassword", newPassword);
};

const setAvatar = (avatar) => {
  emit("setAvatar", avatar);
};

const fileUpload = (file) => {
  emit("fileUpload", file);
};

const deleteKey = (key) => {
  emit("deleteKey", key);
};
</script>
