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
          @connect-client="clientConnectionHandler"
          @delete-sercive="deleteService"
        />
      </div>
      <div class="col-start-17 col-end-21 ml-1">
        <ServiceSection @change-connection="changeMevboostConnection" />
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
      <NetworkModal
        v-if="manageStore.displayNetworkList"
        @close-window="manageStore.displayNetworkList = false"
        @switch-confirm="switchNetworkConfirm"
      />
      <!-- End Switch Network Modal -->
      <!-- Start Switch Client Modal -->
      <SwitchModal
        v-if="isSwitchPanelOpen"
        :client="clientToSwitch"
        main-title="Switch Client"
        confirm-text="Confirm"
        click-outside-text="Click outside to cancel"
        @close-window="isSwitchPanelOpen = false"
        @switch-confirm="switchClientConfirm"
      />

      <!-- End Switch Client Modal -->
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
import ControlService from "@/store/ControlService";
import { useServices } from "@/store/services";
import { useNodeManage } from "@/store/nodeManage";
import { ref, onMounted, watch, watchEffect } from "vue";
import { useRouter } from "vue-router";

const serviceStore = useServices();
const manageStore = useNodeManage();
const router = useRouter();
const isOverDropZone = ref(false);
const list = ref([]);
const clientToSwitch = ref(null);
const isConfirmLoading = ref(false);
const isSwitchPanelOpen = ref(false);

watchEffect(() => {
  manageStore.newConfiguration = serviceStore.installedServices.forEach((service) => {
    if (service === undefined) {
      manageStore.newConfiguration.push(service);
    }
  });
});
console.log(manageStore.newConfiguration);

// Lifecycle hooks

onMounted(() => {
  changeClinetOnMounted();
});

// ******** Methods ********

const changeClinetOnMounted = () => {
  if (manageStore.newConfiguration.length > 0 && manageStore.newConfiguration[0] !== undefined) {
    manageStore.newConfiguration = manageStore.newConfiguration
      .filter((service) => service?.category === "consensus")
      .map((el) => {
        return {
          ...el,
          serviceIsConnected: false,
          connectedToExecution: false,
          connectedToValidator: false,
        };
      });

    manageStore.newConfiguration = manageStore.newConfiguration
      .filter((service) => service?.category === "execution")
      .map((el) => {
        return {
          ...el,
          serviceIsConnected: false,
          connectedToConsensus: false,
        };
      });

    manageStore.newConfiguration = manageStore.newConfiguration
      .filter((service) => service?.category === "validator")
      .map((el) => {
        return {
          ...el,
          serviceIsConnected: false,
          connectedToConsensus: false,
        };
      });
  }
};

// Random ID generator
function generateRandomId() {
  const timestamp = new Date().getTime().toString(16); // Convert timestamp to hexadecimal
  const randomPart = Math.random().toString(16).substring(2, 8); // Generate a random hexadecimal string
  return timestamp + randomPart;
}

const randomId = generateRandomId();

console.log("ONCE", manageStore.newConfiguration);

// Switch Clients methods
const switchClientModalhandler = (item) => {
  item.replacePanel = true;
  clientToSwitch.value = item;
  if (item.replacePanel) {
    isSwitchPanelOpen.value = true;
  } else {
    isSwitchPanelOpen.value = false;
  }
};

const switchClientConfirm = (item) => {
  isSwitchPanelOpen.value = false;
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

// Clients Connection methods

const clientConnectionHandler = (item) => {
  item.isConnectedToMevboost = true;
  item.isNotConnectedToMevboost = false;
  manageStore.confirmChanges.push({
    id: randomId,
    content: "CLIENT CONNECT",
    contentIcon: "/img/icon/manage-node-icons/CONNECT.png",
    service: item,
  });
};

// Mevboost connection methods

const changeMevboostConnection = () => {
  manageStore.newConfiguration = manageStore.newConfiguration
    .filter((e) => e.category == "consensus")
    .map((e) => {
      if (e?.config.dependencies.mevboost[0]) {
        return {
          ...e,
          isConnectedToMevboost: true,
        };
      } else if (!e.config.dependencies.mevboost[0]) {
        return {
          ...e,
          isNotConnectedToMevboost: true,
        };
      }
    });
};
const confirmConnection = (item) => {
  isConfirmLoading.value = true;
  setTimeout(() => {
    isConfirmLoading.value = false;
    item.isNotConnectedToMevboost = false;
    item.isConnectedToMevboost = true;
  }, 5000);
};

// Drawer methods

const openDrawer = () => {
  manageStore.isDrawerOpen = true;
};

// Add service with double click

const addServices = (event, item) => {
  if (item.category === "service" && serviceStore.customServiceToInstall.map((s) => s.service).includes(item.service)) {
    return;
  } else {
    item.id = serviceStore.customServiceToInstall.length;
    const existsService = serviceStore.customServiceToInstall.some((s) => s.service === item.service);
    if (!existsService) {
      serviceStore.customServiceToInstall.push(item);
      manageStore.confirmChanges.push({
        id: item.config.serviceID,
        content: "INSTALL",
        contentIcon: "/img/icon/manage-node-icons/ADD_PLUGIN.png",
        service: item,
      });
    } else {
      return;
    }
  }
  console.log(serviceStore.customServiceToInstall);
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
  const copyAllServices = JSON.parse(JSON.stringify(serviceStore.allServices));
  const item = copyAllServices.find((item) => item.id == itemID);
  if (item.category === "service" && list.value.map((s) => s.service).includes(item.service)) {
    return;
  } else {
    item.id = list.value.length;
    serviceStore.customServiceToInstall.push(item);

    manageStore.confirmChanges.push({
      id: randomId,
      content: "INSTALL",
      contentIcon: "/img/icon/manage-node-icons/ADD_PLUGIN.png",
      service: item,
    });
  }
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

const deleteService = (item) => {
  const currentClientIndex = manageStore.newConfiguration.indexOf(item);
  console.log(currentClientIndex);
  manageStore.newConfiguration.splice(currentClientIndex, 1);
  manageStore.confirmChanges.push({
    id: item.config.serviceID,
    content: "DELETE",
    contentIcon: "/img/icon/manage-node-icons/trash.png",
    service: item,
  });
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
