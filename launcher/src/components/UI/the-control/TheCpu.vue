<template>
  <div class="theCpuParent">
    <div class="theCpuTtl"><span>CPU</span></div>
    <div class="cpuContentBox">
      <div class="cpuIco">
        <img src="../../../../public/img/icon/control/cpuIcon.svg" />
      </div>
      <div class="cpuCountPart">
        <div class="cpuUsage">
          <div class="circle">
            <span>{{ cpuValue }}%</span>
          </div>
          <div class="cpuProccessBarCont">
            <div class="cpuProccessBar">
              <div class="cpuProccessBar_value_bg">
                <div class="cpuProccessBar_value" :style="cpuVal"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="cpuTemp">
          <div class="circle">
            <span>{{ temp }}°</span>
          </div>
          <div class="cpuTempCont">
            <div class="cpuTempBar">
              <div class="cpuTemp_value_bg">
                <div class="cpuTemp_value" :style="verticalBar"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cpuValue: 100,
      temp: 100,
    };
  },
  computed: {
    verticalBar() {
      return { width: this.tVal() + "%" };
    },
    cpuVal() {
      return { width: this.cpuCoun() + "%" };
    },
  },
  methods: {
    tVal() {
      const SVal = 100 - this.temp;
      return SVal;
    },
    cpuCoun() {
      const cVal = 100 - this.cpuValue;
      return cVal;
    },
  },
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
.theCpuTtl {
  width: 98%;
  height: 20%;
  background: #33393e;
  border-radius: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
}
.theCpuTtl span {
  font-size: 50%;
  color: #eee;
  border: 1px solid rgb(27, 26, 26);
  width: 20%;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.cpuContentBox {
  width: 100%;
  height: 79%;
  display: flex;
  box-sizing: border-box;
}
.cpuIco {
  box-sizing: border-box;
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.cpuIco img {
  width: 70%;
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
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 50%;

  box-sizing: border-box;
}
.circle {
  width: 15%;
  font-size: 53%;
  background: #33393e;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: 1px solid #eee;
}
.cpuTempCont {
  width: 79%;
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
}
.cpuTempBar {
  width: 90%;
  background: #33393e;
  height: 40%;
  border: 1px solid #eee;
  display: flex;
  justify-content: center;
  align-items: center;
}
.cpuTemp_value_bg {
  width: 99%;
  background-image: linear-gradient(to right, blue, green, yellow, red);
  height: 88%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.cpuTemp_value {
  height: 100%;
  background: #33393e;
}
.cpuProccessBarCont {
  width: 79%;

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
  background-image: linear-gradient(to right, green 50%, yellow, red);
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
