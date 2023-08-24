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
    <DrawerSection v-if="drawerIsOpen" />
    <!-- End Node main layout -->
  </base-layout>
</template>
<script>
import SidebarSection from "./sections/SidebarSection.vue";
import EditSection from "./sections/EditSection.vue";
import ServiceSection from "./sections/ServiceSection.vue";
import ChangesSection from "./sections/ChangesSection.vue";
import DrawerSection from "./sections/DrawerSection.vue";
import { mapWritableState } from "pinia";
import { useNodeStore } from "@/store/theNode";
export default {
  name: "NodeScreen",
  components: {
    SidebarSection,
    EditSection,
    ServiceSection,
    ChangesSection,
    DrawerSection,
  },
  props: {},
  data() {
    return {
      updatePowerState: false,
      cursorLocation: "",
      chckTutorial: "/img/icon/round-icon.png",
      returnStatus: "/img/icon/round-icon.png",
      displayUpdatePanel: false,
    };
  },
  computed: {
    ...mapWritableState(useNodeStore, {
      infoAlarm: "infoAlarm",
      hideConnectedLines: "hideConnectedLines",
      runNodePowerModal: "runNodePowerModal",
    }),
  },
  mounted() {},
  methods: {
    alarmToggle() {
      this.infoAlarm = !this.infoAlarm;
    },
  },
};
</script>
<style scoped>
.info-button {
  width: 98%;
  height: 7%;
  background: #264744;
  border-radius: 20px;
  box-shadow: 0 1px 3px 0px #1c1f22;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-top: 3px;
  margin-bottom: 15px;
}
.info-button:hover {
  background: rgb(43, 84, 81);
}
.info-button:active {
  background: rgba(43, 84, 81, 0.5);
}
.info-button img {
  max-width: 19%;
}
</style>
