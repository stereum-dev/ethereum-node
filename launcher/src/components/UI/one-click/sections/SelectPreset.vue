<template>
  <div class="col-start-1 col-span-full row-start-1 row-span-full grid grid-cols-24 grid-rows-12">
    <PresetHeader />
    <PresetBody @install-preset="selectItemToInstall" />
    <PresetFooter />
  </div>
</template>

<script setup>
import PresetHeader from "../components/presets/PresetHeader.vue";
import PresetBody from "../components/presets/PresetBody.vue";
import PresetFooter from "../components/presets/PresetFooter.vue";
import ControlService from "@/store/ControlService";
import { useNodeManage } from "@/store/nodeManage";
import { useServices } from "@/store/services";
import { useClickInstall } from "@/store/clickInstallation";

const manageStore = useNodeManage();
const serviceStore = useServices();
const installStore = useClickInstall();

const selectItemToInstall = async (item) => {
  const constellation = await ControlService.getOneClickConstellation({
    setup: item.name,
    network: manageStore.currentNetwork.network,
  });
  let includedPlugins = serviceStore.allServices.filter((service) => constellation.includes(service.service));
  if (
    includedPlugins.map((e) => e.service).includes("SSVNetworkService") ||
    includedPlugins.map((e) => e.service).includes("RocketpoolService")
  ) {
    includedPlugins.splice(
      includedPlugins.findIndex((e) => e.service != "SSVNetworkService" && e.service != "RocketpoolService" && e.category === "validator"),
      1
    );
  }
  item.includedPlugins = includedPlugins;
  installStore.presets.forEach((p) => (p.selected = false));
  item.selected = true;
  installStore.selectedPreset = item;
};
</script>
