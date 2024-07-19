import { ref, computed, watch, watchEffect } from 'vue';
<template>
  <div class="w-full h-[55px] grid grid-cols-24 items-center gap-x-1">
    <div
      class="w-full h-[55px] min-h-[55px] col-start-1 rounded-l-md px-2 py-1 shadow-md shadow-[#1f2021] grid grid-cols-10 gap-x-2 cursor-pointer transition-all duration-200 ease-in-out outline outline-transparent hover:bg-blue-400"
      :class="[
        connectedServer && route.path !== '/login'
          ? 'bg-[#336666] border border-teal-300 '
          : selectedServerBackground
          ? 'bg-blue-300'
          : 'bg-gray-200 ',
        connectedServer || route.path === '/login' || !sshExists ? 'col-span-full rounded-md' : 'col-end-22',
      ]"
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
        :class="connectedServer && route.path !== '/login' ? 'text-gray-100' : 'text-gray-800'"
      >
        <p class="leading-6 text-2xs font-semibold">
          {{ getServerNumber }}
        </p>
        <p class="font-semibold text-md">
          {{ props.server.name }}
        </p>
      </div>
      <img
        v-if="connectedServer && route.path !== '/login'"
        class="col-start-10 col-span-1 w-5 self-center justify-self-center"
        src="/img/icon/edit-node-icons/service-connected.png"
        alt="Check Icon"
      />
    </div>
    <div
      class="w-full h-full col-start-22 col-span-full rounded-r-md justify-self-center self-center flex justify-center items-center cursor-pointer bg-[#18191a] hover:bg-[#222425] active:bg-[#1b1c1c] transition-all duration-200 ease-in-out"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
    >
      <div
        v-if="!connectedServer && route.path !== '/login' && sshExists"
        class="w-full h-full bg-transparent rounded-r-md justify-self-center self-center flex justify-center items-center cursor-pointer hover:shadow-sm hover:shadow-[#1b1c1c] active:scale-95 relative"
        @click="quickLogin"
      >
        <img
          class="w-4 h-4 transition-all duration-200 ease-in-out hover:scale-110"
          src="/img/icon/server-management-icons/quick-login.png"
          alt="Quick Login Icon"
          :class="isHovered ? 'transition-all duration-150 scale-110 invert' : 'filter-none'"
          @mousedown.prevent
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from "vue";
import { useServers } from "@/store/servers";
import { useRoute } from "vue-router";
import { useFooter } from "@/store/theFooter";

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

const isHovered = ref(false);

const avatarModalHandler = () => {
  if (serverStore.selectedServerConnection?.name === props.server?.name) serverStore.isAvatarModalActive = true;
};

const emit = defineEmits(["selectServer", "quickLogin"]);

const route = useRoute();
const serverStore = useServers();
const footerStore = useFooter();

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
  return serverStore.selectedServerConnection?.name === props.server.name;
});

const sshExists = computed(() => {
  return props.server.keylocation !== "";
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

const onMouseEnter = () => {
  footerStore.cursorLocation = "SSH Quick Login";
  isHovered.value = true; // Assuming isHovered is a ref, you need to use .value to update it
};

const onMouseLeave = () => {
  footerStore.cursorLocation = "";
  isHovered.value = false; // Same here for ref
};

const quickLogin = () => {
  emit("quickLogin", props.server);
};

const selectServer = () => {
  emit("selectServer", props.server);
};
</script>
