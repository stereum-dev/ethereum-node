<template>
  <div
    class="animate__animated animate__fadeIn w-full h-full max-h-[32px] col-start-1 col-span-full bg-[#3e4347] rounded-sm flex justify-center items-center cursor-pointer p-1"
  >
    <div class="w-full h-full grid grid-cols-4 bg-[#171D22]">
      <div
        class="col-span-1 colst w-24 h-full flex justify-start items-center bg-[#a7aeb5] hover:bg-slate-300 rounded-sm space-x-1 cursor-pointer transition-all duration-150 px-1"
        @click="pickValidator"
      >
        <img class="w-5 h-5" :src="web3Signer.icon" alt="Service Icon" @mousedown.prevent />
        <span class="text-[10px] text-gray-700 font-semibold">{{ web3Signer.name }}</span>
      </div>
      <input
        id="input1"
        v-model="remoteKey"
        class="col-start-2 col-end-11 w-full bg-[#171D22] border px-4 rounded-sm outline-none text-xs text-gray-400 border-gray-500 placeholder:text-gray-400"
        type="text"
        autofocus
        :class="inputClass"
        placeholder="Write here your group name"
        @change="changeActive"
      />
    </div>
  </div>
</template>
<script setup>
import { computed, ref } from "vue";
import { useServices } from "@/store/services";

const emit = defineEmits(["pickValidator"]);
const serviceStore = useServices();
const remoteKey = ref("");

const web3Signer = computed(() => {
  return serviceStore.installedServices.find((s) => s.category === "validator" && s.service === "Web3SignerService");
});

const pickValidator = () => {
  emit("pickValidator", web3Signer);
};
</script>
