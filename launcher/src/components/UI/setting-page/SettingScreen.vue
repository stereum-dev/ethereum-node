<template>
  <base-layout>
    <!-- <SettingPanel /> -->

    <div class="flex justify-start items-start w-56 h-full">
      <SideBar>
        <SidebarBtn btn-name="general" />
        <SidebarBtn btn-name="audio" />
      </SideBar>
    </div>
    <div class="bg-black w-5/6 h-full"><MainBox /></div>
  </base-layout>
</template>
<script setup>
// import SettingPanel from "./SettingPanel.vue";
import SideBar from "./section/SideBar.vue";
import MainBox from "./section/MainBox";
import SidebarBtn from "./components/SidebarBtn";
</script>
