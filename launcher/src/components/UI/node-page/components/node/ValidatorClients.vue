<template>
  <div class="col-start-3 col-end-4 gap-2 p-2 space-y-6 flex flex-col items-end">
    <div
      v-for="item in getValidatorServices"
      :key="item"
      ref="validatorRefs"
      class="max-h-[100px] max-w-[180px] grid grid-cols-2 py-2 rounded-md border border-gray-700 bg-[#212629] shadow-md divide-x divide-gray-700 hover:bg-[#2b3034]"
      @mouseenter="mouseOver(item)"
      @mouseleave="mouseLeave(item)"
    >
      <ClientLayout :client="item" />
      <ClientButtons
        :client="item"
        @open-expert="openExpert"
        @open-log="openLog"
        @state-handler="stateHandler"
        @restart-handler="restartHandler"
        @open-doc="openDoc"
        @remove-lockfiles="removeLockfilesHandler"
      />
    </div>
  </div>
</template>

<script setup>
import { useServices } from "@/store/services";
import { useNodeStore } from "@/store/theNode";
import ClientLayout from "./ClientLayout.vue";
import ClientButtons from "./ClientButtons.vue";
import { computed, watch, ref } from "vue";
import ControlService from "@/store/ControlService";

const emit = defineEmits([
  "openExpert",
  "openLog",
  "openDoc",
  "stateHandler",
  "restartHandler",
  "mouseOver",
  "mouseLeave",
  "removeLockfiles",
]);

const validatorRefs = ref([]);

const nodeStore = useNodeStore();
const serviceStore = useServices();

const getValidatorServices = computed(() =>
  serviceStore.installedServices.filter((e) => e.category === "validator").sort((a, b) => a.name.localeCompare(b.name))
);

const getValidatorRef = computed(() => {
  return validatorRefs.value.map((el, index) => ({
    ref: el,
    refId: getValidatorServices.value[index].config.serviceID,
  }));
});

watch(getValidatorRef, (newValue) => {
  nodeStore.validatorRefList = newValue;
});

const mouseOver = (item) => {
  emit("mouseOver", item);
};
const mouseLeave = (item) => {
  emit("mouseLeave", item);
};

const openExpert = (item) => {
  emit("openExpert", item);
};
const openLog = (item) => {
  emit("openLog", item);
};

const openDoc = (item) => {
  emit("openDoc", item);
};

const stateHandler = (item) => {
  emit("stateHandler", item);
};

const restartHandler = (item) => {
  emit("restartHandler", item);
};

const removeLockfilesHandler = async (item) => {
  await ControlService.chooseServiceAction({
    action: "removeLockfiles",
    service: structuredClone(item),
  });
};
</script>
