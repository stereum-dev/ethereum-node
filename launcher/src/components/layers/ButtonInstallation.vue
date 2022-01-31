<template>
  <section>
    <div id="title">
      <p>{{ title }}</p>
    </div>
    <div id="img">
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
#title {
  border: 3px solid grey;
  width: 97%;
  text-align: center;
  border-radius: 50px;
  padding: 0;
  height: auto;
  background: #336666;
  resize: both;
}
#title p {
  margin: 1px;
  font-weight: bold;
  color: #eee;
  font-size: 10pt;
}
#img {
  padding: 5px;
  height: auto;

  resize: both;
}
#img img {
  width: 95%;
  margin-top: 5pt;
  resize: both;
}
</style>
