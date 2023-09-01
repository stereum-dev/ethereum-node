<template>
  <div
    class="scrollbar scrollbar-rounded-* hover:scrollbar-thumb-teal-800 scrollbar-track-transparent w-full h-full max-h-[430px] rounded-md border border-gray-500 overflow-y-auto bg-[#151618] relative pt-1 pl-1 hover:scroll-auto"
  >
    <div ref="service" class="flex flex-col space-y-4 items-center pt-2">
      <div
        v-for="item in getServices"
        :key="item"
        class="max-h-[80px] max-w-[160px] grid grid-cols-2 py-2 rounded-md border border-gray-700 bg-[#212629] shadow-md pr-1"
      >
        <ServiceLayout :client="item" />
        <div class="w-full h-full grid grid-cols-2">
          <div
            class="w-8 h-8 col-start-2 col-span-1 self-center justify-self-center flex justify-center items-center border border-gray-200 bg-gray-200 rounded-md cursor-pointer p-1 transform active:scale-75 duration-200"
            :class="{ 'border-red-500': item.displayTooltip }"
            @mouseenter="item.displayTooltip = true"
            @mouseleave="item.displayTooltip = false"
            @click="selectedServiceToRemove(item)"
          >
            <img
              class="w-6 z-10"
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
import { ref, computed, watch } from "vue";

const serviceStore = useServices();
const editStore = useNodeManage();
const installedServices = serviceStore.installedServices;

const animIsActive = ref(false);

const getServices = computed(() =>
  installedServices.filter((e) => e.category === "service").sort((a, b) => a.name.localeCompare(b.name))
);

const trashAnimated = computed(() => (animIsActive.value ? "trash" : ""));

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
  console.log("4", editStore.confirmChanges);
};

watch(animIsActive, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      animIsActive.value = false;
    }, 200);
  }
});
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
