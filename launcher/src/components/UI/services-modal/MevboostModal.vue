<template>
  <div class="service-modal_parent">
    <div class="bg-dark" @click="$emit('closeWindow')"></div>
    <div class="browser-modal">
      <div class="mev-header">
        <div class="icon-box">
          <img :src="mevService.icon" alt="icon" />
        </div>

        <div class="title-box">
          <span class="service-name">Flashbots Mev Boost</span>
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
        <div class="relaysParent" v-if="showRelaysBox">
          <div class="relaysBoxTitle">AVAILABLE BLOCK RELAYS</div>
          <div class="relaysBox">
            <div class="relaysBoxContent">
              <div class="relay" v-for="relay in relaysList" :key="relay.id">
                <input
                  type="checkbox"
                  :id="relay.id"
                  :value="relay"
                  v-model="checkedRelays"
                />
                <label :for="relay.id">{{ relay.name }}</label>
              </div>
            </div>
          </div>
        </div>
        <div class="browserBox" v-else>
          <div class="title">
            <span>Block relay</span>
            <p>Select one or multiple relays to receive blocks from.</p>
          </div>
          <div class="btn-box">
            <span class="openBtn" @click="displayRelaysBlock">OPEN</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapWritableState } from "pinia";
import { useNodeManage } from "@/store/nodeManage";
import { useServices } from "@/store/services";
export default {
  data() {
    return {
      mevService: {},
      isMevAvailable: false,
      showRelaysBox: false,
    };
  },
  mounted() {
    this.filtermevService();
  },
  computed: {
    ...mapState(useServices, {
      allServices: "allServices",
    }),
    ...mapWritableState(useNodeManage, {
      relaysList: "relaysList",
      checkedRelays: "checkedRelays",
    }),
  },
  methods: {
    filtermevService() {
      this.allServices.forEach((item) => {
        if (item.name === "Flashbots Mev Boost") this.mevService = item;
      });
      this.isMevAvailable = true;
    },
    openBrowser() {
      let url = "https://www.mevboost.org/";
      window.open(url, "_blank");
    },
    openGitHub() {
      let url = "https://github.com/mev/mev";
      window.open(url, "_blank");
    },
    displayRelaysBlock() {
      this.showRelaysBox = true;
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
  background-color: #1b1c20;
  border: 5px solid rgb(161, 161, 161);
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

.mev-header {
  width: 100%;
  height: 20%;
  margin-top: 7px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  position: relative;
  z-index: 102;
}

.icon-box {
  grid-column: 1/2;
  grid-row: 1;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-box img {
  margin-left: 10px;
  width: 82%;
  height: 90%;
}

.title-box {
  grid-column: 2/7;
  grid-row: 1;
  width: 90%;
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
}

.title-box span {
  width: max-content;
  height: 45%;
  text-align: center;
  color: rgb(226, 226, 226);
  text-transform: uppercase;
  font-size: 1.7rem;
  font-weight: 600;
}

.service-option {
  width: 60%;
  height: 45%;
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
  height: 75%;
  margin-right: 15px;
  cursor: pointer;
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
.relayscheck {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.browserBox {
  width: 95%;
  height: 30%;
  background-color: #32383e;
  border: 1px solid #32383e;
  box-shadow: 1px 1px 10px 1px #1b1c1c;
  border-radius: 10px;
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.browserBox .title {
  width: 75%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

.title span {
  color: #c4c4c4;
  font-size: 0.9rem;
  font-weight: 700;
  margin-left: 10px;
  margin-top: 5px;
  text-transform: uppercase;
}

.title p {
  color: #c8c8c8;
  font-size: 0.7rem;
  font-weight: 400;
  margin-left: 10px;
  margin-top: 10px;
}

.browserBox .btn-box {
  width: 25%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
}

.browserBox .useBtn {
  width: 80%;
  height: 35%;
  margin-top: 15px;
  margin-right: 10px;
  background-color: transparent;
  text-decoration: none;
  border: 1px solid rgb(40, 40, 41);
  border-radius: 50px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  cursor: pointer;
  color: #e1e1e1;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  transition-duration: all 200ms;
}

.btn-box .useBtn .circleOn {
  width: 12%;
  height: 40%;
  border-radius: 50%;
  background-color: #4eec76;
  box-shadow: 1px 1px 10px 1px #4eec76;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-box .useBtn .circleOff {
  width: 15%;
  height: 55%;
  border-radius: 50%;
  background-color: rgb(81, 81, 81);
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-box .useBtn .text {
  color: #e1e1e1;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.browserBox .openBtn {
  width: 80%;
  height: 35%;
  margin-top: 15px;
  margin-right: 10px;
  background-color: #227ee7;
  text-decoration: none;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #e1e1e1;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  transition-duration: all 200ms;
}

.openBtn:hover {
  transition-duration: 100ms;
  background-color: #1564be;
}

.openBtn:active {
  transform: scale(0.9);
}
.relaysParent {
  width: 90%;
  height: 95%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.relaysBox {
  width: 85%;
  height: 92%;
  padding: 2px;
  border: 1px solid #2b3439;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
}
.relaysBoxTitle {
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  font-size: 0.8rem;
  font-weight: 600;
  color: #aaaaaa;
}
.relaysBoxContent {
  width: 55%;
  height: 90%;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: auto;
}
.relaysBoxContent::-webkit-scrollbar {
  width: 5px;
}
.relaysBoxContent::-webkit-scrollbar-track {
  background: #23282b;
}
.relaysBoxContent::-webkit-scrollbar-thumb {
  background: #42a5de;
  border-radius: 5px;
}

.relaysBoxContent .relay {
  width: 80%;
  height: 12%;
  min-height: 35px;
  background-color: #32383e;
  border: 1px solid #22272a;
  border-radius: 5px;
  margin-top: 2px;
  padding: 3px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  cursor: pointer;
}
.relaysBoxContent .relay:hover {
  background-color: #404851;
  border: 1px solid #3b4246;
  transition-duration: 0.2s;
}
.relaysBoxContent .relay input {
  width: 9%;
  height: 60%;
  border-radius: 2px;
  background-color: rgb(81, 89, 96);
}
.relaysBoxContent .relay label {
  width: 80%;
  height: 100%;
  margin-left: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  font-size: 0.7rem;
  font-weight: 600;
  color: #aaaaaa;
  cursor: pointer;
}
</style>
