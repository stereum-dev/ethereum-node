<template>
  <base-layout>
    <!-- Start Node main layouts -->
    <div class="w-full h-full grid grid-cols-24 relative">
      <div class="col-start-1 col-span-1 flex justify-center items-center">
        <SidebarSection @network-modal="displaySwitchNetwork" @nuke-node="nukeNode" />
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
        <ServiceSection @change-connection="changeMevboostConnection" @delete-service="selectedServiceToRemove" />
      </div>
      <div class="col-start-21 col-end-25 px-1 flex flex-col justify-between">
        <ChangesSection />
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
        :client="clientToAdd"
        @close-window="isAddModalOpen = false"
        @confirm-modify="confirmAddingService"
      />
      <!-- End Add New Service Modal -->
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
import ControlService from "@/store/ControlService";
import { useServices } from "@/store/services";
import { useNodeManage } from "@/store/nodeManage";
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";

const serviceStore = useServices();
const manageStore = useNodeManage();
const router = useRouter();
const isOverDropZone = ref(false);
const clientToRemove = ref(null);
const clientToSwitch = ref(null);
const clientForInfo = ref(null);
const clientToModify = ref(null);
const clientToAdd = ref(null);
const isConfirmLoading = ref(false);
const isSwitchModalOpen = ref(false);
const isInfoModalOpen = ref(false);
const isModifyModalOpen = ref(false);
const isAddModalOpen = ref(false);
const clientToConnect = ref(null);

onMounted(() => {
  manageStore.newConfiguration = structuredClone(serviceStore.installedServices);
});
onMounted(() => {
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
      isConnected: false,
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
    service: item,
  });

  serviceStore.selectedServiceToSwitch = "";
};

const hideOptions = (item) => {
  if (item.category === "consensus") {
    manageStore.newConfiguration
      .filter((e) => {
        e.category === "execution";
      })
      .forEach((e) => {
        e.isNotConnectedToConsensus = false;
        e.connectedToConsensus = false;
      });
  } else if (item.category === "validator") {
    manageStore.newConfiguration
      .filter((e) => {
        e.category === "consensus";
      })
      .forEach((e) => {
        e.isNotConnectedToValidator = false;
        e.connectedToValidator = false;
      });
  }
};
// Clients Modifying methods

const confirmModifyingService = () => {
  console.log("CONFIRM MODIFYING");
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

// Add service with double click

const addServices = (item) => {
  let element = JSON.parse(JSON.stringify(item));
  if (element.category !== "service") {
    // Change item.id to a unique id
    element.id = manageStore.newConfiguration.length + 1;
    manageStore.newConfiguration.push(element);
    manageStore.confirmChanges.push({
      id: element.id,
      content: "INSTALL",
      contentIcon: "/img/icon/manage-node-icons/ADD_PLUGIN.png",
      service: element,
    });
  }
};

// Drag and Drop methods
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
  manageStore.newConfiguration.push(item);

  manageStore.confirmChanges.push({
    id: randomId,
    content: "INSTALL",
    contentIcon: "/img/icon/manage-node-icons/ADD_PLUGIN.png",
    service: item,
  });
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

const nukeNode = async () => {
  //missing nuke component implement later
  await ControlService.destroy();
  await ControlService.logout();
  router.push("/");
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
