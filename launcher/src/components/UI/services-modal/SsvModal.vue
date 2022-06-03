<template>
  <div class="service-modal_parent">
    <div class="bg-dark" @click="$emit('closeWindow')"></div>
    <div class="browser-modal">
      <div
        class="grafana-container"
        v-for="(service, idx) in ssvService"
        :key="idx"
      >
        <div class="icon-box">
          <img :src="service.icon" alt="icon" />
        </div>
        <div class="title-box">
          <span class="service-name">{{ service.serviceName }}</span>
          <div class="service-option">
            <img src="/img/icon/service-icons/internet.png" alt="icon" />
            <img src="/img/icon/service-icons/github1.png" alt="icon" />
            <img src="/img/icon/service-icons/discord.png" alt="icon" />
          </div>
        </div>
        <div class="btn-box">
          <a class="btn" :href="service.linkUrl" target="_blank"
            >open default browser</a
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      ssvService: [],
      isSsvAvailable: false,
    };
  },
  created() {
    this.filterSsvService();
  },
  computed: {
    ...mapGetters({
      services: "getServiceIcons",
      runningServices: "getRunningServices",
    }),
  },
  methods: {
    filterSsvService() {
      this.services.forEach((service) => {
        if (service.serviceName.toLowerCase() == "ssv") {
          this.ssvService.push(service);
          console.log(this.ssvService);
        }
      });
      this.isSsvAvailable = true;
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
}
.browser-modal {
  width: 60%;
  height: 80%;
  background-color: #1b1b1b;
  border: 5px solid rgb(161, 161, 161);
  box-shadow: inset 2px 2px 15px rgb(0, 0, 0);
  border-radius: 35px;
  position: absolute;
  top: 11%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  z-index: 103;
}
grafana-modal {
  z-index: 105;
}
.grafana-container {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  z-index: 106;
}
.icon-box {
  grid-column: 1;
  grid-row: 1;
  padding: 10px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon-box img {
  width: 90%;
  height: 90%;
  z-index: 110;
}
.title-box {
  grid-column: 2/4;
  grid-row: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.title-box span {
  color: rgb(226, 226, 226);
  text-transform: uppercase;
  font-size: 1.5rem;
  font-weight: 600;
}
.service-option {
  width: 90%;
  height: 50%;
  border-top: 1px solid gray;
  border-bottom: 1px solid gray;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.service-option img {
  width: 20%;
  height: 70%;
}

.btn-box {
  grid-column: 1/5;
  grid-row: 3;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn-box .btn {
  width: 70%;
  height: 40px;
  background-color: #f37625;
  text-decoration: none;
  border: 2px solid #f9b88d;
  border-radius: 10px;
  box-shadow: inset 1px 1px 5px #fac7a5;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  transition-duration: all 200ms;
}
.btn:active {
  box-shadow: inset 2px 2px 15px #1d130d;
  color: rgb(218, 218, 218);
}
.btn:hover {
  border: 2px solid #f9b88d;
  box-shadow: none;
  background-color: rgb(230, 127, 58) 5;
}
</style>
