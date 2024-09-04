<template>
  <base-layout>
    <!-- Start Node main layouts -->

    <div class="w-full h-full grid grid-cols-24 relative select-none">
      <div class="col-start-1 col-span-1 flex justify-center items-center">
        <SidebarSection @network-modal="displaySwitchNetwork" @nuke-node="openNukeNodeModal" />
      </div>
      <div class="col-start-2 col-end-17 w-full h-full relative">
        <EditBody
          :drop-zone="isOverDropZone"
          @on-drop="onDrop"
          @confirm-connection="confirmConnection"
          @switch-client="switchClientModalhandler"
          @modify-service="serviceModifyHandler"
          @delete-service="selectedServiceToRemove"
          @delete-setup="deleteSetup"
          @confirm-consensus="confirmConsensusConnection"
          @info-modal="openInfoModal"
        />
      </div>
      <div class="col-start-17 col-end-21 ml-1 grid grid-cols-2 grid-rows-9">
        <NetworkStatus />
        <ServiceSection @change-connection="serviceModifyHandler" @delete-service="selectedServiceToRemove" />
      </div>
      <div class="col-start-21 col-end-25 px-1 flex flex-col justify-between">
        <ChangesSection @remove-change="cancelChangeHandler" @confirm-changes="confirmHandler" />
      </div>
    </div>
    <!-- End Node main layout -->
    <!-- Start drawer layout -->
    <img
      class="w-10 absolute top-50 -right-5 cursor-pointer z-0"
      src="/img/icon/edit-node-icons/sidebar-out.png"
      alt="Arrow Icon"
      @mousedown.prevent.stop
      @click="handleDrawer"
      @mouseenter="footerStore.cursorLocation = 'all services'"
      @mouseleave="footerStore.cursorLocation = ''"
    />
    <transition name="drawerSlide" mode="out-in">
      <drawer-box v-if="manageStore.isDrawerOpen" @mouseleave="drawerMouseLeave">
        <template #default>
          <DrawerMenu
            v-if="manageStore.isDrawerMenuActive"
            @import-setup="importSetup"
            @create-setup="openNetworkMenu"
            @add-service="addServerServices"
          />
          <SetupsDrawer
            v-else-if="manageStore.isSetupsDrawerActive"
            @close-window="closeSetupModal"
            @create-custom="createCustomSetup"
            @get-network="getSetupNetwork"
          />
          <ServicesDrawer v-else-if="manageStore.isServicesDrawerActive" :dragging="startDrag" @add-services="addServices" />
        </template>
      </drawer-box>
    </transition>
    <!-- End drawer layout -->
    <!-- Custom Modals -->
    <TransitionGroup name="fadeModal">
      <!-- Start Network Switch Modal -->
      <NetworkModal v-if="manageStore.displayNetworkList" @close-window="closeNetworkModal" @switch-confirm="switchNetworkConfirm" />
      <!-- End Switch Network Modal -->
      <!-- Start Switch Client Modal -->
      <SwitchModal
        v-if="isSwitchModalOpen"
        :client="clientToSwitch"
        @close-window="closeSwitchModal"
        @switch-confirm="switchClientConfirm"
      />
      <!-- End Switch Client Modal -->
      <!-- Start Info Modal -->
      <InfoModal v-if="isInfoModalOpen" :client="clientForInfo" @close-window="closeInfoModal" @ok-button="isInfoModalOpen = false" />
      <!-- End Info Modal -->
      <!-- Start Modify Services Modal -->
      <ModifyModal
        v-if="isModifyModalOpen"
        :client="clientToModify"
        @close-window="hideModifyModal"
        @confirm-modify="confirmModifyingService"
      />
      <!-- End Modify Services Modal -->
      <!-- Start Add configs for Custom Service -->

      <AddCustom
        v-if="clientToInstall?.configPanel"
        :client="clientToInstall"
        @close-window="cancelInstallation"
        @confirm-create="addServiceHandler"
      />

      <!-- End Add configs for Custom Service -->

      <!-- Start Add New Service Modal -->
      <AddModal
        v-if="clientToInstall?.addPanel"
        :client="clientToInstall"
        @close-window="cancelInstallation"
        @confirm-install="addServiceHandler"
      />
      <!-- End Add New Service Modal -->
      <!-- Start Nuke Modal -->
      <NukeModal
        v-if="isNukeModalOpen"
        ref="nukeModalComponent"
        @close-me="closeNukeModal"
        @remove-items="nukeConfirmation"
        @back-to-login="backToLogin"
      />
      <!-- End Nuke Modal -->

      <!-- Start Import Setup -->
      <ImportSetup v-if="manageStore.isImportSetupYamlActive" @confirm-import="confirmImportSingleSetup" />
      <!-- End Import Setup -->
      <!-- Start Create Setup -->
      <CreateSetup v-if="setupStore.isCreateSetupModalActive" :network="selectedSetupNetwork" />
      <!-- End Create Setup -->

      <!-- Start Setup Infos -->
      <SetupInfos v-if="setupStore.selectedSetupInfos" />
    </TransitionGroup>
    <LoaderAnime v-if="manageStore.disableConfirmButton || setupStore.isImportAnimeActive" :anime="getAimationSrc" />
  </base-layout>
