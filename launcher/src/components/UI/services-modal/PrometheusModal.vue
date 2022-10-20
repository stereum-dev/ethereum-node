<template>
  <div class="service-modal_parent">
    <div class="bg-dark" @click="$emit('closeWindow')"></div>
    <div class="browser-modal">
      <div class="prometheus-header">
        <div class="icon-box">
          <img :src="prometheusService.icon" alt="icon" />
        </div>
        <div class="title-box">
          <span class="service-name">prometheus</span>
          <div class="service-option">
            <img
              src="/img/icon/service-icons/internet.png"
              alt="icon"
              @click="openBrowser"
            />
            <img
              src="/img/icon/service-icons/github1.png"
              alt="icon"
              @click="openGitHub"
            />
          </div>
        </div>
      </div>
      <div class="content">
        <div class="browserBox">
          <div class="title">
            <span>LOCAL APPLICATION</span>
            <span>Open up the service on your local machine</span>
          </div>
          <div class="btn-box">
            <a class="btn" :href="prometheusService.linkUrl" target="_blank"
              >OPEN IN BROWSER</a
            >
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
      prometheusService: {},
      isprometheusAvailable: false,
    };
  },
  mounted() {
    this.filterprometheusService();
  },
  computed: {
    ...mapState(useNodeHeader, {
      runningServices: "runningServices",
    }),
  },
  methods: {
    filterprometheusService() {
      this.runningServices.forEach((item) => {
        if (item.name === "Prometheus") this.prometheusService = item;
      });
      this.isprometheusAvailable = true;
    },
    openBrowser() {
      let url = "https://prometheus.io/";
      window.open(url, "_blank");
    },
    openGitHub() {
      let url = "https://github.com/prometheus/prometheus";
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

.prometheus-header {
  width: 100%;
  height: 20%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  position: relative;
  z-index: 102;
}
.icon-box {
  grid-column: 1;
  grid-row: 1;
  width: 100%;
  margin-top: -1px;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.icon-box img {
  margin: 10px 0 0 15px;
  width: 65%;
  height: 86%;
}
.title-box {
  grid-column: 1/5;
  margin-left: 85px;
  grid-row: 1;
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
}
.title-box span {
  width: 70%;
  height: 35%;
  text-align: center;
  color: rgb(226, 226, 226);
  text-transform: uppercase;
  font-size: 1.7rem;
  font-weight: 600;
}
.service-option {
  width: 60%;
  height: 35%;
  margin-left: 16px;
  border-top: 1px solid gray;
  border-bottom: 1px solid gray;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 10px;
}
.service-option img {
  width: 11%;
  height: 70%;
  cursor: pointer;
  margin-right: 15px;
}
.content {
  width: 100%;
  height: 70%;
  margin-top: 20px;
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
  box-shadow: 1px 1px 3px 1px #252525;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.browserBox .title {
  width: 50%;
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

.browserBox .btn-box {
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
}
.browserBox .btn {
  width: 50%;
  height: 35%;
  margin-top: 15px;
  margin-right: 10px;
  background-color: #f37625;
  text-decoration: none;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #e1e1e1;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  transition-duration: all 200ms;
}
.btn:hover {
  transition-duration: 100ms;
  background-color: rgb(179, 72, 0);
}
.btn:active {
  transform: scale(0.9);
}
</style>
