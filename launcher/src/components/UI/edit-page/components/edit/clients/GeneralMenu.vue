<template>
  <div class="absolute inset-x-0 w-full h-full flex justify-center items-center z-10" @mousedown.prevent>
    <div class="w-2/3 h-2/3 grid grid-cols-2 grid-rows-2 bg-gray-800 p-1 rounded-md gap-1">
      <img
        v-if="item.category !== 'execution' && item.service !== 'ExternalExecutionService' && item.service !== 'ExternalConsensusService'"
        class="w-7 bg-gray-900 hover:bg-gray-500 p-1 cursor-pointer active:scale-90 transition duration-200 border border-gray-700 rounded-md"
        src="/img/icon/edit-node-icons/service-connecting.png"
        alt="Trash Icon"
        @click="modifyService"
        @mouseenter="footerStore.cursorLocation = `${modify} ${item.name} ${connection}`"
        @mouseleave="footerStore.cursorLocation = ''"
      />
      <img
        v-if="item.service !== 'ExternalExecutionService' && item.service !== 'ExternalConsensusService'"
        class="w-7 border border-gray-700 bg-gray-900 rounded-md hover:bg-gray-500 p-1 cursor-pointer active:scale-90 transition duration-200"
        src="/img/icon/edit-node-icons/switch-client.png"
        alt="Trash Icon"
        @click="switchClient"
        @mouseenter="footerStore.cursorLocation = `${switchClientTooltip}`"
        @mouseleave="footerStore.cursorLocation = ''"
      />
      <img
        class="w-7 border border-gray-700 bg-gray-900 rounded-md hover:bg-gray-500 p-1 cursor-pointer active:scale-90 transition duration-200"
        src="/img/icon/edit-node-icons/service-delete.png"
        alt="Trash Icon"
        @click="deleteService"
        @mouseenter="footerStore.cursorLocation = `${deleteServiceTooltip} ${item.name} ${service}`"
        @mouseleave="footerStore.cursorLocation = ''"
      />
      <img
        class="w-7 border border-gray-700 bg-gray-900 rounded-md hover:bg-gray-500 p-1 cursor-pointer active:scale-90 transition duration-200"
        src="/img/icon/edit-node-icons/service-info.png"
        alt="Trash Icon"
        @click="infoModal"
        @mouseenter="footerStore.cursorLocation = `${info} ${item.name} ${service}`"
        @mouseleave="footerStore.cursorLocation = ''"
      />
    </div>
  </div>
</template>

<script setup>
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";

const t = i18n.global.t;

const modify = t("generalMenu.modify");
const connection = t("generalMenu.connection");
const switchClientTooltip = t("generalMenu.switchClient");
const deleteServiceTooltip = t("generalMenu.delete");
const service = t("generalMenu.service");
const info = t("generalMenu.info");

const footerStore = useFooter();
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["deleteService", "switchClient", "modifyService", "infoModal"]);

const deleteService = () => {
  emit("deleteService", props.item);
  footerStore.cursorLocation = "";
};

const switchClient = () => {
  emit("switchClient", props.item);
  footerStore.cursorLocation = "";
};

const modifyService = () => {
  emit("modifyService", props.item);
  footerStore.cursorLocation = "";
};

const infoModal = () => {
  emit("infoModal", props.item);
  footerStore.cursorLocation = "";
};
</script>
