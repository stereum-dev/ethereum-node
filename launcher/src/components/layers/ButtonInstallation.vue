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
}
#title p {
  margin: 1px;
  font-size: 10pt;
  color: #eee;
  font-weight: bold;
}
#img img {
  width: 95%;
  margin-top: 5pt;
  resize: both;
  cursor: pointer;
}
</style>
