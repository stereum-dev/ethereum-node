<template>
  <base-layout>
    <!-- <SettingPanel /> -->
    <div class="setting-parent w-full h-full flex justify-center items-center">
      <div class="flex justify-start items-start w-56 h-full">
        <SideBar>
          <SidebarBtn
            v-for="button in sidebarButtons"
            :key="button.name"
            :btn-name="button.name"
            :is-active="mainBox === button.name ? 'true' : 'false'"
            @toggle-active="toggleSettings(button.name)"
          />
        </SideBar>
      </div>
      <div class="bg-black w-5/6 h-full">
        <MainBox
          ><ItemRow :title="itemTitles[0]"><OutputOptions v-if="mainBox == 'audio'" /></ItemRow>
          <ItemRow :title="itemTitles[1]"><VolumeSlider v-if="mainBox == 'audio'" /></ItemRow
          ><ItemRow /><ItemRow /><ItemRow /><ItemRow /><ItemRow /><ItemRow /><ItemRow
        /></MainBox>
      </div>
    </div>
  </base-layout>
</template>
<script setup>
// import SettingPanel from "./SettingPanel.vue";
import SideBar from "./section/SideBar.vue";
import MainBox from "./section/MainBox";
import SidebarBtn from "./components/SidebarBtn";
import ItemRow from "./components/ItemRow";
import VolumeSlider from "./components/VolumeSlider";
import OutputOptions from "./components/OutputOptions.vue";
import { ref, computed } from "vue";

const mainBox = ref("general");

// const toggleSettings = (arg) => {
//   mainBox.value = arg;
// };

const sidebarButtons = ref([
  { name: "general", label: "General" },
  { name: "audio", label: "Audio" },
]);

const toggleSettings = (name) => {
  mainBox.value = name;
};

const itemTitles = computed(() => {
  return mainBox.value === "general" ? ["Language Selection", "Credits"] : ["Output Device", "Volume"];
});
</script>
<style>
.setting-parent {
  max-height: 488px;
}
</style>
