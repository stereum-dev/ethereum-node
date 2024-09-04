<template>
  <div
    class="min-w-screen h-screen animated fadeIn faster fixed left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover"
  >
    <div class="absolute bg-black opacity-80 inset-0 z-0" @click="closeModal"></div>
    <div class="w-2/3 min-h-[400px] py-1 px-2 relative mx-auto my-auto rounded-[55px] shadow-lg bg-[#1c1d1d] border-4 border-gray-400">
      <div class="flex flex-col justify-between gap-5">
        <div class="text-center p-2 flex-auto justify-center space-y-4">
          <div class="flex flex-col justify-center items-center py-2 px-4 mx-auto">
            <img v-if="icon" class="w-[70px] h-[70px] mr-2" :src="icon" :alt="altText" />
            <div v-if="mainTitle || subTitle" class="flex flex-col justify-between items-start">
              <p class="text-xl font-bold text-red-400 uppercase">{{ mainTitle }}</p>
              <p class="text-[24px] font-bold text-amber-600 uppercase">{{ subTitle }}</p>
            </div>
          </div>

          <div v-if="messageText" class="text-md font-bold py-2 text-amber-600">
            <p>{{ messageText }}</p>
          </div>
          <slot name="content"></slot>
        </div>
        <div class="flex justify-end text-md font-bold py-3 mt-2 space-y-4">
          <button
            v-if="confirmText !== ''"
            class="mr-4 bg-green-500 border border-green-500 px-5 py-2 text-sm shadow-xl shadow-[#141516] font-medium tracking-wider text-white rounded-full hover:bg-green-600 uppercase active:scale-95 transition duration-200"
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
const { icon, altText, mainTitle, messageText, confirmText, subTitle, clickOutsideText } = defineProps({
  icon: String,
  altText: String,
  mainTitle: String,
  messageText: String,
  confirmText: String,
  confirmBtn: Boolean,
  subTitle: String,
  clickOutsideText: String,
});
const emit = defineEmits(["closeWindow", "confirmAction"]);

const closeModal = () => {
  emit("closeWindow");
};

const emitConfirmAction = () => {
  emit("confirmAction");
};
</script>
