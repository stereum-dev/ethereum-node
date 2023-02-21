<template>
  <div class="remove-modal-parent">
    <div class="modal-opacity" @click="closeMe"></div>
    <div class="remove-modal-content" v-if="visible">
      <div class="title-box">
        <img src="../../../../public/img/icon/manage-node-icons/stop.png" />
      </div>
      <div class="remove-message">
        <!-- <span class="warning">{{ $t("removeModal.removeText") }}</span> -->
        <span class="warning"
          >ARE YOU SURE YOU WANT TO REMOVE STEREUM & ALL ITS SERVICES FROM THE
          SERVER?
        </span>
        <!-- <span class="question">{{ $t("removeModal.sure") }}</span> -->
      </div>
      <div class="remove-btn">
        <div class="yes-box" @click="removeItems">
          <!-- <span>{{ $t("removeMultiModal.remove") }}</span> -->
          <span>nuke the node</span>
        </div>
      </div>
      <span class="close">{{ $t("exitValidatorModal.clickClose") }}</span>
    </div>
    <div class="remove-modal-accepted" v-else>
      <div class="remove-modal-accepted_container">
        <div class="remove-modal-accepted_header">
          <span>nuke the node</span>
        </div>
        <div class="remove-modal-accepted_explode-box"></div>
        <div class="remove-modal-accepted_footer"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  emit: ["remove-items", "close-me"],
  data() {
    return {
      visible: true,
    };
  },
  methods: {
    removeItems() {
      this.visible = !this.visible;
      this.$emit("remove-items");
    },
    closeMe() {
      this.$emit("close-me");
    },
  },
};
</script>
<style scoped>
.remove-modal-parent {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 10%;
  left: 5%;
  z-index: 310;
}
.modal-opacity {
  width: 100%;
  height: 100%;
  background-color: black;
  position: fixed;
  left: 0;
  top: 0;
  opacity: 0.7;
  z-index: 311;
}
.remove-modal-content {
  width: 55%;
  height: 60%;
  border-radius: 75px;
  border: 3px solid #bfbfbf;
  position: absolute;
  top: 10%;
  left: 17%;
  background-color: #33393e;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-shadow: 1px 1px 5px 1px rgb(6, 6, 6);
  z-index: 502;
}
.remove-modal-accepted {
  width: 55%;
  height: 60%;
  border-radius: 75px;
  border: 3px solid #bfbfbf;
  position: absolute;
  top: 10%;
  left: 17%;
  background: repeating-linear-gradient(
    45deg,
    #fcd100,
    #fcd100 2%,
    #181b1d 2%,
    #181b1d 4%
  );
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 1px 1px 5px 1px rgb(6, 6, 6);
  z-index: 502;
}
.remove-modal-accepted_container {
  width: 95%;
  height: 95%;
  background: #33393e;
  border-radius: 75px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
}
.remove-modal-accepted_header {
  width: 40%;
  height: 12%;
  border: 2px solid #fcd100;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background: #181b1d;
  color: #fcd100;
  font-size: 120%;
  text-transform: uppercase;
  font-weight: 700;
  box-shadow: 1px 1px 7px 1px rgb(6, 6, 6);
  margin: 2% 0;
}
.remove-modal-accepted_explode-box {
  width: 80%;
  height: 55%;
  display: flex;
  border-top: 2px solid black;
  border-bottom: 2px solid black;
}
.remove-modal-accepted_footer {
  width: 100%;
  height: 25%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.title-box {
  width: 80%;
  height: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}
.title-box img {
  width: 25%;
  height: 100%;
}
.remove-message {
  width: 90%;
  height: 40%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.remove-message .warning {
  color: rgb(195, 195, 195);
  font-size: 1.3rem;
  font-weight: 800;
  text-transform: uppercase;
  align-items: center;
  text-align: center;
}
.remove-message .question {
  color: rgb(195, 195, 195);
  font-size: 1.2rem;
  font-weight: 600;
  text-transform: capitalize;
}
.remove-btn {
  width: 90%;
  height: 45%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.yes-box {
  width: 30%;
  height: 35px;
  border-radius: 10px;
  box-shadow: 0 1px 10px 1px rgb(16, 16, 16);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: repeating-linear-gradient(
    45deg,
    #fcd100,
    #fcd100 4%,
    #181b1d 4%,
    #181b1d 8%
  );
}
.yes-box span {
  font-size: 0.9rem;
  font-weight: 700;
  color: #fcd100;
  text-transform: uppercase;
  background: black;
  width: 95%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80%;
  border-radius: 10px;
}

.yes-box:hover {
  transform: scale(1.05);
  transition: all 100ms;
  color: #d6d6d6;
}

.yes-box:active {
  transform: scale(1);
  box-shadow: none;
}

.close {
  color: rgb(243, 74, 74);
  font-size: 0.7rem;
  font-weight: 500;
  align-self: center;
}
</style>
