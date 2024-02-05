<template>
  <div
    class="w-full h-full col-start-1 col-span-full row-start-1 row-end-8 bg-[#1b1b1d] rounded-md grid grid-cols-2 grid-rows-5 p-2 relative"
  >
    <div class="col-start-1 col-span-1 row-start-1 row-span-1 flex flex-col justify-start items-start">
      <p class="text-xs text-gray-300 font-semibold uppercase">
        {{ $t("multiServer.serverName") }}
      </p>
      <span class="text-xs text-amber-300 font-semibold text-left">{{
        serverStore.selectedServerConnection?.name
          ? serverStore.selectedServerConnection?.name
          : controlStore.ServerName
      }}</span>
    </div>
    <div class="col-start-2 col-span-1 row-start-1 row-span-1 flex flex-col justify-start items-start">
      <p class="text-xs text-gray-300 font-semibold uppercase">
        {{ $t("multiServer.machineName") }}
      </p>
      <span class="text-xs text-amber-300 font-semibold text-left">{{ controlStore.ServerName }}</span>
    </div>
    <div class="col-start-1 col-span-1 row-start-2 row-span-1 flex flex-col justify-start items-start">
      <p class="text-xs text-gray-300 font-semibold uppercase">
        {{ $t("multiServer.ipOrHost") }}
      </p>
      <span class="text-xs text-amber-300 font-semibold text-left">{{ controlStore.ipAddress }}</span>
    </div>
    <div class="col-start-2 col-span-1 row-start-2 row-span-1 flex flex-col justify-start items-start">
      <p class="text-xs text-gray-300 font-semibold uppercase">
        {{ $t("multiServer.port") }}
      </p>
      <span class="text-xs text-amber-300 font-semibold text-left">{{ port }}</span>
    </div>
    <div class="col-start-2 col-span-1 row-start-3 row-span-1 flex flex-col justify-start items-start">
      <p class="text-xs text-gray-300 font-semibold uppercase">
        {{ $t("multiServer.userName") }}
      </p>
      <span class="text-xs text-amber-300 font-semibold text-left">{{ userName }}</span>
    </div>
    <div class="col-start-1 col-span-1 row-start-3 row-span-1 flex justify-start items-start relative space-x-1">
      <img
        class="w-6 h-6 rounded-full border border-gray-300"
        :src="selectedAvatar"
        alt="Avatar"
        @click="avatarModal"
      />
      <p class="text-xs text-gray-300 font-semibold uppercase pt-1">
        {{ $t("multiServer.chngAvatar") }}
      </p>
      <AvatarModal v-if="serverStore.isAvatarModalActive" @pick-avatar="setAvatar" />
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

const emit = defineEmits(["changePassword", "setAvatar"]);

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
  } else if (!serverStore.selectedAvatar && serverStore.selectedServerConnection?.avatar) {
    return serverStore.selectedServerConnection?.avatar;
  } else {
    return "/avatar/default.png";
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

const setAvatar = (avatar) => {
  emit("setAvatar", avatar);
};

const avatarModal = () => {
  serverStore.isAvatarModalActive = !serverStore.isAvatarModalActive;
};
</script>
