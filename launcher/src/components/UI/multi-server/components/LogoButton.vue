import { computed, ref } from 'vue'; import { useFooter } from '@/store/theFooter';
<template>
  <div
    class="w-fit h-fit flex justify-center items-center cursor-pointer"
    @click="accessHandler"
    @mouseenter="runTooltip"
    @mouseleave="mouseLeave"
  >
    <img
      :src="getStatus"
      class="w-16 h-16 hover:scale-105 active:scale-95 transition-all duration-300"
      alt="Logo Icon"
      @mousedown.prevent
    />

    <div
      v-if="isHovered"
      role="tooltip"
      class="absolute top-20 left-12 w-56 h-9 rounded bg-[#1d1f20] px-3 py-2 text-center text-sm font-semibold text-white outline-none flex justify-center items-center"
    >
      <span>Server Access Management</span>
    </div>
  </div>
</template>

<script setup>
import { useFooter } from "@/store/theFooter";
import { computed, ref } from "vue";

const props = defineProps({
  serverAcc: {
    type: String,
    default: "",
  },
});

const footerStore = useFooter();
const isHovered = ref(false);

const emit = defineEmits(["mouseLeave", "accessHandler"]);

const getStatus = computed(() => {
  if (footerStore.stereumStatus) {
    return "/img/icon/header-icons/LOGO.png";
  } else {
    return "/img/icon/header-icons/statusOff.png";
  }
});

const accessHandler = () => {
  emit("accessHandler");
};

const runTooltip = () => {
  isHovered.value = true;
  footerStore.cursorLocation = props.serverAcc;

  setTimeout(() => {
    isHovered.value = false;
  }, 1500);
};

const mouseLeave = () => {
  emit("mouseLeave");
};
</script>
