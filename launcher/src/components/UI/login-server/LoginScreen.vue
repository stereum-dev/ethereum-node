<template>
  <installation-layout>
    <LoginForm />
    <div class="absolute top-2 right-2 w-fit h-9 bg-[#1a2e2c] rounded-full py-1 px-4">
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
