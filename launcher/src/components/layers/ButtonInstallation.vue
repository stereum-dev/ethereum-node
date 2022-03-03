<template>
  <section class="BtnInstIcon">
    <div id="title">
      <p>{{ title }}</p>
    </div>

    <div class="imgIcon">
      <img :src="img" />
    </div>
  </section>
</template>
<script>
export default {
  name: "ButtonInstallation",
  props: ["title", "img"],
};
</script>
<style scoped>
.BtnInstIcon {
  display: flex;
  flex-direction: column;
  align-self: center;
}

#title {
  border: 3px solid rgb(88, 86, 86);
  width: 97%;
  border-radius: 50px;
  background: #336666;
  font-size: 0.9rem;
  font-weight: bold;
}

#title p {
  margin: 1px;
  color: #eee;
}

.imgIcon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.imgIcon img {
  width: 95%;
  margin-top: 5pt;
  resize: both;
}
</style>
