<template>
  <div class="theCpuParent flex w-full h-full justify-center items-center">
    <div class="cpuIco w-1/3 h-full flex flex-col justify-center items-center">
      <div class="cpuIco-container flex justify-center items-center w-full h-4/5">
        <img class="w-3/4" src="/img/icon/control-page-icons/cpuIcon.svg" />
      </div>
      <span class="w-full h-1/5 flex justify-center items-center text-gray-200 text-2xs font-semibold uppercase">CPU</span>
    </div>
    <div class="cpuCountPart w-2/3 h-full flex flex-col justify-center items-center">
      <div class="cpuUsage flex justify-center items-center w-full h-1/2">
        <div class="cpuProccessBarCont w-[90%] h-full flex justify-center items-center">
          <div class="cpuProccessBar">
            <div class="cpuProccessBar_value_bg">
              <div class="cpuProccessBar_value" :style="getStyle" />
            </div>
          </div>
        </div>
      </div>
      <div class="cpuTemp flex justify-center items-center w-full h-1/2 text-gray-200 text-[90%] uppercase">
        <div class="cpuTemp-title flex justify-center items-center w-2/5 h-full">
          <span>{{ $t("controlPage.usage") }} :</span>
        </div>
        <div class="cpuTemp-value flex justify-center items-center w-2/5 h-full">
          <span>{{ cpu }} %</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useControlStore } from "@/store/theControl";
import { computed } from "vue";

const controlStore = useControlStore();

const cpu = computed(() => controlStore.cpu);

const getStyle = computed(() => {
  return { width: 100 - cpu.value + "%" };
});
</script>

<style scoped>
.cpuProccessBar {
  width: 90%;
  background: #33393e;
  height: 50%;
  border: 1px solid #33393e;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 1px 1px 11px 1px #1f1f1f;
}
.cpuProccessBar_value_bg {
  width: 99%;
  background-image: linear-gradient(to right, green 35%, yellow, red);
  height: 88%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-radius: 10px;
}
.cpuProccessBar_value {
  height: 100%;
  background: #33393e;
}
</style>
