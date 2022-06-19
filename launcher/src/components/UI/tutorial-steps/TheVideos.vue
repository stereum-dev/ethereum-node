<template>
  <div class="video-parent">
    <div class="video-box">
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/47N3XuVkBTQ"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</template>
<style scoped>
.video-parent {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
