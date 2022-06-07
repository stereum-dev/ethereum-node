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
      </div>
      <div class="registration-box">
        <div class="operator-box">
          <span class="op-title">pick an operator name</span>
          <div class="operator" >
            <b-form-select
              v-model="selectedOperator"
              :options="operators"
              size="sm"
              value-field="operatorName"
              text-field="operatorName"
            ></b-form-select>
          </div>
          <span class="op-warning"
            >*Choose wisely! This can't be changed later!</span
          >
        </div>
        <div class="public-box">
          <span class="pub-title">OPERATOR PUBLIC KEY</span>
          <div class="pub-key">
            <input type="password" placeholder="Public Key" v-model="pubkey" />

            <div class="copy-icon">
              <img src="/img/icon/service-icons/copy1.png" alt="icon" />
              <span>copied!</span>
            </div>
          </div>
        </div>
        <div class="secret-box">
          <label class="secret-title">OPERATOR SECRET KEY</label>
          <div class="secret-key">
            <input type="password" v-model="secretkey" placeholder="Secret Key" />
            <div class="copy-icon">
              <img src="/img/icon/service-icons/copy1.png" alt="icon" />
              <span>copied!</span>
            </div>
          </div>
          <span class="secret-warning"
            >*Please make sure to store and backup your operator secret key in a
            safe place.Do not share this key with anyone.</span
          >
        </div>
        <div class="btn-box">
          <div class="check-box">
            <b-form-checkbox
              id="checkbox-1"
              name="checkbox-1"
              v-model="accepted"
              modelValue="accepted"
            >
              I have stored my private key
            </b-form-checkbox>
          </div>
          <button class="register-btn" @click="registerHandler">
            register
          </button>
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
      enteredText: "",
      selectedOperator: null,
      accepted: "",
      secretkey: "",
      pubkey: "",
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
    registerHandler() {
      console.log(this.secretkey);
      console.log(this.pubkey);
      // console.log(this.selected);
      // console.log(this.$refs.status.value);
    },
    logItem(event) {
      console.log(event.target);
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
  z-index: 100;
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
  z-index: 101;
}

.ssv-container {
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
  margin-top: 5px;
  height: 90%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.icon-box img {
  margin: 8px 10px;
  width: 58%;
  height: 86%;
}
.title-box {
  grid-column: 2/5;
  grid-row: 1;
  width: 90%;
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
.registration-box {
  width: 100%;
  height: 70%;
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  z-index: 103;
  
}
.operator-box,
.public-box,
.secret-box {
  width: 100%;
  height: 20%;
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  z-index: 1000;
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
  height: 63%;
  background-color: #313131;
  border-radius: 10px;
  padding:5px;
  display: flex;
  justify-content: center;
  align-items: center;
  
}
.operator select {
  width: 100%;
  border-radius: 8px;
  text-transform: uppercase;
  font-weight: 800;
  color: #0a4d38;
}

.public-box .pub-key,
.secret-box .secret-key {
  width: 90%;
  height: 37px;
  background-color: #313131;
  border-radius: 10px;
  box-shadow: 1px 1px 3px 1px rgb(19, 19, 19);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition-duration: all 200ms;

}
.pub-key input,
.secret-key input {
  width: 93%;
  height: 29px;
  padding-left: 10px;
  border: 2px solid #e1e1e1;
  background-color: #e1e1e1;
  outline-style: none;
  border-radius: 8px 0 0 8px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #1b1b1b;
  margin-left: 4px;
}

.pub-key input:hover,
.secret-key input:hover {
  border: 2px solid #1e9ffa;
}
.pub-key .copy-icon,
.secret-key .copy-icon {
  width: 5%;
  height: 100%;
  border-radius: 0 8px 8px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  transition-duration: 200ms;
}
.pub-key .copy-icon span,
.secret-key .copy-icon span {
  width: 35px;
  height: 13px;
  border-radius: 2px;
  border: 1px solid gray;
  background-color: #0a4d38;
  color: #e2e2e2;
  font-size: 8px;
  font-weight: 600;
  position: absolute;
  top: -24px;
  right: -27px;
  display: none;
  transition-duration: 200ms;
  text-align: center;
}
.pub-key .copy-icon:hover,
.secret-key .copy-icon:hover {
  background-color: rgb(73, 73, 73);
}
.pub-key .copy-icon:active,
.secret-key .copy-icon:active {
  background-color: rgb(22, 22, 22);
}
.pub-key .copy-icon:active span {
  display: block;
}
.secret-key .copy-icon:active span {
  display: block;
  transition-duration: 200ms;
}
.pub-key .copy-icon img,
.secret-key .copy-icon img {
  width: 20px;
  height: 20px;
  margin-right: 3px;
}
.operator-box .op-name {
  font-size: 1.3rem;
  font-weight: 800;
  color: rgb(39, 101, 94);
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
.check-box {
  width: 100%;
  height: 25px;
  padding-bottom: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.form-check-input {
  margin-bottom: 3px;
  cursor: pointer;
}
.form-check {
  width: 40%;
  height: 20px;
  padding-bottom: 5px;
  font-size: 0.9rem;
  margin-top: 2px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  color: rgb(226, 102, 102);
}

.btn-box button {
  width: 30%;
  height: 40px;
  margin-top: 10px;
  outline-style: none;
  border-radius: 10px;
  box-shadow: 1px 1px 3px 1px rgb(19, 19, 19);
  border: 2px solid #0b81c0;
  background-color: #d6dde1;
  color: #0b81c0;
  font-size: 1.2rem;
  font-weight: 800;
  cursor: pointer;
  text-transform: uppercase;
  transition-duration: 200ms;
}
.btn-box button:hover {
  color: rgb(253, 253, 253);
  border: 2px solid #d6dde1;
  background-color: #0e8fd4;
  transition-duration: 200ms;
}
.btn-box button:active {
  font-size: 1.18rem;
  border: 2px solid #0f7db8;
  background-color: #0b82c3;
  box-shadow: none;
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
  left: 41%;
  top: 52%;
}

.network-icon img {
  width: 73%;
  height: 73%;
}
</style>
