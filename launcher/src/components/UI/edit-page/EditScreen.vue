<template>
  <base-layout>
    <!-- Start Node main layouts -->
    <div class="w-full h-full grid grid-cols-24 relative">
      <div class="col-start-1 col-span-1 flex justify-center items-center">
        <SidebarSection @network-modal="displaySwitchNetwork" />
      </div>
      <div class="col-start-2 col-end-17 w-full h-full relative">
        <edit-body>
          <Transition name="fade">
            <div
              v-if="isDropLayerActive"
              class="absolute top-[45%] left-[48%] w-10 h-10 border border-dashed border-gray-200 rounded-md flex justify-center items-center"
            >
              <img class="w-10" src="/img/icon/manage-node-icons/drag.png" alt="Drop Icon" />
            </div>
          </Transition>
          <div
            class="w-full h-full flex justify-center items-center"
            :class="getDropImage"
            @drop="onDrop($event)"
            @dragover.prevent
            @dragleave.prevent="isDropLayerActive = false"
            @dragenter.prevent="isDropLayerActive = true"
          ></div>
        </edit-body>
      </div>
      <div class="col-start-17 col-end-21 ml-1">
        <ServiceSection />
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
      @mouseenter="openDrawer"
      @click="openDrawer"
    />
    <transition name="drawerSlide" mode="out-in">
      <DrawerBox
        v-if="store.isDrawerOpen"
        :dragging="startDrag"
        @add-service="addServices"
        @mouseleave="store.isDrawerOpen = false"
      />
    </transition>
    <!-- End drawer layout -->
    <!-- Start network modal layout -->
    <transition name="fadeModal">
      <custom-modal
        v-if="store.displayNetworkList"
        main-title="Switch Network"
        message-text="Are you sure you want to switch network?"
        confirm-text="Confirm"
        click-outside-text="Click outside to cancel"
        @close-window="store.displayNetworkList = false"
        @confirm-action="switchNetworkConfirm"
      >
        <template #content>
          <div class="flex flex-col justify-between items-center py-2 px-4 space-y-4">
            <div class="w-full flex flex-col justify-between items-center space-y-1">
              <span class="w-full text-left text-teal-700 font-semibold">Current Network</span>
              <div
                class="flex justify-center items-center w-full h-[40px] border border-gray-300 shadow-sm shadow-gray-600 rounded-md py-1 px-2 font-semibold text-lg"
              >
                <span>{{ store.currentNetwork.name }}</span>
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
                    class="transition-all duration-400 ease-in-out absolute bg-gray-600 rounded-lg shadow-lg py-1 w-full z-10 mt-1 divide-y"
                    @mouseleave="networkDropdownOpen = false"
                  >
                    <li v-for="network in store.networkList" :key="network.name" @click="switchNetworkHandler(network)">
                      <span
                        class="px-4 py-2 flex gap-2 items-center outline-0 hover:bg-blue-400 whitespace-nowrap cursor-pointer text-lg text-gray-200 font-semibold"
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
    </transition>

    <!-- End network modal layout -->
  </base-layout>
</template>
<script setup>
import SidebarSection from "./sections/SidebarSection.vue";
import EditBody from "./components/edit/EditBody";
import ServiceSection from "./sections/ServiceSection.vue";
import ChangesSection from "./sections/ChangesSection.vue";
import DrawerBox from "./components/drawer/DrawerBox.vue";
import CustomModal from "./components/modals/CustomModal.vue";
import { useServices } from "@/store/services";
import { useNodeManage } from "@/store/nodeManage";
import { ref, computed } from "vue";

const store = useNodeManage();
const serviceStore = useServices();
const selectedNetwrok = ref(null);

const list = ref([]);
const isDropLayerActive = ref(false);
const networkDropdownOpen = ref(false);

const addServices = (event, item) => {
  console.log(item);
  if (item.category === "service" && serviceStore.customServiceToInstall.map((s) => s.service).includes(item.service)) {
    return;
  } else {
    item.id = serviceStore.customServiceToInstall.length;
    serviceStore.customServiceToInstall.push(item);
    console.log(serviceStore.customServiceToInstall);
  }
  // serviceStore.customServiceToInstall.push(item);
  // console.log(serviceStore.customServiceToInstall);
};

const openDrawer = () => {
  store.isDrawerOpen = true;
};
const startDrag = (event, item) => {
  if (event.type === "dragstart") {
    event.dataTransfer.dropEffect = "move";
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("itemId", item.id);
  }
};
const getDropImage = computed(() => {
  return isDropLayerActive.value ? "border-dashed border-2 border-blue-500" : null;
});

const onDrop = (Files) => {
  isDropLayerActive.value = false;
  const copyAllServices = JSON.parse(JSON.stringify(serviceStore.allServices));
  const item = copyAllServices.find((item) => item.id == Files.dataTransfer.getData("itemId"));
  if (item.category === "service" && list.value.map((s) => s.service).includes(item.service)) {
    return;
  } else {
    item.id = list.value.length;
    serviceStore.customServiceToInstall.push(item);
    console.log(serviceStore.customServiceToInstall);
  }
};

// const dropHandler = (Files) => {
//   console.log("dropHandler", Files);
// };

// const onDrop = (event) => {
//   console.log("onDrop", event);
//   // const allServicesCopy = JSON.parse(JSON.stringify(allServices));
//   // const item = event.dataTransfer.getData("item");
//   // console.log(item);
//   // let item = allServicesCopy.find((item) => item.id == itemId);

//   // if (item.category === "service" && newConfiguration.map((s) => s.service).includes(item.service)) {
//   //   return;
//   // } else {
//   //   if (itemToInstall.addPanel === true) {
//   //     cancelAddProcess();
//   //   }
//   //   item.id = newConfiguration.length;
//   //   newConfiguration.push(item);
//   //   item.addPanel = true;
//   //   itemToInstall.value = item;
//   //   displayCustomAddPanel.value = item.modifierPanel;
//   // }
// };

const displaySwitchNetwork = () => {
  store.displayNetworkList = true;
};
const switchNetworkHandler = (network) => {
  selectedNetwrok.value = network.name;
  networkDropdownOpen.value = false;
};
const switchNetworkConfirm = () => {
  store.displayNetworkList = false;
  store.currentNetwork = store.networkList.find((network) => network.name === selectedNetwrok.value);
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

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter {
  transform: scaleY(0);
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-leave-to {
  transform: scaleY(0);
  transition: opacity 0.5s ease-in-out;
}
</style>
