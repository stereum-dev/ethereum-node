<template>
  <div class="control-btn">
    <span :style="color()">{{ name }}</span>
  </div>
</template>
<script>

import { stringLiteral } from "@babel/types";

export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    isRed: {
      type: String,
      required: false,
      default: "0",
      validator: function (value) {
        return value === "1" || value === "0";
      },
    },
  },

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
  font-size: 0.8rem;
  font-weight: 600;
  color: rgb(239, 235, 235);
}
</style>
