<template>
  <div
    class="flex flex-col justify-between box-border items-center w-screen h-screen border-2 border-slate-500 rounded-lg z-50"
  >
    <div
      class="w-full rounded-t-lg h-16 bg-gradient-to-b from-10% from-[#264744] via-[#325d5a] vie-10% to-[#264744] to-95%"
    >
      <div class="absolute left-1 top-1 w-20 rounded-tl-lg">
        <img src="/img/icon/LOGO.png" class="rounded-tl-lg" />
      </div>
      <MainNavbar />
    </div>
    <div class="flex flex-col w-full h-full bg-[#33393E]">
      <slot></slot>
    </div>
    <div class="w-full h-[30px] rounded-b-lg bg-[#33393E]"></div>
  </div>
</template>
<script>
import MainNavbar from "../UI/node-header/MainNavbar.vue";
export default {
  name: "NodeScreen",
  components: {
    MainNavbar,
  },
};
</script>