</template>
<script setup>
import { useDeepClone } from "@/composables/utils";
import { useListKeys } from "@/composables/validators";
import ControlService from "@/store/ControlService";
import { useNodeHeader } from "@/store/nodeHeader";
import { useNodeManage } from "@/store/nodeManage";
import { useServers } from "@/store/servers";
import { useServices } from "@/store/services";
import { useFooter } from "@/store/theFooter";
import { useStakingStore } from "@/store/theStaking";
import { computed, onMounted, onUnmounted, ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useMultiSetups } from "../../../composables/multiSetups";
import { useSetups } from "../../../store/setups";
import NetworkStatus from "../../layers/NetworkStatus.vue";
import DrawerBox from "./components/drawer/DrawerBox.vue";
import DrawerMenu from "./components/drawer/DrawerMenu.vue";
import ServicesDrawer from "./components/drawer/ServicesDrawer.vue";
import SetupsDrawer from "./components/drawer/SetupsDrawer.vue";
import EditBody from "./components/edit/EditBody";
import LoaderAnime from "./components/loader-anime/LoaderAnime.vue";
import AddModal from "./components/modals/AddModal.vue";
import InfoModal from "./components/modals/InfoModal.vue";
import ModifyModal from "./components/modals/ModifyModal.vue";
import NetworkModal from "./components/modals/NetworkModal.vue";
import NukeModal from "./components/modals/NukeModal.vue";
import SwitchModal from "./components/modals/SwitchModal.vue";
import AddCustom from "./components/modals/custom-service/AddCustom.vue";
import CreateSetup from "./components/modals/setups/CreateSetup.vue";
import ImportSetup from "./components/modals/setups/ImportSetup.vue";
import SetupInfos from "./components/modals/setups/SetupInfos.vue";
import ChangesSection from "./sections/ChangesSection.vue";
import ServiceSection from "./sections/ServiceSection.vue";
import SidebarSection from "./sections/SidebarSection.vue";
import { useFrontendServices } from "@/composables/services";

const setupStore = useSetups();
const footerStore = useFooter();
const serviceStore = useServices();
const manageStore = useNodeManage();
const headerStore = useNodeHeader();
const stakingStore = useStakingStore();
const serverStore = useServers();

// Router
const router = useRouter();
// Refs
const isOverDropZone = ref(false);
const clientToRemove = ref(null);
const clientToSwitch = ref(null);
const clientForInfo = ref(null);
const clientToModify = ref(null);
const clientToInstall = ref(null);
const isConfirmLoading = ref(false);
const isSwitchModalOpen = ref(false);
const isInfoModalOpen = ref(false);
const isModifyModalOpen = ref(false);
const isAddModalOpen = ref(false);
const clientToConnect = ref(null);
const isNukeModalOpen = ref(false);
const nukeModalComponent = ref();
const selectedSetupNetwork = ref("");
const changeAnime = ref("/animation/confirm-changes/modify.gif");
const setupImportAnime = ref("/animation/setup/loader.gif");
const { loadSetups, getAllSetups, getServerView, updateDom } = useMultiSetups();

