<template>
  <div class="loading-container">
    <div class="loading-bar">
      <div class="progress-bar"></div>
    </div>
  </div>
</template>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.loading-bar {
  display: flex;
  height: 10px;
  width: 100%;
  max-width: 320px;
  box-shadow: inset 0px 0px 0px 1px #c8c8cd;
  border-radius: 50px;
  overflow: hidden;
}
@keyframes progress-animation {
  0% {
    width: 0%;
  }
  20% {
    width: 10%;
  }
  40% {
    width: 30%;
  }
  50% {
    width: 60%;
  }
  100% {
    width: 90%;
  }
}

.progress-bar {
  display: flex;
  height: 100%;
  width: 80%;
  background: #34a965;
  animation: progress-animation 5s ease-in-out;
}
</style>
