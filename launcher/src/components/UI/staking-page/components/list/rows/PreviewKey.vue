import { computed, ref } from 'vue';
<template>
  <div
    class="w-full h-8 bg-gray-700 rounded-full grid grid-cols-24 p-1 items-center animate__animated animate__faster"
    :class="isRemoveActive ? 'animate__slideOutRight' : 'animate__slideInLeft'"
  >
    <div class="w-full h-full col-start-1 col-span-1 self-center overflow-hidden flex justify-start items-center">
      <div class="w-6 h-6 bg-gray-300 rounded-full p-1">
        <img class="w-full" src="/img/icon/the-staking/select-key.png" alt="Key Icon" @mousedown.prevent />
      </div>
    </div>
    <div class="w-full h-full col-start-2 col-end-25 self-center overflow-hidden flex justify-between items-center">
      <span class="text-center text-xs text-gray-300 ml-2">{{ props.item.pubkey }}</span>
      <div
        class="w-6 h-6 bg-[#1b1d1f] hover:bg-[#212325] rounded-full flex justify-center items-center p-1 cursor-pointer"
        @click="deletePreview"
      >
        <img
          class="w-4 h-4 hover:scale-105 active:scale-100"
          src="/img/icon/the-staking/close.png"
          alt="Close Icon"
          @mousedown.prevent
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const isRemoveActive = ref(false);

const emit = defineEmits(["deletePreview"]);

const deletePreview = () => {
  isRemoveActive.value = true;
  emit("deletePreview", props.item);
};
</script>
