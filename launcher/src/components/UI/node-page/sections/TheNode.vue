<template>
  <div class="w-full h-full flex flex-col items-center px-2">
    <NodeHeader />
    <div class="grow">
      <NodeBody />
    </div>
  </div>
</template>
<script>
import NodeHeader from "../components/NodeHeader.vue";
import NodeBody from "../components/NodeBody.vue";
export default {
  name: "TheNode",
  components: {
    NodeHeader,
    NodeBody,
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
