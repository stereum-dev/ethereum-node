import { computed, ref } from 'vue'; import { useFooter } from '@/store/theFooter';
<template>
  <div
    class="w-20 h-20 flex justify-center items-center cursor-pointer"
    @click="buttonHandler"
    @mouseenter="runTooltip"
    @mouseleave="mouseLeave"
  >
    <img :src="getStatus" class="w-16 h-16" alt="Logo Icon" @mousedown.prevent />

    <div
      v-if="isHovered"
      role="tooltip"
      class="absolute top-10 right-10 max-w-xs break-words rounded bg-[#1d1f20] px-3 py-2 text-center text-xs font-medium text-white outline-none"
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

const emit = defineEmits(["mouseLeave", "buttonHandler"]);

const getStatus = computed(() => {
  if (footerStore.stereumStatus) {
    return "/img/icon/header-icons/LOGO.png";
  } else {
    return "/img/icon/header-icons/statusOff.png";
  }
});

const buttonHandler = () => {
  emit("buttonHandler");
};

const runTooltip = () => {
  isHovered.value = true;
  footerStore.cursorLocation = props.serverAcc;

  setTimeout(() => {
    isHovered.value = false;
  }, 1000);
};

const mouseLeave = () => {
  emit("mouseLeave");
};
</script>
