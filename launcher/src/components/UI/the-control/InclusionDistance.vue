<template>
  <div class="parentGuage">
    <div class="guageTitle"><span>INCLUSION DISTANCE</span></div>
    <div class="guageBox">
      <div
        class="gauge four"
        :class="{
          rischio0: off,
          rischio2: good,
          rischio3: okay,
          rischio4: bad,
        }"
      >
        <div class="slice-colors">
          <div class="st slice-item"></div>
          <div class="st slice-item"></div>
          <div class="st slice-item"></div>
          <div class="st slice-item"></div>
        </div>
        <div class="needle"></div>
        <div class="gauge-center">
          <div class="str">{{ strIns }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // strIns has to wire for active comp.
      strIns: null,
      off: true,
      good: false,
      okay: false,
      bad: false,
    };
  },
  watch: {
    strIns(newValue, _) {
      if (newValue === null) {
        this.off = true;
        this.good = false;
        this.okay = false;
        this.bad = false;
      } else if (newValue === 0) {
        this.off = false;
        this.good = true;
        this.okay = false;
        this.bad = false;
      } else if (newValue === 1) {
        this.off = false;
        this.good = false;
        this.okay = true;
        this.bad = false;
      } else {
        this.off = false;
        this.good = false;
        this.okay = false;
        this.bad = true;
      }
    },
  },
};
</script>

<style scoped>
.parentGuage {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.guageTitle {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
  height: 20%;
  font-size: 30%;
  border: 2px solid #2a2a2a;
}
.guageBox {
  width: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
  height: 100%;
}
.str {
  border-radius: 5px;
  font-size: 60%;
  margin-bottom: 2%;
  font-weight: bold;
  background: #33393e;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40%;
  height: 80%;
}

.parentGuage {
  display: flex;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
}

.incTtl {
  background: #33393e;
  width: 90%;
  font-size: 50%;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.gauge {
  background: #e7e7e7;
  width: 75%;
  height: 80%;
  border-radius: 100px 100px 0 0 !important;
  position: relative;
  overflow: hidden;
}
.gauge.min-scaled {
  transform: scale(0.5);
}

.gauge-center {
  content: "";
  width: 60%;
  height: 60%;
  background: #336666;
  border-radius: 100px 100px 0 0 !important;
  position: absolute;
  box-shadow: 0 -13px 15px -10px rgba(0, 0, 0, 0.28);
  right: 21%;
  bottom: 0;
  color: rgb(183, 182, 182);
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.gauge-center .number {
  display: flex;
  flex-direction: column;
  width: 100%;
  text-align: center;
  border: 0 !important;
}
.gauge-center .number {
  font-size: 70%;
}

.needle {
  width: 40px;
  height: 2px;
  background: #15222e;
  border-bottom-left-radius: 100% !important;
  border-bottom-right-radius: 20% !important;
  border-top-left-radius: 100% !important;
  border-top-right-radius: 10px !important;
  position: absolute;
  bottom: 10%;
  left: -10%;
  transform-origin: 100% 4px;
  transform: rotate(0deg);
  box-shadow: 0 2px 2px 1px rgba(0, 0, 0, 0.38);
  display: none;
  z-index: 9;
}
.four.rischio0 .needle {
  display: block;
}

.four.rischio1 .needle {
  animation: fourspeed1 2s 1 both;
  animation-delay: 1s;
  display: block;
}
.four.rischio2 .needle {
  animation: fourspeed2 2s 1 both;
  animation-delay: 1s;
  display: block;
}
.four.rischio3 .needle {
  animation: fourspeed3 2s 1 both;
  animation-delay: 1s;
  display: block;
  left: -1% !important;
}
.four.rischio4 .needle {
  animation: fourspeed4 2s 1 both;
  animation-delay: 2s;
  display: block;
}

.slice-colors {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.slice-colors .st {
  position: absolute;
  bottom: 0;
  border: 50px solid transparent;
}

.four .slice-colors .st.slice-item:nth-child(2) {
  border-top: 50px #f1c40f solid;
  border-right: 50px #f1c40f solid;
  background-color: #1eaa59;
}

.four .slice-colors .st.slice-item:nth-child(4) {
  left: 50%;
  border-bottom: 50px #e84c3d solid;
  border-right: 50px #e84c3d solid;
  background-color: #e67e22;
}

@keyframes fourspeed1 {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(30deg);
  }
}

@keyframes fourspeed2 {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(70deg);
  }
}

@keyframes fourspeed3 {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(105deg);
  }
}

@keyframes fourspeed4 {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(170deg);
  }
}
</style>
