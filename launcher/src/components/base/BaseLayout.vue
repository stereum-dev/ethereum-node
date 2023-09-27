<template>
  <div
    class="flex flex-col justify-between box-border items-center w-screen h-screen border-2 border-slate-500 rounded-lg z-50"
  >
    <div
      class="w-full rounded-t-lg h-16 bg-gradient-to-b from-10% from-[#264744] via-[#325d5a] vie-10% to-[#264744] to-95% border-b border-[#1c3634]"
    >
      <div
        class="absolute left-1 top-1 w-[72px] rounded-tl-lg z-50 p-1 bg-[#1E3428] rounded-tr-[33px] rounded-br-[33px] rounded-bl-[33px] shadow-md shadow-[#252525]"
        @pointerdown.prevent.stop
        @mousedown.prevent.stop
      >
        <img src="/img/icon/LOGO.png" class="rounded-tl-lg" />
      </div>
      <MainNavbar />
    </div>
    <div class="flex justify-center items-center w-full h-full bg-[#33393E]">
      <slot></slot>
    </div>
    <div class="w-full h-[30px] rounded-b-lg bg-[#33393E]" @pointerdown.prevent.stop @mousedown.prevent.stop>
      <TaskManager />
    </div>
  </div>
</template>
<script setup>
import MainNavbar from "../UI/node-header/MainNavbar.vue";
import TaskManager from "../UI/task-manager/TaskManager.vue";
</script>
