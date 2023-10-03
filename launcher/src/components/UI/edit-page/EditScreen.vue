<template>
  <base-layout>
    <!-- Start Node main layouts -->
    <div class="w-full h-full grid grid-cols-24 relative">
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
          @confirm-consensus="confirmConsensusConnection"
          @info-modal="openInfoModal"
        />
      </div>
      <div class="col-start-17 col-end-21 ml-1">
        <ServiceSection @change-connection="serviceModifyHandler" @delete-service="selectedServiceToRemove" />
      </div>
      <div class="col-start-21 col-end-25 px-1 flex flex-col justify-between">
        <ChangesSection @remove-change="removeChangeHandler" />
      </div>
    </div>
    <!-- End Node main layout -->
    <!-- Start drawer layout -->
    <img
      class="w-10 absolute top-50 -right-5 cursor-pointer"
      src="/img/icon/manage-node-icons/sidebar-out.png"
      alt="Arrow Icon"
      @mousedown.prevent.stop
      @click="openDrawer"
    />
    <transition name="drawerSlide" mode="out-in">
      <DrawerBox
        v-if="manageStore.isDrawerOpen"
        :dragging="startDrag"
        @add-service="addServices"
        @mouseleave="manageStore.isDrawerOpen = false"
      />
    </transition>
    <!-- End drawer layout -->
    <!-- Custom Modals -->
    <TransitionGroup name="fadeModal">
      <!-- Start Network Switch Modal -->
      <NetworkModal
        v-if="manageStore.displayNetworkList"
        @close-window="manageStore.displayNetworkList = false"
        @switch-confirm="switchNetworkConfirm"
      />
      <!-- End Switch Network Modal -->
      <!-- Start Switch Client Modal -->
      <SwitchModal
        v-if="isSwitchModalOpen"
        :client="clientToSwitch"
        main-title="Switch Client"
        confirm-text="Confirm"
        click-outside-text="Click outside to cancel"
        @close-window="isSwitchModalOpen = false"
        @switch-confirm="switchClientConfirm"
      />
      <!-- End Switch Client Modal -->
      <!-- Start Info Modal -->
      <InfoModal
        v-if="isInfoModalOpen"
        :client="clientForInfo"
        @close-window="isInfoModalOpen = false"
        @ok-button="isInfoModalOpen = false"
      />
      <!-- End Info Modal -->
      <!-- Start Modify Services Modal -->
      <ModifyModal
        v-if="isModifyModalOpen"
        :client="clientToModify"
        @close-window="hideModifyModal"
        @confirm-modify="confirmModifyingService"
      />
      <!-- End Modify Services Modal -->
      <!-- Start Add New Service Modal -->
      <AddModal
        v-if="isAddModalOpen"
        :client="clientToInstall"
        @close-window="cancelInstallation"
        @confirm-install="serviceInstallHandler"
      />
      <!-- End Add New Service Modal -->
      <!-- Start Nuke Modal -->
      <NukeModal
        v-if="isNukeModalOpen"
        ref="nukeModalComponent"
        @close-me="isNukeModalOpen = false"
        @remove-items="nukeConfirmation"
        @back-to-login="backToLogin"
      />
      <!-- End Nuke Modal -->
    </TransitionGroup>
  </base-layout>
</template>
<script setup>
import SidebarSection from "./sections/SidebarSection.vue";
import EditBody from "./components/edit/EditBody";
import ServiceSection from "./sections/ServiceSection.vue";
import ChangesSection from "./sections/ChangesSection.vue";
import DrawerBox from "./components/drawer/DrawerBox.vue";
import NetworkModal from "./components/modals/NetworkModal.vue";
import SwitchModal from "./components/modals/SwitchModal.vue";
import InfoModal from "./components/modals/InfoModal.vue";
import ModifyModal from "./components/modals/ModifyModal.vue";
import AddModal from "./components/modals/AddModal.vue";
import NukeModal from "./components/modals/NukeModal.vue";
import ControlService from "@/store/ControlService";
import { useServices } from "@/store/services";
import { useNodeManage } from "@/store/nodeManage";
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useNodeHeader } from "@/store/nodeHeader";
import { useStakingStore } from "@/store/theStaking";

const serviceStore = useServices();
const manageStore = useNodeManage();
const headerStore = useNodeHeader();
const stakingStore = useStakingStore();
const router = useRouter();
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

