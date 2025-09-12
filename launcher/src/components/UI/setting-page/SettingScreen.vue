<template>
  <base-layout>
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
import MainBox from "./section/MainBox.vue";
import SidebarBtn from "./components/SidebarBtn.vue";
import ItemRow from "./section/ItemRow.vue";
import VolumeSlider from "./components/VolumeSlider.vue";
import OutputOptions from "./components/OutputOptions.vue";
import LanguageBtn from "./components/LanguageBtn.vue";
import CreditButtons from "./section/CreditButtons.vue";
import IdleTimer from "./components/IdleTimer.vue";
import LogBackups from "./components/LogBackups.vue";
import IdleTimerTime from "./components/IdleTimerTime.vue";
import { ref, computed, onMounted } from "vue";
import CreditBtn from "./components/CreditBtn.vue";
import { useRouter } from "vue-router";
import { useLangStore } from "@/store/languages";
import { useNodeHeader } from "@/store/nodeHeader";
import ControlService from "@/store/ControlService";

const mainBox = ref("general");
const router = useRouter();
const langStore = useLangStore();
const headerStore = useNodeHeader();

const sidebarButtons = ref([
  { name: "general", label: "General" },
  { name: "audio", label: "Audio" },
]);

const creditButtonNames = ["technical contribution", "feedback, testing & suggestions", "translation"];

const toggleSettings = (name) => {
  mainBox.value = name;
};

onMounted(() => {
  if (!headerStore.stereumTesters.length || !headerStore.stereumTranslators.length) {
    fetchStereumTesters();
    fetchStereumTranslators();
  }
});

const fetchStereumTesters = async () => {
  try {
    const testers = await ControlService.fetchGitHubTesters();
    if (testers && Array.isArray(testers)) {
      headerStore.stereumTesters = testers;
    } else {
      console.error("fetchTesters did not return an array");
    }
  } catch (error) {
    console.error("Error fetching Testers:", error);
  }
};

const fetchStereumTranslators = async () => {
  try {
    const translators = await ControlService.fetchTranslators();
    if (translators && Array.isArray(translators)) {
      headerStore.stereumTranslators = translators.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      console.error("fetchTranslators did not return an array");
    }
  } catch (error) {
    console.error("Error fetching translators:", error);
  }
};

const langActiveBox = () => {
  router.push("/");
  langStore.settingPageIsVisible = true;
};

const itemConfigurations = computed(() => {
  let items = [];
  if (mainBox.value === "general") {
    items = [
      { title: "Language Selection", component: LanguageBtn },
      { title: "Credits", component: CreditButtons },
      { title: "Idle Timeout", component: IdleTimer },
      { title: "Idle Timeout Time (in minutes)", component: IdleTimerTime },
      { title: "Stereum Log Backups", component: LogBackups },
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
<style scoped>
.setting-parent {
  max-height: 488px;
}
</style>
