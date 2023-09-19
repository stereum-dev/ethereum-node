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
        v-if="isSwitchPanelnOpen"
        :client="clientToSwitch"
        main-title="Switch Client"
        confirm-text="Confirm"
        click-outside-text="Click outside to cancel"
        @close-window="isSwitchPanelnOpen = false"
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const serviceStore = useServices();
const manageStore = useNodeManage();
const router = useRouter();
const isOverDropZone = ref(false);
const list = ref([]);
const clientToSwitch = ref(null);
const isConfirmLoading = ref(false);

const isSwitchPanelnOpen = ref(false);

onMounted(() => {
  serviceStore.installedServices = serviceStore.installedServices
    .filter((service) => service.category === "consensus")
    .map((el) => {
      return {
        ...el,
        connectedToExecution: false,
        connectedToValidator: false,
      };
    });
});
onMounted(() => {
  serviceStore.installedServices = serviceStore.installedServices
    .filter((service) => service.category === "execution")
    .map((el) => {
      return {
        ...el,
        connectedToConsensus: false,
      };
    });
});
onMounted(() => {
  serviceStore.installedServices = serviceStore.installedServices
    .filter((service) => service.category === "validator")
    .map((el) => {
      return {
        ...el,
        connectedToConsensus: false,
      };
    });
});

// Methods

// Switch Clients methods
const switchClientModalhandler = (item) => {
  item.replacePanel = true;
  clientToSwitch.value = item;
  if (item.replacePanel) {
    isSwitchPanelnOpen.value = true;
  } else {
    isSwitchPanelnOpen.value = false;
  }
};

const switchClientConfirm = (item) => {
  isSwitchPanelnOpen.value = false;
  const current = serviceStore.installedServices.find(
    (e) => e?.config.serviceID === clientToSwitch.value?.config.serviceID
  );

  const currentClientIndex = serviceStore.installedServices.indexOf(current);

  serviceStore.installedServices.splice(currentClientIndex, 1);

  serviceStore.installedServices.push(item);
  manageStore.confirmChanges.push({
    id: "switch-client",
    content: "SWITCH CLIENT",
    contentIcon: "/img/icon/manage-node-icons/switch.png",
    service: item,
  });
};

// Service connection methods

// Mevboost connection methods

const changeMevboostConnection = () => {
  console.log("CLICKED MEVBOOST");
  serviceStore.installedServices = serviceStore.installedServices
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
      id: item.config.serviceID,
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
    id: "switch-network",
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
