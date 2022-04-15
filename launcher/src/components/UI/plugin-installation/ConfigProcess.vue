<template>
  <div class="config-parent">
    <background-page>
      <div class="opacity-bg"></div>

      <div class="config-modal-parent">
        <div class="config-modal">
          <div class="config-box">
            <div class="config-title-box">
              <div class="config-title">
                <span>CONFIGURATION</span>
              </div>
            </div>
          </div>
          <div class="content-box">
            <div class="loading-container" v-if="isLoading">
              <div class="preparation-node" v-if="isNodePreparing">
                <span>Preparing Node</span>
                <span class="dot-flashing"></span>
              </div>
              <div class="prepared-node" v-if="isNodePrepared">
                <img
                  src="../../../../public/img/icon/check-mark/check-mark5.png"
                  alt="icon"
                />
                <span>Preparing Node Done!</span>
              </div>
              <div class="writing-config" v-if="isConfigWriting">
                <span>writing configuration</span
                ><span class="dot-flashing"></span>
              </div>
              <div class="config-done" v-if="isConfigDone">
                <img
                  src="../../../../public/img/icon/check-mark/check-mark5.png"
                  alt="icon"
                />
                <span>configuration done!</span>
              </div>
              <div class="starting-container" v-if="isContStarting">
                <span>starting containers</span>
                <span class="dot-flashing"></span>
              </div>
              <div class="started" v-if="isContStarted">
                <img
                  src="../../../../public/img/icon/check-mark/check-mark5.png"
                  alt="icon"
                />
                <span>containers started!</span>
              </div>
            </div>
            <div class="setup" v-if="isInstalled">
              <span>Installed Successfully!</span>
              <img
                src="../../../../public/img/icon/check-mark/check-mark1.png"
                alt="icon"
              />
            </div>
          </div>
          <div class="btn-box" v-if="isInstalled">
            <router-link :to="{ path: '/node' }">
              <button class="next-btn">DONE</button>
            </router-link>
          </div>
        </div>
      </div>
    </background-page>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import ControlService from "@/store/ControlService";
export default {
  data() {
    return {
      isInstalled: false,
      isLoading: true,
      isConfigWriting: false,
      isConfigDone: false,
      isContStarting: false,
      isContStarted: false,
      isNodePreparing: true,
      isNodePrepared: false,
    };
  },
  computed: {
    ...mapGetters({
      selectedPreset: "getSelectedPreset",
      installationPath: "getInstallationPath",
    }),
  },
  methods: {
    installation: async function () {
      console.log(await ControlService.prepareOneClickInstallation(this.installationPath));
      await new Promise((r) => setTimeout(r, 5000));
      this.isNodePreparing = false;
      this.isNodePrepared = true;
      this.isConfigWriting = true;
      console.log(await ControlService.writeOneClickConfiguration());
      await new Promise((r) => setTimeout(r, 5000));
      this.isConfigWriting = false;
      this.isConfigDone = true;
      this.isContStarting = true;
      console.log(await ControlService.startOneClickServices());
      await new Promise((r) => setTimeout(r, 5000));
      this.isContStarting = false;
      this.isContStarted = true;
      await new Promise((r) => setTimeout(r, 3000));
      this.isLoading = false;
      this.isInstalled = true;
    },
  },
  mounted() {
    this.installation();
  },
};
</script>
<style scoped>
.config-parent {
  display: flex;
  justify-content: center;
  align-items: center;
}
.opacity-bg {
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0);
  position: fixed;
  left: 0;
  top: 0;
  opacity: 0.7;
  z-index: 1;
}
.config-modal-parent {
  width: 80%;
  height: 75%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 11.2%;
  left: 10%;
  z-index: 2;
}
.config-modal {
  width: 70%;
  height: 95%;
  border: 1px solid rgba(38, 38, 38, 0.5);
  border-radius: 20px;
  background-color: #334b3e;
  display: grid;
  grid-template-columns: 30% 40% 30%;
  grid-template-rows: repeat(5, 20%);
}
.config-box {
  grid-column: 1/4;
  grid-row: 1/2;
  width: 95%;
  height: 90%;
  margin-top: 5px;
  justify-self: center;
  background-color: #8e8e8e;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 1px 4px 1px rgb(31, 47, 43);
}
.config-title-box {
  width: 96%;
  height: 80%;
  border-radius: 15px;
  background-color: #5b5b5b;
  display: flex;
  justify-content: center;
  align-items: center;
}
.config-title-box span {
  font-size: 2rem;
  font-weight: 900;
  color: #d7d7d7;
}