onMounted(() => {
  manageStore.newConfiguration = structuredClone(serviceStore.installedServices);
});
onMounted(() => {
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

// Methods

// Random ID generator
function generateRandomId() {
  const timestamp = new Date().getTime().toString(16); // Convert timestamp to hexadecimal
  const randomPart = Math.random().toString(16).substring(2, 8); // Generate a random hexadecimal string
  return timestamp + randomPart;
}

const randomId = computed(() => generateRandomId());

// Switch Clients methods
const switchClientModalhandler = (item) => {
  item.replacePanel = true;
  clientToSwitch.value = item;
  if (item.replacePanel) {
    isSwitchModalOpen.value = true;
  } else {
    isSwitchModalOpen.value = false;
  }
};

const switchClientConfirm = (item) => {
  isSwitchModalOpen.value = false;
  const current = manageStore.newConfiguration.find(
    (e) => e?.config.serviceID === clientToSwitch.value?.config.serviceID
  );

  const currentClientIndex = manageStore.newConfiguration.indexOf(current);

  manageStore.newConfiguration.splice(currentClientIndex, 1);

  manageStore.newConfiguration.push(item);
  manageStore.confirmChanges.push({
    id: randomId,
    content: "SWITCH CLIENT",
    contentIcon: "/img/icon/manage-node-icons/switch.png",
    service: current,
    data: {
      itemToInstall: item,
      data: {},
    },
  });

  serviceStore.selectedServiceToSwitch = "";
};
// Clients Modifying methods

const confirmModifyingService = (item) => {
  isModifyModalOpen.value = false;
  console.log(item);
  if (item.service === "FlashbotsMevBoostService") {
    changeMevboostConnection();
    console.log("MEVBOOST CONNECTION CHANGED");
  }
  manageStore.confirmChanges.push({
    id: randomId,
    content: "MODIFY",
    contentIcon: "/img/icon/manage-node-icons/connected.png",
    service: item,
  });
};

const serviceModifyHandler = (item) => {
  clientToModify.value = item;
  isModifyModalOpen.value = true;
};

const hideModifyModal = () => {
  isModifyModalOpen.value = false;
};
const confirmConsensusConnection = (item) => {
  clientToConnect.value.isNotConnectedToConsensus = false;
  manageStore.confirmChanges.push({
    id: randomId,
    content: "CLIENT CONNECT",
    contentIcon: "/img/icon/manage-node-icons/connection.png",
    service: item,
  });
};

// Mevboost connection methods

const changeMevboostConnection = () => {
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
};

// Drawer methods

const openDrawer = () => {
  manageStore.isDrawerOpen = true;
};

//Change Box methods

const removeChangeHandler = (item) => {
  isAddModalOpen.value = false;
  if (item) {
    if (item.content === "INSTALL") {
      const event = manageStore.newConfiguration.find((e) => e.id === item.service.id);
      const eventIdx = manageStore.newConfiguration.indexOf(event);
      manageStore.newConfiguration.splice(eventIdx, 1);
    }
    const event = manageStore.confirmChanges.find((e) => e.id === item.id);
    const eventIdx = manageStore.confirmChanges.indexOf(event);
    manageStore.confirmChanges.splice(eventIdx, 1);
  }
};
// Add service with double click

const addServices = (item) => {
  let element = JSON.parse(JSON.stringify(item));
  // Change item.id to a unique id
  element.id = manageStore.newConfiguration.length + 1;
  clientToInstall.value = element;
  isAddModalOpen.value = true;
};

// Add service with drag and drop

const startDrag = (event, item) => {
  if (event.type === "dragstart") {
    event.dataTransfer.dropEffect = "move";
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("itemId", item.id);
  }
};

const onDrop = (event) => {
  const itemID = event.dataTransfer.getData("itemId");
  isOverDropZone.value = false;
  const copyAllServices = structuredClone(serviceStore.allServices);
  const allServices = JSON.parse(JSON.stringify(copyAllServices));
  const item = allServices.find((item) => item.id == itemID);
  item.id = manageStore.newConfiguration.length + 1;
  clientToInstall.value = item;
  isAddModalOpen.value = true;
};

//Confirm Adding service

const serviceInstallHandler = (item) => {
  isAddModalOpen.value = false;
  manageStore.confirmChanges.push({
    id: randomId,
    content: "INSTALL",
    contentIcon: "/img/icon/manage-node-icons/install.png",
    service: clientToInstall.value,
  });
  manageStore.newConfiguration.push(item);
};

// Cancel Adding service

const cancelInstallation = (item) => {
  isAddModalOpen.value = false;
  const element = manageStore.confirmChanges.find((e) => e.id === item.id);
  const eventIdx = manageStore.confirmChanges.indexOf(element);
  manageStore.confirmChanges.splice(eventIdx, 1);
  const event = manageStore.newConfiguration.find((e) => e.id === item.id);
  const eventIdx2 = manageStore.newConfiguration.indexOf(event);
  manageStore.newConfiguration.splice(eventIdx2, 1);
};

// Network switch methods
const displaySwitchNetwork = () => {
  manageStore.displayNetworkList = true;
};

const switchNetworkConfirm = () => {
  manageStore.displayNetworkList = false;
  manageStore.currentNetwork = {};
  manageStore.currentNetwork = manageStore.selectedNetwork;
  manageStore.confirmChanges.push({
    id: randomId,
    content: "SWITCH NETWORK",
    contentIcon: "/img/icon/manage-node-icons/switch-client.png",
    service: manageStore.currentNetwork,
  });
  manageStore.displayNetworkList = false;
};

// Nuke node method

const openNukeNodeModal = async () => {
  isNukeModalOpen.value = true;
};

const selectedServiceToRemove = (item) => {
  item.displayPluginMenu = false;
  if (
    item.isNotConnectedToConsensus ||
    item.isNotConnectedToValidator ||
    item.isNotConnectedToMevboost ||
    item.isDisplayPluginMenu
  ) {
    return;
  } else {
    clientToRemove.value = item;
    item.isRemoveProcessing = true;
  }

  item.displayTooltip = false;
  manageStore.selectedItemToRemove.push(item);
  const confirmDelete = {
    id: item.config.serviceID,
    content: "DELETE",
    contentIcon: "/img/icon/manage-node-icons/delete.png",
    service: item,
  };
  const itemExists = manageStore.confirmChanges.some((e) => e.id === item.config.serviceID && e.content === "DELETE");
  if (!itemExists) {
    manageStore.confirmChanges.push(confirmDelete);
  }
};

const openInfoModal = (item) => {
  clientForInfo.value = item;
  isInfoModalOpen.value = true;
};

const destroyNode = async () => {
  let condition = true;
  await ControlService.clearTasks();
  ControlService.destroy(); // no await, we wanna read tasks while deletion is in progress
  var uxtStart = Math.floor(Date.now() / 1000);
  var secMax = 30; // wait max X seconds to finish destroy process
  while (condition) {
    var secElapsed = Math.floor(Math.floor(Date.now() / 1000) - uxtStart);
    if (secElapsed >= secMax) {
      console.log("abort -> timeout -> secElapsed", secElapsed);
      await ControlService.clearTasks();
      break;
    }
    var tasks = await ControlService.getTasks();
    var task = tasks.findLast((t) => t.name.includes("Delete Node"));
    var subtasks = task && task.hasOwnProperty("subTasks") ? task.subTasks : null;
    var status = task && task.hasOwnProperty("status") ? task.status : null;
    // console.log("tasks => ", tasks);
    // console.log("task => ", task);
    // console.log("subtasks => ", subtasks);
    // console.log("status => ", status);
    var myresult = [];
    myresult.push("nuke node executed (ok)");
    if (subtasks && Array.isArray(subtasks) && subtasks.length > 0) {
      myresult.push("gathering facts (ok)");
      for (var i = 0; i < subtasks.length; i++) {
        var subtask = subtasks[i];
        myresult.push(subtask.name + " (" + subtask.status + ")");
      }
    } else {
      if (secElapsed >= 2) {
        myresult.push("gathering facts (ok)");
      }
      // console.log("waiting for subtasks");
    }
    nukeModalComponent.value.nukeData = myresult;
    // Intentionally as last check since last subtask could be retrieved at exact same frame
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
  headerStore.refresh = true;
  stakingStore.forceRefresh = true;
  stakingStore.keys = [];
  serviceStore.versions = {};
  headerStore.runningServices = [];
  serviceStore.runningServices = [];
  serviceStore.installedServices = [];
  manageStore.newConfiguration = [];
  nukeModalComponent.value.loginBtn = false;
};

const nukeConfirmation = () => {
  headerStore.refresh = false;
  destroyNode();
};
const backToLogin = async () => {
  await ControlService.logout();
  router.push("/");
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
