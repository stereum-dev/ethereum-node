<template>
  <base-layout>
    <!-- Start Node main layouts -->
    <div class="w-full h-full grid grid-cols-24 relative">
      <div class="col-start-1 col-span-1 flex justify-center items-center">
        <SidebarSection />
      </div>
      <div class="col-start-2 col-end-17 w-full h-full relative">
        <EditSection />
      </div>
      <div class="col-start-17 col-end-21 ml-1">
        <ServiceSection />
      </div>
      <div class="col-start-21 col-end-25 px-1 flex flex-col justify-between">
        <ChangesSection />
      </div>
    </div>

    <img
      class="w-10 absolute top-50 -right-5 cursor-pointer"
      src="/img/icon/manage-node-icons/sidebar-out.png"
      alt="Arrow Icon"
      @mousedown.prevent.stop
      @mouseenter="openDrawer"
      @click="openDrawer"
    />
    <transition name="slide-fade" mode="out-in">
      <DrawerSection v-if="store.isDrawerOpen" />
    </transition>
    <!-- End Node main layout -->
  </base-layout>
</template>
<script setup>
import SidebarSection from "./sections/SidebarSection.vue";
import EditSection from "./sections/EditSection.vue";
import ServiceSection from "./sections/ServiceSection.vue";
import ChangesSection from "./sections/ChangesSection.vue";
import DrawerSection from "./sections/DrawerSection.vue";
import { useNodeManage } from "@/store/nodeManage";

const store = useNodeManage();

const openDrawer = () => {
  store.isDrawerOpen = true;
};
</script>

<style scoped>
/* trasnsition styles */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
