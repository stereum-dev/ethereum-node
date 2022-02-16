<template>
  <div>
    <img :src="link" :class="mode" />
  </div>
</template>

<script>
export default {
  name: "BaseLogo",
  props: ["link"],
};
</script>

<style scoped>
img {
  width: 50%;
  min-width: 40%;
  opacity: 0.3;
}
</style>
