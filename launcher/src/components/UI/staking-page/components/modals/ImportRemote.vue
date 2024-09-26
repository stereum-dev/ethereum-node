<template>
  <staking-custom-modal main-title="Import Remote Key" height="450">
    <template #content>
      <div class="w-full col-start-1 col-span-full row-start-2 row-end-5 grid grid-cols-3 grid-rows-3 items-center overflow-hidden">
        <div class="w-full col-start-1 col-span-full row-start-1 row-end-3 flex justify-start items-center overflow-hidden">
          <img class="h-28 sliding-animation" src="/animation/staking/alice.gif" alt="Animation" />
        </div>
        <div class="w-full col-start-1 col-span-full row-start-3 row-span-1 flex justify-center items-center overflow-hidden p-2 space-x-1">
          <span class="text-md text-gray-200 text-center font-semibold">{{ $t("stakingPage.pleaseWait") }}</span>
        </div>
        <div
          class="w-full h-10 col-start-1 col-span-full row-start-4 row-span-1 flex justify-center items-center overflow-hidden p-2 space-x-1"
        >
          <span class="text-2xl text-amber-500 font-semibold">{{ $t("stakingPage.imp") }}</span>
          <span class="text-2xl text-amber-500 font-semibold dot1">.</span>
          <span class="text-2xl text-amber-500 font-semibold dot2">.</span>
          <span class="text-2xl text-amber-500 font-semibold dot3">.</span>
        </div>
      </div>
      <!-- <div
        class="w-full col-start-1 col-span-full row-start-3 row-end-6 overflow-hidden flex justify-center items-center"
      >
        <div class="w-2/3 h-fit flex flex-col justify-center items-center space-y-2">
          <span
            v-if="description"
            class="w-full max-h-28 overflow-x-hidden overflow-y-auto text-sm font-semibold text-left whitespace-pre-wrap break-all mx-2 px-6 py-2 bg-[#0d0d0e] rounded-md"
            :class="getDescriptionClass"
          >
            {{ description }}
          </span>
          <span
            v-if="details"
            class="w-9/12 text-md text-gray-300 font-semibold text-center whitespace-pre-wrap break-all mx-auto"
          >
            {{ details }}
          </span>
        </div>
      </div> -->
    </template>
  </staking-custom-modal>
</template>
<script setup></script>
<style scoped>
.sliding-animation {
  animation: slide-in-out 5s linear infinite;
}

@keyframes slide-in-out {
  0% {
    transform: translateX(-100%) translateY(-10px);
  }
  50% {
    transform: translateX(270px) translateY(10px);
  }
  100% {
    transform: translateX(580px) translateY(-10px);
  }
}
.dot1,
.dot2,
.dot3 {
  opacity: 0;
  animation: appear-and-disappear 1.5s infinite;
}

.dot1 {
  animation-delay: 0s;
}

.dot2 {
  animation-delay: 0.5s;
}

.dot3 {
  animation-delay: 1s;
}

@keyframes appear-and-disappear {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
