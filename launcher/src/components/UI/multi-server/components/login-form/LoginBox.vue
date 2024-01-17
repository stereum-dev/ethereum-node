<template>
  <div class="col-start-1 col-span-full row-start-1 row-span-full p-2 pl-0 grid grid-cols-12 grid-rows-12">
    <div class="col-start-1 col-span-full row-start-1 row-end-12 bg-[#1b1b1d] rounded-md p-2">
      <LoginForm :server="selectedServer" />
    </div>
  </div>
</template>

<script setup>
import LoginForm from "./LoginForm.vue";
import { computed } from "vue";
import { useServers } from "@/store/servers";

const serverStore = useServers();

const selectedServer = computed(() => {
  return serverStore.selectedServerConnection;
});
</script>
