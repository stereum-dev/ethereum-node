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
            <img src="/img/icon/service-icons/internet.png" alt="icon" />
            <img src="/img/icon/service-icons/github1.png" alt="icon" />
            <img src="/img/icon/service-icons/discord.png" alt="icon" />
          </div>
        </div>
      </div>
      <div class="btn-box">
        <a class="btn" :href="prometheusService.linkUrl" target="_blank"
          >open default browser</a
        >
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "pinia";
import { useServices } from "@/store/services";
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
    ...mapState(useServices, {
      allServices: "allServices",
    }),
  },
  methods: {
    filterprometheusService() {
      this.allServices.forEach((item) => {
        if (item.name === "Prometheus") this.prometheusService = item;
      });
      this.isprometheusAvailable = true;
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
  background-color: #1b1b1b;
  border: 5px solid rgb(161, 161, 161);
  box-shadow: inset 2px 2px 15px rgb(0, 0, 0);
  border-radius: 30px;
  position: absolute;
  top: 11%;
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
  margin-right: 15px;
}

.btn-box {
  width: 100%;
  height: 70%;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  z-index: 103;
}
.btn-box .btn {
  width: 94%;
  height: 35px;
  margin-top: 20px;
  background-color: #f37625;
  text-decoration: none;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: rgb(59, 59, 59);
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  transition-duration: all 200ms;
}
.btn:active {
  box-shadow: inset 2px 2px 15px #1d130d;
  transform: scale(0.99);
}
.btn:hover {
  transition-duration: 100ms;
  color: rgb(218, 218, 218);
  border: 2px solid #f9b88d;
  box-shadow: none;
  background-color: rgb(230, 127, 58) 5;
}
</style>
