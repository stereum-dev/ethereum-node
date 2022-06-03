<template>
  <div class="service-modal_parent">
    <div class="bg-dark" @click="$emit('closeWindow')"></div>
    <div class="browser-modal">
      <div
        class="ssv-container"
        v-for="(service, idx) in ssvService"
        :key="idx"
      >
        <div class="icon-box">
          <img :src="service.icon" alt="icon" />
        </div>
        <div class="network-icon">
          <img
            src="/img/icon/click-installation/testnet-circle.png"
            alt="icon"
          />
        </div>
        <div class="title-box">
          <span class="service-name">{{ service.serviceName }}</span>
          <div class="service-option">
            <img src="/img/icon/service-icons/internet.png" alt="icon" />
            <img src="/img/icon/service-icons/github1.png" alt="icon" />
            <img src="/img/icon/service-icons/discord.png" alt="icon" />
          </div>
        </div>
        <div class="registration-box">
          <div class="operator-box">
            <span class="op-title">pick an operator name</span>
            <div
              class="operator"
              v-for="(operator, index) in operators"
              :key="index"
            >
              <span class="op-name">{{ operator.name }}</span>
            </div>
            <span class="op-warning"
              >Choose wisely! This can't be changed later!</span
            >
          </div>
          <div class="public-box">
            <span class="pub-title">OPERATOR PUBLIC KEY</span>
            <div class="pub-key">
              <input type="text" />
              <div class="copy-icon">
                <img src="/img/icon/service-icons/copy2.png" alt="icon" />
              </div>
            </div>
          </div>
          <div class="secret-box">
            <span class="secret-title">OPERATOR SECRET KEY</span>
            <div class="secret-key">
              <input type="text" />
              <div class="copy-icon">
                <img src="/img/icon/service-icons/copy1.png" alt="icon" />
              </div>
            </div>
            <span class="secret-warning"
              >Please make sure to store and backup your operator secret key in
              a safe place.Do not share this key with anyone.</span
            >
          </div>
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
      operators: "getTheOperators",
    }),
  },
  methods: {
    filterSsvService() {
      this.services.forEach((service) => {
        if (service.serviceName.toLowerCase() == "ssv") {
          this.ssvService.push(service);
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
.ssv-container {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(6, 1fr);
  z-index: 106;
  position: relative;
}
.icon-box {
  grid-column: 1;
  grid-row: 1;
  width: 85%;
  margin-top: 6px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon-box img {
  width: 80%;
  height: 93%;
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
.registration-box {
  grid-column: 1/5;
  grid-row: 2/7;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.operator-box,
.public-box,
.secret-box {
  width: 100%;
  height: 19%;
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.operator-box .op-title,
.public-box .pub-title,
.secret-box .secret-title {
  font-size: 0.8rem;
  font-weight: 400;
  color: rgb(209, 209, 209);
  text-transform: uppercase;
}
.operator-box .operator {
  width: 90%;
  height: 30px;
  background-color: #c3c2c2;
  border: 2px solid #f9f9f9;
  border-radius: 10px;
  margin: 5px auto 3px auto;
  box-shadow: inset 2px 2px 10px #ebebeb, 1px 1px 3px 1px rgb(19, 19, 19);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition-duration: all 200ms;
}
.public-box .pub-key,
.secret-box .secret-key {
  width: 90%;
  height: 30px;
  background-color: #c3c2c2;
  border: 2px solid #f9f9f9;
  border-radius: 10px;
  margin: 5px auto 3px auto;
  box-shadow: 1px 1px 3px 1px rgb(19, 19, 19);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition-duration: all 200ms;
}
.public-box .pub-key input,
.secret-box .secret-key input {
  width: 95%;
  height: 100%;
  padding-left: 10px;
  border: none;
  outline-style: none;
  border-radius: 10px 0 0 10px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #1b1b1b;
}
.pub-key .copy-icon,
.secret-key .copy-icon {
  width: 5%;
  height: 38px;
  background-color: #1b1b1b;
  border-radius: 0 10px 10px 0;
}
.pub-key .copy-icon img,
.secret-key .copy-icon img {
  width: 25px;
  height: 25px;
}
.operator-box .op-name {
  font-size: 1.3rem;
  font-weight: 800;
  color: rgb(33, 59, 56);
  text-transform: capitalize;
}
.operator-box .op-warning,
.secret-box .secret-warning {
  width: 90%;
  font-size: 0.5rem;
  font-weight: 400;
  color: rgb(208, 208, 208);
  text-transform: capitalize;
}

.network-icon {
  grid-column: 1/2;
  grid-row: 1/2;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 54%;
  top: 68%;
  z-index: 110;
}

.network-icon img {
  width: 90%;
  height: 90%;
}
</style>
