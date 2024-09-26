<template>
  <div class="layer1 fixed inset-0 flex justify-center items-center">
    <div class="layer2 fixed bg-black opacity-80 inset-0" @click="closeModal"></div>
    <div
      class="layer3 w-2/3 min-h-[400px] py-2 px-2 mx-auto my-auto rounded-[35px] shadow-lg border-4 border-gray-400"
      :class="bgColor ? bgColor : 'bg-gray-100'"
    >
      <div class="flex flex-col justify-between gap-5">
        <div class="text-center p-2 flex-auto justify-center space-y-4">
          <div v-if="icon">
            <img
              class="-m-1 flex items-center text-red-500 mx-auto"
              :src="icon"
              :alt="altText"
              :class="iconSize !== '' ? iconSize : 'w-24 '"
            />
          </div>
          <div v-if="mainTitle" class="text-xl font-bold py-2 text-gray-200 uppercase">
            <p>{{ mainTitle }}</p>
          </div>
          <div v-if="messageText" class="text-md font-bold py-2" :class="bgColor ? 'text-gray-200' : null">
            <p>{{ messageText }}</p>
          </div>
          <slot name="content"></slot>
        </div>
        <div class="flex justify-end text-md font-bold py-3 mt-2 text-center space-y-4">
          <button
            v-if="confirmText !== ''"
            class="w-[8rem] mr-2 px-5 py-2 shadow-sm rounded-full hover:shadow-lg transition-all duration-300 ease-in-out hover:scale-110 active:scale-100 text-gray-200 font-semibold uppercase"
            :class="[
              btnColor === 'red'
                ? 'bg-red-500 border border-gray-200 hover:bg-red-600'
                : 'bg-green-500 border border-green-500 hover:bg-green-600',
              isDisabled ? 'opacity-40 pointer-events-none' : '',
            ]"
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

const { icon, altText, mainTitle, messageText, confirmText, clickOutsideText, bgColor, btnColor, iconSize } = defineProps({
  icon: String,
  altText: String,
  mainTitle: String,
  messageText: String,
  confirmText: String,
  confirmBtn: Boolean,
  clickOutsideText: String,
  bgColor: String,
  btnColor: String,
  iconSize: String,
  isDisabled: Boolean,
});
</script>

<style>
.layer1 {
  z-index: 1000 !important;
}
.layer2 {
  z-index: 1001 !important;
}
.layer3 {
  z-index: 1002 !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
