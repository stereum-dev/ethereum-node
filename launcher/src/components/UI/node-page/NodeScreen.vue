<template>
  <base-layout>
    <!-- Start Node main layouts -->
    <div class="w-full h-full grid grid-cols-24">
      <div class="col-start-1 col-span-1 bg-green-500 flex justify-center items-center">
        <NodeSidebar />
      </div>
      <div class="col-start-2 col-end-18 w-full h-full relative">
        <NodeSection />
      </div>
      <div class="col-start-18 col-end-22">
        <ServiceSection />
      </div>
      <div class="col-start-22 col-end-25">
        <NodeAlert v-if="infoAlarm"/>
        <div
          class="info-button"
          @click="infoAlarm = !infoAlarm"
          @mouseenter="cursorLocation = infoAlarm ? `${chckTutorial}` : `${returnStatus}`"
          @mouseleave="cursorLocation = ''"
        >
          <img src="/img/icon/round-icon.png" alt="information" />
        </div>
        <NodeTutorial v-if="!infoAlarm" @show-modal="openTutorialModalHandler" />
      </div>
    </div>
    <!-- End Node main layout -->
  </base-layout>
</template>
<script>
import NodeAlert from "../the-node/NodeAlert.vue";
import NodeSidebar from "./sections/NodeSidebar.vue";
import NodeSection from "./sections/NodeSection.vue";
import ServiceSection from "./sections/ServiceSection.vue";
import NodeTutorial from "../the-node/NodeTutorial.vue";
// import NodeAlerting from "./sections/NodeAlerting.vue";
export default {
  name: "NodeScreen",
  components: {
    NodeSidebar,
    NodeSection,
    ServiceSection,
    NodeAlert,
    NodeTutorial,
  },
  props: {},
  data() {
    return {
      infoAlarm: true,
      cursorLocation: "",
      chckTutorial: "/img/icon/round-icon.png",
      returnStatus: "/img/icon/round-icon.png",
    };
  },
  computed: {},
  mounted() {},
  methods: {},
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
