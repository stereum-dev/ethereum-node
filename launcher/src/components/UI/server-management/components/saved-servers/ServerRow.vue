import { ref, computed, watch, watchEffect } from 'vue';
<template>
  <div
    class="w-full h-[55px] min-h-[55px] rounded-md px-2 py-1 shadow-md shadow-[#1f2021] grid grid-cols-10 gap-x-2 cursor-pointer transition-all duration-200 ease-in-out outline outline-transparent hover:outline-blue-600"
    :class="
      connectedServer
        ? 'bg-[#336666] border border-teal-300 '
        : selectedServerBackground
        ? 'bg-blue-300'
        : 'bg-gray-200 '
    "
    @mouseenter="hovered = true"
    @click="selectServer"
  >
    <div
      v-if="serverStore.refreshServers"
      class="col-start-1 col-span-1 self-center mx-auto h-[38px] w-[38px] flex-none rounded-full bg-gray-50"
    >
      <span class="animate-spin border-2 border-gray-300 border-t-blue-600 border-r-blue-600 bg-transparent"></span>
    </div>

    <div
      v-else
      class="col-start-1 col-span-1 h-[38px] w-[38px] self-center mx-auto flex-none rounded-full bg-gray-50 border border-gray-300 shadow-sm shadow-[#1f2021]"
    >
      <img class="w-full h-full rounded-full" :src="serverAvatar" alt="Server Avatar" @click="avatarModalHandler" />
    </div>

    <div
      class="col-start-2 col-end-10 flex flex-col justify-center items-start ml-2"
      :class="connectedServer ? 'text-gray-100' : 'text-gray-800'"
    >
      <p class="leading-6 text-2xs font-semibold">
        {{ getServerNumber }}
      </p>
      <p class="font-semibold text-md">
        {{ props.server.name }}
      </p>
    </div>
    <img
      v-if="connectedServer"
      class="col-start-10 col-span-1 w-5 self-center justify-self-center"
      src="/img/icon/server-management-icons/check.png"
      alt="Check Icon"
    />
    <div
      v-if="!connectedServer"
      class="w-7 h-7 p-[2px] col-start-10 col-span-1 justify-self-center self-center rounded-full border-2 border-teal-800 transition-all duration-200 ease-in-out flex justify-center items-center cursor-pointer hover:scale-110 hover:shadow-sm hover:shadow-[#1b1c1c] active:scale-95"
      @click="quickLogin"
    >
      <img
        class="w-4 h-4"
        src="/img/icon/server-management-icons/quick-login.png"
        alt="Quick Login Icon"
        @mousedown.prevent
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from "vue";
import { useServers } from "@/store/servers";
import { useRoute } from "vue-router";

const props = defineProps({
  server: {
    type: Object,
    required: true,
  },
  idx: {
    type: Number,
    required: true,
  },
});

const avatarModalHandler = () => {
  if (serverStore.selectedServerConnection?.name === props.server?.name) serverStore.isAvatarModalActive = true;
};

const emit = defineEmits(["selectServer", "quickLogin"]);

const route = useRoute();
const serverStore = useServers();

const hovered = ref(false);
const selectedServerBackground = ref(false);

const getServerNumber = computed(() => {
  return `SERVER #${props.idx + 1}`;
});

const serverAvatar = computed(() => {
  if (props.server.avatar) return props.server.avatar;
  else return "/avatar/default.png";
});

const connectedServer = computed(() => {
  if (serverStore.selectedServerConnection?.name === props.server.name) return true;
  else return false;
});

watchEffect(() => {
  if (connectedServer.value && route.path !== "/login") {
    serverStore.isServerLoginActive = false;
    serverStore.isServerDetailsActive = true;
    serverStore.tabs = serverStore.tabs.map((tab) => {
      if (tab.name === "info") tab.isActive = true;
      else tab.isActive = false;
      return tab;
    });
  }
});

watchEffect(() => {
  if (props.server.isSelected && (!connectedServer.value || route.path === "/login")) {
    selectedServerBackground.value = true;
  } else {
    selectedServerBackground.value = false;
  }
});

const quickLogin = () => {
  emit("quickLogin", props.server);
};

const selectServer = () => {
  emit("selectServer", props.server);
};
</script>
