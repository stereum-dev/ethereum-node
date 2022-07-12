<template>
  <section class="item-parent">
    <div class="general-items">
      <div class="general-title">
        <span :style="color()">{{ title }}</span>
      </div>
      <div class="general-description">
        <p>{{ summary }}</p>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  props: ["title", "summary", "isRed"],
  data() {
    return {
      colorStyle: this.isRed,
    };
  },
  computed: {
    red() {
      return { color: "red" };
    },
  },
  methods: {
    color() {
      if (this.colorStyle === "1") {
        return this.red;
      }
    },
  },
};
</script>
<style scoped>
.general-items {
  width: 80%;
  height: 68%;
  background-color: #e8e8e8;
  border: 2px solid #e0e1e1;
  border-radius: 15px;
  justify-self: center;
  align-self: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: 0 1px 3px 1px #4b4b4b;
  overflow: hidden;
}
.general-items:hover {
  border: 2px solid #65baf3;
}
.general-title {
  width: 90%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.general-title span {
  font-size: 0.55rem;
  font-weight: 800;
  color: rgb(82, 82, 82);
}
.general-description {
  width: 90%;
  height: 80%;
}
.general-description p {
  font-size: 0.55rem;
  font-weight: 900;
  text-align: center;
  color: #2b6262;
}
</style>
