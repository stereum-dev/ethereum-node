<template>
  <div
    class="w-full h-full col-start-1 col-span-full row-start-1 row-end-6 bg-[#1b1b1d] rounded-md grid grid-cols-2 grid-rows-4 p-2 relative"
  >
    <div class="col-start-1 col-span-1 row-start-1 row-span-1 flex flex-col justify-start items-start">
      <p class="text-xs text-gray-300 font-semibold uppercase">Server Name</p>
      <span class="text-xs text-amber-300 font-semibold text-left">{{ controlStore.ServerName }}</span>
    </div>
    <div class="col-start-2 col-span-1 row-start-1 row-span-1 flex flex-col justify-start items-start">
      <p class="text-xs text-gray-300 font-semibold uppercase">Machine Name</p>
      <span class="text-xs text-amber-300 font-semibold text-left">{{ controlStore.ServerName }}</span>
    </div>
    <div class="col-start-1 col-span-1 row-start-2 row-span-1 flex flex-col justify-start items-start">
      <p class="text-xs text-gray-300 font-semibold uppercase">IP or HOSTNAME</p>
      <span class="text-xs text-amber-300 font-semibold text-left">{{ controlStore.ipAddress }}</span>
    </div>
    <div class="col-start-2 col-span-1 row-start-2 row-span-1 flex flex-col justify-start items-start">
      <p class="text-xs text-gray-300 font-semibold uppercase">PORT</p>
      <span class="text-xs text-amber-300 font-semibold text-left">{{ port }}</span>
    </div>
    <div class="col-start-2 col-span-1 row-start-3 row-span-1 flex flex-col justify-start items-start">
      <p class="text-xs text-gray-300 font-semibold uppercase">USERNAME</p>
      <span class="text-xs text-amber-300 font-semibold text-left">{{ userName }}</span>
    </div>
    <div class="col-start-1 col-span-1 row-start-3 row-span-1 flex justify-start items-start relative space-x-1">
      <img
        class="w-6 h-6 rounded-full border border-gray-300"
        :src="selectedAvatar"
        alt="Avatar"
        @click="avatarModal"
      />
      <p class="text-xs text-gray-300 font-semibold uppercase pt-1">Change Avatar</p>
      <AvatarModal v-if="serverStore.isAvatarModalActive" @pick-avatar="setServerAvatar" />
    </div>

    <ChangePassword @change-password="changePassword" />
  </div>
</template>
<script setup>
import ChangePassword from "./ChangePassword.vue";
import AvatarModal from "../modals/AvatarModal.vue";
import { computed, onMounted } from "vue";
import ControlService from "@/store/ControlService";
import { useControlStore } from "@/store/theControl";
import { useServers } from "@/store/servers";

const emit = defineEmits(["changePassword"]);

const controlStore = useControlStore();
const serverStore = useServers();

const userName = computed(() => {
  return serverStore.selectedServerConnection?.user;
});

const port = computed(() => {
  return serverStore.selectedServerConnection?.port !== "" ? serverStore.selectedServerConnection?.port : 22;
});

const selectedAvatar = computed(() => {
  if (serverStore.selectedAvatar) {
    return serverStore.selectedAvatar;
  } else {
    return serverStore.selectedServerConnection?.avatar;
  }
});

onMounted(() => {
  updateConnectionStats();
});

//Methods
const updateConnectionStats = async () => {
  const stats = await ControlService.getConnectionStats();

  controlStore.ServerName = stats.ServerName;
  controlStore.ipAddress = stats.ipAddress;
};

const changePassword = (newPassword) => {
  emit("changePassword", newPassword);
};

const avatarModal = () => {
  serverStore.isAvatarModalActive = !serverStore.isAvatarModalActive;
};

const setServerAvatar = async (avatar) => {
  serverStore.selectedAvatar = avatar;
  serverStore.isAvatarModalActive = false;
  const savedServers = await ControlService.readConfig();

  // Update the avatar in the savedConnections array
  const updatedConnections = savedServers.savedConnections.map((item) => {
    if (item.host === controlStore.ipAddress) {
      return { ...item, avatar: avatar };
    }
    return item;
  });

  // Update the config with the new connections array
  const updatedConfig = {
    ...savedServers,
    savedConnections: updatedConnections,
  };
  serverStore.refreshServers = true;
  await ControlService.writeConfig(updatedConfig);
};
</script>
