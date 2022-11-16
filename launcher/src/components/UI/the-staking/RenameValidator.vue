<template>
  <div class="renameRow">
    <div class="inputBox">
      <input
        type="text"
        v-model="newName"
        :placeholder="$t('renameValidator.textPlaceHolder')"
      />
    </div>
    <div class="buttonBox">
      <button class="cancelBtn" @click="$emit('closeRename', item)">
        <img src="/img/icon/the-staking/close.png" alt="icon" />
      </button>
      <button
        class="confirmBtn"
        :class="{ disabled: newName.trim().length === 0 }"
        @click="checkEnteredName"
      >
        <img src="/img/icon/the-staking/done.png" alt="icon" />
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
  width: 85%;
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
  background-color: #3f4551;
  border: 1px solid #464b57;
  border-radius: 35px 0 0 35px;
  color: #dfdfdf;
  font-size: 0.8rem;
  font-weight: 500;
}
.inputBox input:focus {
  outline: none;
}
.buttonBox {
  width: 15%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.confirmBtn {
  width: 60%;
  height: 100%;
  border-radius: 0 35px 35px 0;
  background-color: #2e333d;
  border: 1px solid #464b57;
  cursor: pointer;
  padding: 2px auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
.cancelBtn {
  width: 40%;
  height: 100%;
  padding: 2px auto;
  /* border-radius: 0 35px 35px 0; */
  background-color: #2e333d;
  border: 1px solid #464b57;
  border-right: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
.confirmBtn img {
  width: 45%;
}
.cancelBtn img {
  width:50%;
}
.confirmBtn:focus,
.cancelBtn:focus {
  outline: none;
}
.confirmBtn:hover {
  background-color: #21252e;
  transition-duration: 0.2s;
}
.cancelBtn:hover {
  background-color: #21252e;
  transition-duration: 0.2s;
}
.confirmBtn:hover img,
.cancelBtn:hover img {
  transform: scale(1.2);
  transition-duration: 0.4s;
}
.confirmBtn:active img,
.cancelBtn:active img {
  transform: scale(1);
  transition-duration: 0.2s;
}
.disabled {
  opacity: 0.7;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
