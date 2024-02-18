<template>
  <div class="obol-modal-plugin_parent">
    <div class="obol-modal-plugin_header">
      <span>{{
        headerStore.distrubutedValidatorGenerator
          ? `${$t("serviceModal.distributedValidator")}`
          : `${$t("serviceModal.generateEnr")}`
      }}</span>
    </div>
    <div
      class="obol-modal-plugin_spaceWindow"
      :style="{
        backgroundImage: backupDistributedValidator || distributedCompleted ? distrubutedValidatorAnimation : '',
      }"
    >
      <div v-if="!backupDistributedValidator" class="obol-modal-plugin_wapper">
        <span v-if="!headerStore.distrubutedValidatorGenerator">{{ headerStore.generatedENR }}</span>
        <div v-else class="span-wrapper">
          <span v-for="item in dkgLogs" :key="item">{{ item }}</span>
        </div>
      </div>
    </div>
    <div
      :class="[
        'obol-modal-plugin_btn',
        !headerStore.enrIsGenerating ? 'activeBtn' : '',
        headerStore.deactivateBtnToWaitForLogs ? 'deactivate' : '',
      ]"
      @click="btnHandling"
    >
      {{ enrBtnToShow }}
    </div>
  </div>
</template>
<script setup>
import { useNodeHeader } from "@/store/nodeHeader";
import { ref, onMounted, computed, onBeforeUnmount } from "vue";
import ControlService from "@/store/ControlService";
import { saveToFile } from "@/composables/utils";
import { defineProps } from "vue";

// Define props
const props = defineProps({
  clusterDefinition: String,
});

const enrGeneratedSuccess = ref(false);
const enrGeneratedFailed = ref(false);
const enrGeneratedContinue = ref(false);
const backupDistributedValidator = ref(false);
const distrubutedValidatorAnimation = ref("url('./img/icon/service-icons/obol_animation.gif')");
const distributedCompleted = ref(false);
const polling = ref(null);
const dkgLogs = ref([]);
const backupPath = ref("");

const headerStore = useNodeHeader();

const enrBtnToShow = computed(() => {
  if (
    headerStore.enrIsGenerating &&
    !enrGeneratedSuccess.value &&
    !enrGeneratedFailed.value &&
    !enrGeneratedContinue.value &&
    !headerStore.distrubutedValidatorGenerator
  ) {
    return "GENERATING..."; //generating
  } else if (
    enrGeneratedSuccess.value &&
    !enrGeneratedFailed.value &&
    !headerStore.enrIsGenerating &&
    !enrGeneratedContinue.value &&
    !headerStore.distrubutedValidatorGenerator
  ) {
    return "BACKUP ENR"; //generated
  } else if (
    enrGeneratedFailed.value &&
    !enrGeneratedSuccess.value &&
    !headerStore.enrIsGenerating &&
    !enrGeneratedContinue.value &&
    !headerStore.distrubutedValidatorGenerator
  ) {
    return "RETURN"; //failed
  } else if (
    enrGeneratedContinue.value &&
    !enrGeneratedFailed.value &&
    !headerStore.enrIsGenerating &&
    !enrGeneratedSuccess.value &&
    !headerStore.distrubutedValidatorGenerator
  ) {
    return "CONTINUE"; //continue
  } else if (headerStore.distrubutedValidatorGenerator && !headerStore.enrIsGenerating) {
    return "DKG FINISHED";
  } else if (backupDistributedValidator.value && !headerStore.enrIsGenerating) {
    return "BACKUP";
  } else if (distributedCompleted.value && !headerStore.enrIsGenerating && !backupDistributedValidator.value) {
    return "COMPLETE";
  }

  return "RETURN"; //failed
});

onMounted(() => {
  if (!headerStore.distrubutedValidatorGenerator && headerStore.enrIsGenerating) {
    createEnr();
  }
  headerStore.generatedENR = "";
  if (headerStore.distrubutedValidatorGenerator && !headerStore.enrIsGenerating) {
    startDKG(props.clusterDefinition);
  }
});

onBeforeUnmount(() => {
  clearInterval(polling.value);
});

const createEnr = async () => {
  enrGeneratedSuccess.value = false;
  enrGeneratedFailed.value = false;
  let enr = "";

  try {
    enr = await ControlService.createObolENR();
  } catch (error) {
    enrGeneratedFailed.value = true;
    headerStore.generatedENR = JSON.stringify(error);
  } finally {
    headerStore.generatedENR = enr;

    if (enr.includes("enr:-")) {
      enrGeneratedSuccess.value = true;
    } else {
      enrGeneratedFailed.value = true;
    }

    enrGeneratedContinue.value = false;
    headerStore.enrIsGenerating = false;
  }
};

const backupPrivateKey = async () => {
  const content = await ControlService.getObolENRPrivateKey();
  saveToFile("charon-enr-private-key", content);
};

const startDKG = async () => {
  //first check if there is already a running dkg
  const isRunning = await ControlService.checkObolDKG();
  if (!isRunning) {
    await ControlService.startObolDKG();
  }
  startDGKLogging();
};

