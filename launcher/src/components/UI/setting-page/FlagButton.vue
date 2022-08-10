<template>
  <div class="flagBtn_parent" @click="setting">
    <slot></slot>
  </div>
</template>
<script>
export default {
  emits: ["setting"],
  methods: {
    setting() {
      this.$emit("setting");
    },
  },
};
</script>
<style scoped>
.flagBtn_parent {
  width: 20%;
  height: 12%;
  display: flex;
  border: 1px solid #343434;
  background: rgb(42, 42, 42);
  box-sizing: border-box;
  box-shadow: 1px 1px 10px 1px rgb(23, 23, 23);
  text-decoration: none;
  margin: 2%;
  border-radius: 30px;
  cursor: pointer;
}
.flagBtn_parent:hover,
.flagBtn_parent:active {
  background: #313131;
}
</style>
