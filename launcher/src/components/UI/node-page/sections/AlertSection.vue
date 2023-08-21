<template>
  <div class="h-[430px] flex flex-col justify-between items-center">
    <NodeTutorial v-if="!infoAlarm" @show-modal="openTutorialModalHandler" />
    <NodeAlert v-else />
  </div>
</template>
<script>
import NodeAlert from "../components/alert/NodeAlert.vue";
import NodeTutorial from "../components/alert/NodeTutorial.vue";
import { mapWritableState } from "pinia";
import { useNodeStore } from "@/store/theNode";
export default {
  name: "AlertSection",
  components: {
    NodeAlert,
    NodeTutorial,
  },
  props: {
    infoAralm: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapWritableState(useNodeStore, {
      infoAlarm: "infoAlarm",
    }),
  },
  mounted() {},
  methods: {},
};
</script>
