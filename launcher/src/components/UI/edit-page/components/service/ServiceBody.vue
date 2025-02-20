<template>
  <div
    class="w-full h-[430px] rounded-md border border-gray-600 bg-[#151618] relative hover:scroll-auto overflow-y-auto"
    :class="manageStore.disableConfirmButton ? 'opacity-70 pointer-events-none' : ''"
  >
    <div
      class="absolute inset-x-0 w-full mx-auto flex justify-center items-center h-6 border border-gray-950 text-gray-300 rounded-t-[5px]"
      :class="[setupStore.getBGColor(setupStore.selectedSetup?.color), setupStore.getTextColor(setupStore.selectedSetup?.color)]"
    >
      <span v-if="setupStore.isEditConfigViewActive" class="text-xs text-center font-sans">Config Services </span>
      <span v-else class="text-xs text-center font-sans">Server Services </span>
    </div>
    <div
      ref="service"
      class="h-full max-h-[430px] flex flex-col space-y-2 items-center justify-start pt-8 px-1 overflow-x-hidden overflow-y-auto scrollbar scrollbar-rounded-* hover:scrollbar-thumb-teal-800 scrollbar-track-transparent"
      :class="manageStore.disableConfirmButton ? 'opacity-70 pointer-events-none' : ''"
    >
      <div
        v-for="item in getServices"
        :key="item"
        :ref="
          (el) => {
            item.ref = el;
          }
        "
        class="w-full max-h-[78px] grid grid-cols-2 p-2 rounded-md border border-gray-600 shadow-md mx-auto bg-[#212629]"
        :class="getDynamicClasses(item)"
        style="cursor: default"
        @mouseenter="footerStore.cursorLocation = `${item.name} ${$t('editPageServices.service')}`"
        @mouseleave="footerStore.cursorLocation = ''"
      >
        <ServiceLayout :client="item" />
        <div class="w-full h-full grid grid-cols-2 items-center">
          <div
            v-if="
              /FlashbotsMevBoostService|LidoObolExitService|ValidatorEjectorService|KeysAPIService|SSVDKGService/.test(item.service) &&
              !item.isRemoveProcessing
            "
            class="w-8 h-8 col-start-1 col-span-1 self-center justify-self-center flex justify-center items-center border border-gray-500 bg-gray-700 rounded-md cursor-pointer p-1 transform active:scale-75 duration-200 hover:border-gray-300"
            @click="changeConnection(item)"
          >
            <img class="w-5 z-10" src="/img/icon/edit-node-icons/service-connecting.png" alt="" @mousedown.prevent.stop />
          </div>
          <div
            class="w-8 h-8 col-start-2 col-span-1 self-center justify-self-center flex justify-center items-center border border-gray-500 bg-gray-700 hover:bg-black rounded-md cursor-pointer p-1 transform active:scale-75 duration-200"
            :class="{
              'border-red-500': item.displayTooltip,
              'pointer-events-none': item.isRemoveProcessing,
            }"
            @click="deleteService(item)"
            @mouseenter="footerStore.cursorLocation = `${$t('editPageServices.delete')} ${item.name} ${$t('editPageServices.service')}`"
            @mouseleave="footerStore.cursorLocation = ''"
          >
            <img class="w-5 z-10 cursor-pointer" src="/img/icon/edit-node-icons/service-delete.png" alt="" @mousedown.prevent.stop />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useNodeManage } from "@/store/nodeManage";
import ServiceLayout from "./ServiceLayout.vue";
import { computed } from "vue";
import { useFooter } from "@/store/theFooter";
import { useSetups } from "../../../../../store/setups";

const footerStore = useFooter();

const emit = defineEmits(["changeConnection", "deleteService"]);

const manageStore = useNodeManage();
const setupStore = useSetups();

// Methods
const getDynamicClasses = (item) => {
  if (item.hasOwnProperty("isRemoveProcessing") && item.isRemoveProcessing) {
    return "border bg-red-600 border-white hover:bg-red-600";
  } else if (item.hasOwnProperty("isNewClient") && item.isNewClient) {
    return "opacity-50 cursor-not-allowed pointer-events-none bg-[#212629] border border-gray-700";
  } else if (item.hasOwnProperty("modifierPanel") && item.modifierPanel) {
    return "opacity-50 cursor-not-allowed pointer-events-none bg-[#212629] border border-gray-700";
  } else {
    return "bg-[#212629] hover:bg-[#374045] border border-gray-700";
  }
};

const getServices = computed(() => {
  let services = manageStore.newConfiguration.filter((e) => e.category === "service").sort((a, b) => a.name.localeCompare(b.name));

  if (!setupStore.isEditConfigViewActive) {
    const seen = new Set();
    services = services.filter((service) => {
      if (setupStore.serverServices.includes(service.service)) {
        if (!seen.has(service.service)) {
          seen.add(service.service);
          return true;
        }
        return false; // Exclude duplicate
      }
      return false; // services not in serverServices
    });
  } else {
    services = services.filter(
      (service) => !setupStore.serverServices.includes(service.service) && service.setupId === setupStore.selectedSetup.setupId
    );
  }

  return services;
});

// Methods
const changeConnection = (item) => {
  emit("changeConnection", item);
};

const deleteService = (item) => {
  emit("deleteService", item);
};
</script>

<style scoped>
::-webkit-scrollbar {
  width: 3px;
}

.trash:active {
  transform: rotateY(180deg);
}

.btn:active {
  transform: scale(0.9);
}
</style>
