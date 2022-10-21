<template>
  <div class="insertBox">
    <div class="insert-key" @click="openUploadHandler">
      <input
        type="file"
        @change="signalChangeHandler"
        style="display: none"
        ref="fileInput"
        multiple="true"
        accept="application/json"
      />
      <span>{{ $t("insertValidator.insertText") }}</span>
      <img
        class="black-key"
        src="../../../../public/img/icon/the-staking/black-key.png"
        alt="icon"
      />
    </div>
  </div>
</template>
<script>
export default {
  props: ["services"],
  methods: {
    openUploadHandler() {
      let validator = this.services.filter((s) =>
        s.service.includes("Validator")
      );
      if (validator && validator.map((e) => e.state).includes("running"))
        this.$refs.fileInput.click();
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
  background-color: #bfbfbf;
  border-radius: 40px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  cursor: pointer;
}
.insertBox .insert-key img {
  width: 26px;
  height: 28px;
}
.insertBox .insert-key span {
  color: #3a3a3a;
  font-size: 1.1rem;
  font-weight: 700;
}
</style>
