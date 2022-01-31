<template>
  <div>
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
img {
  width: 50%;
  min-width: 60%;
}
</style>
