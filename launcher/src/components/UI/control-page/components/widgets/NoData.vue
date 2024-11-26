<template>
  <div class="no-data_box text-blue-300">
    <span class="big-sign flex justify-center items-center w-full h-full uppercase text-xl font-semibold">
      &gt; {{ $t("noData.noData") }} &lt;
    </span>
  </div>
</template>
<script setup></script>

<style scoped>
.no-data_box {
  position: absolute;

  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 1; /* Ensure it’s not too high */
}
.big-sign {
  animation: blink 1s linear infinite;
  text-shadow: rgb(86, 202, 234) 1px 0 4px;
}
@keyframes blink {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}
</style>
