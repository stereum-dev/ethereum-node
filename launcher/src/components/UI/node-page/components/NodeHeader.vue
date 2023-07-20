<template>
  <div class="w-full h-[50px] flex justify-between items-center">
    <SelectConfig />

    <NetworkDropdown />
  </div>
</template>
<script>
import NetworkDropdown from "./NetworkDropdown.vue";
import SelectConfig from "./SelectConfig.vue";
export default {
  name: "TheNode",
  components: {
    NetworkDropdown,
    SelectConfig,
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
