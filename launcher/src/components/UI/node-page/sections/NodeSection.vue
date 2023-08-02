<template>
  <div class="w-full h-full flex flex-col justify-between items-center px-2">
    <NodeHeader />
    <NodeBody />
  </div>
</template>
<script>
import NodeHeader from "../components/node/BodyHeader.vue";
import NodeBody from "../components/node/NodeBody.vue";
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
