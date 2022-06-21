<template>
  <div class="video-parent">
    <div class="video-box">
      <iframe
        width="900"
        height="456"
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
  width: 90%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 20px;
  border-radius: 15px;
  z-index: 300;
}
</style>
