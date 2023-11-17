import { useNodeManage } from '@/store/nodeManage'; import { computed } from 'vue';
<template>
  <div
    class="min-w-screen h-screen animated fadeIn faster fixed left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover"
  >
    <div class="absolute bg-black opacity-80 inset-0 z-0 rounded-md" @click="closeModal"></div>
    <div
      class="w-2/3 min-h-[450px] p-2 relative mx-auto rounded-[55px] shadow-lg bg-[#1c1d1d] border-4 border-gray-600 grid grid-cols-12 grid-rows-7"
    >
      <div class="w-full h-full col-start-1 col-span-full row-start-1 row-span-full grid grid-cols-12 grid-rows-7">
        <div v-if="mainTitle" class="col-start-1 col-span-full row-start-1 row-span-1 flex justify-center items-center">
          <span class="text-[26px] font-bold text-teal-600 uppercase">{{ mainTitle }}</span>
        </div>

        <div
          v-if="subTitle || messageText"
          class="col-start-1 col-span-full row-start-2 row-span-2 flex justify-center items-center"
        >
          <span v-if="subTitle" class="text-[22px] font-bold text-amber-600 uppercase">{{ subTitle }}</span>
          <span v-if="messageText" class="text-md font-bold text-gray-400">{{ messageText }}</span>
        </div>

        <slot name="content"></slot>
        <div class="w-full flex justify-end text-md font-bold py-3 mt-2 space-y-4 absolute bottom-4 right-2">
          <button
            class="mr-4 min-w-[100px] bg-green-500 border border-green-500 px-5 py-2 text-sm shadow-xl shadow-[#141516] font-medium tracking-wider text-white rounded-full uppercase"
            :class="
              disabledButton
                ? 'opacity-40 pointer-events-none'
                : 'hover:bg-green-600  active:scale-95 transition duration-200'
            "
            @click="emitConfirmAction"
          >
            {{ confirmText }}
          </button>
        </div>
        <span class="absolute bottom-1 left-[40%] text-xs flex justify-center items-center text-red-500 mx-auto">{{
          clickOutsideText
        }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
//Props
const props = defineProps({
  icon: {
    type: String,
    default: "",
  },
  animation: {
    type: String,
    default: "",
  },
  mainTitle: {
    type: String,
    default: "",
  },
  messageText: {
    type: String,
    default: "",
  },
  clickOutsideText: {
    type: String,
    default: "",
  },
  subTitle: {
    type: String,
    default: "",
  },
  confirmText: {
    type: String,
    default: "",
  },
  confirmBtn: {
    type: Boolean,
    default: false,
  },
  disabledButton: {
    type: Boolean,
    default: false,
  },
});

//Emits
const emit = defineEmits(["closeWindow", "confirmAction"]);

//Refs

//Watchers

//Methods
const closeModal = () => {
  if (props.clickOutsideText) {
    emit("closeWindow");
  }
};

const emitConfirmAction = () => {
  if (props.confirmText) {
    emit("confirmAction");
  }
};
</script>
