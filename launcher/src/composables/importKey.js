import { useStakingStore } from "../store/theStaking";
import ControlService from "../store/ControlService";
import { useListKeys } from "./validators";
import { useListGroups } from "./groups";
import { useServices } from "../store/services";

export function useImportKeys(forceRefresh) {
  const stakingStore = useStakingStore();
  const serviceStore = useServices();

  const readFileContent = (file) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        if (file.type === "application/json") {
          const jsonContent = JSON.parse(event.target.result);

          // Add filename property to jsonContent
          jsonContent.filename = file.name;
          stakingStore.previewKeys.push(jsonContent);
        }
      } catch (e) {
        console.error("Error parsing JSON file:", e);
      }
    };
    reader.onerror = (event) => {
      console.error("Error reading file:", event.target.error);
    };

    reader.readAsText(file);
  };

  //Handle multiple files
  const handleFiles = (files) => {
    if (files.length > 1) {
      for (let file of files) {
        if (file.type === "application/json") {
          readFileContent(file);
        }
      }
    } else if (files[0].type === "application/json") {
      readFileContent(files[0]);
    }
  };

  const uploadValidatorKey = (event) => {
    let uploadedFiles = event.target.files;
    stakingStore.previewKeys = [];
    handleFiles(uploadedFiles);
    stakingStore.passwordFiles = [...uploadedFiles].filter((file) => file.type === "text/plain");
    stakingStore.keyFiles = [...uploadedFiles].filter((file) => file.type === "application/json");
    stakingStore.isOverDropZone = false;
    stakingStore.isPreviewListActive = true;
    stakingStore.setActivePanel("validator");
  };

  const onDrop = (event) => {
    let validator = serviceStore.installedServices.filter((s) => s.category === "validator");
    if (validator && validator.map((e) => e.state).includes("running")) {
      stakingStore.previewKeys = [];
      let droppedFiles = event.dataTransfer.files;
      if (droppedFiles[0]["type"] === "application/json" || droppedFiles[0]["type"] === "text/plain") {
        stakingStore.isOverDropZone = false;
        stakingStore.isPreviewListActive = true;
        handleFiles(droppedFiles);
        stakingStore.passwordFiles = [...droppedFiles].filter((file) => file.type === "text/plain");
        stakingStore.keyFiles = [...droppedFiles].filter((file) => file.type === "application/json");
        stakingStore.setActivePanel("validator");
      } else {
        stakingStore.inputWrongKey = true;
      }
    }
  };

  const importingKey = async (val) => {
    stakingStore.importEnteredPassword = val;
    stakingStore.importKeyMessage = await ControlService.importKey(stakingStore.selectedValidatorService.config.serviceID);
    if (stakingStore.importKeyMessage.includes("error")) {
      if (stakingStore.keyFiles.length > 1) stakingStore.doppelgangerKeys = [];
      else {
        stakingStore.doppelgangerKeys.pop();
      }
    }
    stakingStore.isPreviewListActive = false;
    stakingStore.setActivePanel("insert");
    stakingStore.keyFiles = [];
    stakingStore.passwordFiles = [];
    stakingStore.previewKeys = [];

    stakingStore.importEnteredPassword = "";
    stakingStore.forceRefresh = true;
    if (
      stakingStore.isDoppelgangerProtectionActive &&
      stakingStore.doppelgangerKeys.length > 0 &&
      !stakingStore.importKeyMessage.includes("error")
    ) {
      stakingStore.displayDoppelgangerPreview = true;
      setTimeout(() => {
        stakingStore.setActiveModal(null);
      }, 10000);
      await useListKeys(forceRefresh);
      await useListGroups();
    }
  };

  const importValidatorProcessing = async () => {
    stakingStore.isImportValidatorButtonClicked = true;
    stakingStore.checkActiveValidatorsResponse = await ControlService.checkActiveValidators({
      files: stakingStore.keyFiles,
      passwordFiles: stakingStore.passwordFiles,
      password: stakingStore.importEnteredPassword,
      serviceID: stakingStore.selectedValidatorService.config?.serviceID,
      slashingDB: stakingStore.slashingDB ? window.webUtils.getPathForFile(stakingStore.slashingDB) : null,
    });

    if (
      stakingStore.checkActiveValidatorsResponse.length === 0 ||
      stakingStore.checkActiveValidatorsResponse.includes("Validator check error:\n")
    ) {
      await importingKey(stakingStore.importEnteredPassword);

      stakingStore.setActivePanel(null);
      stakingStore.keyFiles = [];
      stakingStore.passwordFiles = [];
    } else {
      stakingStore.setActiveModal("risk");
      stakingStore.doppelgangerKeys = [];
    }
  };

  return {
    uploadValidatorKey,
    onDrop,
    importingKey,
    importValidatorProcessing,
  };
}
