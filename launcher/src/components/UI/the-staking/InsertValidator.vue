<template>
  <div class="insertBox">
    <div class="insert-key" @click="openUploadHandler">
      <input
        ref="fileInput"
        type="file"
        style="display: none"
        multiple="true"
        accept="application/json"
        @change="signalChangeHandler"
      />
      <span>{{ $t("insertValidator.insertText") }}</span>
      <img class="black-key" src="../../../../public/img/icon/the-staking/white-key.svg" alt="icon" />
    </div>
  </div>
</template>
<script>
export default {
  props: ["services"],
  methods: {
    openUploadHandler() {
      let validator = this.services.filter((s) => s.service.includes("Validator"));
      if (validator && validator.map((e) => e.state).includes("running")) this.$refs.fileInput.click();
    },
    signalChangeHandler(event) {
      this.$emit("uploadFile", event);
    },
  },
};
</script>
<style scoped>
.insertBox {
  grid-column: 3/11;
  grid-row: 2/3;
  width: 100%;
  height: 40px;
  margin-top: 21px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
}
.insertBox .insert-key {
  width: 100%;
  height: 80%;
  margin: 0 auto;
  background-color: #17a2b8;
  border-radius: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.insertBox .insert-key img {
  width: 5%;
}
.insertBox .insert-key span {
  color: #eee;
  font-size: 100%;
  font-weight: 500;
  margin-right: 2%;
}
</style>
