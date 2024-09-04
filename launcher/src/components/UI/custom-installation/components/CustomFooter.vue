<template>
  <div class="w-full h-full col-start-1 col-span-full row-start-11 row-span-full grid grid-cols-12 gird-rows-2 px-4" @mousedown.prevent>
    <router-link
      to="/welcome"
      class="col-start-1 col-span-2 row-start-1 row-span-2 justify-self-end w-[120px] h-12 bg-[#264744] hover:bg-[#447a75] rounded-full py-2 px-4 flex justify-center items-center hover:scale-110 hover:shadow-lg hover:shadow-[#1e2a29] transition-all duration-300 ease-in-out active:scale-100 active:shadow-none"
    >
      <span class="text-gray-200 text-xl font-semibold text-center uppercase">{{ $t("customFooter.back") }}</span>
    </router-link>
    <div
      class="col-start-11 col-span-1 row-start-1 row-span-2 w-[120px] h-12 bg-[#264744] hover:bg-[#447a75] rounded-full py-2 px-4 flex justify-center items-center hover:scale-110 hover:shadow-lg hover:shadow-[#1e2a29] transition-all duration-300 ease-in-out active:scale-100 active:shadow-none cursor-pointer"
      :class="{ 'opacity-50 pointer-events-none shadow-none': props.disabledBtn }"
      @click="prepareStereum"
    >
      <span class="text-gray-200 text-xl font-semibold text-center uppercase">{{ $t("customFooter.next") }}</span>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  disabledBtn: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["prepareStereum"]);

const prepareStereum = () => {
  emit("prepareStereum");
};
</script>
