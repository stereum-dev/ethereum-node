<template>
  <div class="parentStorage">
    <div class="gauge-wrapper">
      <div class="gauge four rischio3">
        <div class="slice-colors">
          <div class="st slice-item"></div>
          <div class="st slice-item"></div>
          <div class="st slice-item"></div>
          <div class="st slice-item"></div>
        </div>
        <div class="needle"></div>
        <div class="gauge-center">
          <div class="label">625 GB FRER</div>
          <div class="number">STORAGE</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.parentStorage {
  width: 30%;
}
h1 {
  text-align: center;
}

.gauge-wrapper {
  width: auto;
  margin: 0 auto;
  padding: 20px 15px 15px;
}

.gauge {
  background: #e7e7e7;
  box-shadow: 0 -3px 6px 2px rgba(0, 0, 0, 0.5);
  width: 200px;
  height: 100px;
  border-radius: 100px 100px 0 0 !important;
  position: relative;
  overflow: hidden;
}
.gauge.min-scaled {
  transform: scale(0.5);
}

.gauge-center {
  content: "";
  color: #fff;
  width: 60%;
  height: 60%;
  background: #15222e;
  border-radius: 100px 100px 0 0 !important;
  position: absolute;
  box-shadow: 0 -13px 15px -10px rgba(0, 0, 0, 0.28);
  right: 21%;
  bottom: 0;
  color: #fff;
  z-index: 10;
}

.gauge-center .label,
.gauge-center .number {
  display: block;
  width: 100%;
  text-align: center;
  border: 0 !important;
}
.gauge-center .label {
  font-size: 0.75em;
  opacity: 0.6;
  margin: 1.1em 0 0.3em 0;
}
.gauge-center .number {
  font-size: 1.2em;
}

.needle {
  width: 80px;
  height: 7px;
  background: #15222e;
  border-bottom-left-radius: 100% !important;
  border-bottom-right-radius: 5px !important;
  border-top-left-radius: 100% !important;
  border-top-right-radius: 5px !important;
  position: absolute;
  bottom: -2px;
  left: 20px;
  transform-origin: 100% 4px;
  transform: rotate(0deg);
  box-shadow: 0 2px 2px 1px rgba(0, 0, 0, 0.38);
  display: none;
  z-index: 9;
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
}
.four.rischio4 .needle {
  animation: fourspeed4 2s 1 both;
  animation-delay: 2s;
  display: block;
}

.slice-colors {
  height: 100%;
}

.slice-colors .st {
  position: absolute;
  bottom: 0;
  width: 0;
  height: 0;
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

@-webkit-keyframes fourspeed1 {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(16deg);
  }
}

@-webkit-keyframes fourspeed2 {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(65deg);
  }
}

@-webkit-keyframes fourspeed3 {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(115deg);
  }
}

@-webkit-keyframes fourspeed4 {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(164deg);
  }
}
</style>
