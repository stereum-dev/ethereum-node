<template>
  <base-layout>
    <div class="w-full h-full max-h-[492px] grid grid-cols-24 grid-rows-12 pt-1 select-none">
      <SidebarSection />

      <ListSection
        @confirm-grouping="confirmGrouping"
        @pick-validator="pickValidatorService"
        @upload-file="uploadValidatorKey"
        @confirm-password="confirmPassword"
        @on-drop="onDrop"
        @remove-single="removeValidatorKeys"
        @open-group="openGroupList"
        @rename-group="renameGroup"
        @withdraw-group="withdrawGroup"
        @confirm-rename="confirmValidatorKeyRename"
        @back-list="backToList"
        @rename-single="confirmValidatorKeyRename"
        @reset-name="resetValidatorKeyName"
        @withdraw-single="withdrawModalHandler"
        @confirm-feerecepient="confirmFeeRecepient"
        @delete-feerecepient="deleteFeeRecepient"
        @delete-preview="deletePreviewKey"
        @confirm-graffiti="confirmEnteredGrafiti"
        @confirm-remote="confirmImportRemoteKeys"
        @remove-group="removeGroupConfirm"
      />
      <ManagementSection
        @graffiti-panel="graffitiPanelHandler"
        @import-remote="confirmImportRemoteKeys"
        @withdraw-multiple="withdrawModalHandler"
      />
    </div>
    <transition tag="div" enter-active-class="animate__animated animate__fadeIn" leave-active-class="animate__animated animate__fadeOut">
      <component :is="activeModal?.component" v-bind="activeModal?.props" v-on="activeModal?.events" />
    </transition>
  </base-layout>
</template>

<script setup>
import { useListGroups } from "@/composables/groups";
import { useMultiSetups } from "@/composables/multiSetups";
import { useDeepClone } from "@/composables/utils";
import { useListKeys } from "@/composables/validators";
import { useImportKeys } from "@/composables/importKey";
import { useServices } from "@/store/services";
import { useSetups } from "@/store/setups";
import { useStakingStore } from "@/store/theStaking";
import { saveAs } from "file-saver";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import ControlService from "../../../store/ControlService";
import ImportRemote from "./components/modals/ImportRemote.vue";
import ImportValidator from "./components/modals/ImportValidator.vue";
import RemoveGroup from "./components/modals/RemoveGroup.vue";
import RemoveValidators from "./components/modals/RemoveValidators.vue";
import RiskWarning from "./components/modals/RiskWarning.vue";
import WithdrawMultiple from "./components/modals/WithdrawMultiple.vue";
import ListSection from "./sections/ListSection.vue";
import ManagementSection from "./sections/ManagementSection.vue";
import SidebarSection from "./sections/SidebarSection.vue";

//Store
const stakingStore = useStakingStore();
const serviceStore = useServices();
const setupStore = useSetups();
const { listGroups } = useListGroups();
const { getServerView } = useMultiSetups();
const { uploadValidatorKey, onDrop, importingKey, importValidatorProcessing } = useImportKeys(stakingStore.forceRefresh);
const fetchInterval = ref(null);

