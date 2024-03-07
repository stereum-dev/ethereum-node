<template>
  <router-link
    class="credit-btn-btn w-[30%] rounded-md h-full bg-green-800 flex justify-center items-center cursor-pointer border border-[#33393E] hover:border-[#4d7575] hover:bg-[#4d7575]"
    to="/credit"
    @click="creditTypeHandler"
  >
    <span class="uppercase font-medium text-gray-200 text-[8px] text-center">{{ props.btnName }}</span>
  </router-link>
</template>
<script setup>
import { useNodeHeader } from "@/store/nodeHeader";

const headerStore = useNodeHeader();

const props = defineProps({
  btnName: String,
});

const creditTypeHandler = () => {
  headerStore.choosedCreditType = props.btnName;
};
</script>
<style scoped>
.credit-btn-btn:active {
  box-shadow: 1px 1px 10px 1px #171717 inset;
  border: none;
}
.credit-btn-btn:active span {
  transform: scale(0.95);
}
</style>
