<template>
  <base-layout>
    <!-- Start Node main layouts -->
    <div class="w-full h-full grid grid-cols-24">
      <div class="col-start-1 col-span-1 bg-green-500 flex justify-center items-center">
        <NodeSidebar />
      </div>
      <div class="col-start-2 col-end-18 w-full h-full bg-amber-500">2</div>
      <div class="col-start-18 col-end-22 bg-cyan-300">03</div>
      <div class="col-start-22 col-end-25 bg-violet-400">04</div>
    </div>
    <!-- End Node main layout -->
  </base-layout>
</template>
<script>
// import ManageButtons from "./sections/ManageButtons.vue";
import NodeSidebar from "./sections/NodeSidebar.vue";
// import TheNode from "./sections/TheNode.vue";
export default {
  name: "NodeScreen",
  components: {
    NodeSidebar,
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