// Computed & Watcher

const isLoadingNewConfiguration = ref(true);

const getAimationSrc = computed(() => {
  let animationSrc = "";
  if (manageStore.disableConfirmButton) {
    animationSrc = changeAnime.value;
  } else if (setupStore.isImportAnimeActive) {
    animationSrc = setupImportAnime.value;
  }
  return animationSrc;
});

// watch(
//   () => manageStore.newConfiguration,
//   () => {
//     isLoadingNewConfiguration.value = false;

//     // updateDisplayNetworkList();
//   },
//   { deep: true }
// );

watchEffect(() => {
  if (setupStore.isImportAnimeActive) {
    setTimeout(() => {
      setupStore.isImportAnimeActive = false;
    }, 5000);
  }
});
watchEffect(() => {
  if (setupStore.selectedSetup === null) {
    setupStore.isEditConfigViewActive = false;
  }
});

// Methods

onMounted(async () => {
  await fetchSetups();
  if (!manageStore.architecture) setArchitecture();
  editSetupsPrepration();
  isLoadingNewConfiguration.value = false;
  manageStore.confirmChanges = [];
  manageStore.newConfiguration.forEach((el) => {
    return {
      ...el,
      serviceIsConnected: false,
      connectedToExecution: false,
      connectedToValidator: false,
      isNotConnectedToValidator: false,
      connectedToConsensus: false,
      isNotConnectedToConsensus: false,
      isRemoveProcessing: false,
      isConnectedToMevboost: false,
      isNotConnectedToMevboost: false,
      isConfirmProcessing: false,
      isServiceConnecting: false,
      isResyncModalOpen: false,
      isModifyPanelOpen: false,
      isAddPanelOpen: false,
    };
  });
});

onUnmounted(() => {
  setupStore.editSetups = [];
  setupStore.isEditConfigViewActive = false;
  setupStore.isRenameSetupActive = false;
  setupStore.setupToRename = null;
  setupStore.selectedSetup = null;
  manageStore.confirmChanges = [];
  manageStore.newConfiguration = [];
  manageStore.selectedNetwork = {};
  manageStore.configNetwork = {};
  getServerView();
});

// Methods
const fetchSetups = async () => {
  await loadSetups();
  setupStore.editSetups = getAllSetups();
};

const listKeys = async (forceRefresh) => {
  await useListKeys(forceRefresh);
};

// Random ID generator
function generateRandomId() {
  const timestamp = new Date().getTime().toString(16);
  const randomPart = Math.random().toString(16).substring(2, 8);
  return timestamp + randomPart;
}

const setArchitecture = async () => {
  let settings = await ControlService.getStereumSettings();
  manageStore.architecture = settings.stereum?.settings.arch;
};

const randomId = computed(() => generateRandomId());

// Switch Clients methods
const switchClientModalhandler = (item) => {
  manageStore.isLineHidden = true;
  item.replacePanel = true;
  clientToSwitch.value = item;
  if (item.replacePanel) {
    isSwitchModalOpen.value = true;
  } else {
    isSwitchModalOpen.value = false;
  }
};

const switchClientConfirm = (properties) => {
  isSwitchModalOpen.value = false;
  const current = manageStore.newConfiguration.find((e) => e?.config.serviceID === properties.itemToReplace.config.serviceID);

  const currentClientIndex = manageStore.newConfiguration.indexOf(current);

  manageStore.newConfiguration.splice(currentClientIndex, 1);

  let item = useDeepClone(properties.itemToInstall);
  if (
    item?.category === "service" &&
    manageStore.newConfiguration.map((s) => s.service).includes(item.service) &&
    setupStore.selectedSetup?.setupId === properties.itemToInstall?.setupId
  ) {
    return;
  } else {
    item.id = manageStore.newConfiguration.length;
    const newItem = {
      ...item,
      isNewClient: true,
      setupId: setupStore.selectedSetup?.setupId,
    };
    manageStore.newConfiguration.push(newItem);
  }

  manageStore.confirmChanges.push({
    id: properties.itemToReplace.config?.serviceID,
    content: "SWITCH CLIENT",
    contentIcon: "/img/icon/edit-node-icons/switch-client-icon.png",
    service: properties.itemToReplace,
    setupId: setupStore.selectedSetup?.setupId,
    data: {
      itemToInstall: properties.itemToInstall,
      data: {
        network: properties.itemToReplace.config.network,
        installDir: "/opt/stereum",
        executionClients: [],
        consensusClients: [],
        otherServices: [],
        checkpointURL: properties.checkPointSyncUrl ? properties.checkPointSyncUrl : false,
      },
    },
  });
  manageStore.isLineHidden = false;
};
// Clients Modifying methods

