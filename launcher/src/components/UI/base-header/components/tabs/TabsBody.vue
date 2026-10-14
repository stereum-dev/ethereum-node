<template>
  <div class="col-start-3 col-end-14 grid items-center gap-x-2" :class="tabs.length > 3 ? 'grid-cols-9' : 'grid-cols-7'">
    <SingleTab v-for="tab in tabs" :key="tab.page" :tab="tab" />
    <router-link
      to="/shell"
      class="w-full h-full col-span-1 flex justify-center items-center"
      :class="tabs.length > 3 ? 'col-start-9' : 'col-start-7'"
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
import { ref } from "vue";
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";

const t = i18n.global.t;

const title = t("shellPage.title");

const footerStore = useFooter();

const tabs = ref([
  { page: "Node", path: "/node", relativePath: "/edit" },
  { page: "Control", path: "/control" },
  { page: "Staking", path: "/staking" },
]);
</script>
