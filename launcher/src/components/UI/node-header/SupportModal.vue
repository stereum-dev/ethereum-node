<template>
  <div class="support-modal-parent">
    <div class="modal-opacity" @click="$emit('closeMe')"></div>
    <div class="support-modal-content">
      <div class="content">
        <div class="supportBox">
          <div class="title">
            <span>{{ $t("supportModal.support") }}</span>
          </div>
          <div class="text">
            <p>
              {{ $t("supportModal.supportText") }}
            </p>
          </div>
          <div class="btnBox" @click="OpenStereumDiscord">
            <img
              src="../../../../public/img/icon/header-icons/support.png"
              alt=""
            />
          </div>
        </div>
        <div class="reportBox">
          <div class="title">
            <span>{{ $t("supportModal.bugReport") }}</span>
          </div>
          <div class="text">
            <p>
              {{ $t("supportModal.bugRepText") }}
            </p>
          </div>
          <div class="btnBox">
            <img
              @click="OpenStereumGithub"
              src="../../../../public/img/icon/header-icons/bug.png"
              alt=""
            />
          </div>
        </div>
      </div>
      <span class="email"
        >{{ $t("supportModal.emailText")
        }}<a href="mailto:support@stereum.net">support@stereum.net</a></span
      >
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    OpenStereumGithub() {
      let URL =
        "https://github.com/stereum-dev/ethereum-node/issues/new?assignees=&labels=bug&template=bug_report.md&title=BUG%3A+";
      window.open(URL, "_blank");
    },
    OpenStereumDiscord() {
      let URL = "https://discord.gg/DzAwgnSXtB";
      window.open(URL, "_blank");
    },
  },
};
</script>
<style scoped>
.support-modal-parent {
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
.support-modal-content {
  width: 55%;
  height: 55%;
  border-radius: 1rem;
  background-color: #363a41;
  background-color: #343434;
  border: 4px solid rgb(171, 170, 170);
  z-index: 312;
  opacity: 1;
  position: absolute;
  top: 13%;
  left: 18%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-shadow: 1px 1px 5px 1px rgb(6, 6, 6);
}

.content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
}

.content .supportBox,
.content .reportBox {
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.content .supportBox .title,
.content .reportBox .title {
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.title span {
  font-size: 1rem;
  font-weight: 800;
  color: #b0b0b0;
  text-transform: uppercase;
}
.content .supportBox .text,
.content .reportBox .text {
  width: 80%;
  height: 15%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.content .supportBox .text p,
.content .reportBox .text p {
  width: 100%;
  height: 100%;
  font-size: 0.6rem;
  font-weight: 500;
  color: #bfbfbf;
  padding: 0;
  margin: 0;
  text-align: center;
}
.content .supportBox .btnBox,
.content .reportBox .btnBox {
  width: 100%;
  height: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.content .supportBox .btnBox img,
.content .reportBox .btnBox img {
  width: 80%;
  cursor: pointer;
}
.content .supportBox .btnBox img:active,
.content .reportBox .btnBox img:active {
  transform: scale(0.98);
  transition-duration: 200ms;
}
.email {
  font-size: 0.6rem;
  font-weight: 500;
  color: #c6c6c6c6;
  text-align: center;
}
.email a {
  color: #83bbee;
  font-weight: 600;
}
.close {
  color: #bf3a3a;
  font-size: 0.6rem;
  font-weight: 400;
  align-self: center;
}
</style>
