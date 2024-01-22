import { ref, computed } from 'vue';
<template>
  <div
    class="w-full h-[55px] rounded-md px-2 py-1 shadow-md shadow-[#1f2021] grid grid-cols-10 gap-x-2 cursor-pointer transition-all duration-200 ease-in-out outline outline-transparent hover:outline-blue-600"
    :class="connectedServer ? 'bg-[#336666] border border-teal-300 ' : 'bg-gray-200 '"
    @mouseenter="hovered = true"
    @click="selectServer"
  >
    <div
      v-if="serverStore.refreshServers"
      class="col-start-1 col-span-1 self-center mx-auto h-[38px] w-[38px] flex-none rounded-full bg-gray-50"
    >
      <span class="animate-spin border-2 border-gray-300 border-t-blue-600 border-r-blue-600 bg-transparent"></span>
    </div>

    <img
      v-else
      class="col-start-1 col-span-1 self-center mx-auto w-full flex-none rounded-full bg-gray-50 border border-gray-300 shadow-sm shadow-[#1f2021]"
      :src="serverAvatar"
      alt="Server Avatar"
      @click="avatarModalHandler"
    />
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
      class="col-start-10 col-span-1 w-5 self-center"
      src="/img/icon/access-management/check.png"
      alt="Check Icon"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useServers } from "@/store/servers";

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

const emit = defineEmits(["selectServer"]);

const serverStore = useServers();

const hovered = ref(false);

const getServerNumber = computed(() => {
  return `SERVER #${props.idx + 1}`;
});

const serverAvatar = computed(() => {
  if (props.server.avatar) return props.server.avatar;
  else return "/avatar/server_selection_1.png";
});

const connectedServer = computed(() => {
  if (serverStore.selectedServerConnection?.name === props.server.name) return true;
  else return false;
});

const selectServer = () => {
  emit("selectServer", props.server);
};
</script>
