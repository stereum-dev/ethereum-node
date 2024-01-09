<template>
  <div
    class="w-full h-full col-start-1 col-span-full row-start-1 row-end-6 bg-slate-800 rounded-md grid grid-cols-2 grid-rows-4 p-2 relative"
  >
    <div class="col-start-1 col-span-1 row-start-1 row-span-1 flex flex-col justify-start items-start">
      <p class="text-xs text-gray-300 font-semibold uppercase">Server Name</p>
      <span>{{ serverName }}</span>
    </div>
    <div class="col-start-2 col-span-1 row-start-1 row-span-1 flex flex-col justify-start items-start">
      <p class="text-xs text-gray-300 font-semibold uppercase">Machine Name</p>
      <span>{{ serverName }}</span>
    </div>
    <div class="col-start-1 col-span-1 row-start-2 row-span-1 flex flex-col justify-start items-start">
      <p class="text-xs text-gray-300 font-semibold uppercase">IP or HOSTNAME</p>
      <span>{{ serverIp }}</span>
    </div>
    <div class="col-start-2 col-span-1 row-start-2 row-span-1 flex flex-col justify-start items-start">
      <p class="text-xs text-gray-300 font-semibold uppercase">PORT</p>
      <span>{{ serverName }}</span>
    </div>
    <div class="col-start-2 col-span-1 row-start-3 row-span-1 flex flex-col justify-start items-start">
      <p class="text-xs text-gray-300 font-semibold uppercase">USERNAME</p>
      <span>{{ serverName }}</span>
    </div>
    <div class="col-start-1 col-span-1 row-start-3 row-span-1 flex justify-start items-start relative space-x-1">
      <img
        class="w-6 h-6 rounded-full border border-gray-300"
        :src="selectedAvatar"
        alt="Avatar"
        @click="avatarModal"
      />
      <p class="text-xs text-gray-300 font-semibold uppercase pt-1">Choose Avatar</p>
      <AvatarModal @pick-avatar="pickSererAvatar" />
    </div>

    <ChangePassword @change-password="changePassword" />
  </div>
</template>
<script setup>
import ChangePassword from "./ChangePassword.vue";
import AvatarModal from "../modals/AvatarModal.vue";
import { computed } from "vue";
import { useControlStore } from "@/store/theControl";
import { useServers } from "@/store/servers";

const emit = defineEmits(["changePassword"]);

const controlStore = useControlStore();
const serverStore = useServers();

const serverName = computed(() => {
  return controlStore.serverName;
});

const serverIp = computed(() => {
  return controlStore.ipAddress;
});

const selectedAvatar = computed(() => {
  if (serverStore.selectedAvatar?.img) {
    return serverStore.selectedAvatar?.img;
  } else {
    return "/avatar/astronaut.png";
  }
});

const changePassword = (newPassword) => {
  emit("changePassword", newPassword);
};

const avatarModal = () => {
  serverStore.isAvatarBoxActive = !serverStore.isAvatarBoxActive;
};

const pickSererAvatar = (avatar) => {
  serverStore.selectedAvatar = avatar;
  serverStore.isAvatarBoxActive = false;
};
</script>
