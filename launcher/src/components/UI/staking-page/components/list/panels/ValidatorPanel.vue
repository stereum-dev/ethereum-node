<template>
  <div
    class="animate__animated animate__fadeIn w-full h-full max-h-[32px] col-start-1 col-span-full bg-[#3e4347] rounded-sm flex justify-center items-center cursor-pointer p-1"
  >
    <div class="w-full h-full grid grid-cols-7 bg-[#171D22]">
      <div
        v-for="service in runningValidators"
        :key="service.config?.serviceID"
        class="col-span-1 w-22 h-full flex justify-start items-center hover:bg-slate-300 rounded-sm space-x-1 cursor-pointer transition-all duration-150 px-1 border border-gray-700"
        :class="getBgColor(service.setupId)?.background"
        @click="pickValidator(service)"
      >
        <img class="w-4 h-4" :src="service.icon" alt="Service Icon" @mousedown.prevent />
        <span class="text-[9px] font-medium hover:text-black transition-all duration-150" :class="getBgColor(service.setupId)?.text">{{
          service.name
        }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue";
import { useServices } from "@/store/services";
import { useSetups } from "@/store/setups";

const emit = defineEmits(["pickValidator"]);
const serviceStore = useServices();
const setupStore = useSetups();

const runningValidators = computed(() => {
  let validatores;
  if (setupStore.selectedSetup !== null) {
    validatores = serviceStore.installedServices.filter(
      (s) =>
        s.category === "validator" &&
        s.state === "running" &&
        s.setupId === setupStore.selectedSetup?.setupId &&
        s.service !== "LCOMService" &&
        s.service !== "SSVNetworkService" &&
        s.service !== "CharonService"
    );
  } else {
    validatores = serviceStore.installedServices.filter(
      (s) =>
        s.category === "validator" &&
        s.state === "running" &&
        s.service !== "LCOMService" &&
        s.service !== "SSVNetworkService" &&
        s.service !== "CharonService"
    );
  }
  return validatores;
});

const getBgColor = (setupId) => {
  const currentSetup = setupStore.allSetups.find((s) => s.setupId === setupId);
  const setupColor = currentSetup?.color;
  return setupStore.colorMappings[setupColor];
};

const pickValidator = (service) => {
  emit("pickValidator", service);
};
</script>
