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
    icon: "/img/icon/header-icons/question-mark.png",
  },
  {
    name: "Notifications",
    icon: "/img/icon/header-icons/megaphone9.png",
  },
  {
    name: "Available Update",
    icon: "/img/icon/header-icons/update-green.png",
    activeIcon: "/img/icon/header-icons/update-blue.png",
  },
  {
    name: "Settings",
    icon: "/img/icon/header-icons/setting4.png",
    path: "/setting",
  },
  {
    name: "Logout",
    icon: "/img/icon/header-icons/exit9.png",
  },
]);
</script>
