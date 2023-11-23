<template>
  <div class="service-modal_parent">
    <div class="bg-dark" @click="$emit('closeWindow')"></div>
    <div class="browser-modal">
      <div class="obol_charon-header">
        <div class="icon-box">
          <img :src="obolSharonService.icon" alt="icon" />
        </div>
        <div class="title-box">
          <div class="service-name"><span>obol</span></div>
          <div class="service-option">
            <img src="/img/icon/service-icons/internet.png" alt="icon" @click="openBrowser" />
            <img src="/img/icon/service-icons/github1.png" alt="icon" @click="openGitHub" />
          </div>
        </div>
      </div>
      <div class="content">
        <div class="browserBox">
          <div class="title">
            <span>CREATE NEW ENR</span>
            <span>Generate a new ENR to use to create or join an existing cluster</span>
          </div>
          <div class="btn-box">
            <div class="btn">GENERATE</div>
          </div>
        </div>

        <div class="browserBox">
          <div class="import-title">
            <span>IMPORT EXISTING ENR</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "pinia";
import { useNodeHeader } from "@/store/nodeHeader";
export default {
  data() {
    return {
      obolSharonService: {},
      isprometheusAvailable: false,
    };
  },

  computed: {
    ...mapState(useNodeHeader, {
      runningServices: "runningServices",
    }),
  },
  mounted() {
    this.filterObolSharonService();
  },
  methods: {
    filterObolSharonService() {
      this.runningServices.forEach((item) => {
        if (item.name === "Obol Charon") this.obolSharonService = item;
      });
      this.isprometheusAvailable = true;
    },
    openBrowser() {
      let url = "https://obol.tech/";
      window.open(url, "_blank");
    },
    openGitHub() {
      let url = "https://github.com/ObolNetwork";
      window.open(url, "_blank");
    },
  },
};
</script>
<style scoped>
.service-modal_parent {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
}
.bg-dark {
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0);
  opacity: 0.5;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 102;
  cursor: default;
}
.browser-modal {
  width: 60%;
  height: 80%;
  background-color: #212122;
  border: 5px solid #a1a1a1;
  border-radius: 30px;
  position: absolute;
  top: 9%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  z-index: 105;
  cursor: default;
}

.obol_charon-header {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: nowrap;
  position: relative;
  z-index: 102;
  margin-top: 1.5%;
}
.icon-box {
  width: 20%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon-box img {
  width: 70%;
  height: 90%;
}
.title-box {
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.service-name {
  width: 100%;
  height: 45%;
  text-align: center;
  color: rgb(226, 226, 226);
  text-transform: uppercase;
  font-size: 1.6rem;
  font-weight: 600;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.service-option {
  width: 60%;
  height: 38%;
  border-top: 1px solid gray;
  border-bottom: 1px solid gray;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.service-option img {
  width: 8%;
  height: 72%;
  margin-right: 15px;
  cursor: pointer;
}
.content {
  width: 100%;
  height: 75%;
  margin-top: 2%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.browserBox {
  width: 95%;
  height: 30%;
  background-color: #393939;
  border: 1px solid #444444;
  box-shadow: 1px 1px 10px 1px #171717;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2%;
}
.browserBox .title {
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}
.title span:first-child {
  color: #dbdbdb;
  font-size: 0.9rem;
  font-weight: 600;
  margin-left: 10px;
  margin-top: 5px;
}
.title span:last-child {
  color: #dbdbdb;
  font-size: 0.65rem;
  font-weight: 400;
  margin-left: 10px;
  margin-top: 10px;
}
.import-title {
  width: 100%;
  height: 30%;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  align-self: flex-start;
}
.import-title span {
  color: #dbdbdb;
  font-size: 0.9rem;
  font-weight: 600;
  margin-left: 10px;
  margin-top: 5px;
}

.browserBox .btn-box {
  width: 30%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
}
.browserBox .btn {
  width: 90%;
  height: 35%;
  margin-top: 15px;
  margin-right: 10px;
  background-color: #192d31;
  text-decoration: none;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #2fe4ab;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  transition-duration: all 200ms;
}
.btn:hover {
  transition-duration: 100ms;
  background-color: rgba(26, 46, 50, 0.6);
}
.btn:active {
  transform: scale(0.9);
}
</style>
