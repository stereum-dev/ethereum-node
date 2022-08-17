<template>
  <section class="BtnInstIcon">
    <div
      class="imgIcon"
      @mouseover="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <img :src="url" v-if="isHovered" />
      <img :src="img" v-else />
    </div>
  </section>
</template>
<script>
export default {
  name: 'ButtonInstallation',
  props: ['img', 'url'],
  data () {
    return {
      isHovered: false
    }
  }
}
</script>
<style scoped>
.BtnInstIcon {
  width: 90%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}

.imgIcon {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.imgIcon img {
  width: 95%;
  resize: both;
  border-radius: 50px;
  border: 4px solid #6e8582;
  box-shadow: 0 1px 4px 1px rgb(60, 60, 60);
}

.text-color {
  color: #333 !important;
}
</style>
