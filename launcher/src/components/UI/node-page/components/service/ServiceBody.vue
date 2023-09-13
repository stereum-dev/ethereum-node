<template>
  <div
    class="w-full h-[430px] rounded-md border border-gray-500 bg-[#151618] relative hover:scroll-auto overflow-y-auto"
  >
    <div
      class="absolute inset-x-0 w-full mx-auto flex justify-center items-center h-6 bg-[#4f585f] border border-gray-950 rounded-t-[5px] text-gray-200 text-sm z-10"
    >
      <span>Services </span>
    </div>
    <div
      ref="service"
      class="h-full flex flex-col space-y-4 items-center pt-2 overflow-y-auto scrollbar scrollbar-rounded-* hover:scrollbar-thumb-teal-800 scrollbar-track-transparent"
    >
      <div
        v-for="item in getServices"
        :key="item"
        class="max-h-[70px] max-w-[160px] grid grid-cols-2 py-2 rounded-md border border-gray-700 bg-[#212629] shadow-md mx-auto mt-8"
      >
        <ServiceLayout :client="item" />
        <ServiceButtons :client="item" />
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
