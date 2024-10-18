<template>
  <div class="no-data_box flex justify-center items-center w-full h-full absolute text-blue-300">
    <span class="big-sign flex justify-center items-center w-full h-full uppercase text-xl font-semibold">
      &gt; {{ $t("noData.noData") }} &lt;
    </span>
  </div>
</template>
<script setup></script>

<style scoped>
.big-sign {
  animation: blink 1s linear infinite;
  text-shadow: rgb(86, 202, 234) 1px 0 4px;
}
.bottom-part {
  width: 100%;
  height: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
}
.comment-part {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 68%;
  height: 100%;
  text-transform: uppercase;
}
.comment-row1 {
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 55%;
  font-weight: 500;
}
.comment-row2 {
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 50%;
  font-weight: 700;
}
.icon-part {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30%;
  height: 100%;
}
.icon-part img {
  width: 70%;
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
