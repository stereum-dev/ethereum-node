<template>
  <div
    class="min-w-screen h-screen animated fadeIn faster fixed left-0 top-0 flex justify-center items-center inset-0 z-20 outline-none focus:outline-none bg-no-repeat bg-center bg-cover"
  >
    <div class="absolute bg-black opacity-80 inset-0 z-0" @click="closeModal"></div>
    <div
      class="w-2/3 min-h-[400px] py-2 px-2 relative mx-auto my-auto rounded-[35px] shadow-lg border-4 border-gray-400"
      :class="bgColor ? bgColor : 'bg-gray-100'"
    >
      <div class="flex flex-col justify-between gap-5">
        <div class="text-center p-2 flex-auto justify-center space-y-4">
          <div v-if="icon !== ''">
            <img class="w-24 -m-1 flex items-center text-red-500 mx-auto" :src="icon" :alt="altText" />
          </div>
          <div v-if="mainTitle" class="text-xl font-bold py-2 text-gray-200 capitalize">
            <p>{{ mainTitle }}</p>
          </div>
          <div v-if="messageText" class="text-md font-bold py-2">
            <p>{{ messageText }}</p>
          </div>
          <slot name="content"></slot>
        </div>
        <div class="flex justify-end text-md font-bold py-3 mt-2 text-center space-y-4">
          <button
            v-if="confirmText !== ''"
            class="w-[8rem] mr-2 bg-green-500 border border-green-500 px-5 py-2 text-md capitalize shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-green-600 active:scale-95 transition-all duration-200 ease-in-out"
            @click="emitConfirmAction"
          >
            {{ confirmText }}
          </button>
          <span class="absolute bottom-1 left-[17rem] text-xs flex justify-center items-center text-red-500 mx-auto">{{
            clickOutsideText
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["closeWindow", "confirmAction"]);

const closeModal = () => {
  emit("closeWindow");
};

const emitConfirmAction = () => {
  emit("confirmAction");
};

defineProps({
  icon: String,
  altText: String,
  mainTitle: String,
  messageText: String,
  confirmText: String,
  confirmBtn: Boolean,
  clickOutsideText: String,
  bgColor: String,
});
</script>
