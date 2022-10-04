<template>
  <div class="contributor-parent">
    <div class="contributor-avatar"><img :src="avatar" /></div>
    <div class="contributor-name">
      <span>{{ name }}</span>
    </div>
  </div>
</template>
<script>
export default {
  props: ["name", "avatar"],
};
</script>
<style scoped>
.contributor-parent {
  display: flex;
  width: 14rem;
  height: 3.2rem;
  justify-content: flex-start;
  align-items: center;
  border: 1px solid #343434;
  background: rgb(42, 42, 42);
  box-sizing: border-box;
  box-shadow: 1px 1px 10px 1px rgb(23, 23, 23);
  border-radius: 30px;
}
.contributor-avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25%;
  height: 100%;
}
.contributor-avatar img {
  width: 80%;
  border-radius: 40px;
}
.contributor-name {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 75%;
  height: 10%;
  font-size: 100%;
  font-weight: 400;
  color: #eee;
}
</style>
