<template>
  <div
    class="scrollbar scrollbar-rounded-* scrollbar-thumb-teal-800 scrollbar-track-transparent w-full h-full max-h-[425px] rounded-md border border-gray-500 overflow-y-auto bg-[#151618] relative pt-1"
  >
    <div ref="service" class="col-start-1 col-span-1 space-y-2 px-1 pt-2 mt-1">
      <div v-for="item in getServices" :key="item" class="max-h-[80px] grid grid-cols-3 pt-2">
        <ServiceLayout :client="item" />
        <ServiceButtons :client="item" @open-expert="openExpertWindow" @open-log="openLogsPage" />
        <ExpertWindow
          v-if="item.expertOptionsModal"
          :item="item"
          @hide-modal="clickOutside(item)"
          @prunning-warning="runGethPrunningWarning"
          @resync-warning="runResyncWarning"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { useServices } from "@/store/services";
import ServiceLayout from "./ServiceLayout.vue";
import ServiceButtons from "./ServiceButtons.vue";
export default {
  name: "ServiceBody",
  components: {
    ServiceLayout,
    ServiceButtons,
  },
  props: {},
  data() {
    return {};
  },
  computed: {
    getServices() {
      return this.installedServices
        .filter((e) => e.category === "service")
        .sort((a, b) => a.name.localeCompare(b.name));
    },

    ...mapState(useServices, {
      installedServices: "installedServices",
    }),
  },
  mounted() {},
  methods: {},
};
</script>
<style scoped>
::-webkit-scrollbar {
  width: 3px;
}
</style>
