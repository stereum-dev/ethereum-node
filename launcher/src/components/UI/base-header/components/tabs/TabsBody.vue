<template>
  <div class="col-start-3 col-end-14 grid grid-cols-7 items-center gap-x-2">
    <SingleTab v-for="tab in tabs" :key="tab.page" :tab="tab" />
    <router-link
      to="/shell"
      class="w-full h-full col-start-7 col-span-1 flex justify-center items-center"
      @mouseenter="footerStore.cursorLocation = `${title}`"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <img
        class="w-9 h-9 rounded-full shadow-md shadow-gray-800 hover:shadow-lg hover:shadow-gray-800 hover:scale-110 cursor-pointer transition-transform duration-300 ease-in-out active:scale-100 active:shadow-none active:shadow-gray-800"
        src="/img/icon/base-header-icons/terminal2.png"
        alt="Shell Icon"
        @mousedown.prevent
      />
    </router-link>
  </div>
</template>

<script setup>
import SingleTab from "./SingleTab.vue";
import { ref, onMounted, onUnmounted } from "vue";
import { useFooter } from "@/store/theFooter";
import { useRouter } from "vue-router";
import i18n from "@/includes/i18n";

const t = i18n.global.t;

const footerStore = useFooter();
const router = useRouter();

const title = t("shellPage.title");

const tabs = ref([
  { page: "Node", path: "/node", relativePath: "/edit" },
  { page: "Control", path: "/control" },
  { page: "Staking", path: "/staking" },
]);

const navigateToTab = (path) => {
  router.push(path);
};

const handleKeyCombination = (event) => {
  // Check for both Ctrl (Windows/Linux) and Meta (Cmd on macOS) along with Shift
  if ((event.ctrlKey || event.metaKey) && event.shiftKey) {
    switch (event.key.toLowerCase()) {
      case "n": // Ctrl+Shift+N or Cmd+Shift+N for Node
        navigateToTab(tabs.value[0].path);
        break;
      case "c": // Ctrl+Shift+C or Cmd+Shift+C for Control
        navigateToTab(tabs.value[1].path);
        break;
      case "s": // Ctrl+Shift+S or Cmd+Shift+S for Staking
        navigateToTab(tabs.value[2].path);
        break;
      case "t": // Ctrl+Shift+T or Cmd+Shift+T for Shell
        navigateToTab("/shell");
        break;
    }
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyCombination);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyCombination);
});
</script>
