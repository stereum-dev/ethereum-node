<template>
  <div class="items" @click="openItem">
    <div class="title">
      <span :style="color()">{{ title }}</span>
    </div>
    <div class="description">
      <p>{{ summary }}</p>
    </div>
  </div>
</template>
<script>
export default {
  props: ["title", "summary", "isColor"],
  emits: ["open-item"],
  data() {
    return {
      colorStyle: this.isColor,
    };
  },
  computed: {
    red() {
      return { color: "red" };
    },
    green() {
      return { color: "green" };
    },
  },
  methods: {
    color() {
      if (this.colorStyle === "1") {
        return this.red;
      } else if (this.colorStyle === "2") {
        return this.green;
      }
    },
    openItem() {
      this.$emit("open-item");
    },
  },
};
</script>
<style scoped>
.items {
  width: 22%;
  height: 85%;
  background-color: #e8e8e8;
  border: 2px solid #e0e1e1;
  border-radius: 15px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 1px 3px 1px #4b4b4b;
  overflow: hidden;
}
.title {
  width: 95%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.title span {
  font-size: 60%;
  font-weight: bolder;
  color: rgb(82, 82, 82);
}
.description {
  width: 95%;
  height: 80%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
}
.description p {
  font-size: 60%;
  font-weight: bold;
  color: #2b6262;
}
.items:hover {
  border: 2px solid greenyellow;
}
</style>