const confirmModifyingService = (item) => {
  isModifyModalOpen.value = false;
  if (item.client.service === "FlashbotsMevBoostService") {
    changeMevboostConnection();
  }

  manageStore.confirmChanges.push({
    id: randomId,
    content: "MODIFY",
    contentIcon: "/img/icon/edit-node-icons/service-connected.png",
    service: item.client,
    data: {
      executionClients: item.executionClients,
      consensusClients: item.consensusClients,
      otherServices: item.otherServices,
    },
  });
  manageStore.isLineHidden = false;
};

const serviceModifyHandler = (item) => {
  item.modifierPanel = true;
  clientToModify.value = item;
  isModifyModalOpen.value = true;
};

const hideModifyModal = () => {
  manageStore.isLineHidden = false;
  isModifyModalOpen.value = false;
  manageStore.newConfiguration = JSON.parse(JSON.stringify(serviceStore.installedServices));
};
const confirmConsensusConnection = (item) => {
  clientToConnect.value.isNotConnectedToConsensus = false;
  manageStore.confirmChanges.push({
    id: randomId,
    content: "CLIENT CONNECT",
    contentIcon: "/img/icon/edit-node-icons/service-connecting.png",
    service: item,
  });
};

// Mevboost connection methods

const changeMevboostConnection = () => {
  manageStore.isLineHidden = true;
  const hasConsensusWithMevboost = manageStore.newConfiguration.some((e) => {
    return e.category === "consensus" && !e.config.dependencies.mevboost[0];
  });
  if (hasConsensusWithMevboost) {
    manageStore.newConfiguration.forEach((e) => {
      if (e.config.dependencies.mevboost[0]) {
        e.isConnectedToMevboost = true;
      } else if (!e.config.dependencies.mevboost[0]) {
        e.isNotConnectedToMevboost = true;
      }
    });
  } else {
    return;
  }
};

const confirmConnection = (item) => {
  isConfirmLoading.value = true;
  setTimeout(() => {
    isConfirmLoading.value = false;
    item.isNotConnectedToMevboost = false;
    item.isConnectedToMevboost = true;
  }, 2000);
  manageStore.isLineHidden = false;
};

// Drawer methods

const openDrawer = () => {
  if (setupStore.isEditConfigViewActive) {
    manageStore.isDrawerOpen = true;
    manageStore.isDrawerMenuActive = false;
    manageStore.isServicesDrawerActive = true;
    manageStore.isSetupsDrawerActive = false;
  } else {
    manageStore.isDrawerOpen = true;
    manageStore.isServicesDrawerActive = false;
    manageStore.isSetupsDrawerActive = false;
    manageStore.isDrawerMenuActive = true;
  }
};

const handleDrawer = () => {
  openDrawer();
};

const openNetworkMenu = () => {
  manageStore.isDrawerMenuActive = false;
  manageStore.isServicesDrawerActive = false;
  manageStore.isSetupsDrawerActive = true;
};
const createCustomSetup = () => {
  console.log("Create Custom Setup");
};

const getSetupNetwork = (network) => {
  selectedSetupNetwork.value = network;
  manageStore.isDrawerOpen = false;
  manageStore.isSetupsDrawerActive = false;
  setupStore.isCreateSetupModalActive = true;
};

const drawerMouseLeave = () => {
  manageStore.isDrawerOpen = false;
  manageStore.isServicesDrawerActive = false;
  manageStore.isSetupsDrawerActive = false;
};

//Change Box methods