.content-box {
  grid-column: 1/4;
  grid-row: 2/5;
  width: 60%;
  height: 90%;
  justify-self: center;
  margin-top: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.setup {
  width: 90%;
  height: 90%;
  background-color: rgb(217, 217, 217);
  border: 4px solid rgb(106, 106, 106);
  border-radius: 30px;
  box-shadow: 0 1px 3px 1px rgb(26, 42, 36);
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.loading-container {
  width: 90%;
  height: 90%;
  background-color: rgb(217, 217, 217);
  border: 4px solid rgb(106, 106, 106);
  border-radius: 30px;
  box-shadow: 0 1px 3px 1px rgb(26, 42, 36);
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(5, 1fr);
}
.setup span {
  font-size: 1.2rem;
  font-weight: 800;
  color: rgb(45, 125, 73);
}
.setup img {
  width: 20%;
}
.preparation-node {
  grid-column: 1/7;
  grid-row: 2/3;
  margin: 0 auto;
  width: 70%;
  height: 100%;
  padding-left: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.prepared-node {
  width: 70%;
  grid-column: 1/7;
  grid-row: 2/3;
  height: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.writing-config {
  grid-column: 1/7;
  grid-row: 3/4;
  width: 70%;
  height: 100%;
  margin: 0 auto;
  padding-left: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.config-done {
  grid-column: 1/7;
  grid-row: 3/4;
  width: 70%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.starting-container {
  grid-column: 1/7;
  grid-row: 4/5;
  width: 70%;
  height: 100%;
  margin: 0 auto;
  padding-left: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.started {
  grid-column: 1/7;
  grid-row: 4/5;
  width: 70%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.writing-config span,
.config-done span,
.starting-container span,
.started span,
.preparation-node span,
.prepared-node span {
  font-size: 1rem;
  font-weight: 600;
  color: rgb(73, 73, 77);
  text-transform: capitalize;
}
.writing-config img,
.config-done img,
.starting-container img,
.started img,
.preparation-node img,
.prepared-node img {
  width: 10%;
}
.table-content::-webkit-scrollbar {
  width: 1px;
}

.btn-box {
  grid-column: 2/3;
  grid-row: 5/6;
  justify-self: center;
  width: 100%;
  height: 90%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.btn-box a {
  width: 95%;
  height: 90%;
  text-decoration: none;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.next-btn,
.back-btn {
  width: 55%;
  height: 60%;
  border: 2px solid rgb(125, 125, 125);
  border-radius: 20px;
  background-color: #336666;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 1px 2px 1px rgb(53, 62, 57);
  outline-style: none;
}
.next-btn:hover,
.back-btn:hover {
  background-color: #1a3535;
  box-shadow: 0 1px 4px 1px rgb(60, 60, 60);
}
.next-btn:active,
.back-btn:active {
  box-shadow: inset 1px 1px 5px 1px rgb(28, 36, 28);
  font-size: 0.8rem;
  outline-style: none;
}
.active {
  display: block;
}
.dot-flashing {
  position: relative;
  left: 15px;
  width: 5px;
  height: 5px;
  top: 4px;
  border-radius: 15px;
  background-color: #444444;
  color: #444444;
  animation: dotFlashing 1s infinite linear alternate;
  animation-delay: 0.5s;
}

.dot-flashing::before,
.dot-flashing::after {
  content: "";
  display: inline-block;
  position: absolute;
  top: 0;
}

.dot-flashing::before {
  left: -10px;
  width: 5px;
  height: 5px;
  border-radius: 15px;
  background-color: #363636;
  color: #3e3e3e;
  animation: dotFlashing 1s infinite alternate;
  animation-delay: 0s;
  text-align: left;
}

.dot-flashing::after {
  left: 10px;
  width: 5px;
  height: 5px;
  border-radius: 15px;
  background-color: #373737;
  color: #353535;
  animation: dotFlashing 1s infinite alternate;
  animation-delay: 1s;
}

@keyframes dotFlashing {
  0% {
    background-color: #3e8c74;
  }
  50%,
  100% {
    background-color: #ababab;
  }
}
</style>
