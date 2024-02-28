<template>
  <div class="col-start-19 col-span-full grid grid-cols-5 items-center">
    <SingleMenu v-for="item in items" :key="item.name" :item="item" />
  </div>
</template>

//
<script setup>
import SingleMenu from "./SingleMenu.vue";
import { ref } from "vue";

const items = ref([
  {
    name: "Help",
    icon: "/img/icon/header-icons/header-help-button.png",
  },
  {
    name: "Notifications",
    icon: "/img/icon/header-icons/header-notification-button.png",
  },
  {
    name: "Available Update",
    icon: "/img/icon/header-icons/header-update-button-green.png",
    activeIcon: "/img/icon/header-icons/header-update-button-blue.png",
  },
  {
    name: "Settings",
    icon: "/img/icon/header-icons/header-stereum-settings-button.png",
    path: "/setting",
  },
  {
    name: "Logout",
    icon: "/img/icon/header-icons/header-logout-button.png",
  },
]);
</script>
