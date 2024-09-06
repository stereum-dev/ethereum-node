<template>
  <div class="w-full h-full absolute inset-0 flex justify-center items-center">
    <div class="w-full h-full absolute indent-0 bg-black opacity-80 rounded-lg z-10" @click="$emit('closeWindow')"></div>
    <div class="browser-modal">
      <div class="obol_charon-header">
        <div class="icon-box">
          <img src="/img/icon/service-icons/validator/ObolCharon.png" alt="icon" />
        </div>
        <div class="title-box">
          <div class="service-name"><span>obol</span></div>
          <div class="service-option">
            <img src="/img/icon/service-modals-icons/internet.png" alt="icon" @click="openBrowser" />
            <img src="/img/icon/service-modals-icons/github.png" alt="icon" @click="openGitHub" />
            <img src="/img/icon/service-modals-icons/discord.png" alt="icon" @click="openDiscord" />
          </div>
        </div>
      </div>
      <div v-if="isLoading">
        <img src="/animation/services/obol/obol-animation.gif" alt="icon" />
      </div>
      <div v-else class="content">
        <div v-if="!headerStore.generatorPlugin" class="wrapper">
          <div class="browserBox">
            <ConfirmBox
              :top-line="`${!headerStore.continueForExistENR ? $t('serviceModal.createEnr') : $t('serviceModal.openObol')}`"
              :bottom-line="`${!headerStore.continueForExistENR ? $t('serviceModal.generateEnrToJoin') : $t('serviceModal.joinCluster')}`"
              :btn-name="`${!headerStore.continueForExistENR ? $t('multiServer.gen') : $t('serviceModal.openBrowser')}`"
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
                    ? $t('serviceModal.createEnr')
                    : areYouSureToRemove
                    ? $t('serviceModal.areYouSure')
                    : $t('serviceModal.mngEnr')
                }`"
                :bottom-line="`${
                  !headerStore.continueForExistENR
                    ? $t('serviceModal.generateEnrToJoin')
                    : areYouSureToRemove
                    ? $t('serviceModal.areYouSureMsg')
                    : $t('serviceModal.copyEnr')
                }`"
                :btn-name="`${areYouSureToRemove ? $t('exitMultipleValidator.confirm') : $t('serviceModal.copy')}`"
                :second-btn-name="`${
                  headerStore.depositFile ? '' : areYouSureToRemove ? $t('displayValidator.cancel') : $t('serviceModal.rem')
                }`"
                :btn-bg-color="`${areYouSureToRemove ? '#74FA65' : '#494949'}`"
                :second-btn-bg-color="`#eb5353`"
                :btn-name-color="`${areYouSureToRemove ? '#000' : '#dbdbdb'}`"
                :second-btn-name-color="`#dbdbdb`"
                :img-url="`${areYouSureToRemove ? '' : '/img/icon/service-modals-icons/copy.png'}`"
                @confirmPluginClick="secondRowBtnHandler"
                @secBtnPluginClick="removeHandlerControler"
              />
            </div>
          </div>
          <div class="browserBox">
            <div v-if="!headerStore.continueForExistENR || dkgControl == true" class="browserBox_import">
              <div class="import-title">
                <span>{{ dkgControl !== true ? "INSERT EXISITING BACKUP" : $t("serviceModal.pasteUrl") }}</span>
              </div>
              <div class="enrImport" style="position: relative; z-index: 99">
                <label
                  v-if="!dkgControl"
                  for="file_input"
                  class="col-start-12 col-span-1 bg-gray-300 rounded-r-full flex justify-center items-center"
                  @click="selectBackupPath"
                >
                  <span class="absolute cursor-pointer" style="color: #192d31; top: 1; left: 3%; font-size: 2rem; font-weight: 600">+</span>
                </label>
                <input
                  v-model="thirdRowInput"
                  :style="`${dkgControl !== true ? 'padding-left: 14px; text-indent: 14px;' : ''}`"
                  type="text"
                  :placeholder="`${dkgControl !== true ? 'e.g., C:\\path\\to\\backup.zip' : $t('serviceModal.entrUrl')}`"
                />
                <div class="import-btn" @click="dkgImporter">
                  {{ $t("serviceModal.srart") }}
                </div>
              </div>
            </div>
            <ConfirmBox
              v-else-if="!dkgControl || headerStore.depositFile"
              :top-line="`${
                areYouSureToRemoveCluster
                  ? $t('serviceModal.areYouSureCluster')
                  : headerStore.depositFile
                  ? $t('serviceModal.backUpFile')
                  : $t('serviceModal.startDkg')
              }`"
              :bottom-line="`${
                areYouSureToRemoveCluster
                  ? $t('serviceModal.areYouSureMsg')
                  : headerStore.depositFile
                  ? $t('serviceModal.exportBackup')
                  : $t('serviceModal.allEnrSign')
              }`"
              :btn-name="`${
                areYouSureToRemoveCluster
                  ? $t('exitMultipleValidator.confirm')
                  : headerStore.depositFile
                  ? $t('serviceModal.save')
                  : $t('serviceModal.srart')
              }`"
              :second-btn-name="`${
                !headerStore.depositFile ? '' : areYouSureToRemoveCluster ? $t('displayValidator.cancel') : $t('serviceModal.rem')
              }`"
              :second-btn-bg-color="`#eb5353`"
              :btn-bg-color="`${areYouSureToRemoveCluster ? '#74FA65' : '#192d31'}`"
              :btn-name-color="`${areYouSureToRemoveCluster ? '#000' : '#2fe4ab'}`"
              :second-btn-name-color="`#dbdbdb`"
              @confirmPluginClick="dkgSwitch"
              @secBtnPluginClick="removeHandlerClusterControler"
            />
          </div>
        </div>
        <div v-else class="wrapper">
          <EnrGenerator :cluster-definition="clusterDefinition" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useNodeHeader } from "@/store/nodeHeader";
