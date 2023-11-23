<template>
  <div
    class="w-full h-full max-h-[35px] col-start-1 col-span-full bg-[#171D22] rounded-full flex justify-center items-center cursor-pointer overflow-hidden border border-gray-600"
  >
    <div class="w-full h-full grid grid-cols-4 p-1">
      <div
        v-for="service in runningValidators"
        :key="service.config?.serviceID"
        class="col-span-1 colst w-24 h-full flex justify-start items-center bg-[#a7aeb5] hover:bg-slate-300 rounded-full space-x-1 cursor-pointer transition-all duration-150 px-1"
        @click="pickValidator(service)"
      >
        <img class="w-5 h-5" :src="service.icon" alt="Service Icon" @mousedown.prevent />
        <span class="text-[10px] text-gray-700 font-semibold">{{ service.name }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue";
import { useServices } from "@/store/services";

const emit = defineEmits(["pickValidator"]);
const serviceStore = useServices();

const runningValidators = computed(() => {
  return serviceStore.installedServices.filter((s) => s.category === "validator" && s.state === "running");
});

const pickValidator = (service) => {
  emit("pickValidator", service);
};
</script>
