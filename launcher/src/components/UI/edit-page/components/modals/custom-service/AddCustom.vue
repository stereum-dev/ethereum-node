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
import { defineEmits, onMounted } from "vue";
import CustomConfig from "./CustomConfig.vue";

const emits = defineEmits(["confirmCreate"]);

const props = defineProps({
  client: {
    type: Object,
    required: true,
  },
});

const manageStore = useNodeManage();

const serviceInstallation = () => {
  emits("confirmCreate", {
    client: props.client,
    installDir: manageStore.customConfig.installDir,
    image: manageStore.customConfig.image,
    entrypoint: manageStore.customConfig.entrypoint,
    command: manageStore.customConfig.command,
    ports: manageStore.customConfig.ports,
    volumes: manageStore.customConfig.paths,
    relays: [],
    executionClients: [],
    consensusClients: [],
    customConfigReady: true,
  });
};

onMounted(() => {
  manageStore.customConfig.image = "";
  manageStore.customConfig.entrypoint = "";
  manageStore.customConfig.command = "";
  manageStore.customConfig.ports = [];
  manageStore.customConfig.paths = [];
});

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
../../../../../../../public/img/icon/edit-node-icons/CustomConfig.vue
