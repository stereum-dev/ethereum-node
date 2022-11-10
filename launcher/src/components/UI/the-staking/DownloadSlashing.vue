<template>
  <div class="download-modal-parent">
    <div class="modal-opacity" @click="$emit('closeModal')"></div>
    <div class="downloadContent">
      <div class="title-box">
        <span>?</span>
      </div>
      <div class="downloadMessage">
        <p>{{ $t("removeSingleModal.question") }}</p>
        <p>{{ $t("removeSingleModal.description") }}</p>
      </div>
      <div class="download-box">
        <div class="download-btn" @click="$emit('download')">
          <span>{{ $t("removeSingleModal.btn") }}</span>
        </div>
        <span class="close">{{ $t("exitValidatorModal.clickClose") }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["item"],
  data() {
    return {};
  },
};
</script>

<style scoped>
.download-modal-parent {
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

.downloadContent {
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
  height: 30%;
  margin-top: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.title-box span {
  font-size: 4rem;
  font-weight: 900;
  color: #bfbfbf;
}

.downloadMessage {
  width: 95%;
  height: 45%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.downloadMessage p:first-child {
  width: 80%;
  height: 30%;
  color: #c1c1c1;
  font-size: .9rem;
  font-weight: 700;
  word-break: break-all;
  text-align: center;
}
.downloadMessage p:last-child {
  font-family: "Times New Roman", Times, serif;
  width: 80%;
  height: 80%;
  color: #c1c1c1;
  font-size: 1.1rem;
  font-weight: 700;
  word-break: break-all;
  text-align: center;
}

.download-box {
  width: 100%;
  height: 25%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  z-index: 502;
}
.download-btn {
  width: 30%;
  height: 50%;
  border-radius: 10px;
  border: 1px solid #093d05;
  background-color: #56bc37;
  box-shadow: 0 1px 3px 1px rgb(35, 59, 53);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 700;
  color: rgb(210, 210, 210);
  text-transform: uppercase;
}

.download-btn:hover {
  transform: scale(1.08);
  transition-duration: 150ms;
  box-shadow: 0 1px 5px 1px rgb(35, 59, 53);
}
.download-btn:active {
  transform: scale(1);
  box-shadow: none;
}
.close {
  color: rgba(136, 6, 6, 0.588);
  font-size: 0.65rem;
  font-weight: 500;
  align-self: center;
}
</style>
