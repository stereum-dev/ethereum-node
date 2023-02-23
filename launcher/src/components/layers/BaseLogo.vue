<template>
  <div class="logo-parent">
    <img :src="link" />
  </div>
</template>

<script>
export default {
  name: "BaseLogo",
  props: ["link"],
};
</script>

<style scoped>
.logo-parent {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
img {
  width: 90%;
  min-width: 40%;
  z-index: 0;
}
</style>
