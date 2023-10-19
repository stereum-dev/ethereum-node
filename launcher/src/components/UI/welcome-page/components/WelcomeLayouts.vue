<template>
  <div class="box-border w-screen h-screen border-2 border-slate-500 rounded-lg bg-[#336666]">
    <div
      class="w-full h-full bg-no-repeat bg-center bg-contain bg-fixed grid grid-cols-24 grid-rows-12"
      style="background-image: url('/img/icon/stereum-logo/stereum-logo-2.png')"
    >
      <img
        id="logo"
        class="w-[74px] col-start-1 col-span-2 row-start-1 row-end-2 border-4 rounded-tr-[50px] rounded-br-[50px] rounded-bl-[50px] border-[#719d87] shadow-lg shadow-[#303232] z-10"
        src="/img/icon/LOGO.png"
        alt="Stereum Logo"
      />
      <slot></slot>
    </div>
  </div>
</template>
