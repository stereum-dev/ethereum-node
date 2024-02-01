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
        <div v-if="!headerStore.generatorPlugin" class="wrapper">
          <div class="browserBox">
            <ConfirmBox
              :top-line="`${
                !headerStore.continueForExistENR ? `${$t('serviceModal.createEnr')}` : `${$t('serviceModal.openObol')}`
              }`"
              :bottom-line="`${
                !headerStore.continueForExistENR
                  ? `${$t('serviceModal.generateEnrToJoin')}`
                  : `${$t('serviceModal.joinCluster')}`
              }`"
              :btn-name="`${
                !headerStore.continueForExistENR ? `${$t('multiServer.gen')}` : `${$t('serviceModal.openBrowser')}`
              }`"
              :btn-bg-color="`#192d31`"
              :btn-name-color="`#2fe4ab`"
              @confirmPluginClick="topBlock"
            />
          </div>

          <div class="browserBox">
            <div v-if="!headerStore.continueForExistENR" class="browserBox_import">
              <div class="import-title">
                <span>{{ $t("serviceModal.importEnr") }}</span>
              </div>
              <div class="enrImport">
                <input v-model="importedENR" type="text" :placeholder="`${$t('serviceModal.entrEnr')}`" />
                <div class="import-btn" @click="enrImport">
                  {{ $t("serviceModal.import") }}
                </div>
              </div>
            </div>
            <div v-else class="wrapper" style="flex-direction: row">
              <ConfirmBox
                :top-line="`${
                  !headerStore.continueForExistENR
                    ? `${$t('serviceModal.createEnr')}`
                    : `${$t('serviceModal.openObol')}`
                }`"
                :bottom-line="`${
                  !headerStore.continueForExistENR
                    ? `${$t('serviceModal.generateEnrToJoin')}`
                    : `${$t('serviceModal.joinCluster')}`
                }`"
                :btn-name="`${$t('serviceModal.copy')}`"
                :second-btn-name="`${$t('serviceModal.rem')}`"
                :btn-bg-color="`#494949`"
                :second-btn-bg-color="`#eb5353`"
                :btn-name-color="`#dbdbdb`"
                img-url="/img/icon/service-icons/copy1.png"
                @confirmPluginClick="copyHandler"
                @secBtnPluginClick="removeHandler"
              />
            </div>
          </div>
          <div v-if="headerStore.continueForExistENR" class="browserBox">
            <ConfirmBox
              v-if="!dkgControl || headerStore.depositFile"
              :top-line="`${
                headerStore.depositFile ? `${$t('serviceModal.backUpFile')}` : `${$t('serviceModal.startDkg')}`
              }`"
              :bottom-line="`${
                headerStore.depositFile ? `${$t('serviceModal.exportBackup')}` : `${$t('serviceModal.allEnrSign')}`
              }`"
              :btn-name="`${headerStore.depositFile ? `${$t('addModifyPanel.save')}` : `${$t('serviceModal.srart')}`}`"
              :btn-bg-color="`#192d31`"
              :btn-name-color="`#2fe4ab`"
              @confirmPluginClick="dkgSwitch"
            />
            <div v-else class="browserBox_import">
              <div class="import-title">
                <span>{{ $t("serviceModal.pasteUrl") }}</span>
              </div>
              <div class="enrImport">
                <input v-model="startDKG" type="text" :placeholder="`${$t('serviceModal.entrUrl')}`" />
                <div class="import-btn" @click="dkgImporter">
                  {{ $t("serviceModal.srart") }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="wrapper"><EnrGenerator /></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useNodeHeader } from "@/store/nodeHeader";
import EnrGenerator from "./EnrGenerator.vue";
import { ref, onMounted } from "vue";
import ConfirmBox from "./plugin/ConfirmBox.vue";

const obolSharonService = ref({});
const importedENR = ref("");
const startDKG = ref("");
const dkgControl = ref(false);

const headerStore = useNodeHeader();

const filterObolSharonService = () => {
  headerStore.runningServices.forEach((item) => {
    if (item.name === "Obol Charon") obolSharonService.value = item;
  });
};

const openBrowser = () => {
  let url = "https://obol.tech/";
  window.open(url, "_blank");
};

const openGitHub = () => {
  let url = "https://github.com/ObolNetwork";
  window.open(url, "_blank");
};

const openDiscord = () => {
  let url = "https://discord.gg/n6ebKsX46w";
  window.open(url, "_blank");
};

const topBlock = () => {
  if (!headerStore.continueForExistENR) {
    headerStore.enrIsGenerating = true;
    headerStore.generatorPlugin = true;
    headerStore.obolDashboard = false;
    headerStore.generatedENR = "";
    headerStore.distrubutedValidatorGenerator = false;
  } else {
    let url = "https://goerli.launchpad.obol.tech/";
    window.open(url, "_blank");
  }
};

const enrImport = () => {
  console.log(importedENR.value);
  headerStore.depositFile = true;
  headerStore.generatorPlugin = false;
  headerStore.continueForExistENR = true;
};

const copyHandler = () => {
  let toCopy = headerStore.generatedENR;
  navigator.clipboard
    .writeText(toCopy)
    .then(() => {
      headerStore.cursorLocation = headerStore.copiedPub;
    })
    .catch(() => {
      console.log(`can't copy`);
    });
};

const removeHandler = () => {
  headerStore.generatedENR = "";
  headerStore.continueForExistENR = false;
  headerStore.depositFile = false;
};

const dkgSwitch = () => {
  dkgControl.value = true;
};

const dkgImporter = () => {
  if (!startDKG.value) {
    console.log("please enter url");
  } else {
    headerStore.enrIsGenerating = false;
    headerStore.generatorPlugin = true;
    headerStore.distrubutedValidatorGenerator = true;
    headerStore.deactivateBtnToWaitForLogs = true;
  }
};

onMounted(() => {
  filterObolSharonService();
  headerStore.generatorPlugin = false;
  headerStore.distrubutedValidatorGenerator = false;
});
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
</style>
