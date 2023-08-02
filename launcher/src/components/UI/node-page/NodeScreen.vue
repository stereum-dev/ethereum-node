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
      <div class="col-start-22 col-end-25 bg-violet-400">alerting</div>
    </div>
    <!-- End Node main layout -->
  </base-layout>
</template>
<script>
import NodeSidebar from "./sections/NodeSidebar.vue";
import NodeSection from "./sections/NodeSection.vue";
import ServiceSection from "./sections/ServiceSection.vue";
export default {
  name: "NodeScreen",
  components: {
    NodeSidebar,
    NodeSection,
    ServiceSection,
  },
  props: {},
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  methods: {},
};
</script>