import EnrGenerator from "./EnrGenerator.vue";
import { ref, onMounted } from "vue";
import ConfirmBox from "./plugin/ConfirmBox";
import ControlService from "@/store/ControlService";

const importedENR = ref("");
const clusterDefinition = ref("");
const dkgControl = ref(false);
const isLoading = ref(true);
const thirdRowInput = ref("");
const areYouSureToRemove = ref(false);
const areYouSureToRemoveCluster = ref(false);

const headerStore = useNodeHeader();

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
    let url = "https://holesky.launchpad.obol.tech/";
    window.open(url, "_blank");
  }
};

const enrImport = async () => {
  isLoading.value = true;
  headerStore.generatedENR = "";
  await createEnr(importedENR.value);
  if (headerStore.generatedENR) {
    headerStore.depositFile = false;
    headerStore.generatorPlugin = false;
    headerStore.continueForExistENR = true;
  }
};

const createEnr = async (privateKey) => {
  let enr = "";
  try {
    enr = await ControlService.createObolENR(privateKey);
  } catch (error) {
    isLoading.value = false;
    console.log(error);
  } finally {
    headerStore.generatedENR = enr;
    isLoading.value = false;
  }
};

const secondRowBtnHandler = () => {
  if (areYouSureToRemove.value) {
    removeHandler();
  } else {
    copyHandler();
  }
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

const removeHandlerControler = () => {
  areYouSureToRemove.value = !areYouSureToRemove.value;
};
const removeHandlerClusterControler = () => {
  areYouSureToRemoveCluster.value = !areYouSureToRemoveCluster.value;
};

const removeHandler = () => {
  //returns true if successful otherwise false
  ControlService.removeObolENR().then((res) => {
    if (res) {
      headerStore.generatedENR = "";
      headerStore.continueForExistENR = false;
      headerStore.depositFile = false;
      dkgControl.value = false;
      areYouSureToRemove.value = false;
    }
  });
};

const openDirectoryPicker = async () => {
  try {
    const paths = await ControlService.openDirectoryDialog({
      properties: ["openDirectory", "createDirectory"],
    });
    return paths[0];
  } catch (error) {
    // Handle case when user cancels directory picker
    if (error.name === "AbortError") {
      return "";
    } else {
      console.error("Error picking directory:", error);
    }
  }
};

const dkgSwitch = async () => {
  if (areYouSureToRemoveCluster.value) {
    isLoading.value = true;
    try {
      await ControlService.removeObolCluster();
    } catch (error) {
      console.log(error);
    } finally {
      areYouSureToRemoveCluster.value = false;
      dkgControl.value = false;
      await checkExistingFiles();
    }
  } else if (headerStore.depositFile) {
    const path = await openDirectoryPicker();
    if (path) {
      isLoading.value = true;
      try {
        await ControlService.downloadObolBackup(path);
      } catch (error) {
        console.log(error);
      } finally {
        isLoading.value = false;
      }
    }
  } else {
    dkgControl.value = true;
  }
};

const dkgImporter = async () => {
  if (!dkgControl.value) {
    // path of existing backup
    if (!thirdRowInput.value) {
      console.log("please enter input");
    } else {
      isLoading.value = true;
      headerStore.enrIsGenerating = false;
      headerStore.generatorPlugin = false;
      headerStore.distrubutedValidatorGenerator = false;
      headerStore.deactivateBtnToWaitForLogs = false;
      try {
        await ControlService.importObolBackup(thirdRowInput.value);
      } catch (error) {
        console.log(error);
      } finally {
        await checkExistingFiles();
        thirdRowInput.value = "";
        isLoading.value = false;
      }
    }
  }
  // url of cluster definition
  else if (!thirdRowInput.value) {
    console.log("please enter url");
  } else {
    clusterDefinition.value = thirdRowInput.value;
    thirdRowInput.value = "";
    headerStore.enrIsGenerating = false;
    headerStore.generatorPlugin = true;
    headerStore.distrubutedValidatorGenerator = true;
    headerStore.deactivateBtnToWaitForLogs = true;
    dkgControl.value = false;
  }
};
const selectBackupPath = async () => {
  const path = await openDirectoryPicker();
  thirdRowInput.value = path;
};

const checkExistingFiles = async () => {
  isLoading.value = true;
  //check existing files
  const content = await ControlService.checkObolContent();
  //if there is a private key, then get public enr
  if (content.privateKey) {
    ControlService.getObolENRPublicKey().then((res) => {
      headerStore.generatedENR = res;
    });
  }
  //check if ready for DKG
  headerStore.continueForExistENR = content.privateKey;
  //check if ready for operation
  headerStore.depositFile = content.privateKey && content.depositData && content.clusterLock && content.validatorKeys;
  isLoading.value = false;
};

onMounted(async () => {
  headerStore.generatorPlugin = false;
  headerStore.distrubutedValidatorGenerator = false;
  headerStore.continueForExistENR = false;
  await checkExistingFiles();
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
  justify-content: flex-start;
  align-items: center;
  position: relative;
}
.enrImport input {
  width: 71.5%;
  height: 50%;
  border: none;
  border-radius: 20px 0 0 20px;
  font-size: 0.9rem;
  font-weight: 600;
  padding-left: 10px;
  margin-left: 10px;
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
  background-color: #1c3035;
}
.import-btn:active {
  transition-duration: 100ms;
  background-color: #22393e;
  box-shadow: 1px 1px 10px 1px #171717 inset;
}
</style>
