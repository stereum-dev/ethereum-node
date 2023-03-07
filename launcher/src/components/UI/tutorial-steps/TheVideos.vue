<template>
  <div class="video-parent">
    <div class="video-box">
      <iframe
        width="756"
        height="400"
        :src="url"
        title="YouTube video player"
        frameborder="1"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    videoUrl: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      url: "",
    };
  },

  mounted() {
    this.url = this.videoUrl;
  },
};
</script>
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
.video-box {
  width: 756px;
  height: 400px;
  border: 3px solid rgb(189, 189, 189);
  display: flex;
  justify-content: center;
  align-items: center;
}
iframe {
  width: 100%;
  height: 100%;
}
</style>
