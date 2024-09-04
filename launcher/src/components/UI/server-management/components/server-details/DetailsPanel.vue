<template>
  <div class="w-full h-full col-start-1 col-span-full row-start-1 row-span-full grid grid-cols-12 grid-rows-12 p-2 gap-y-1">
    <ServerDetails
      v-if="serverStore.isServerDetailsActive && getRoute !== '/login'"
      @change-password="changePassword"
      @set-avatar="setAvatar"
    />
  </div>
</template>

<script setup>
import ServerDetails from "./ServerDetails.vue";
import { useRouter } from "vue-router";
import { computed } from "vue";
import { useServers } from "@/store/servers";

const emit = defineEmits(["changePassword", "setAvatar", "fileUpload", "deleteKey"]);

const router = useRouter();
const serverStore = useServers();

const getRoute = computed(() => {
  return router.currentRoute.value.fullPath;
});

const changePassword = (newPassword) => {
  emit("changePassword", newPassword);
};

const setAvatar = (avatar) => {
  emit("setAvatar", avatar);
};
</script>