const modals = {
  import: {
    component: ImportValidator,
    props: {},
    events: {
      importKey: () => importValidatorProcessing(),
    },
  },
  risk: {
    component: RiskWarning,
    events: {
      acceptRisk: () => riskAccepted(),
    },
  },
  removeGroup: {
    component: RemoveGroup,

    events: {
      removeGroup: () => removeGroupConfirm(stakingStore.currentGroup),
    },
  },
  withdraw: {
    component: WithdrawMultiple,
    events: {
      confirmWithdraw: () => withdrawValidatorKey(),
      exportMessage: () => exportExitMessage(),
    },
  },
  removeValidator: {
    component: RemoveValidators,
    props: {},
    events: {
      removeValidator: () => removeValidatorKeys(),
    },
  },
  remote: {
    component: ImportRemote,
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

watch(
  () => serviceStore.installedServices,
  async () => {
    const hasValidator = serviceStore.installedServices.some((s) => s.category === "validator" && s.state === "running");
    stakingStore.isStakingDisabled = !hasValidator;
  }
);

onMounted(async () => {
  stakingStore.forceRefresh = true;
  getServerView();
  await listKeys();
  if (stakingStore.keys.length > 0 && setupStore.allSetups.length > 0) {
    getKeySetupColor();
  }
  fetchInterval.value = setInterval(fetchKeysWhileDplProtection, 30000);
});

// *************** Methods *****************

//Methods

//**** List Keys ****
const listKeys = async () => {
  await useListKeys(stakingStore.forceRefresh);
  stakingStore.isSkeletonActive = false;
};

const fetchKeysWhileDplProtection = async () => {
  if (stakingStore.doppelgangerKeys) {
    await useListKeys();
  }
};

// const updateValidatorStats = async () => {
//   await useUpdateValidatorStats();
// };

//****End of Validator Key File ****

//Risk Accepted

const riskAccepted = async () => {
  if (stakingStore.previewRemoteKeys.length > 0) {
    await importRemoteKey(
      useDeepClone({
        serviceID: stakingStore.selectedServiceToFilter.config?.serviceID,
        url: stakingStore.previewRemoteKeys[0]?.url, //url is for all keys the same
        pubkeys: stakingStore.previewRemoteKeys.filter((k) => k.selected).map((k) => k.pubkey),
      })
    );
  } else {
    await importingKey(stakingStore.importEnteredPassword);
  }
  stakingStore.setActiveModal(null);
};

//Validation validator key Password

const confirmPassword = async (pass) => {
  stakingStore.importEnteredPassword = pass;
  stakingStore.setActiveModal("import");
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
  const groupId = self.crypto.randomUUID();
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

const withdrawGroup = () => {
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
  await listKeys(true);
  listGroups();
};

//****End of Grouping ****

//**** Validator Key ****

//Confirm Rename Validator Key
const confirmValidatorKeyRename = async (name) => {
  stakingStore.isRenameKeyActive = true;
  stakingStore.keys.find((key) => key.key === stakingStore.selectKeyToRename.key).selected = false;
  let el = stakingStore.selectKeyToRename;

  el.displayName = name;
  const keys = await ControlService.readKeys();
  if (keys) {
    keys[el.key].keyName = name;
    await ControlService.writeKeys(keys);
    stakingStore.setActivePanel(null);
    stakingStore.validatorDisplayName = "";
  } else {
    console.log("Couldn't read KeyFile!");
  }
  await useListKeys(stakingStore.forceRefresh);
  stakingStore.isRenameKeyActive = false;
};

const resetValidatorKeyName = async (el) => {
  el.displayName = "";
  const keys = await ControlService.readKeys();
  if (keys) {
    keys[el.key].keyName = "";
    await ControlService.writeKeys(keys);
    stakingStore.setActivePanel(null);
  } else {
    console.log("Couldn't Reset Key Name!");
  }

  stakingStore.keys.find((key) => key.key === stakingStore.selectKeyToRename.key).selected = false;
};

//****End of Validator Key ****

//Doppelganger
const doppelgangerController = async (item) => {
  try {
    const res = await ControlService.getServiceYAML(item?.config?.serviceID);
    item.expertOptions.map((option) => {
      if (item.service === "LighthouseValidatorService" && option.title === "Doppelganger Protection") {
        stakingStore.doppelgangerStatus = res.indexOf(option.pattern[0]) === -1 ? false : true;
      } else if (option.title === "Doppelganger Protection") {
        const matchedValue = res.match(new RegExp(option.pattern[0])) ? [...res.match(new RegExp(option.pattern[0]))][2] : "";

        stakingStore.doppelgangerStatus = matchedValue === "true" ? true : false;
        stakingStore.isDoppelgangerProtectionActive = true;
      }
    });
  } catch (error) {
    // console.error("Error fetching service YAML:", error);
  }
};

//Pick a Validator Service

const pickValidatorService = async (service) => {
  stakingStore.selectedValidatorService = service;
  const existingPubKeys = new Set(stakingStore.doppelgangerKeys.map((key) => key.pubkey));

  stakingStore.previewKeys.forEach((previewKey) => {
    if (existingPubKeys.has(previewKey.pubkey)) return;
    stakingStore.doppelgangerKeys.push({
      ...previewKey,
      serviceID: service.config?.serviceID,
    });
  });

  await doppelgangerController(service);
  stakingStore.setActivePanel("password");
};

//Delete Preview Key

const deletePreviewKey = async (item) => {
  stakingStore.previewKeys = stakingStore.previewKeys.filter((key) => key.filename !== item.filename);

  const indexItem = stakingStore.keyFiles.findIndex((key) => key.name === item.filename);
  if (indexItem !== -1) {
    stakingStore.keyFiles.splice(indexItem, 1);
  }

  if (!stakingStore.previewKeys.length) {
    stakingStore.isPreviewListActive = false;
    stakingStore.selectedValidatorService = null;
    stakingStore.doppelgangerKeys = stakingStore.doppelgangerKeys.filter((key) => key.filename !== item.filename);
    stakingStore.setActivePanel("insert");
  }

  try {
    stakingStore.forceRefresh = true;
    await listKeys();
  } catch (error) {
    console.error("Failed to refresh keys:", error);
  }
};

//****End of Validator Key ****

//**** Client Commands Buttons ****

// ****** Fee Recipient *******
const confirmFeeRecepient = async () => {
  const key = stakingStore.selectKeyForFee;
  if (key) {
    await ControlService.setFeeRecipient({
      serviceID: key.validatorID,
      pubkey: key.key,
      address: stakingStore.enteredFeeRecipientAddress,
    });
  }
  key.selected = false;
  stakingStore.enteredFeeRecipientAddress = "";
  stakingStore.setActivePanel(null);
};

const deleteFeeRecepient = async () => {
  const key = stakingStore.selectKeyForFee;
  if (key) {
    await ControlService.deleteFeeRecipient({
      serviceID: key.validatorID,
      pubkey: key.key,
    });
  }
  key.selected = false;
  stakingStore.enteredFeeRecipientAddress = "";
  stakingStore.setActivePanel(null);
};

// ****** End of Fee Recipient *******

//****** Withdraw & Exit *******
const withdrawModalHandler = () => {
  stakingStore.setActiveModal("withdraw");
};

const withdrawValidatorKey = async () => {
  stakingStore.withdrawAndExitResponse = null;
  const key = stakingStore.selectedSingleKeyToWithdraw;
  if (!stakingStore.selectedServiceToFilter) {
    stakingStore.selectedServiceToFilter = serviceStore.installedServices.find(
      (service) => service?.config?.serviceID === key?.validatorID
    );
  }

  try {
    let res;
    let responseObj;

    if (key && key !== null) {
      // If single key
      res = await ControlService.exitValidatorAccount({
        pubkey: key.key,
        serviceID: stakingStore.selectedServiceToFilter.config?.serviceID,
      });

      responseObj = {
        pubkey: key.key,
        code: null,
        msg: res.msg,
        flag: "rejected",
      };

      if (Array.isArray(res) && res.length > 0) {
        const resObj = res[0];
        responseObj.code = resObj.code;
        responseObj.msg = resObj.msg;
        responseObj.pubkey = resObj.pubkey || key.key;
        responseObj.flag = resObj.code === 200 ? "approved" : "rejected";
      }

      stakingStore.withdrawAndExitResponse = [responseObj];
    } else {
      // If multiple keys
      const multiKeys = stakingStore.keys

        .filter((item) => item.validatorID === stakingStore.selectedServiceToFilter.config?.serviceID)
        .map((item) => item.key);

      res = await Promise.all(
        multiKeys.map(async (key) => {
          return await ControlService.exitValidatorAccount({
            pubkey: key,
            serviceID: stakingStore.selectedServiceToFilter.config?.serviceID,
          });
        })
      );

      stakingStore.withdrawAndExitResponse = res.map((item, index) => {
        let responseObj = {
          pubkey: multiKeys[index],
          code: null,
          msg: item.msg,
          flag: "rejected",
        };

        if (Array.isArray(item) && item.length > 0) {
          const resObj = item[0];
          responseObj.code = resObj.code;
          responseObj.msg = resObj.msg;
          responseObj.pubkey = resObj.pubkey || multiKeys[index];
          responseObj.flag = resObj.code === 200 ? "approved" : "rejected";
        }

        return responseObj;
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
const deleteValidators = async (serviceID, keys, picked) => {
  const result = await ControlService.deleteValidators({
    serviceID: serviceID,
    keys: keys,
    picked: picked === "yes" ? true : false,
  });
  stakingStore.removeResponse.push({
    name: "local",
    data: result,
  });
  return result;
};
const deleteRemoteKeys = async (serviceID, keys) => {
  const result = await ControlService.deleteRemoteKeys({
    serviceID: serviceID,
    pubkeys: keys,
  });
  stakingStore.removeResponse.push({
    name: "remote",
    data: result,
  });
  return result;
};

const exportExitMessage = async () => {
  try {
    const key = stakingStore.selectedSingleKeyToWithdraw;

    if (key) {
      const result = await ControlService.getExitValidatorMessage({
        pubkey: key.key,
        serviceID: key.validatorID,
      });
      saveExitMessage(result, "single");
    } else {
      const pubkeys = stakingStore.keys
        .filter((item) => item.validatorID === stakingStore.selectedServiceToFilter?.config?.serviceID)
        .map((item) => item.key);

      const results = await Promise.all(
        pubkeys.map(async (key) => {
          return ControlService.getExitValidatorMessage({
            pubkey: key,
            serviceID: stakingStore.selectedServiceToFilter.config?.serviceID,
          });
        })
      );

      saveExitMessage(results, "multiple");
    }
  } catch (error) {
    console.error("Error exporting exit message:", error);
  }
};

const saveExitMessage = (data, type) => {
  // Helper to strip a potential `data` wrapper returned by the API
  const unwrap = (entry) => (entry && entry.data ? entry.data : entry);

  const content =
    type === "single" ? JSON.stringify(unwrap(data), null, 2) : data.map((entry) => JSON.stringify(unwrap(entry), null, 2)).join("\n\n");

  const fileName = type === "single" ? "single_exit_message.txt" : "multiple_exit_messages.txt";
  const blob = new Blob([content], { type: "application/json;charset=utf-8" });
  saveAs(blob, fileName);
};

const removeValidatorKeys = async () => {
  if (stakingStore.removeKeys && stakingStore.removeKeys.length > 0) {
    // filter for local and remote keys
    let localKeys = [];
    let remoteKeys = [];
    stakingStore.removeKeys.forEach((k) => {
      if (k.isRemote) {
        remoteKeys.push(k.key);
      } else {
        localKeys.push(k.key);
      }
    });

    //check if all belong to the same vc
    let id = "";
    let changed = 0;
    stakingStore.removeKeys.forEach((key) => {
      if (id != key.validatorID) {
        id = key.validatorID;
        changed++;
      }
    });

    if (changed === 1 && id) {
      // Remove all Local Keys if selected validator holds some
      if (localKeys && localKeys.length > 0) {
        const returnVal = await deleteValidators(id, localKeys, stakingStore.pickedSlashing);

        if (stakingStore.pickedSlashing === "yes") {
          downloadFile(returnVal);
        }
      }
      // Remove all Remote Keys if selected validator holds some
      if (remoteKeys && remoteKeys.length > 0) {
        await deleteRemoteKeys(id, remoteKeys);
      }
    } else if (changed === 0) {
      console.log("Nothing to delete!");
    } else {
      console.log("Multiple validator services are not supported yet!");
    }
    stakingStore.removeKeys = [];

    // Refresh the list of keys
    stakingStore.forceRefresh = true;
    await listKeys();
    await listGroups();
    stakingStore.isGroupListActive = false;

    stakingStore.removeResponse = [];
    stakingStore.setActiveModal(null);
  }
};

const downloadFile = (data) => {
  let json = JSON.stringify(data);
  let blob = new Blob([json], { type: "application/json" });
  let url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "slashingDB");
  link.click();
  window.URL.revokeObjectURL(url);
};

// ******  Key Color *******
const getKeySetupColor = () => {
  try {
    stakingStore.keys = stakingStore?.keys.map((key) => {
      const allSetups = useDeepClone(setupStore.allSetups);
      const setup = allSetups.find((s) => s?.services.some((service) => service.id === key.validatorID));
      const setupColor = setup ? setup.color : "default";
      return {
        ...key,
        color: setupColor,
      };
    });
  } catch (error) {
    console.error("Error fetching setup color:", error);
  }
};

// ******  Remote Key *******

const importRemoteKey = async (args) => {
  stakingStore.setActivePanel(null);
  stakingStore.isRemoteListActive = false;
  stakingStore.previewRemoteKeys = [];
  stakingStore.remoteUrl = "";

  //************ Infos ************
  // stakingStore.remoteUrl is if the user wants to import from a remote url
  //stakingStore.selectedServiceToFilter is the selected validator filter on sidebar
  await ControlService.importRemoteKeys(args);

  stakingStore.forceRefresh = true;
  await listKeys();
  stakingStore.setActiveModal(null);
};

const confirmImportRemoteKeys = async () => {
  stakingStore.setActiveModal("remote");
  stakingStore.checkActiveValidatorsResponse = await ControlService.checkActiveValidators({
    files: stakingStore.previewRemoteKeys.filter((k) => k.selected).map((k) => k.pubkey),
    serviceID: stakingStore.selectedServiceToFilter.config?.serviceID,
    isRemote: true,
  });
  stakingStore.setActivePanel(null);
  if (
    stakingStore.checkActiveValidatorsResponse.length === 0 ||
    stakingStore.checkActiveValidatorsResponse.includes("Validator check error:\n")
  ) {
    importRemoteKey(
      useDeepClone({
        serviceID: stakingStore.selectedServiceToFilter.config?.serviceID,
        url: stakingStore.previewRemoteKeys[0]?.url,
        pubkeys: stakingStore.previewRemoteKeys.filter((k) => k.selected).map((k) => k.pubkey),
      })
    );

    stakingStore.keyFiles = [];
    stakingStore.passwordFiles = [];
    stakingStore.previewRemoteKeys = [];
  } else {
    stakingStore.setActiveModal("risk");
    console.log("error: there are active validators");
  }
};

//****End of Client Commands Buttons ****

onUnmounted(() => {
  setupStore.selectedSetup = null;
  getServerView();
  clearInterval(fetchInterval.value);
});
</script>
