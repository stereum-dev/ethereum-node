<template>
  <div class="containerLoli">
    <div class="loading-bar">
      <div class="loading-bar--progress">
        <span class="first"></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span class="last"></span>
      </div>
    </div>
    <p class="clickbait">
      <!-- <a href="#" onclick="javascript:history.go(0); return false;">Again!</a> -->
    </p>
  </div>
</template>

<style scoped>
.lollypop,
.clickbait,
.lollypop a,
.clickbait a,
.by-jasper a {
  text-decoration: none;
  color: rgba(131, 125, 217, 1);
}

.loading-bar {
  width: 90%;
  background: #cecece;

  border: 1px solid rgba(131, 125, 217, 1);
  border-radius: 6px;

  margin: auto;
}
.loading-bar--progress {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  align-content: center;
}
.loading-bar--progress span {
  margin: auto;
  background: rgba(131, 125, 217, 1);
  border-radius: 4px;
  flex-basis: 11%;
  flex-grow: 1;
  flex-shrink: 1;
  height: 10px;
  animation: FadeIn 0.5s ease;
  transition: all 1s cubic-bezier(0.17, 0.67, 0.88, 0.17);
}
.loading-bar--progress span:first-of-type {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}
.loading-bar--progress span:last-of-type {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

@keyframes FadeIn {
  0% {
    opacity: 0;
    transform: scale(0.1);
    background: rgba(131, 125, 217, 1);
    border-radius: 4px;
  }
  85% {
    opacity: 1;
    background: #837dd9;
    background: linear-gradient(
      180deg,
      rgba(131, 125, 217, 1) 0%,
      rgba(57, 55, 131, 1) 56%,
      rgba(9, 9, 121, 1) 100%
    );
    border-radius: 0;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }
  100% {
    transform: scale(1);
    background: #837dd9;
    background: linear-gradient(
      180deg,
      rgba(131, 125, 217, 1) 0%,
      rgba(57, 55, 131, 1) 56%,
      rgba(9, 9, 121, 1) 100%
    );
    border-radius: 0;
  }
}
.loading-bar--progress span:nth-child(1n) {
  animation-delay: 0.15s;
  animation-iteration-count: 1;
  animation-fill-mode: both;
}
.loading-bar--progress span:nth-child(2n) {
  animation-delay: 0.3s;
  animation-iteration-count: 1;
  animation-fill-mode: both;
}
.loading-bar--progress span:nth-child(3n) {
  animation-delay: 0.45s;
  animation-iteration-count: 1;
  animation-fill-mode: both;
}
.loading-bar--progress span:nth-child(4n) {
  animation-delay: 0.6s;
  animation-iteration-count: 1;
  animation-fill-mode: both;
}
.loading-bar--progress span:nth-child(5n) {
  animation-delay: 0.75s;
  animation-iteration-count: 1;
  animation-fill-mode: both;
}
.loading-bar--progress span:nth-child(6n) {
  animation-delay: 0.9s;
  animation-iteration-count: 1;
  animation-fill-mode: both;
}
.loading-bar--progress span:nth-child(7n) {
  animation-delay: 1.05s;
  animation-iteration-count: 1;
  animation-fill-mode: both;
}
.loading-bar--progress span:nth-child(8n) {
  animation-delay: 1.2s;
  animation-iteration-count: 1;
  animation-fill-mode: both;
}
.loading-bar--progress span:nth-child(9n) {
  animation-delay: 1.35s;
  animation-iteration-count: 1;
  animation-fill-mode: both;
}
.loading-bar--progress span:nth-child(10n) {
  animation-delay: 1.5s;
  animation-iteration-count: 1;
  animation-fill-mode: both;
}
.loading-bar--progress span:nth-child(11n) {
  animation-delay: 1.65s;
  animation-iteration-count: 1;
  animation-fill-mode: both;
}
.loading-bar--progress span:nth-child(12n) {
  animation-delay: 1.8s;
  animation-iteration-count: 1;
  animation-fill-mode: both;
}
.loading-bar--progress .first {
  border-top-left-radius: 4px !important;
  border-bottom-left-radius: 4px !important;
}
.loading-bar--progress .last {
  border-top-right-radius: 4px !important;
  border-bottom-right-radius: 4px !important;
}
</style>
