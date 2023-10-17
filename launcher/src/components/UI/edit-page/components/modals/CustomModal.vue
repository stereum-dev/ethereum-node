import { useNodeManage } from '@/store/nodeManage'; import { computed } from 'vue';
<template>
  <div
    class="min-w-screen h-screen animated fadeIn faster fixed left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover"
  >
    <div class="absolute bg-black opacity-80 inset-0 z-0" @click="closeModal"></div>
    <div
      class="w-2/3 min-h-[450px] py-1 px-2 relative mx-auto my-auto rounded-[55px] shadow-lg bg-[#1c1d1d] border-4 border-gray-400"
    >
      <div class="h-full flex flex-col justify-between gap-4">
        <div class="text-center pt-4 flex-auto justify-center space-y-2">
          <div class="flex justify-center items-center px-4 mx-auto">
            <img v-if="client" class="w-[55px] h-[55px] mr-2" :src="getClientIcon" alt="Service Icon" />
            <div class="flex flex-col justify-center items-start">
              <span v-if="mainTitle" class="text-[26px] font-bold text-teal-600 uppercase">{{ mainTitle }}</span>
              <span v-if="subTitle" class="text-[22px] font-bold text-amber-600 uppercase">{{ subTitle }}</span>
            </div>
          </div>

          <div v-if="messageText" class="text-md font-bold text-gray-400 mt-8">
            <span>{{ messageText }}</span>
          </div>
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
import { computed } from "vue";
//Props
const props = defineProps({
  client: {
    type: Object,
    default: () => {},
  },
  mainTitle: String,
  messageText: String,
  confirmText: String,
  confirmBtn: Boolean,
  disabledButton: Boolean,
  subTitle: String,
  clickOutsideText: String,
});

//Emits
const emit = defineEmits(["closeWindow", "confirmAction"]);

//Refs

//Watchers

const getClientIcon = computed(() => {
  return props.client.sIcon ? props.client.sIcon : props.client.icon;
});

//Methods
const closeModal = () => {
  emit("closeWindow");
};

const emitConfirmAction = () => {
  emit("confirmAction", props.client);
};
</script>
