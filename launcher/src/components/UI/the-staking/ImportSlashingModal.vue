<template>
  <div class="remove-modal-parent">
    <div class="modal-opacity" @click="$emit('removeModal')"></div>
    <div class="remove-modal-content" v-if="!importSlashingFile">
      <div class="title-box">
        <img
          src="../../../../public/img/icon/the-staking/stereum-error.png"
          alt="icon"
        />
      </div>
      <div class="removeMessage">
        <span>Do you want to import with a slashing protection database?</span>
      </div>
      <div class="slashingParent">
        <div class="pickSlashing">
          <label for="no" class="inline-flex items-center">
            <input
              class="form-radio"
              type="radio"
              id="no"
              value="no"
              v-model="picked"
            />
            NO
          </label>

          <label for="yes" class="inline-flex items-center">
            <input
              class="form-radio"
              type="radio"
              id="yes"
              value="yes"
              v-model="picked"
            />
            YES
          </label>
        </div>
        <!-- </Transition> -->
      </div>

      <!-- <div class="remove-box" :class="{ disabled: !disabledBtn }"> -->
      <div class="continue-box" :class="{ disabled: !disabledBtn }">
        <div
          class="continue-btn"
          @click.stop="
            $emit(
              'importSlashing',
              picked == 'yes' ? slashingDB.path : '',
              picked == 'yes' ? true : false
            )
          "
        >
          <span>Continue</span>
        </div>
      </div>
      <span class="close">{{ $t("exitValidatorModal.clickClose") }}</span>
    </div>
    <div class="remove-modal-content" v-if="importSlashingFile">
      <div class="title-box">
        <img
          class="folder-icon"
          src="../../../../public/img/icon/the-staking/folder.png"
          alt="icon"
        />
      </div>
      <div class="removeMessage">
        <span>Import your slashing database file.</span>
      </div>
      <div class="uploadBox" v-if="picked == 'yes'">
        <div class="upload-btn" @click="openFileUpload">
          <span>Choose File</span>
          <input
            type="file"
            @change="signalChangeHandler"
            style="display: none"
            ref="fileInput"
            accept="application/json"
          />
        </div>
        <div class="pathBox" v-if="slashingDB.name">
          <span class="fileName">{{ slashingDB.name }}</span>
        </div>
      </div>
      <!-- <div class="remove-box" :class="{ disabled: !disabledBtn }"> -->
      <div class="continue-box" :class="{ disabled: !disabledBtn }">
        <div
          class="continue-btn"
          @click.stop="
            $emit(
              'importSlashing',
              picked == 'yes' ? slashingDB.path : '',
              picked == 'yes' ? true : false
            )
          "
        >
          <span>Continue</span>
        </div>
      </div>
      <span class="close">{{ $t("exitValidatorModal.clickClose") }}</span>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      slashingDB: {},
      picked: "",
      path: "",
      disabledBtn: false,
      importSlashingFile: false,
    };
  },
  watch: {
    picked: function () {
      if (this.picked === "yes") {
        this.importSlashingFile = true;
      } else if (this.picked === "no") {
        this.disabledBtn = true;
      } else {
        this.disabledBtn = false;
      }
    },
    slashingDB: function () {
      if (this.slashingDB.name) {
        this.disabledBtn = true;
      }
    },
  },
  computed: {},
  methods: {
    openFileUpload() {
      this.$refs.fileInput.click();
    },
    signalChangeHandler(event) {
      this.slashingDB = event.target.files[0];
    },
  },
};
</script>
<style scoped>
.fileName {
  font-size: 1rem;
  font-weight: 500;
  color: rgb(210, 210, 210);
}
.remove-modal-parent {
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
  background-color: black;
  border-radius: 0 20px 0 0;
  position: fixed;
  left: 0;
  bottom: 0;
  opacity: 0.8;
  z-index: 501;
}
.remove-modal-content {
  width: 55%;
  height: 60%;
  border-radius: 75px;
  border: 3px solid #bfbfbf;
  position: absolute;
  top: 10%;
  left: 22%;
  background-color: #336666;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-shadow: 1px 1px 5px 1px rgb(6, 6, 6);
  z-index: 1000;
}
.title-box {
  width: 100%;
  height: 25%;
  margin-top: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.title-box img {
  width: 14%;
}
.title-box .folder-icon {
  width: 12%;
  height: 70%;
}
.removeMessage,
.uploadBox {
  width: 95%;
  height: 20%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.upload-btn {
  width: 30%;
  height: 40%;
  border-radius: 5px;
  border: 1px solid #128ff5;
  background-color: #128ff5;
  box-shadow: 0 1px 3px 1px rgb(40, 75, 66);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  color: rgb(210, 210, 210);
  text-transform: uppercase;
}
.upload-btn:hover {
  border: 1px solid #e6e7e8;
  color: rgb(236, 236, 236);
}
.upload-btn:active {
  transform: scale(0.95);
}
.uploadBox .pathBox {
  width: max-content;
  height: 40%;
  background-color: rgb(63, 68, 75);
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 0.8rem;
  font-weight: 500;
  color: rgb(210, 210, 210);
  display: flex;
  justify-content: center;
  align-items: center;
}
.removeMessage p {
  width: 85%;
  color: rgb(211, 211, 211);
  background-color: rgb(47, 51, 55);
  border: 1px solid rgb(211, 211, 211);
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 0.7rem;
  font-weight: 500;
  word-break: break-all;
  text-align: center;
}
.removeMessage span {
  color: rgb(197, 197, 197);
  font-size: 1rem;
  font-weight: 700;
  margin-top: 5px;
  text-align: center;
  text-transform: initial;
}
/* .removeMessage span {
    color: rgb(195, 195, 195);
    font-size: 1rem;
    font-weight: 700;
  } */

.slashingParent {
  width: 95%;
  height: 20%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.pickSlashing {
  width: 30%;
  height: max-content;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
}
.pickSlashing label {
  width: 30%;
  height: 40%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: rgb(209, 211, 210);
  font-size: 0.8rem;
  font-weight: 600;
  margin-top: 5px;
  text-align: center;
  text-transform: uppercase;
  cursor: pointer;
}
.pickSlashing label input {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}
.pickSlashing label input:hover {
  border: 2px solid rgb(17, 172, 255);
  border-radius: 100%;
}

.continue-box {
  width: 100%;
  height: 25%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 502;
}

.continue-btn {
  width: 30%;
  height: 40%;
  border-radius: 5px;
  border: 1px solid #229b63;
  background-color: #229b63;
  box-shadow: 0 1px 3px 1px rgb(51, 88, 78);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 700;
  color: rgb(210, 210, 210);
  text-transform: uppercase;
}

.continue-btn:hover {
  border: 1px solid #dfe3e1;
  transition-duration: 150ms;
  color: #dfe3e1;
}
.continue-btn:active {
  transform: scale(0.9);
  box-shadow: none;
}
.close {
  color: rgba(235, 95, 95, 0.931);
  font-size: 0.65rem;
  font-weight: 500;
  align-self: center;
}
.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
.deactivated {
  pointer-events: none;
  background-color: rgb(17, 17, 17);
  opacity: 0.3;
}
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>
