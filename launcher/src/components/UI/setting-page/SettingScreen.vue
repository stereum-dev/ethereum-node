<template>
  <base-layout>
    <language-panel v-if="langActive" @back="langActiveBox" />
    <div v-else class="setting-parent w-full h-full flex justify-center items-center">
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
        <MainBox>
          <ItemRow v-for="(item, index) in itemConfigurations" :key="index" :title="item.title">
            <component :is="item.component" v-if="item.component === CreditButtons">
              <CreditBtn v-for="btnName in creditButtonNames" :key="btnName" :btn-name="btnName" />
            </component>
            <component :is="item.component" v-else @languageChanged="langActiveBox" />
          </ItemRow>
        </MainBox>
      </div>
    </div>
  </base-layout>
</template>
<script setup>
import SideBar from "./section/SideBar.vue";
import MainBox from "./section/MainBox";
import SidebarBtn from "./components/SidebarBtn";
import ItemRow from "./section/ItemRow";
import VolumeSlider from "./components/VolumeSlider";
import OutputOptions from "./components/OutputOptions.vue";
import LanguageBtn from "./components/LanguageBtn.vue";
import CreditButtons from "./section/CreditButtons.vue";
import { ref, computed } from "vue";
import LanguagePanel from "./section/LanguagePanel.vue";
import CreditBtn from "./components/CreditBtn.vue";

const mainBox = ref("general");
const langActive = ref(false);

const sidebarButtons = ref([
  { name: "general", label: "General" },
  { name: "audio", label: "Audio" },
]);

const creditButtonNames = ["technical contribution", "feedback, testing & suggestions", "translation"];

const toggleSettings = (name) => {
  mainBox.value = name;
};

const langActiveBox = () => {
  langActive.value = !langActive.value;
};

const itemConfigurations = computed(() => {
  let items = [];
  if (mainBox.value === "general") {
    items = [
      { title: "Language Selection", component: LanguageBtn },
      { title: "Credits", component: CreditButtons },
    ];
  } else if (mainBox.value === "audio") {
    items = [
      { title: "Output Device", component: OutputOptions },
      { title: "Volume", component: VolumeSlider },
    ];
  }

  while (items.length < 8) {
    items.push({ title: "" });
  }
  return items;
});
</script>
<style>
.setting-parent {
  max-height: 488px;
}
</style>