const cancelChangeHandler = (item) => {
  isAddModalOpen.value = false;
  item.service.isRemoveProcessing = false;
  if (item) {
    if (item.content === "INSTALL") {
      const event = manageStore.newConfiguration.find((e) => e.id === item.service.id);
      const eventIdx = manageStore.newConfiguration.indexOf(event);
      manageStore.newConfiguration.splice(eventIdx, 1);
    }
    if (item.content === "SWITCH CLIENT") {
      const event = manageStore.newConfiguration.find((e) => e.id === item.service.id);
      const eventIdx = manageStore.newConfiguration.indexOf(event);
      manageStore.newConfiguration.splice(eventIdx, 1);
      manageStore.newConfiguration = JSON.parse(JSON.stringify(serviceStore.installedServices));
    }

    if (item.content === "MODIFY") {
      item.service.modifierPanel = false;
    }

    const event = manageStore.confirmChanges.find((e) => e.id === item.id);
    const eventIdx = manageStore.confirmChanges.indexOf(event);
    manageStore.confirmChanges.splice(eventIdx, 1);
  }
  manageStore.isLineHidden = false;
};

// Add service with  click

const addServices = (service) => {
  let item = useDeepClone(service);
  if (
    item?.category === "service" &&
    manageStore.newConfiguration.map((s) => s.service).includes(item.service) &&
    setupStore.selectedSetup?.setupId === service?.setupId
  ) {
    return;
  } else {
    item.id = manageStore.newConfiguration.length;
    const newItem = {
      ...item,
      isNewClient: true,
      setupId: setupStore.selectedSetup?.setupId,
    };
    manageStore.newConfiguration.push(newItem);
    clientToInstall.value = newItem;
    clientToInstall.value.addPanel = true;
  }
};

const addServerServices = (service) => {
  let item = useDeepClone(service);

  if (item.category === "service" && manageStore.newConfiguration.map((s) => s?.service).includes(item?.service)) {
    return;
  } else {
    item.id = manageStore.newConfiguration.length;
    const newItem = {
      ...item,
      isNewClient: true,
    };
    manageStore.newConfiguration.push(newItem);

    setupStore.editSetups.find((s) => s.setupId === setupStore.selectedSetup?.setupId)?.services.push(newItem);

    clientToInstall.value = newItem;
    clientToInstall.value.addPanel = true;
  }
};

// Add service with drag and drop

const startDrag = (event, item) => {
  manageStore.isLineHidden = false;
  if (event.type === "dragstart") {
    event.dataTransfer.dropEffect = "move";
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("itemId", item.id);
  }
};

const onDrop = (event) => {
  manageStore.isLineHidden = true;
  const allServices = useDeepClone(serviceStore.allServices);
  const itemId = event.dataTransfer.getData("itemId");
  let item = allServices.find((item) => item.id == itemId);
  if (item.category === "service" && manageStore.newConfiguration.map((s) => s.service).includes(item.service)) {
    return;
  } else {
    item.id = manageStore.newConfiguration.length;
    const newItem = {
      ...item,
      isNewClient: true,
    };
    manageStore.newConfiguration.push(newItem);
    clientToInstall.value = newItem;
    clientToInstall.value.addPanel = true;
  }
};

//Confirm Adding service

const addServiceHandler = (item) => {
  if (item.client.service === "CustomService" && !item.customConfigReady) {
    manageStore.customConfig.installDir = item.installDir;
    clientToInstall.value.configPanel = true;
    return;
  }
  let dataObject = {
    setupId: setupStore.selectedSetup?.setupId,
    network: setupStore.selectedSetup?.network,
    installDir: item.installDir || "/opt/stereum",
    executionClients: item.executionClients,
    consensusClients: item.consensusClients,
    otherServices: item.otherServices,
    relays: item.relays.map((r) => r[setupStore.selectedSetup?.network]).join(),
    checkpointURL: item.checkPointSyncUrl || false,
    //CustomService Attributes
    image: item.image,
    entrypoint: item.entrypoint,
    command: item.command,
    ports: item.ports,
    volumes: item.volumes,
  };

  if (item.client.service === "ExternalExecutionService") {
    dataObject.source = item.client.config?.source;
    dataObject.jwtToken = item.client.config?.jwtToken;
  } else if (item.client.service === "ExternalConsensusService") {
    dataObject.source = item.client.config?.source;
    dataObject.gateway = item.client.config?.gateway;
  }

  manageStore.confirmChanges.push({
    id: randomId,
    content: "INSTALL",
    contentIcon: "/img/icon/edit-node-icons/add-service-icon.png",
    service: item.client,
    data: dataObject,
  });
};

