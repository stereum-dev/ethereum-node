<template>
  <div
    class="w-full h-[430px] rounded-md border border-gray-500 bg-[#151618] relative hover:scroll-auto overflow-y-auto"
  >
    <div
      class="absolute inset-x-0 w-full mx-auto flex justify-center items-center h-6 bg-[#4f585f] border border-gray-950 rounded-t-[5px] text-gray-200 text-[10px] font-semibold z-10"
    >
      <span>Services </span>
    </div>
    <div
      ref="service"
      class="h-full flex flex-col space-y-4 items-center pt-2 overflow-y-auto scrollbar scrollbar-rounded-* hover:scrollbar-thumb-teal-800 scrollbar-track-transparent"
    >
      <div
        v-for="item in getServices"
        :key="item"
        class="max-h-[80px] max-w-[160px] grid grid-cols-2 py-2 rounded-md border border-gray-600 shadow-md mx-auto mt-8"
      >
        <ServiceLayout :client="item" />
        <div class="w-full h-full grid grid-cols-2">
          <div
            v-if="item.service === 'FlashbotsMevBoostService'"
            class="w-8 h-8 col-start-1 col-span-1 self-center justify-self-center flex justify-center items-center border border-gray-500 bg-gray-700 rounded-md cursor-pointer p-1 transform active:scale-75 duration-200 mt-2 hover:border-gray-300"
            @click="changeConnection"
          >
            <img
              class="w-5 z-10"
              :class="trashAnimated"
              src="/img/icon/manage-node-icons/not-connected.png"
              alt=""
              @mousedown.prevent.stop
              @click="animIsActive = true"
              @mouseleave="animIsActive = false"
            />
          </div>
          <div
            class="w-8 h-8 col-start-2 col-span-1 self-center justify-self-center flex justify-center items-center border border-gray-500 bg-gray-700 rounded-md cursor-pointer p-1 transform active:scale-75 duration-200 mt-2"
            :class="{ 'border-red-500': item.displayTooltip }"
            @mouseenter="item.displayTooltip = true"
            @mouseleave="item.displayTooltip = false"
            @click="selectedServiceToRemove(item)"
          >
            <img
              class="w-5 z-10"
              :class="trashAnimated"
              src="/img/icon/manage-node-icons/trash.png"
              alt=""
              @mousedown.prevent.stop
              @click="animIsActive = true"
              @mouseleave="animIsActive = false"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useServices } from "@/store/services";
import { useNodeManage } from "@/store/nodeManage";
import ServiceLayout from "./ServiceLayout.vue";
import { ref, computed, watchEffect } from "vue";

const emit = defineEmits(["changeConnection"]);
const serviceStore = useServices();
const editStore = useNodeManage();

const animIsActive = ref(false);

const getServices = computed(() => serviceStore.installedServices.filter((e) => e?.category === "service"));
watchEffect(() => {
  getServices.value.sort((a, b) => {
    let fa = a.name.toLowerCase(),
      fb = b.name.toLowerCase();

    if (fa < fb) {
      return -1;
    }
    if (fa > fb) {
      return 1;
    }
    return 0;
  });
});

const trashAnimated = computed(() => (animIsActive.value ? "trash" : ""));

watchEffect(animIsActive, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      animIsActive.value = false;
    }, 200);
  }
});

// Methods
const changeConnection = () => {
  emit("changeConnection");
};
// const removeService = (item) => {
//   item.displayTooltip = false;
//   if (item) {
//     editStore.selectedItemToRemove = editStore.selectedItemToRemove.concat(
//       editStore.newConfiguration.filter((el) => el.config.serviceID === item.config.serviceID)
//     );
//   } else {
//     if (!item.config.serviceID) {
//       editStore.newConfiguration = editStore.newConfiguration.filter((el) => el.id !== item.id);
//       editStore.confirmChanges = editStore.confirmChanges.filter((el) => el.service.id !== item.id);
//     }
//     editStore.selectedItemToRemove = editStore.selectedItemToRemove.filter(
//       (el) => el.config.serviceID !== item.config.serviceID
//     );
//   }
// };
const selectedServiceToRemove = (item) => {
  item.displayTooltip = false;
  getServices.value = getServices.value.filter((el) => el.id !== item.id);
  editStore.selectedItemToRemove.push(item);
  editStore.confirmChanges.push({
    id: item.config.serviceID,
    content: "DELETE",
    contentIcon: "/img/icon/manage-node-icons/delete.png",
    service: item,
  });

  // if (item.config.serviceID) {
  //   editStore.selectedItemToRemove = editStore.selectedItemToRemove.concat(
  //     editStore.newConfiguration.filter((el) => el.config.serviceID === item.config.serviceID)
  //   );
  // } else if (!item.config.serviceID) {
  //   editStore.newConfiguration = editStore.newConfiguration.filter((el) => el.id !== item.id);
  //   editStore.confirmChanges = editStore.confirmChanges.filter((el) => el.service.id !== item.id);
  // }
  // editStore.selectedItemToRemove = editStore.selectedItemToRemove.filter(
  //   (el) => el.config.serviceID !== item.config.serviceID
  // );
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
