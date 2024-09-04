<template>
  <div class="w-screen h-screen grid grid-cols-12 grid-rows-12 items-center bg-[#336666] rounded-md relative">
    <LogoSection />
    <MenuSection />
    <div class="col-start-11 col-span-full row-start-11 row-span-full flex justify-center items-center">
      <div
        class="w-[150px] h-14 bg-[#2f5a5a] hover:bg-[#244343] border-2 border-gray-400 rounded-full shadow-md shadow-[#1e2b2b] flex justify-center items-center cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg active:shadow-none active:scale-95 mr-4"
        :class="langStore.selectedLang === '' ? 'pointer-events-none opacity-50 ' : ''"
        @click="buttonHandler"
      >
        <span class="text-2xl font-bold uppercase text-gray-200">Next</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
import LogoSection from "./sections/LogoSection.vue";
import MenuSection from "./sections/MenuSection.vue";

import { useLangStore } from "@/store/languages";

const router = useRouter();
const langStore = useLangStore();

const buttonHandler = () => {
  langStore.settingPageIsVisible ? router.push("/setting") : router.push("/login");
  langStore.settingPageIsVisible = false;
};
</script>
