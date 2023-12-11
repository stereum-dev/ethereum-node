<template>
  <base-layout>
    <div class="w-full h-full max-h-full grid grid-cols-24 grid-rows-12 py-1">
      <SidebarSection />
      <ListSection
        @confirm-grouping="confirmGrouping"
        @pick-validator="pickValidatorService"
        @upload-file="uploadValidatorKey"
        @confirm-password="passwordValidation"
        @on-drop="onDrop"
        @remove-single="removeMultipleKeys"
        @open-group="openGroupList"
        @rename-group="renameGroup"
        @withdraw-group="withdrawGroup"
        @confirm-rename="confirmValidatorKeyRename"
        @back-list="backToList"
        @rename-single="confirmValidatorKeyRename"
        @reset-name="resetValidatorKeyName"
        @withdraw-single="withdrawModalHandler"
        @confirm-feerecepient="confirmFeeRecepient"
        @delete-preview="deletePreviewKey"
        @confirm-graffiti="confirmEnteredGrafiti"
        @confirm-remote="importRemoteKey"
      />
      <ManagementSection
        @graffiti-panel="graffitiPanelHandler"
        @import-remote="importRemoteKey"
        @withdraw-multiple="withdrawModalHandler"
      />
    </div>
    <transition
      tag="div"
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
    >
      <component :is="activeModal?.component" v-bind="activeModal?.props" v-on="activeModal?.events" />
    </transition>
  </base-layout>
</template>
<script setup>
import SidebarSection from "./sections/SidebarSection.vue";
import ListSection from "./sections/ListSection.vue";
import ManagementSection from "./sections/ManagementSection.vue";
import ControlService from "../../../store/ControlService";
import ImportValidator from "./components/modals/ImportValidator.vue";
import RiskWarning from "./components/modals/RiskWarning.vue";
import RemoveGroup from "./components/modals/RemoveGroup.vue";
import WithdrawMultiple from "./components/modals/WithdrawMultiple.vue";
import { v4 as uuidv4 } from "uuid";
import { useListKeys } from "@/composables/validators";
import { useStakingStore } from "@/store/theStaking";
import { computed } from "vue";
import { useServices } from "@/store/services";
import { useListGroups } from "@/composables/groups";
import RemoveValidators from "./components/modals/RemoveValidators.vue";

//Store
const stakingStore = useStakingStore();
const serviceStore = useServices();
const { listGroups } = useListGroups();

const modals = {
  import: {
    component: ImportValidator,
    props: {},
  },
  risk: {
    component: RiskWarning,
  },
  removeGroup: {
    component: RemoveGroup,
    props: {},
    events: {
      removeGroup: () => removeGroupConfirm(stakingStore.currentGroup),
    },
  },
  withdraw: {
    component: WithdrawMultiple,
    events: {
      confirmWithdraw: () => withdrawValidatorKey(),
    },
  },
  removeValidator: {
    component: RemoveValidators,
    props: {},
    events: {
      removeValidator: () => removeMultipleKeys(),
    },
  },
};
//Computed & Watchers

const activeModal = computed(() => {
  const modalConfig = modals[stakingStore.activeModal] || {};
  return {
    component: modalConfig.component || null,
    props: modalConfig.props || {},
    events: modalConfig.events || {},
  };
});

//Lifecycle Hooks

// *************** Methods *****************

//**** List Keys ****
//Methods

const listKeys = async () => {
  await useListKeys(stakingStore.forceRefresh);
};

// const updateValidatorStats = async () => {
//   await useUpdateValidatorStats();
// };

//**** Validator Key File ****

