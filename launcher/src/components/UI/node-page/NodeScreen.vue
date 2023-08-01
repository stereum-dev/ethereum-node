<template>
  <base-layout>
    <!-- Start Node main layouts -->
    <div class="w-full h-full grid grid-cols-24">
      <div class="col-start-1 col-span-1 bg-green-500 flex justify-center items-center">
        <NodeSidebar />
      </div>
      <div class="col-start-2 col-end-18 w-full h-full relative">
        <TheNode />
      </div>
      <div class="col-start-18 col-end-22 bg-cyan-300">service</div>
      <div class="col-start-22 col-end-25 bg-violet-400">alerting</div>
    </div>
    <!-- End Node main layout -->
  </base-layout>
</template>
<script>
import NodeSidebar from "./sections/NodeSidebar.vue";
import TheNode from "./sections/TheNode.vue";
export default {
  name: "NodeScreen",
  components: {
    NodeSidebar,
    TheNode,
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
