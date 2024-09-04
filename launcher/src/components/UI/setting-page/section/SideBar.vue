<template>
  <div class="flex flex-col items-start justify-start h-full w-full bg-[#33393E]" style="border-right: 1px solid #707070">
    <div class="title mt-3 bg-[#336666] w-11/12 h-12 pr-4 font-semibold text-md uppercase box-border justify-end flex items-center">
      settings
    </div>
    <div class="sidebar-container flex flex-col h-4/5 w-full justify-start items-center space-y-2 pt-4 px-1">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.title {
  color: #eee;
  border: 1px solid #343434;
  box-shadow: 5px 1px 10px 1px rgb(36, 36, 36);
  border-radius: 0 10px 10px 0;
}
</style>
