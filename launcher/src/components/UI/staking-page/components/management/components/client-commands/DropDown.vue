<template>
  <div
    class="h-6 col-start-1 col-span-full row-start-1 row-span-1 bg-[#336666] hover:bg-gray-300 rounded-md -mt-1 relative flex justify-center items-center cursor-pointer text-gray-300 hover:text-gray-800 transition-all duration-200 z-20"
  >
    <div class="w-full h-full grid grid-cols-6" @click="isOpen = !isOpen">
      <img
        v-if="displayItem?.icon"
        class="col-start-1 col-span-1 w-4 h-4 justify-self-center self-center"
        :src="displayItem?.icon"
        alt="Arrow icon"
      />
      <span class="col-start-2 col-end-6 justify-self-center self-center text-center text-[10px] font-semibold">{{
        displayItem?.name ? displayItem?.name : displayItem
      }}</span>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="col-start-6 col-span-1 justify-self-center self-center w-5 h-5 text-gray-900"
        :class="{ 'transform rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-width="2" d="M5 10l7 7 7-7"></path>
      </svg>
    </div>
    <TransitionGroup name="slide-fade">
      <div
        v-if="isOpen"
        class="absolute top-7 w-[200px] h-fit max-h-[150px] bg-gray-700 rounded-sm shadow-lg p-1 overflow-y-auto flex flex-col justify-start items-center divide-y divide-gray-500"
      >
        <li
          v-for="item in getValidatorList"
          :key="item.name"
          class="w-full min-h-[30px] max-h-[30px] px-4 hover:bg-blue-400 grid grid-cols-6 items-center cursor-pointer"
          @click="selectValidator(item)"
        >
          <img class="h-5 col-start-1 col-end-2 self-center justify-self-center" :src="item.icon" alt="service Icon" />
          <span
            class="col-start-3 col-span-full px-4 py-1 flex justify-start items-center outline-0 whitespace-nowrap cursor-pointer text-xs text-gray-200 font-semibold"
            >{{ item.name }}</span
          >
        </li>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useServices } from "@/store/services";

const serviceStore = useServices();
const isOpen = ref(false);
const displayItem = ref("Select a validator");

const getValidatorList = computed(() => {
  return serviceStore.installedServices.filter((service) => service.category === "validator");
});

const selectValidator = (item) => {
  displayItem.value = item;
  isOpen.value = false;
};
</script>
<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: transform 0.5s ease-in-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
}
</style>