// Cancel Adding service

const cancelInstallation = (item) => {
  clientToInstall.value = null;
  isAddModalOpen.value = false;
  if (item?.service === "CustomService") {
    manageStore.customConfig = {
      image: "",
      entrypoint: "",
      command: "",
      ports: [],
      paths: [],
    };
    item.configPanel = false;
  }

  const event = manageStore.newConfiguration.find((e) => e.id === item?.id);
  const eventIdx2 = manageStore.newConfiguration.indexOf(event);
  manageStore.newConfiguration.splice(eventIdx2, 1);
  manageStore.isLineHidden = false;
  // manageStore.newConfiguration = JSON.parse(JSON.stringify(serviceStore.installedServices));
};

// Network switch methods
const displaySwitchNetwork = () => {
  manageStore.isLineHidden = true;
  manageStore.displayNetworkList = true;
};

const switchNetworkConfirm = (network) => {
  manageStore.displayNetworkList = false;
  if (network?.network != setupStore.selectedSetup?.network) {
    if (manageStore.confirmChanges.map((j) => j.content).includes("CHANGE NETWORK")) {
      let index = manageStore.confirmChanges.findIndex((j) => j.content.includes("CHANGE NETWORK"));
      if (setupStore.selectedSetup.network === network.network) {
        manageStore.confirmChanges.splice(index, 1);
      } else {
        manageStore.confirmChanges[index].data.network = network.network;
        manageStore.confirmChanges[index].service.icon = network.icon;
      }
    } else if (manageStore.newConfiguration.length > 0) {
      manageStore.confirmChanges.push({
        id: network.network,
        content: "NETWORK",
        contentIcon: "/img/icon/edit-node-icons/switch-client.png",
        service: network,
        data: { network: network.network },
      });
      setupStore.selectedSetup.network = network.network;
      setupStore.editSetups = setupStore.editSetups.map((s) => {
        if (s.setupId === setupStore.selectedSetup.setupId) {
          s.network = network.network;
        }
        return s;
      });
    } else if (manageStore.newConfiguration.length === 0) {
      return;
    }
  }
  manageStore.isLineHidden = false;
  manageStore.configNetwork = network;
};

// Nuke node method

const openNukeNodeModal = async () => {
  manageStore.isLineHidden = true;
  isNukeModalOpen.value = true;
};

const selectedServiceToRemove = (item) => {
  manageStore.isLineHidden = true;
  item.displayPluginMenu = false;
  const commonServiceExistance = setupStore.serverServices.includes(item.service);
  let commonService = setupStore.editSetups.find((s) => {
    return s.setupName === "commonServices";
  });
  if (item.isNotConnectedToConsensus || item.isNotConnectedToValidator || item.isNotConnectedToMevboost || item.isDisplayPluginMenu) {
    return;
  } else {
    clientToRemove.value = item;
    item.isRemoveProcessing = true;
  }

  item.displayTooltip = false;

  manageStore.selectedItemToRemove.push(item);
  const confirmDelete = {
    id: item.config?.serviceID || item.id,
    content: "DELETE",
    contentIcon: "/img/icon/edit-node-icons/delete-service.png",
    service: item,
    setupId: commonServiceExistance ? commonService.setupId : setupStore.selectedSetup?.setupId,
  };
  const itemExists = manageStore.confirmChanges.some(
    (e) => (e.id === item.config?.serviceID || e.id === item.id) && e.content === "DELETE"
  );
  if (!itemExists) {
    manageStore.confirmChanges.push(confirmDelete);
  }
};

const openInfoModal = (item) => {
  clientForInfo.value = item;
  isInfoModalOpen.value = true;
};

