import { useNodeManage } from '@/store/nodeManage'; import { computed } from 'vue';
<template>
  <div
    class="min-w-screen h-screen animated fadeIn faster fixed left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover"
  >
    <div class="absolute bg-black opacity-80 inset-0 z-0 rounded-md" @click="closeModal"></div>
    <div
      class="w-2/3 p-2 relative mx-auto rounded-[55px] shadow-lg bg-[#1c1d1d] border-4 border-gray-600 grid grid-cols-12 grid-rows-7"
      :style="getHeight"
    >
      <div class="w-full h-full col-start-1 col-span-full row-start-1 row-span-full grid grid-cols-12 grid-rows-7">
        <div v-if="mainTitle" class="col-start-1 col-span-full row-start-1 row-span-1 flex justify-center items-center">
          <span class="text-[26px] font-bold uppercase" :class="getTitleColor">{{ mainTitle }}</span>
        </div>

        <div v-if="subTitle || messageText" class="col-start-1 col-span-full row-start-2 row-span-2 flex justify-center items-center">
          <span v-if="subTitle" class="text-[22px] font-bold text-amber-600 uppercase">{{ subTitle }}</span>
          <span v-if="messageText" class="text-md font-bold text-gray-400">{{ messageText }}</span>
        </div>

        <slot name="content"></slot>
        <div class="col-start-1 col-span-full row-start-7 row-span-1 grid grid-cols-12 items-center px-2">
          <button
            v-if="props.confirmText === 'Withdraw & Exit'"
            class="col-start-1 col-end-5 ml-4 min-w-[100px] max-h-10 bg-blue-500 px-5 py-2 shadow-xl shadow-[#141516] tracking-wider rounded-full uppercase active:scale-90 transition-all duration-150 flex justify-evenly items-center space-x-2"
            @click="exportAction"
          >
            <img class="h-4" src="/img/icon/staking-page-icons/export.png" alt="Export Icon" />
            <span class="text-sm text-gray-200 font-semibold">{{ $t("stakingPage.expMsg") }}</span>
          </button>
          <button
            v-if="!props.isProcessing && props.confirmText"
            class="col-start-9 col-span-full mr-4 min-w-[100px] max-h-10 px-5 py-2 text-sm shadow-xl shadow-[#141516] font-semibold tracking-wider text-white rounded-full uppercase active:scale-90 transition-all duration-150"
            :class="!activeButton ? 'opacity-40 pointer-events-none bg-gray-500' : getButtonColor"
            @click="emitConfirmAction"
          >
            {{ confirmText }}
          </button>

          <button
            v-if="props.isProcessing"
            type="button"
            class="col-start-9 col-span-full mr-4 min-w-[120px] px-5 py-2 text-sm shadow-xl shadow-[#141516] font-semibold tracking-wider text-white rounded-full transition-all duration-150 flex justify-center items-center pointer-events-none uppercase"
            :class="!activeButton ? 'opacity-40 pointer-events-none bg-gray-500' : getButtonColor"
            disabled
          >
            <span class="animate-spinGrow h-5 w-5 mr-2 rounded-full border-2"></span>
            {{ $t("stakingPage.process") }}
          </button>
        </div>
        <span class="absolute bottom-1 left-[40%] text-xs flex justify-center items-center text-red-500 mx-auto">{{
          props.clickOutsideText
        }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStakingStore } from "@/store/theStaking";
import { computed } from "vue";

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
  titleColor: {
    type: String,
    default: "text-teal-500",
  },
  messageText: {
    type: String,
    default: "",
  },
  clickOutsideText: {
    type: String,
    default: null,
  },
  externalClose: {
    type: Boolean,
    default: false,
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
  activeButton: {
    type: Boolean,
    default: false,
  },
  isProcessing: {
    type: Boolean,
    default: false,
  },
  height: {
    type: String,
    default: "",
  },
});

//Emits
const emit = defineEmits(["closeModal", "confirmAction", "exportAction"]);

//Store
const stakingStore = useStakingStore();

//Refs

//Computed

const getHeight = computed(() => {
  if (props.height && props.height !== "") {
    const heightValue = `${props.height}px`;
    return { height: heightValue };
  } else {
    return { minHeight: "450px", maxHeight: "550px" };
  }
});

const getTitleColor = computed(() => {
  if (props.titleColor === "remove") {
    return "text-red-500";
  } else if (props.titleColor === "confirm") {
    return "text-amber-400";
  } else if (props.titleColor === "withdraw") {
    return "text-blue-400";
  } else {
    return "text-teal-500";
  }
});

const getButtonColor = computed(() => {
  if (props.confirmText === "remove") {
    return "bg-red-500 border border-red-500 hover:bg-red-700 ";
  } else if (props.confirmText === "confirm" || props.confirmText === "import" || props.confirmText === "ok") {
    return "bg-green-700 ";
  } else if (props.confirmText === "Withdraw & Exit") {
    return "bg-blue-500 ";
  } else {
    return "bg-teal-800 ";
  }
});

//Watchers

//Methods
const closeModal = () => {
  if (!props.externalClose) {
    stakingStore.setActiveModal(null);
    stakingStore.setActiveModal(null);
    stakingStore.setActivePanel(null);
    stakingStore.keys.forEach((key) => {
      key.showExitText = false;
    });
    stakingStore.isPreviewListActive = false;
    stakingStore.previewKeys = [];
  } else {
    emit("closeModal", props.clickOutsideText);
  }
};

const emitConfirmAction = () => {
  if (props.confirmText) {
    emit("confirmAction");
  }
};

const exportAction = () => {
  emit("exportAction");
};
</script>
<style scoped>
.animate-spinGrow {
  animation: spinGrow 5s infinite;
  border-color: white #e6e6e649 #e6e6e649 #e6e6e649;
}

@keyframes spinGrow {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
