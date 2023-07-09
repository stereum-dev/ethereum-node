<template>
  <div class="warning-modal-paren">
    <div class="modal-opacity" @click="$emit('cancelWarning', item)"></div>
    <div class="warning-modal-content">
      <div v-if="displayWarningMessage" class="title-box">
        <img src="/img/icon/the-staking/stereum-error.png" alt="icon" />
      </div>
      <div v-if="displayWarningMessage" class="warningMessage">
        <p>
          {{ $t("resyncModal.message") }}
        </p>
      </div>
      <div v-else class="resyncBox">
        <div class="titleBox">
          <img src="/img/icon/plugin-menu-icons/resync.png" alt="icon" />
        </div>
        <div class="fast-sync">
          <div class="sync-header">
            <div class="headerTitle">
              <span>{{ $t("resyncModal.sync") }}</span>
            </div>
            <div class="headerContent">
              <img src="/img/icon/arrows/left-arrow.png" alt="icon" @click="changeTheOption" />
              <span v-if="genesisIsActive">{{ $t("resyncModal.gen") }}</span>
              <span v-if="checkPointIsActive">{{ $t("resyncModal.chkSync") }}</span>
              <img src="/img/icon/arrows/right-arrow.png" alt="icon" @click="changeTheOption" />
            </div>
          </div>
          <div class="content">
            <span v-if="genesisIsActive">{{ $t("resyncModal.syncMsg") }}</span>
            <div v-if="checkPointIsActive" class="inputBox">
              <input v-model="checkPointSync" type="text" />
            </div>
          </div>
        </div>
      </div>

      <div class="btnBox">
        <div v-if="displayWarningMessage" class="confirmBtn" @click="continueToResync">
          <span>{{ $t("resyncModal.cont") }}</span>
        </div>
        <div v-else class="confirmBtn" @click="$emit('confirmBtn', checkPointSync)">
          <span>{{ $t("resyncModal.resync") }}</span>
        </div>
      </div>
      <span class="close">{{ $t("resyncModal.close") }}</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      checked: null,
      isButtonDisabled: false,
      genesisIsActive: true,
      checkPointIsActive: false,
      displayWarningMessage: true,
      checkPointSync: "",
    };
  },
  computed: {
    isChecked: {
      // getter
      get: function () {
        return this.checked ? true : false;
      },
      // setter
      set: function (newValue) {
        this.checked = newValue;
      },
    },
  },
  methods: {
    changeTheOption() {
      if (this.genesisIsActive) {
        this.genesisIsActive = false;
        this.checkPointIsActive = true;
      } else {
        this.genesisIsActive = true;
        this.checkPointIsActive = false;
      }
    },
    continueToResync() {
      this.displayWarningMessage = false;
    },
  },
};
</script>
<style scoped>
.warning-modal-paren {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 10%;
  left: 0;
  z-index: 500;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-opacity {
  width: 100%;
  height: 91%;
  background-color: rgba(3, 3, 3, 0.745);
  border-radius: 0 35px 0 0;
  position: fixed;
  left: 0;
  bottom: 0;
  opacity: 0.5;
  z-index: 501;
}
.warning-modal-content {
  width: 55%;
  height: 60%;
  border-radius: 65px;
  border: 3px solid #bfbfbf;
  position: absolute;
  top: 10%;
  left: 22%;
  background-color: #33393e;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-shadow: 1px 1px 5px 1px rgb(6, 6, 6);
  z-index: 502;
}
.title-box {
  width: 100%;
  height: 30%;
  margin-top: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.title-box img {
  width: 20%;
  height: 100%;
}
.warningMessage {
  width: 95%;
  height: 50%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.warningMessage p {
  width: 90%;
  color: rgb(156, 156, 156);
  font-size: 0.9rem;
  font-weight: 600;
  word-wrap: break-word;
  text-align: justify;
  text-transform: uppercase;
}
.btnBox {
  width: 90%;
  height: 15%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  z-index: 502;
}

.btnBox .confirmBtn {
  width: 40%;
  height: 80%;
  border-radius: 10px;
  border: 1px solid #8f8f8f;
  background-color: #127a65;
  box-shadow: 0 1px 3px 1px rgb(35, 59, 53);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;
  color: rgb(210, 210, 210);
  text-transform: uppercase;
}
.disabled {
  opacity: 0.7;
  pointer-events: none;
}
.confirmBtn:hover {
  transform: scale(1.08);
  transition-duration: 150ms;
  box-shadow: 0 1px 5px 1px rgb(35, 59, 53);
}
.confirmBtn:active {
  transform: scale(1);
  box-shadow: none;
}
.resyncBox {
  width: 100%;
  height: 85%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.resyncBox .titleBox {
  width: 100%;
  height: 30%;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.resyncBox .titleBox img {
  width: 13%;
  height: 90%;
}
.resyncBox .fast-sync {
  width: 90%;
  height: 40%;
  background-color: #2a2e30;
  border-radius: 10px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.fast-sync .sync-header {
  width: 100%;
  height: 34%;

  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}
.fast-sync .sync-header .headerTitle {
  width: 45%;
  height: 100%;
  border-radius: 15px 0 0 15px;
  background-color: #127a65;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.headerTitle span {
  width: 86%;
  font-size: 0.9rem;
  font-weight: 600;
  color: #c4c4c4;
  text-align: center;
  margin-right: 3px;
}
.fast-sync .sync-header .headerContent {
  width: 55%;
  height: 100%;
  border-radius: 0;
  padding: 0 5px;
  background-color: #232427;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}
.headerContent span {
  width: 86%;
  font-size: 0.9rem;
  font-weight: 600;
  color: #c4c4c4;
  text-align: center;
  margin-right: 3px;
}
.headerContent img {
  width: 5%;
  height: 50%;
  cursor: pointer;
}
.fast-sync .content {
  width: 100%;
  height: 64%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.fast-sync .content span {
  font-size: 0.9rem;
  font-weight: 600;
  color: #c4c4c4;
}
.fast-sync .content .inputBox {
  width: 96%;
  height: 60%;
  background-color: rgb(209, 209, 209);
  border: 5px solid rgb(104, 104, 104);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}
.fast-sync .content input {
  width: 100%;
  height: 100%;
  background-color: rgb(209, 209, 209);
  border: none;
  border-radius: 6px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 0.9rem;
  font-weight: 600;
  color: #232323;
  padding: 0;
  padding-left: 7px;
  padding-bottom: 3px;
}
.close {
  color: rgba(186, 71, 71, 0.826);
  font-size: 0.6rem;
  font-weight: 500;
  align-self: center;
}
</style>