const destroyNode = async () => {
  manageStore.isLineHidden = true;
  try {
    let condition = true;
    await ControlService.clearTasks();
    ControlService.destroy(); // no await, we wanna read tasks while deletion is in progress
    const uxtStart = Math.floor(Date.now() / 1000);
    const secMax = 30; // wait max X seconds to finish destroy process
    while (condition) {
      const secElapsed = Math.floor(Math.floor(Date.now() / 1000) - uxtStart);
      if (secElapsed >= secMax) {
        console.log("abort -> timeout -> secElapsed", secElapsed);
        await ControlService.clearTasks();
        break;
      }
      const tasks = await ControlService.getTasks();
      const task = tasks.findLast((t) => t.name.includes("Delete Node"));
      const subtasks = task && task.hasOwnProperty("subTasks") ? task.subTasks : null;
      let status = task && task.hasOwnProperty("status") ? task.status : null;
      const myresult = [];
      myresult.push("nuke node executed (ok)");
      if (subtasks && Array.isArray(subtasks) && subtasks.length > 0) {
        myresult.push("gathering facts (ok)");
        for (const element of subtasks) {
          const subtask = element;
          myresult.push(subtask.name + " (" + subtask.status + ")");
        }
      } else if (secElapsed >= 2) {
        myresult.push("gathering facts (ok)");
      }
      nukeModalComponent.value.nukeData = myresult;
      if (status != null) {
        status = status === "success" ? "ok" : status;
        myresult.push("node nuked (" + status + ")");
        nukeModalComponent.value.nukeData = myresult;
        await ControlService.clearTasks();
        condition = false;
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 100)); // sleep 100ms between attempts
    }
  } catch (e) {
    console.error(e);
  } finally {
    headerStore.refresh = true;
    stakingStore.forceRefresh = true;
    stakingStore.keys = [];
    serviceStore.versions = {};
    headerStore.runningServices = [];
    serviceStore.runningServices = [];
    serviceStore.installedServices = [];
    manageStore.newConfiguration = [];
    nukeModalComponent.value.loginBtn = false;
  }
};

// Confirm Changes methods
const confirmHandler = async () => {
  manageStore.disableConfirmButton = true;

  const setupExists = manageStore.confirmChanges.some(
    (item) => item.service?.hasOwnProperty("setupName") && item.service?.hasOwnProperty("setupId") && item.service.setupId == item.id
  );

  const serverServiceExists = manageStore.confirmChanges.some(
    (change) => change.content === "INSTALL" && setupStore.serverServices.includes(change.service.service)
  );

  try {
    if (serverServiceExists) {
      await handleServerServiceChanges();
    } else if (setupExists && manageStore.confirmChanges.some((e) => e.content === "DELETE")) {
      await handleSetupChanges();
    } else if (manageStore.confirmChanges.some((e) => e.content === "NETWORK")) {
      await handleSwitchSetupNetwork();
      await ControlService.handleServiceChanges(JSON.parse(JSON.stringify(manageStore.confirmChanges)));
    } else if (manageStore.confirmChanges.some((e) => e.content === "MODIFY")) {
      await ControlService.handleServiceChanges(JSON.parse(JSON.stringify(manageStore.confirmChanges)));
    } else {
      await ControlService.handleServiceChanges(JSON.parse(JSON.stringify(manageStore.confirmChanges)));
    }
  } catch (error) {
    console.error("Error processing changes:", error);
  } finally {
    await useFrontendServices();
    await resetState();
  }
};

const handleServerServiceChanges = async () => {
  const commonServicesId = setupStore.editSetups.find((s) => s.setupName === "commonServices")?.setupId;
  manageStore.confirmChanges.forEach((change) => {
    change.data.setupId = commonServicesId ?? change.data.setupId;
  });
  await ControlService.handleServiceChanges(JSON.parse(JSON.stringify(manageStore.confirmChanges)));
};

