<template>
  <div
    class="w-full h-full col-start-1 col-span-full row-start-1 row-span-full bg-[#1b1b1d] rounded-md grid grid-cols-2 grid-rows-5 p-2 relative"
  >
    <div class="col-start-1 col-span-1 row-start-1 row-span-1 flex flex-col justify-start items-start">
      <p class="text-md text-gray-300 font-semibold uppercase">
        {{ t("multiServer.serverName") }}
      </p>
      <span
        class="text-lg text-amber-300 font-semibold text-left"
        @mouseenter="footerStore.cursorLocation = `${serverName}`"
        @mouseleave="footerStore.cursorLocation = ''"
        >{{ serverStore.selectedServerConnection?.name ? serverStore.selectedServerConnection?.name : controlStore.ServerName }}</span
      >
    </div>
    <div
      class="col-start-2 col-span-1 row-start-1 row-span-1 flex flex-col justify-start items-start"
      @mouseenter="footerStore.cursorLocation = `${machine}`"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <p class="text-md text-gray-300 font-semibold uppercase">
        {{ t("multiServer.machineName") }}
      </p>
      <span class="text-lg text-amber-300 font-semibold text-left">{{ controlStore.ServerName }}</span>
    </div>
    <div
      class="col-start-1 col-span-1 row-start-2 row-span-1 flex flex-col justify-start items-start"
      @mouseenter="footerStore.cursorLocation = `${serverIp}`"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <p class="text-md text-gray-300 font-semibold uppercase">
        {{ t("multiServer.ipOrHost") }}
      </p>
      <span class="text-lg text-amber-300 font-semibold text-left">{{ controlStore.ipAddress }}</span>
    </div>
    <div
      class="col-start-2 col-span-1 row-start-2 row-span-1 flex flex-col justify-start items-start"
      @mouseenter="footerStore.cursorLocation = `${portTooltip}`"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <p class="text-md text-gray-300 font-semibold uppercase">
        {{ t("multiServer.port") }}
      </p>
      <span class="text-lg text-amber-300 font-semibold text-left">{{ port }}</span>
    </div>
    <div
      class="col-start-2 col-span-1 row-start-3 row-span-1 flex flex-col justify-start items-start"
      @mouseenter="footerStore.cursorLocation = `${userNameTooltip}`"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <p class="text-md text-gray-300 font-semibold uppercase">
        {{ t("multiServer.userName") }}
      </p>
      <span class="text-lg text-amber-300 font-semibold text-left">{{ userName }}</span>
    </div>
    <div class="col-start-1 col-span-1 row-start-3 row-span-1 flex justify-start items-start relative space-x-1">
      <img
        class="w-8 h-8 rounded-full border border-gray-300 cursor-pointer hover:border-amber-300 transition duration-200 ease-in-out"
        :src="selectedAvatar"
        alt="Avatar"
        @click="avatarModal"
        @mouseenter="footerStore.cursorLocation = `${chngAvatar}`"
        @mouseleave="footerStore.cursorLocation = ''"
      />
      <p class="text-md text-gray-300 font-semibold uppercase pt-1">
        {{ t("multiServer.chngAvatar") }}
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
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";

const t = i18n.global.t;

const emit = defineEmits(["changePassword", "setAvatar"]);

const controlStore = useControlStore();
const serverStore = useServers();
const footerStore = useFooter();

const serverName = t("serverDetail.serverName", {
  serverName: serverStore.selectedServerConnection?.name ? serverStore.selectedServerConnection?.name : controlStore.ServerName,
});
const serverIp = t("serverDetail.serverIp", { serverIp: controlStore.ipAddress });
const machine = t("serverDetail.machine", { machineName: controlStore.ServerName });
const portTooltip = t("serverDetail.port", {
  port: serverStore.selectedServerConnection?.port !== "" ? serverStore.selectedServerConnection?.port : 22,
});
const userNameTooltip = t("serverDetail.userName", {
  userName: serverStore.selectedServerConnection?.user,
});
const chngAvatar = t("serverDetail.chngAvatar");

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
