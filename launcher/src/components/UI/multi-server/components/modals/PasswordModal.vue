import { ref } from 'vue';
<template>
  <div
    class="absolute top-[7rem] left-[1.3rem] w-[390px] h-[150px] justify-center items-center animate__animated transition-all duration-500 z-50 bg-white rounded-sm shadow-lg overflow-hidden grid grid-cols-5 grid-rows-4 gap-2 p-2"
    :class="serverStore.isPasswordChanged ? 'animate__fadeInDown' : 'animate__fadeOutUp'"
  >
    <p class="col-start-1 col-span-full row-start-1 row-span-1 text-center text-md font-bold text-gray-700 uppercase">
      Change Password
    </p>
    <div class="col-start-1 col-span-full row-start-2 row-span-2 flex justify-center items-center space-x-2">
      <img
        class="w-8 h-8 rounded-full justify-self-center self-center col-span-1 row-span-1 bg-teal-500 p-2"
        src="/img/icon/access-management/check.png"
        alt="Avatar"
      />

      <span class="text-md text-teal-500 font-semibold capitalize">{{ props.res }}</span>
    </div>

    <button
      class="col-start-4 col-span-full row-start-4 row-span-1 rounded-md bg-teal-800 hover:bg-teal-950 active:scale-95 text-gray-100 uppercase font-semibold"
      @click="serverStore.isPasswordChanged = false"
    >
      ok
    </button>
  </div>
</template>

<script setup>
import { useServers } from "@/store/servers";

const serverStore = useServers();
const props = defineProps({
  res: {
    type: String,
    required: true,
  },
});
</script>