//Read File Content
const readFileContent = (file) => {
  const reader = new FileReader();

  reader.onload = (event) => {
    try {
      const jsonContent = JSON.parse(event.target.result);
      stakingStore.previewKeys.push(jsonContent);
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
  } else {
    readFileContent(files[0]);
  }
};

const uploadValidatorKey = (event) => {
  let uploadedFiles = event.target.files;
  if (!stakingStore.keyFiles.includes(uploadedFiles[0]["name"]) && uploadedFiles[0]["type"] === "application/json") {
    handleFiles(uploadedFiles);
    stakingStore.keyFiles.push(...uploadedFiles);
    stakingStore.isOverDropZone = false;
    stakingStore.isPreviewListActive = true;
    stakingStore.setActivePanel("validator");
  }
};

const onDrop = (event) => {
  let validator = serviceStore.installedServices.filter((s) => s.category === "validator");
  if (validator && validator.map((e) => e.state).includes("running")) {
    let droppedFiles = event.dataTransfer.files;
    if (droppedFiles[0]["type"] === "application/json") {
      stakingStore.isOverDropZone = false;
      stakingStore.isPreviewListActive = true;
      handleFiles(droppedFiles);
      stakingStore.keyFiles.push(...droppedFiles);
      stakingStore.setActivePanel("validator");
    }
  }
};

//Group Keys by GroupName and GroupId

//****End of Validator Key File ****

//**** Import Key Validation ****

const importKey = async (val) => {
  stakingStore.importEnteredPassword = val;
  stakingStore.importKeyMessage = await ControlService.importKey(
    stakingStore.selectedValidatorService.config.serviceID
  );
  stakingStore.isPreviewListActive = false;
  stakingStore.setActivePanel("insert");
  stakingStore.keyFiles = [];
  stakingStore.previewKeys = [];
  stakingStore.importEnteredPassword = "";
  stakingStore.forceRefresh = true;
  await listKeys();
  listGroups();
};

//Validation validator key Password
const passwordValidation = async (pass) => {
  stakingStore.importEnteredPassword = pass;

  stakingStore.setActiveModal("import");
  stakingStore.checkActiveValidatorsResponse = await ControlService.checkActiveValidators({
    files: stakingStore.keyFiles,
    password: stakingStore.importEnteredPassword,
    serviceID: stakingStore.selectedValidatorService.config.serviceID,
    //Temporarily set slashingDB to null
    slashingDB: null,
  });
  stakingStore.setActivePanel(null);
  if (
    stakingStore.checkActiveValidatorsResponse.length === 0 ||
    stakingStore.checkActiveValidatorsResponse.includes("Validator check error:\n")
  ) {
    importKey(stakingStore.importEnteredPassword);
    stakingStore.keys.push(...stakingStore.checkActiveValidatorsResponse);
  } else {
    console.log("error: there are active validators");
    //Risk Modal
  }
};

//****End of Import Key Validation ****

//**** Grouping ****

//Back to List

const backToList = () => {
  stakingStore.isGroupingAllowed = false;
  stakingStore.isGroupListActive = false;
};

//Open Group List

const openGroupList = (item) => {
  stakingStore.isGroupListActive = true;
  stakingStore.currentGroup = item;
};

//Create Group;

const createGroup = async (groupName) => {
  const groupId = uuidv4();
  const existingKeys = await ControlService.readKeys();

  if (existingKeys) {
    stakingStore.selectedValidatorKeys.forEach((key) => {
      const pubkey = key.key;
      existingKeys[pubkey] = {
        ...existingKeys[pubkey],
        groupName: groupName,
        groupID: groupId,
        validatorClientID: stakingStore.selectedValidatorKeys[0].validatorID,
      };
    });

    await ControlService.writeKeys(existingKeys);

    const newGroup = {
      id: groupId,
      name: groupName,
      validatorClientID: stakingStore.selectedValidatorKeys[0].validatorID,
      keys: stakingStore.selectedValidatorKeys.map((key) => ({
        ...key,
        groupName: groupName,
        groupID: groupId,
        selected: false,
      })),
    };
    stakingStore.validatorKeyGroups.push(newGroup);
  } else {
    console.error("Error fetching keys from server");
  }
};

//Rename Group
const groupRenameHandler = async (newGroupName, groupId) => {
  const keysFromServer = await ControlService.readKeys();

  if (keysFromServer) {
    stakingStore.validatorKeyGroups.forEach((group) => {
      if (group.id === groupId) {
        group.name = newGroupName;
        group.keys.forEach((key) => {
          keysFromServer[key.key] = {
            ...keysFromServer[key.key],
            groupName: newGroupName,
            groupID: groupId,
            validatorClientID: keysFromServer[key.key].validatorClientID,
          };
        });
      }
    });

    await ControlService.writeKeys(keysFromServer);
  } else {
    console.error("Error fetching keys from server");
  }
};

//Confirm Create or Rename Group
const confirmGrouping = async (val) => {
  const groupName = stakingStore.groupName;

  if (stakingStore.mode === "create") {
    stakingStore.setActivePanel(null);
    stakingStore.isGroupingAllowed = false;
    await createGroup(groupName);
    stakingStore.groupName = "";
  } else if (stakingStore.mode === "rename") {
    stakingStore.setActivePanel(null);
    const groupId = stakingStore.currentGroup.id;
    await groupRenameHandler(val, groupId);
    stakingStore.groupName = "";
  }
  stakingStore.keys = stakingStore.keys.map((key) => {
    if (key.selected) {
      return { ...key, selected: false };
    }
    return key;
  });
  stakingStore.forceRefresh = true;
  listGroups();
};

const renameGroup = (item) => {
  stakingStore.setMode("rename");
  stakingStore.currentGroup = item;
  stakingStore.setActivePanel("grouping");
};

//Withdraw Group

const withdrawGroup = (item) => {
  console.log(item);
  stakingStore.setActivePanel("password");
};

//Remove Group

const removeGroupConfirm = async (item) => {
  const keysFromServer = await ControlService.readKeys();

  if (keysFromServer) {
    stakingStore.validatorKeyGroups.forEach((group) => {
      if (group.id === item.id) {
        group.keys.forEach((key) => {
          keysFromServer[key.key] = {
            keyName: keysFromServer[key.key].keyName,
            groupName: "",
            groupID: null,
            validatorClientID: null,
          };
        });
      }
    });

    await ControlService.writeKeys(keysFromServer);
  } else {
    console.error("Error fetching keys from server");
  }
  // stakingStore.currentGroup.keys.forEach((key) => {
  //   stakingStore.keys.push(key);
  // });
  stakingStore.validatorKeyGroups = stakingStore.validatorKeyGroups.filter((group) => group?.id !== item.id);
  stakingStore.setActiveModal(null);
  stakingStore.setMode("create");
  stakingStore.currentGroup = "";
  stakingStore.forceRefresh = true;
  listGroups();
};

//****End of Grouping ****

//**** Validator Key ****

//Confirm Rename Validator Key
const confirmValidatorKeyRename = async (name) => {
  stakingStore.keys.find((key) => key.key === stakingStore.selectKeyToRename.key).selected = false;
  let el = stakingStore.selectKeyToRename;

  el.displayName = name;
  const keys = await ControlService.readKeys();
  if (keys) {
    keys[el.key].keyName = name;
    await ControlService.writeKeys(keys);
    stakingStore.setActivePanel(null);
  } else {
    console.log("Couldn't read KeyFile!");
  }
};

const resetValidatorKeyName = (key) => {
  console.log("resetValidatorKeyName", key);
};

//****End of Validator Key ****

//Pick a Validator Service

const pickValidatorService = (service) => {
  stakingStore.selectedValidatorService = service;
  stakingStore.setActivePanel("password");
};

//Delete Preview Key
const deletePreviewKey = async (item) => {
  stakingStore.previewKeys = stakingStore.previewKeys.filter((key) => key.pubkey !== item.pubkey);
  if (!stakingStore.previewKeys.length) {
    stakingStore.isPreviewListActive = false;
    stakingStore.setActivePanel("insert");
  }
  stakingStore.forceRefresh = true;
  await listKeys();
};

//****End of Validator Key ****

//**** Client Commands Buttons ****

// ****** Fee Recepient *******
const confirmFeeRecepient = async (item) => {
  console.log("feeRecepientConfirmHandler", item);
  if (item) {
    await ControlService.setFeeRecipient({
      serviceID: item.validatorID,
      pubkey: item.key,
      address: stakingStore.feeRecepientAddress,
    });
  } else {
    await ControlService.deleteFeeRecipient({
      serviceID: item.validatorID,
      pubkey: item.key,
    });
  }
  stakingStore.eneterdFeeRecipientAddress = "";
  stakingStore.setActivePanel(null);
};

// ****** End of Fee Recepient *******

//****** Withdraw & Exit *******

const withdrawModalHandler = (key) => {
  if (key) {
    key.showExitText = true;
    stakingStore.selectedSingleKeyToWithdraw = key;
    stakingStore.setActiveModal("withdraw");
  }

  stakingStore.setActiveModal("withdraw");
};

const withdrawValidatorKey = async () => {
  //if single key
  const key = stakingStore.selectedSingleKeyToWithdraw;
  try {
    if (key && key !== null) {
      stakingStore.withdrawAndExitResponse = await ControlService.exitValidatorAccount({
        pubkey: key.key,
        serviceID: stakingStore.selectedServiceToFilter.config?.serviceID,
      });
    } else {
      //if multiple keys
      stakingStore.keys.forEach(async (item) => {
        if (item.validatorID === stakingStore.selectedServiceToFilter.config?.serviceID) {
          stakingStore.withdrawAndExitResponse = await ControlService.exitValidatorAccount({
            pubkey: item.key,
            serviceID: stakingStore.selectedServiceToFilter.config?.serviceID,
          });
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
};

//****** End of Withdraw & Exit *******

//****** Graffiti *******
const graffitiPanelHandler = () => {
  stakingStore.setActivePanel("graffiti");
};

const confirmEnteredGrafiti = async (graffiti) => {
  await ControlService.setGraffitis({
    id: stakingStore.selectedServiceToFilter.config?.serviceID,
    graffiti: graffiti,
  });
  stakingStore.setActivePanel(null);
};

//****** End of Graffiti *******

const removeMultipleKeys = () => {
  if (stakingStore.selectedKeyToRemove) {
    stakingStore.keys = stakingStore.keys.filter((key) => key.key !== stakingStore.selectedKeyToRemove.key);
  } else {
    console.log("this is multiple");
    stakingStore.keys = stakingStore.keys.filter(
      (key) => key.validatorID !== stakingStore.selectedServiceToFilter.config.serviceID
    );
  }

  stakingStore.removeKeys = [];
  stakingStore.setActiveModal(null);
};

// ******  Remote Key *******

const importRemoteKey = async () => {
  stakingStore.setActivePanel(null);
  stakingStore.isRemoteListActive = false;
  stakingStore.previewRemoteKeys = [];
  stakingStore.selectedRemoteKeys = [];
  stakingStore.remoteUrl = "";

  if (stakingStore.remoteUrl) {
    const response = await ControlService.checkRemoteKeys({
      url: stakingStore.remoteUrl,
      serviceID: stakingStore.selectedServiceToFilter?.config?.serviceID,
    });

    if (response.error) {
      console.log(response.error);
    } else {
      // stakingStore.remoteKeys = response.keys;
      console.log(response.keys);
    }
  } else {
    console.log("NO IDEA");
  }
};

//****End of Client Commands Buttons ****
</script>
