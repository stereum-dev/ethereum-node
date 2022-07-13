<template>
  <div class="control-btn" @click="openCont">
    <span :style="color()">{{ name }}</span>
  </div>
</template>
<script>
export default {
  emits: ["open-cont"],
  props: {
    name: {
      type: String,
      required: true,
    },
    isColor: {
      type: String,
      required: false,
      default: "0",
    },
  },

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
    openCont() {
      this.$emit("open-cont");
    },
  },
};
</script>
<style scoped>
.control-btn {
  width: 80%;
  height: 16%;
  border: 1px solid rgb(142, 142, 142);
  background-color: #0f3c3f;
  border-radius: 20px;
  margin-top: 5px;
  padding-top: 2px;
  cursor: pointer;
  box-shadow: 0 1px 3px 1px rgb(62, 61, 61);
  display: flex;
  justify-content: center;
  align-items: center;
}
.control-btn span {
  font-size: 70%;
  font-weight: 600;
  color: rgb(239, 235, 235);
}
.control-btn:hover,
.control-btn:focus {
  border: none;
}
</style>
