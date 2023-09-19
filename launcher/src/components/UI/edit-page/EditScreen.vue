<template>
  <base-layout>
    <!-- Start Node main layouts -->
    <div class="w-full h-full grid grid-cols-24 relative">
      <div class="col-start-1 col-span-1 flex justify-center items-center">
        <SidebarSection @network-modal="displaySwitchNetwork" @nuke-node="nukeNode" />
      </div>
      <div class="col-start-2 col-end-17 w-full h-full relative">
        <EditBody :drop-zone="isOverDropZone" @on-drop="onDrop" @confirm-connection="confirmConnection" />
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
      <!-- Switch Network Modal -->
      <custom-modal
        v-if="manageStore.displayNetworkList"
        main-title="Switch Network"
        message-text="Are you sure you want to switch network?"
        confirm-text="Confirm"
        click-outside-text="Click outside to cancel"
        @close-window="manageStore.displayNetworkList = false"
        @confirm-action="switchNetworkConfirm"
      >
        <template #content>
          <div class="flex flex-col justify-between items-center py-2 px-4 space-y-4">
            <div class="w-full flex flex-col justify-between items-center space-y-1">
              <span class="w-full text-left text-teal-700 font-semibold">Current Network</span>
              <div
                class="flex justify-center items-center w-full h-[40px] border border-gray-300 shadow-sm shadow-gray-600 rounded-md py-1 px-2 font-semibold text-lg"
              >
                <span>{{ manageStore.currentNetwork.name }}</span>
              </div>
            </div>
            <div class="w-full flex flex-col justify-between items-center space-y-1">
              <span class="w-full text-left text-teal-700 font-semibold">Switch To</span>
              <div class="w-full relative">
                <button
                  aria-expanded="false"
                  class="w-full h-[40px] border border-gray-300 shadow-sm shadow-gray-600 rounded-md font-semibold text-lg text-blue-500 px-4 py-2 hover:brightness-110 flex items-center whitespace-nowrap space-x-4 justify-between"
                  @click="networkDropdownOpen = !networkDropdownOpen"
                >
                  <span>{{ selectedNetwrok ? selectedNetwrok : "Select Network From List" }}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5 inline ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-width="2" d="M5 10l7 7 7-7"></path>
                  </svg>
                </button>
                <Transition name="slide">
                  <ul
                    v-show="networkDropdownOpen"
                    class="transition-all max-h-[180px] duration-400 ease-in-out absolute bg-gray-600 rounded-lg shadow-lg py-1 w-full z-10 mt-1 divide-y overflow-y-auto flex flex-col justify-evenly items-center"
                    @mouseleave="networkDropdownOpen = false"
                  >
                    <li
                      v-for="network in manageStore.networkList"
                      :key="network.name"
                      class="w-full grid grid-cols-6 px-4"
                      @click="switchNetworkHandler(network)"
                    >
                      <img class="col-start-1 col-end-2 w-10 p-1" :src="network.icon" alt="Network Icon" />
                      <span
                        class="col-start-3 col-end-6 px-4 py-2 flex gap-2 justify-start items-center outline-0 hover:bg-blue-400 whitespace-nowrap cursor-pointer text-lg text-gray-200 font-semibold"
                        >{{ network.name }}</span
                      >
                    </li>
                  </ul>
                </Transition>
              </div>
            </div>
          </div>
        </template>
      </custom-modal>
      <!-- Mevboost Connection Modal -->
      <!-- <template v-for="item in serviceConnectionState">
        <ConnectionModal
          v-if="item.if"
          :key="item.id"
          :main-title="item.mainTitle"
          :message-text="item.messageText"
          :options-array="item.optionsArray"
          :number-of-options="item.numberOfOptions"
          :new-connection="item.newConnection"
          @get-item="item.getItem"
          @close-window="item.closeWindow"
          @confirm-action="item.confirmAction"
        />
      </template> -->
    </TransitionGroup>
  </base-layout>
</template>
<script setup>
import SidebarSection from "./sections/SidebarSection.vue";
import EditBody from "./components/edit/EditBody";
import ServiceSection from "./sections/ServiceSection.vue";
import ChangesSection from "./sections/ChangesSection.vue";
import DrawerBox from "./components/drawer/DrawerBox.vue";
import CustomModal from "./components/modals/CustomModal.vue";
import ControlService from "@/store/ControlService";
import { useServices } from "@/store/services";
import { useNodeManage } from "@/store/nodeManage";
import { useConnectClients } from "@/store/connectClients";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import ConnectionModal from "./components/modals/ConnectionModal.vue";

const manageStore = useNodeManage();
const serviceStore = useServices();
const connectStore = useConnectClients();
const selectedNetwrok = ref(null);
const router = useRouter();
const isOverDropZone = ref(false);
const list = ref([]);

// const serviceConnectionState = ref([
//   {
//     id: 1,
//     name: "mevboost",
//     if: isMevboostConnectionOpen.value,
//     mainTitle: "Mevboost Connection",
//     messageText: "Select a service you want to connect to mevboost",
//     optionsArray: mevboostOptions.value,
//     numberOfOptions: numberOfOptions.value,
//     newConnection: mevboostNewConnection.value,
//     getItem: getConnectionItem,
//     confirmAction: changeMevboostConnection,
//     closeWindow: (isMevboostConnectionOpen.value = false),
//   },
//   // {
//   //   id: 2,
//   //   name: "consensus",
//   //   if: isConsensusConnectionOpen,
//   //   mainTitle: "Consensus Connection",
//   //   messageText: "Select the execution service you want to connect to consensus",
//   //   optionsArray: consensusCennectionOptions.value,
//   //   numberOfOptions: numberOfOptions.value,
//   //   newConnection: consensusNewConnection.value,
//   //   getItem: getConnectionItem,
//   //   confirmAction: changeConsensusConnection.apply,
//   //   closeWindow: (isConsensusConnectionOpen.value = false),
//   // },
// ]);

const networkDropdownOpen = ref(false);

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
const switchNetworkHandler = (network) => {
  selectedNetwrok.value = network.name;
  networkDropdownOpen.value = false;
};
const switchNetworkConfirm = () => {
  manageStore.displayNetworkList = false;
  manageStore.currentNetwork = manageStore.networkList.find((network) => network.name === selectedNetwrok.value);
  manageStore.confirmChanges.push({
    id: "switch-network",
    content: "SWITCH NETWORK",
    contentIcon: "/img/icon/manage-node-icons/switch-client.png",
    service: manageStore.currentNetwork,
  });
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
