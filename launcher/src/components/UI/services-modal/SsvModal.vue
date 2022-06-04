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
          <span class="service-name">{{ service.serviceName }} NETWORK</span>
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
              >*Choose wisely! This can't be changed later!</span
            >
          </div>
          <div class="public-box">
            <span class="pub-title">OPERATOR PUBLIC KEY</span>
            <div class="pub-key">
              <input @click="logInput" type="text" :ref="pubKey" />
              <div class="copy-icon">
                <img src="/img/icon/service-icons/copy1.png" alt="icon" />
              </div>
            </div>
          </div>
          <div class="secret-box">
            <la class="secret-title">OPERATOR SECRET KEY</la>
            <div class="secret-key">
              <input @click="logInput" type="text" :ref="secretKey" />
              <div class="copy-icon">
                <img src="/img/icon/service-icons/copy1.png" alt="icon" />
              </div>
            </div>
            <span class="secret-warning"
              >*Please make sure to store and backup your operator secret key in
              a safe place.Do not share this key with anyone.</span
            >
          </div>
          <div class="btn-box">
            <div class="check-box">
              <label for="stored">
                <input type="checkbox" name="check" id="stored" />
                I have stored my private key
              </label>
            </div>
            <button class="register-btn">register</button>
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
    logInput() {
      console.log(this.$refs);
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

.ssv-container {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(6, 1fr);
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
}
.title-box {
  grid-column: 2/4;
  grid-row: 1;
  width: 100%;
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
  font-size: 1.8rem;
  font-weight: 600;
}
.service-option {
  width: 70%;
  height: 35%;
  border-top: 1px solid gray;
  border-bottom: 1px solid gray;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.service-option img {
  width: 13%;
  height: 70%;
  margin-left: 8px;
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
  background-color: #313131;
  border: 2px solid #e1e1e1;
  border-radius: 10px;
  margin: 5px auto 3px auto;
  box-shadow: 1px 1px 3px 1px rgb(19, 19, 19);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition-duration: all 200ms;
}
.pub-key input,
.secret-key input {
  width: 95%;
  height: 30px;
  padding-left: 10px;
  border: none;
  background-color: #e1e1e1;
  outline-style: none;
  border-radius: 8px 0 0 8px;
  font-size: 0.5rem;
  font-weight: 500;
  color: #1b1b1b;
}
.pub-key .copy-icon,
.secret-key .copy-icon {
  width: 5%;
  height: 100%;
  border-radius: 0 10px 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.pub-key .copy-icon img,
.secret-key .copy-icon img {
  width: 20px;
  height: 20px;
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
.btn-box {
  width: 100%;
  height: 40%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.btn-box label {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.7rem;
  font-weight: 400;
  color: rgb(237, 70, 70);
}
.btn-box button {
  width: 30%;
  height: 40px;
  margin-top: 10px;
  outline-style: none;
  border-radius: 10px;
  box-shadow: inset 2px 2px 10px #ebebeb, 1px 1px 3px 1px rgb(19, 19, 19);
  border: 2px solid #60bcee;
  background-color: #d6dde1;
  color: #0b81c0;
  font-size: 1.2rem;
  font-weight: 800;
  cursor: pointer;
  text-transform: uppercase;
  transition-duration: 200ms;
}
.btn-box button:hover {
  color: rgb(50, 50, 50);
  border: 1px solid #d6dde1;
  background-color: #60bcee;
  transition-duration: 200ms;
}
.btn-box button:active {
  font-size: 1.18rem;
  border: 1px solid #0f7db8;
  box-shadow: inset 2px 2px 10px #10232d;
  transition-duration: 200ms;
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
}

.network-icon img {
  width: 90%;
  height: 90%;
}
</style>
