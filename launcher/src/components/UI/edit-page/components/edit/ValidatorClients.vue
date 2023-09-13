<template>
  <div class="col-start-1 col-end-2 gap-1 py-2 space-y-2 flex flex-col justify-start items-center relative">
    <div
      v-for="item in getValidatorServices"
      :key="item"
      ref="validatorRefs"
      class="h-[120px] w-[120px] relative flex justify-center items-center py-2 rounded-md border border-gray-700 bg-[#212629] shadow-md divide-x divide-gray-700 hover:bg-[#374045]"
      @mouseenter="displayMenu(item)"
      @mouseleave="item.displayPluginMenu = false"
    >
      <ClientLayout :client="item" />
      <div
        v-if="item.displayPluginMenu"
        class="absolute left-0 right-0 w-full h-full flex justify-center items-center z-50"
        @mouseleave="item.displayPluginMenu = false"
      >
        <div class="flex justify-center items-center bg-gray-800 z-20 p-2 rounded-md space-x-2">
          <img
            class="w-6 rounded-sm hover:bg-gray-500 p-1 cursor-pointer active:scale-90 transition duration-200"
            src="/img/icon/manage-node-icons/stop.png"
            alt="Trash Icon"
          />
          <img
            class="w-6 rounded-sm hover:bg-gray-500 p-1 cursor-pointer active:scale-90 transition duration-200"
            src="/img/icon/manage-node-icons/delete.png"
            alt="Trash Icon"
          />
          <img
            class="w-6 rounded-sm hover:bg-gray-500 p-1 cursor-pointer active:scale-90 transition duration-200"
            src="/img/icon/manage-node-icons/trash.png"
            alt="Trash Icon"
            @click="deleteService(item)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useServices } from "@/store/services";
import { useNodeStore } from "@/store/theNode";
import ClientLayout from "./ClientLayout.vue";


const emit = defineEmits(["deleteService"]);
const validatorRefs = ref([]);
const nodeStore = useNodeStore();
const serviceStore = useServices();


const getValidatorServices = computed(() =>
  serviceStore.installedServices.filter((e) => e.category === "validator").sort((a, b) => a.name.localeCompare(b.name))
);

const getValidatorRef = computed(() =>
  validatorRefs.value.map((el, index) => ({
    ref: el,
    refId: getValidatorServices.value[index].config.serviceID,
  }))
);

watch(getValidatorRef, () => {
  nodeStore.validatorRef.value = getValidatorRef.value;
});

const displayMenu = (item) => {
  item.displayPluginMenu = true;
};

const deleteService = (item) => {
  emit("deleteService", item);
};
</script>
