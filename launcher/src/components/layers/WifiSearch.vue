<template>
  <div class="wifi-symbol">
    <div class="wifi-circle first"></div>
    <div class="wifi-circle second"></div>
    <div class="wifi-circle third"></div>
    <div class="wifi-circle fourth"></div>
  </div>
</template>

<style scoped>
.wifi-symbol {
  display: block;
  width: 25px;
  height: 25px;
  transform: rotate(-45deg);
  position: relative;
}

.wifi-symbol .wifi-circle {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  display: block;
  width: 100%;
  height: 100%;
  font-size: 21.4285714286px; /* 150px / 7 */
  position: absolute;
  bottom: 6px;
  left: 3px;
  border-color: rgb(248, 246, 245);
  border-style: solid;
  border-width: 3px 3px 0 0;
  border-radius: 0 100% 0 0;
  -webkit-border-radius: 0 100% 0 0;
  border-radius: 0 100% 0 0;
  opacity: 0;
  -o-animation: wifianimation 3s infinite;
  -moz-animation: wifianimation 3s infinite;
  -webkit-animation: wifianimation 3s infinite;
  animation: wifianimation 3s infinite;
}

.wifi-symbol .wifi-circle.first {
  -o-animation-delay: 800ms;
  -moz-animation-delay: 800ms;
  -webkit-animation-delay: 800ms;
  animation-delay: 800ms;
}

.wifi-symbol .wifi-circle.second {
  width: 20px;
  height: 20px;
  -o-animation-delay: 400ms;
  -moz-animation-delay: 400ms;
  -webkit-animation-delay: 400ms;
  animation-delay: 400ms;
}

.wifi-symbol .wifi-circle.third {
  width: 15px;
  height: 15px;
}

.wifi-symbol .wifi-circle.fourth {
  width: 10px;
  height: 10px;
  opacity: 1;
  background-color: white;
  -o-animation: none;
  -moz-animation: none;
  -webkit-animation: none;
  animation: none;
}

@-o-keyframes wifianimation {
  0% {
    opacity: 0.4;
  }
  5% {
    opacity: 1;
  }
  6% {
    opacity: 0.5;
  }
  100% {
    opacity: 0.5;
  }
}

@-moz-keyframes wifianimation {
  0% {
    opacity: 0.4;
  }
  5% {
    opacity: 1;
  }
  6% {
    opacity: 0.5;
  }
  100% {
    opacity: 0.5;
  }
}

@-webkit-keyframes wifianimation {
  0% {
    opacity: 0.4;
  }
  5% {
    opacity: 1;
  }
  6% {
    opacity: 0.5;
  }
  100% {
    opacity: 0.5;
  }
}

@keyframes wifianimation {
  0% {
    opacity: 0.4;
  }
  5% {
    opacity: 1;
  }
  6% {
    opacity: 0.5;
  }
  100% {
    opacity: 0.5;
  }
}
</style>
