<template>
  <installation-layout>
    <LoginForm />
    <div class="absolute top-0 right-0 w-fit h-10 bg-[#192924] rounded-full py-1 px-2">
      <span class="text-sm text-gray-300 font-semibold">{{ launchers }}</span>
    </div>
  </installation-layout>
</template>

<script setup>
import LoginForm from "./components/LoginForm.vue";
import ControlService from "@/store/ControlService";
import { ref, onBeforeMount } from "vue";

let launchers = ref("");

// Lifecycle

onBeforeMount(() => {
  checkVersion();
});

// Methods

const checkVersion = async () => {
  let launcher;
  try {
    launcher = await ControlService.getCurrentLauncherVersion();
    launchers.value = launcher;
  } catch (err) {
    console.log("Couldn't fetch versions...\nError:", err.message);
  }
};
</script>
