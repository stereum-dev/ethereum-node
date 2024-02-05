<template>
  <div
    class="w-full h-full col-start-1 col-span-full row-start-1 row-span-full grid grid-cols-12 grid-rows-12 p-2 gap-y-1"
  >
    <ServerDetails v-if="getRoute !== '/login'" @change-password="changePassword" @set-avatar="setAvatar" />
    <SshManagement v-if="getRoute !== '/login'" @file-upload="fileUpload" @delete-key="deleteKey" />
  </div>
</template>

<script setup>
import ServerDetails from "./ServerDetails.vue";
import SshManagement from "./SshManagement.vue";
import { useRouter } from "vue-router";
import { computed } from "vue";

const emit = defineEmits(["changePassword", "setAvatar", "fileUpload", "deleteKey"]);

const router = useRouter();

const getRoute = computed(() => {
  return router.currentRoute.value.fullPath;
});

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
