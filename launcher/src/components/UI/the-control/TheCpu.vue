<template>
  <div class="theCpuParent">
    <div class="cpuContentBox">
      <div class="cpuIco">
        <div class="cpuIco-container">
          <img src="../../../../public/img/icon/control/cpuIcon.svg" />
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
          <span>Usage: {{ cpu }} %</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'pinia';
import { useControlStore } from '../../../store/theControl';
export default {
  data() {
    return {
      cpuValue: null,
    };
  },
  computed: {
    ...mapState(useControlStore, {
      cpu: "cpu",
    }),
    getStyle(){
      return {width: (100-this.cpu)+'%'}
    }
  }
};
</script>

<style scoped>
.theCpuParent {
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
}
.cpuContentBox {
  width: 100%;
  height: 100%;
  display: flex;
  box-sizing: border-box;
}
.cpuIco {
  box-sizing: border-box;
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
}
.cpuCountPart {
  display: flex;
  width: 70%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}
.cpuUsage,
.cpuTemp {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50%;
  box-sizing: border-box;
  font-size: 70%;
  font-weight: bold;
  color: #eee;
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
  height: 40%;
  border: 1px solid #33393e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.cpuProccessBar_value_bg {
  width: 99%;
  background-image: linear-gradient(to right, green 35%, yellow, red);
  height: 88%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.cpuProccessBar_value {
  height: 100%;
  background: #33393e;
}
</style>
