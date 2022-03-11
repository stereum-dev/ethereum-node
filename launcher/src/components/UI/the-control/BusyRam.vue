<template>
  <div class="loadParent">
    <p>USED RAM</p>
    <div class="spinner">
      <div class="rect1"></div>
      <div class="rect2"></div>
      <div class="rect3"></div>
      <div class="rect4"></div>
      <div class="rect5"></div>
      <div class="rect6"></div>
      <div class="rect7"></div>
      <div class="rect8"></div>
      <div class="rect9"></div>
      <div class="rect10"></div>
    </div>
  </div>
</template>

<style scoped>
.loadParent {
  width: 15%;
  border: 1px dotted red;
  box-sizing: border-box;
  margin: 1rem;
}
.loadParent p {
  font-weight: bold;
}

.spinner {
  height: 2rem;
  width: 100%;
  box-sizing: border-box;
}

.spinner > div {
  background-color: green;
  height: 100%;
  width: 5px;
  display: inline-block;
  margin: 2px;
  -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
  animation: sk-stretchdelay 1.2s infinite ease-in-out;
}

.spinner .rect2 {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}

.spinner .rect3 {
  -webkit-animation-delay: -1s;
  animation-delay: -1s;
}

.spinner .rect4 {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}

.spinner .rect5 {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}

.spinner .rect6 {
  -webkit-animation-delay: -0.7s;
  animation-delay: -0.7s;
}

.spinner .rect7 {
  -webkit-animation-delay: -0.6s;
  animation-delay: -0.6s;
}

.spinner .rect8 {
  background-color: yellow;
  -webkit-animation-delay: -0.5s;
  animation-delay: -0.5s;
}

.spinner .rect9 {
  background-color: yellow;
  -webkit-animation-delay: -0.4s;
  animation-delay: -0.4s;
}

.spinner .rect10 {
  background-color: red;
  -webkit-animation-delay: -0.3s;
  animation-delay: -0.3s;
}

@-webkit-keyframes sk-stretchdelay {
  0%,
  40%,
  100% {
    -webkit-transform: scaleY(0.4);
  }
  20% {
    -webkit-transform: scaleY(1);
  }
}

@keyframes sk-stretchdelay {
  0%,
  40%,
  100% {
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1);
    -webkit-transform: scaleY(1);
  }
}
</style>
