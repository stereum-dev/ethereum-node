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
            <img src="/img/icon/service-icons/discord.png" alt="icon" @click="openDiscord" />
          </div>
        </div>
      </div>
      <div class="content">
        <div v-if="!generatorPlugin" class="wrapper">
          <div class="browserBox">
            <div class="title">
              <span>{{ !continueForExistENR ? "CREATE NEW ENR" : "OPEN OBOL LAUNCHPAD" }}</span>
              <span>{{
                !continueForExistENR
                  ? "Generate a new ENR to use to create or join an existing cluster"
                  : "Create/join an Obol Cluster solo or with a group using the Distributed Validator Launchpad."
              }}</span>
            </div>
            <div class="btn-box">
              <div class="btn" @click="topBlock">
                {{ !continueForExistENR ? "GENERATE" : "OPEN IN BROWSER" }}
              </div>
            </div>
          </div>

          <div class="browserBox">
            <div v-if="!continueForExistENR" class="browserBox_import">
              <div class="import-title">
                <span>IMPORT EXISTING ENR</span>
              </div>
              <div class="enrImport">
                <input v-model="importedENR" type="text" placeholder="Enter ENR" />
                <div class="import-btn" @click="enrImport">import</div>
              </div>
            </div>
            <div v-else class="wrapper" style="flex-direction: row">
              <div class="title">
                <span>{{ !continueForExistENR ? "CREATE NEW ENR" : "OPEN OBOL LAUNCHPAD" }}</span>
                <span>{{
                  !continueForExistENR
                    ? "Generate a new ENR to use to create or join an existing cluster"
                    : "Create/join an Obol Cluster solo or with a group using the Distributed Validator Launchpad."
                }}</span>
              </div>
              <div class="btn-box">
                <div class="btn" style="background: #494949; color: #dbdbdb" @click="copyHandler">
                  <img style="width: 10%; margin-right: 2%" src="/img/icon/service-icons/copy1.png" alt="" />ENR
                </div>
                <div class="btn" style="background: #eb5353; color: #dbdbdb" @click="removeHandler">REMOVE</div>
              </div>
            </div>
          </div>
          <div v-if="continueForExistENR" class="browserBox">
            <div v-if="!dkgControl || depositFile" class="wrapper" style="flex-direction: row">
              <div class="title">
                <span>{{ depositFile ? "BACKUP DEPOSIT FILE" : "START THE DKG" }}</span>
                <span
                  >{{
                    depositFile
                      ? "Export your backup deposit file from the server to back it up"
                      : "When all ENRs are signed, you will be presented with a command. All Node Operators have to run this command at the same time!"
                  }}
                </span>
              </div>
              <div class="btn-box">
                <div class="btn" @click="dkgSwitch">
                  {{ depositFile ? "SAVE" : "START" }}
                </div>
              </div>
            </div>
            <div v-else class="browserBox_import">
              <div class="import-title">
                <span>PASTE THE URL</span>
              </div>
              <div class="enrImport">
                <input v-model="startDKG" type="text" placeholder="Enter URL" />
                <div class="import-btn" @click="dkgImporter">start</div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="wrapper"><EnrGenerator /></div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapWritableState } from "pinia";
import { useNodeHeader } from "@/store/nodeHeader";
import EnrGenerator from "./EnrGenerator.vue";
export default {
  components: {
    EnrGenerator,
  },
  data() {
    return {
      obolSharonService: {},
      importedENR: "",
      startDKG: "",
      dkgControl: false,
    };
  },

  computed: {
    ...mapWritableState(useNodeHeader, {
      runningServices: "runningServices",
      generatorPlugin: "generatorPlugin",
      obolDashboard: "obolDashboard",
      generatedENR: "generatedENR",
      continueForExistENR: "continueForExistENR",
      distrubutedValidatorGenerator: "distrubutedValidatorGenerator",
      enrIsGenerating: "enrIsGenerating",
      deactivateBtnToWaitForLogs: "deactivateBtnToWaitForLogs",
      depositFile: "depositFile",
    }),
  },
  mounted() {
    this.filterObolSharonService();
    this.generatorPlugin = false;
    this.distrubutedValidatorGenerator = false;
  },
  methods: {
    filterObolSharonService() {
      this.runningServices.forEach((item) => {
        if (item.name === "Obol Charon") this.obolSharonService = item;
      });
    },
    openBrowser() {
      let url = "https://obol.tech/";
      window.open(url, "_blank");
    },
    openGitHub() {
      let url = "https://github.com/ObolNetwork";
      window.open(url, "_blank");
    },
    openDiscord() {
      let url = "https://discord.gg/n6ebKsX46w";
      window.open(url, "_blank");
    },
    topBlock() {
      if (!this.continueForExistENR) {
        this.enrIsGenerating = true;
        this.generatorPlugin = true;
        this.obolDashboard = false;
        this.generatedENR = "";
        this.distrubutedValidatorGenerator = false;
      } else {
        let url = "https://goerli.launchpad.obol.tech/";
        window.open(url, "_blank");
      }
    },
    enrImport() {
      console.log(this.importedENR);
      this.depositFile = true;
      this.generatorPlugin = false;
      this.continueForExistENR = true;
    },
    copyHandler() {
      let toCopy = this.generatedENR;
      navigator.clipboard
        .writeText(toCopy)
        .then(() => {
          this.cursorLocation = this.copiedPub;
        })
        .catch(() => {
          console.log(`can't copy`);
        });
    },
    removeHandler() {
      this.generatedENR = "";
      this.continueForExistENR = false;
      this.depositFile = false;
    },
    dkgSwitch() {
      this.dkgControl = true;
    },
    dkgImporter() {
      if (!this.startDKG) {
        console.log("please enter url");
      } else {
        this.enrIsGenerating = false;
        this.generatorPlugin = true;
        this.distrubutedValidatorGenerator = true;
        this.deactivateBtnToWaitForLogs = true;
      }
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
.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
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
.browserBox_import {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}
.import-title {
  width: 100%;
  height: 30%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-self: flex-start;
}
.enrImport {
  width: 100%;
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.enrImport input {
  width: 95%;
  height: 50%;
  border: none;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  padding-left: 10px;
}
.import-title span {
  color: #dbdbdb;
  font-size: 0.9rem;
  font-weight: 600;
  margin-left: 10px;
  margin-top: 5px;
}
.import-btn {
  width: 27%;
  height: 50%;
  background-color: #192d31;
  text-decoration: none;
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #2fe4ab;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  transition-duration: all 200ms;
  position: absolute;
  right: 2%;
}
.import-btn:hover {
  transition-duration: 100ms;
  background-color: #1a2e32e6;
}
.import-btn:active {
  transition-duration: 100ms;
  background-color: #1a2e32e6;
  box-shadow: 1px 1px 10px 1px #171717 inset;
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
.browserBox .btn:first-child {
  margin-top: 15px;
}
.browserBox .btn:not(:first-child) {
  margin-top: 5px;
}
.btn:hover {
  transition-duration: 100ms;
  background-color: rgba(26, 46, 50, 0.6);
}
.btn:active {
  transition-duration: 100ms;
  background-color: #1a2e32e6;
  box-shadow: 1px 1px 10px 1px #171717 inset;
}
</style>