const startDGKLogging = async () => {
  dkgLogs.value = (await ControlService.getObolDKGLogs()).split("\n");
  polling.value = setInterval(async () => {
    console.log("interval running...");
    const logs = await ControlService.getObolDKGLogs();
    dkgLogs.value = logs.split("\n");
    if (logs.includes("Successfully completed DKG ceremony")) {
      clearInterval(polling.value);
      headerStore.deactivateBtnToWaitForLogs = false;
    }
  }, 5000);
};

const openDirectoryPicker = async () => {
  try {
    const paths = await ControlService.openDirectoryDialog({
      properties: ["openDirectory", "createDirectory"],
    });
    backupPath.value = paths[0];
  } catch (error) {
    // Handle case when user cancels directory picker
    if (error.name === "AbortError") {
      backupPath.value = "";
    } else {
      console.error("Error picking directory:", error);
    }
  }
};

const btnHandling = async () => {
  if (enrBtnToShow.value === "GENERATING...") {
    console.log("GENERATING...");
  } else if (enrBtnToShow.value === "BACKUP ENR") {
    backupPrivateKey();
    headerStore.enrIsGenerating = false;
    enrGeneratedSuccess.value = false;
    enrGeneratedFailed.value = false;
    enrGeneratedContinue.value = true;
  } else if (enrBtnToShow.value === "RETURN") {
    headerStore.enrIsGenerating = true;
    enrGeneratedSuccess.value = false;
    enrGeneratedFailed.value = false;
    enrGeneratedContinue.value = false;
    headerStore.generatorPlugin = false;
    headerStore.obolDashboard = false;
    headerStore.continueForExistENR = false;
  } else if (enrBtnToShow.value === "CONTINUE") {
    headerStore.enrIsGenerating = true;
    enrGeneratedSuccess.value = false;
    enrGeneratedFailed.value = false;
    enrGeneratedContinue.value = false;
    headerStore.generatorPlugin = false;
    headerStore.obolDashboard = true;
    headerStore.continueForExistENR = true;
  } else if (enrBtnToShow.value === "DKG FINISHED") {
    await openDirectoryPicker();
    backupDistributedValidator.value = true;
    headerStore.distrubutedValidatorGenerator = false;
    distributedCompleted.value = false;
  } else if (enrBtnToShow.value === "BACKUP") {
    if (!backupPath.value || backupPath.value === "") {
      //check if user has selected a path
      openDirectoryPicker(); // if not prompt selection again
      return;
    }
    await ControlService.downloadObolBackup(backupPath.value);
    backupDistributedValidator.value = false;
    headerStore.distrubutedValidatorGenerator = false;
    distributedCompleted.value = true;
  } else if (enrBtnToShow.value === "COMPLETE") {
    backupDistributedValidator.value = false;
    headerStore.distrubutedValidatorGenerator = false;
    distributedCompleted.value = false;
    headerStore.generatorPlugin = false;
    headerStore.obolDashboard = true;
    headerStore.continueForExistENR = true;
    headerStore.depositFile = true;
  }
};
</script>

<style scoped>
.deactivate {
  opacity: 0.5;
  box-shadow: none;
  pointer-events: none;
  cursor: not-allowed;
}
.obol-modal-plugin_parent {
  width: 95%;
  height: 90%;
  background-color: #393939;
  border: 1px solid #444444;
  box-shadow: 1px 1px 10px 1px #171717;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.obol-modal-plugin_header {
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1% 0;
}
.obol-modal-plugin_header span {
  color: #dbdbdb;
  font-size: 1.2rem;
  font-weight: 600;
}
.obol-modal-plugin_spaceWindow {
  width: 90%;
  height: 60%;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  background-color: #192d31;
  border: 1px solid #444444;
  box-shadow: 1px 1px 10px 1px #171717;
  border-radius: 10px;
  padding: 1%;
  cursor: text;
  color: #dbdbdb;
  font-size: 100%;
  font-weight: 400;
  overflow-y: scroll;
  background-size: cover;
  background-position: center;
}
.obol-modal-plugin_wapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  overflow-y: scroll;
}
.span-wrapper {
  width: 100%;
  height: max-content;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}
.obol-modal-plugin_spaceWindow span {
  width: 100%;
  height: 20%;
  font-size: 1rem;
  font-weight: 400;
  flex-shrink: 0;
  word-wrap: break-word;
}
.obol-modal-plugin_btn {
  width: 30%;
  height: 15%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #192d31;
  border: 1px solid #444444;
  box-shadow: 1px 1px 10px 1px #171717;
  border-radius: 25px;
  cursor: pointer;
  color: #dbdbdb;
  font-size: 1rem;
  font-weight: 600;
  margin: 2% 0;
}
.obol-modal-plugin_btn:hover {
  transition-duration: 100ms;
  background-color: #1e3a3f;
}
.obol-modal-plugin_btn:active {
  transition-duration: 100ms;
  background-color: #1e3a3f;
  box-shadow: 1px 1px 10px 1px #171717 inset;
}
.activeBtn {
  color: #2fe4ab;
}
.distributed-confirmed {
  background-size: cover;
  background-position: center;
}
</style>
