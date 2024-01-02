<template>
  <div
    class="animate__animated animate__fadeIn w-full h-full max-h-[32px] col-start-1 col-span-full bg-[#3e4347] rounded-sm flex justify-center items-center cursor-pointer p-1"
  >
    <div class="w-full h-full grid grid-cols-4 bg-[#171D22]">
      <div
        v-for="service in runningValidators"
        :key="service.config?.serviceID"
        class="col-span-1 colst w-24 h-full flex justify-start items-center bg-[#a7aeb5] hover:bg-slate-300 rounded-sm space-x-1 cursor-pointer transition-all duration-150 px-1"
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
