import { ref } from 'vue';
<template>
  <div
    class="absolute -top-14 left-2 w-[350px] h-[150px] justify-center items-center animate__animated transition-all duration-500 z-50 bg-white rounded-lg shadow-lg overflow-hidden grid grid-cols-4 grid-rows-3 gap-2 p-2"
    :class="serverStore.isAvatarBoxActive ? 'animate__fadeInDown' : 'animate__fadeOutUp'"
    @mouseleave="serverStore.isAvatarBoxActive = false"
  >
    <img
      v-for="avatar in serverStore.avatars"
      :key="avatar.name"
      class="w-7 h-7 rounded-full justify-self-center self-center bg-teal-300 col-span-1 row-span-1 p-[2px] shadow-md shadow-[#3a3a3b] hover:shadow-lg hover:shadow-[#3a3a3b] hover:scale-110 transition-all duration-150 cursor-pointer"
      :src="avatar.img"
      alt="Avatar"
      @click="pickAvatar(avatar)"
    />
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-6 h-6 absolute rotate-45 -translate-x-1/2 left-1/2 bottom-0.5 -mb-6 transform text-white fill-current z-50 bg-white"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z"></path>
    </svg>
  </div>
</template>

<script setup>
import { useServers } from "@/store/servers";

const emit = defineEmits(["pickAvatar"]);

const serverStore = useServers();

const pickAvatar = (avatar) => {
  emit("pickAvatar", avatar);
};
</script>
