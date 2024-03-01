<template>
  <div
    class="w-full h-[430px] rounded-md border border-gray-600 bg-[#151618] relative hover:scroll-auto overflow-y-auto"
    :class="manageStore.disableConfirmButton ? 'opacity-70 pointer-events-none' : ''"
  >
    <div
      class="absolute inset-x-0 w-full mx-auto flex justify-center items-center h-6 bg-[#33393E] border border-gray-950 rounded-t-[5px] text-gray-300 text-[10px] font-semibold z-10"
    >
      <span>{{ $t("editPageServices.services") }} </span>
    </div>
    <div
      ref="service"
      class="h-full max-h-[430px] flex flex-col space-y-2 items-center justify-start pt-8 px-1 overflow-x-hidden overflow-y-auto scrollbar scrollbar-rounded-* hover:scrollbar-thumb-teal-800 scrollbar-track-transparent"
      :class="manageStore.disableConfirmButton ? 'opacity-70 pointer-events-none' : ''"
    >
      <div
        v-for="item in getServices"
        :key="item"
        class="w-full max-h-[78px] grid grid-cols-2 p-2 rounded-md border border-gray-600 shadow-md mx-auto bg-[#212629]"
        :class="{ 'border border-red-600 bg-red-600': item.isRemoveProcessing }"
        style="cursor: default"
        @mouseenter="footerStore.cursorLocation = `${item.name} ${$t('editPageServices.service')}`"
        @mouseleave="footerStore.cursorLocation = ''"
      >
        <ServiceLayout :client="item" />
        <div class="w-full h-full grid grid-cols-2 items-center">
          <div
            v-if="item.service === 'FlashbotsMevBoostService' && !item.isRemoveProcessing"
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
            @mouseenter="
              footerStore.cursorLocation = `${$t('editPageServices.delete')} ${item.name} ${$t(
                'editPageServices.service'
              )}`
            "
            @mouseleave="footerStore.cursorLocation = ''"
          >
            <img
              class="w-5 z-10 cursor-pointer"
              src="/img/icon/edit-node-icons/service-delete.png"
              alt=""
              @mousedown.prevent.stop
            />
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

const footerStore = useFooter();

const emit = defineEmits(["changeConnection", "deleteService"]);

const manageStore = useNodeManage();

const getServices = computed(() =>
  manageStore.newConfiguration
    .filter((e) => e?.category === "service")
    .sort((a, b) => {
      let fa = a.name.toLowerCase(),
        fb = b.name.toLowerCase();

      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    })
);

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
