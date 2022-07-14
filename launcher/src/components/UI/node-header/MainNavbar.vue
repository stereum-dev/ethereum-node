<template>
  <nav class="main-nav1">
    <pages-nav></pages-nav>
    <service-links></service-links>
    <icons-nav></icons-nav>
  </nav>
</template>
<script>
import PagesNav from "./PagesNav.vue";
import IconsNav from "./IconsNav.vue";
import ServiceLinks from "./ServiceLinks.vue";
import ControlService from "@/store/ControlService";
import { mapWritableState } from "pinia";
import { useNodeHeader } from "@/store/nodeHeader";
import { useServices } from "@/store/services";
export default {
  components: { PagesNav, IconsNav, ServiceLinks },
  mounted() {
    this.polling = setInterval(this.refreshServiceStates, 1000); //refresh services
  },
  beforeUnmount() {
    clearInterval(this.polling);
  },
  computed: {
    ...mapWritableState(useServices, {
      installedServices: "installedServices",
      runningServices: "runningServices",
      allServices: "allServices",
    }),
    ...mapWritableState(useNodeHeader, {
      headerServices: "runningServices",
    }),
  },
  methods: {
    refreshServiceStates: async function(){
      let services = (await ControlService.refreshServiceInfos()).filter(s => s.service != "PrometheusNodeExporterService")
      const newServices = services.map(service => {
          const oldService = this.installedServices.find(s => s.config.serviceID === service.config.serviceID)
          oldService.config = service.config
          oldService.state = service.state
        return oldService
      })
      this.installedServices = newServices

      this.headerServices = this.installedServices
        .filter((service) => service.headerOption)
    }
  },
};
</script>
<style scoped>
.main-nav1 {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
