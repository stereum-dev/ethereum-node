<template>
  <div class="renameRow">
    <div class="inputBox">
      <input
        type="text"
        v-model="newName"
        :placeholder="$t('renameValidator.textPlaceHolder')"
      />
    </div>
    <div class="confirmBox">
      <button class="confirmBtn" @click="checkEnteredName">
        {{ $t("exitMultipleValidator.confirm") }}
      </button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data() {
    return {
      newName: "",
    };
  },
  methods: {
    checkEnteredName() {
      if (this.newName.trim().length > 0) {
        this.$emit("changeName", this.item, this.newName);
      } else {
        return false;
      }
    },
  },
};
</script>
<style scoped>
.renameRow {
  grid-column: 1/8;
  grid-row: 1;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #424d57;
  border-radius: 50px;
  position: absolute;
  z-index: 1000;
}

.inputBox {
  width: 80%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.inputBox input {
  width: 100%;
  height: 100%;
  padding: 0;
  padding-left: 10px;
  background-color: #7f8593;
  border: 1px solid #8e96a7;
  border-radius: 35px 0 0 35px;
  color: #dfdfdf;
  font-size: 0.8rem;
  font-weight: 500;
}
.inputBox input:focus {
  outline: none;
}
.confirmBox {
  width: 20%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.confirmBtn {
  width: 100%;
  height: 100%;
  border-radius: 0 35px 35px 0;
  background-color: #1277e3;
  border: 1px solid #1277e3;
  color: #dedede;
  font-size: 0.7rem;
  font-weight: 700;
  cursor: pointer;
  text-transform: uppercase;
}
.confirmBtn:focus {
  outline: none;
}
.confirmBtn:hover {
  border: 1px solid #a6c8ed;
  background-color: #0167d5;
  transition-duration: 0.2s;
}
.confirmBtn:active {
  background-color: #055ab4;
  font-size: 0.67rem;
}
</style>
