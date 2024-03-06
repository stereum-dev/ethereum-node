<template>
  <CustomConfig
    :client="client"
    @service-installation="serviceInstallation"
    @close-window="closeWindow"
    @remove-ports="removePorts"
    @remove-paths="removePaths"
  />
</template>
<script setup>
import { useNodeManage } from "@/store/nodeManage";
import CustomConfig from "./CustomConfig.vue";

const { client } = defineProps({
  client: {
    type: Object,
    required: true,
  },
});

const manageStore = useNodeManage();

const serviceInstallation = () => {
  console.log(manageStore.customConfig);
};

const closeWindow = () => {
  manageStore.customConfig.image = "";
  manageStore.customConfig.entrypoint = "";
  manageStore.customConfig.command = "";
  manageStore.customConfig.ports = [];
  manageStore.customConfig.paths = [];
};

const removePaths = (path) => {
  manageStore.customConfig.paths = manageStore.customConfig.paths.filter((p) => p !== path);
};

const removePorts = (port) => {
  manageStore.customConfig.ports = manageStore.customConfig.ports.filter((p) => p !== port);
};
</script>
