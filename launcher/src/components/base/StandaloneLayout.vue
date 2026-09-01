<template>
  <div
    class="flex flex-col justify-between box-border items-center w-screen h-screen border-2 border-slate-500 rounded-lg z-30 select-none"
  >
    <div
      class="w-full rounded-t-lg h-16 bg-gradient-to-b from-10% from-[#264744] via-[#325d5a] to-[#264744] to-95% border-b border-[#1c3634] flex justify-between items-center px-4"
    >
      <div
        class="h-9 px-4 border border-[#4b8585] rounded-full flex justify-center items-center cursor-pointer bg-[#387272] hover:bg-[#264e4e] shadow-sm shadow-[#1c3634] transition-colors duration-200 ease-in-out active:scale-95"
        @click="backToLogin"
      >
        <span class="text-sm font-semibold uppercase text-gray-200">{{ $t("nukeModal.backToLogin") }}</span>
      </div>
      <SingleMenu :item="helpItem" />
    </div>

    <div class="flex justify-center items-center w-full h-full max-h-[503px] bg-[#33393E]">
      <slot></slot>
    </div>

    <div class="w-full h-[30px] rounded-b-lg bg-[#33393E]"></div>

    <SupportModal v-if="headerStore.supportModalIsActive" @close-window="headerStore.setMenuModal(null)" />
  </div>
</template>

<script setup>
import SingleMenu from "../UI/base-header/components/menu/SingleMenu.vue";
import SupportModal from "../UI/base-header/components/modals/SupportModal.vue";
import { useNodeHeader } from "@/store/nodeHeader";
import { useRouter } from "vue-router";

const headerStore = useNodeHeader();
const router = useRouter();

const helpItem = {
  name: "Help",
  icon: "/img/icon/base-header-icons/header-help-button.png",
};

const backToLogin = () => {
  headerStore.settingsStandalone = false;
  router.push("/login");
};
</script>
