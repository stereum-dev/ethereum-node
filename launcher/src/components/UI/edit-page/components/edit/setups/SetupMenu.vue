<template>
  <div
    class="absolute inset-0 w-full h-full flex justify-center items-center mx-auto mt-2"
    @mousedown.prevent
    @mouseleave="props.setup.isActive = false"
  >
    <div
      class="w-20 h-20 bg-gray-700 border border-gray-600 p-1 rounded-md gap-1 z-10 grid grid-cols-2 grid-rows-2 items-center shadow-lg shadow-black overflow-hidden"
    >
      <img
        v-for="icon in icons"
        :key="icon.name"
        class="w-8 col-span-1 bg-gray-900 hover:bg-gray-500 p-1 cursor-pointer active:scale-90 transition duration-200 border border-gray-700 rounded-md"
        :class="{ 'opacity-50 pointer-events-none': icon.disabled }"
        :src="icon.src"
        :alt="`${icon.name} icon`"
        @click="handleAction(icon)"
        @mouseenter="footerStore.cursorLocation = `${icon.tooltip}`"
        @mouseleave="footerStore.cursorLocation = ''"
      />
    </div>
  </div>
</template>

<script setup>
import { useFooter } from "@/store/theFooter";
import { useNodeManage } from "../../../../../../store/nodeManage";

// props & emits
const props = defineProps({
  setup: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["deleteSetup", "connectSetup", "infoModal", "openConfigs"]);

// Store
const footerStore = useFooter();
const manageStore = useNodeManage();

// Methods
const deleteSetup = () => {
  emit("deleteSetup", props.setup);
  footerStore.cursorLocation = "";
};

const connectSetup = () => {
  emit("connectSetup", props.setup);
  footerStore.cursorLocation = "";
};

const infoModal = () => {
  emit("infoModal", props.setup);
  footerStore.cursorLocation = "";
};

const openConfigs = () => {
  manageStore.confirmChanges = [];
  emit("openConfigs", props.setup);
};

const handleAction = (icon) => {
  if (icon.action) {
    icon.action();
  }
};

// Icons array
const icons = [
  {
    name: "connection",
    src: "/img/icon/edit-node-icons/service-connecting.png",
    action: connectSetup,
    tooltip: "Setup Connection",
    disabled: true,
  },
  {
    name: "delete",
    src: "/img/icon/edit-node-icons/service-delete.png",
    tooltip: "Remove Setup",
    action: deleteSetup,
    disabled: false,
  },
  {
    name: "info",
    src: "/img/icon/edit-node-icons/service-info.png",
    tooltip: "Setup Informations",
    action: infoModal,
    disabled: false,
  },
  {
    name: "open",
    src: "/img/icon/edit-node-icons/link.png",
    tooltip: "Configs Page",
    action: openConfigs,
    disabled: false,
  },
];
</script>