const handleSetupChanges = async () => {
  const setupsToRemoveIds = new Set(setupStore.selectedSetupToRemove.map((s) => s.setupId));
  setupStore.allSetups = setupStore.allSetups.filter((e) => !setupsToRemoveIds.has(e.setupId));
  setupStore.editSetups = setupStore.editSetups.filter((e) => !setupsToRemoveIds.has(e.setupId));

  let subtasks = manageStore.confirmChanges.flatMap((e) => e.subTasks);
  await ControlService.handleServiceChanges(JSON.parse(JSON.stringify(subtasks)));
  for (const setup of setupStore.selectedSetupToRemove) {
    await ControlService.deleteSetup(setup.setupId);
  }
};

const handleSwitchSetupNetwork = async () => {
  const setupId = setupStore.selectedSetup?.setupId;
  const network = manageStore.selectedNetwork.network;
  const data = {
    setupId: setupId,
    network: network,
  };
  await ControlService.switchSetupNetwork(data);
};

const resetState = async () => {
  manageStore.confirmChanges = [];
  manageStore.selectedNetwork = {};
  setupStore.selectedSetupToRemove = [];
  manageStore.isLineHidden = false;
  await listKeys();
  await updateDom();
  setTimeout(() => {
    manageStore.disableConfirmButton = false;
  }, 3000);
};

const nukeConfirmation = () => {
  headerStore.refresh = false;
  destroyNode();
};
const backToLogin = async () => {
  serverStore.connectingAnimActive = false;

  router.push("/login").then(() => {
    location.reload();
  });
  await ControlService.logout();
};

// Setups methods
const editSetupsPrepration = () => {
  setupStore.editSetups = setupStore.allSetups.map((setup) => {
    if (setup.isActive) {
      setup.isActive = false;
    }
    return setup;
  });
  setupStore.isSetupMenuActive = false;
  setupStore.selectedSetup = null;
};

const deleteSetup = async (item) => {
  setupStore.selectedSetupToRemove.push(item);
  setupStore.editSetups = setupStore.editSetups.map((e) => {
    if (e.setupId === item.setupId) {
      e.isRemoveProcessing = true;
    }
    return e;
  });
  const subtasks =
    item?.services.flatMap((service) => {
      const matchedServices = manageStore.newConfiguration.filter((e) => e.config?.serviceID === service.config?.serviceID);

      return matchedServices.map((e) => ({
        id: e.config?.serviceID,
        content: "DELETE",
        contentIcon: "/img/icon/edit-node-icons/delete-service.png",
        service: e,
        setupId: item.setupId,
      }));
    }) || [];

  manageStore.selectedItemToRemove.push(item);
  const confirmDelete = {
    id: item.setupId,
    content: "DELETE",
    contentIcon: "/img/icon/edit-node-icons/delete-service.png",
    service: item,
    subTasks: subtasks,
  };

  const itemExists = manageStore.confirmChanges.some((e) => e.id === item.setupId && e.content === "DELETE");
  if (!itemExists) {
    manageStore.confirmChanges.push(confirmDelete);
  }
};

const importSetup = () => {
  manageStore.isImportSetupYamlActive = true;
};
const confirmImportSingleSetup = async (data) => {
  await ControlService.importSingleSetup(useDeepClone(data));
  setupStore.setupDataToImport = [];
  manageStore.isImportSetupYamlActive = false;
  setupStore.isImportAnimeActive = true;
};

const closeNetworkModal = () => {
  manageStore.displayNetworkList = false;
  manageStore.isLineHidden = false;
};

const closeSwitchModal = () => {
  isSwitchModalOpen.value = false;
  manageStore.isLineHidden = false;
  manageStore.newConfiguration = JSON.parse(JSON.stringify(serviceStore.installedServices));
};

const closeInfoModal = () => {
  isInfoModalOpen.value = false;
  manageStore.isLineHidden = false;
};

const closeNukeModal = () => {
  isNukeModalOpen.value = false;
  manageStore.isLineHidden = false;
};

const closeSetupModal = () => {
  setupStore.isCreateSetupModalActive = false;
};
</script>

<style scoped>
.fadeModal-enter-active,
.fadeModal-leave-active {
  transition: opacity 0.5s ease;
}

.fadeModal-enter-from,
.fadeModal-leave-to {
  opacity: 0;
}

.drawerSlide-enter-active {
  transition: all 0.3s ease-out;
}

.drawerSlide-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.drawerSlide-enter-from,
.drawerSlide-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
</style>
