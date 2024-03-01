<template>
  <div class="theCpuParent">
    <div class="cpuContentBox">
      <div class="cpuIco">
        <div class="cpuIco-container">
          <img src="/img/icon/control-page-icons/cpuIcon.svg" />
        </div>
        <span>CPU</span>
      </div>
      <div class="cpuCountPart">
        <div class="cpuUsage">
          <div class="cpuProccessBarCont">
            <div class="cpuProccessBar">
              <div class="cpuProccessBar_value_bg">
                <div class="cpuProccessBar_value" :style="getStyle"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="cpuTemp">
          <div class="cpuTemp-title">
            <span>{{ $t("controlPage.usage") }} :</span>
          </div>
          <div class="cpuTemp-value">
            <span>{{ cpu }} %</span>
          </div>
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
.theCpuParent {
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.cpuContentBox {
  width: 100%;
  height: 100%;
  display: flex;
}
.cpuIco {
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.cpuIco-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80%;
}
.cpuIco img {
  width: 75%;
  height: 80%;
}
.cpuIco span {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 60%;
  font-weight: bold;
  color: #c1c1c1;
}
.cpuCountPart {
  display: flex;
  width: 70%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.cpuUsage,
.cpuTemp {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50%;
  font-size: 90%;
  font-weight: bold;
  color: #eee;
  color: #c1c1c1;
  text-transform: uppercase;
}
.cpuProccessBarCont {
  width: 90%;
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
}
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
.cpuTemp-title,
.cpuTemp-value {
  width: 40%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
