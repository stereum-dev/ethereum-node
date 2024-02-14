import { useRouter } from 'vue-router'; import { useNodeHeader } from '@/store/nodeHeader';
<template>
  <div
    class="w-9 h-9 border border-[#4b8585] rounded-full flex justify-center items-center p-2 cursor-pointer bg-[#387272] hover:scale-105 hover:bg-[#264e4e] shadow-sm shadow-[#1c3634] transition-colors duration-200 ease-in-out active:scale-95"
    @click="handleClick"
  >
    <img v-if="props.item.activeIcon" class="w-8" :src="props.item.activeIcon" alt="icon" @mousedown.prevent />
    <img v-else class="w-8" :src="props.item.icon" alt="icon" @mousedown.prevent />
  </div>
</template>

<script setup>
import { useNodeHeader } from "@/store/nodeHeader";
import { useRouter } from "vue-router";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const headerStore = useNodeHeader();
const router = useRouter();

const handleClick = () => {
  if (props.item.name === "Settings") {
    router.push("/setting");
  } else {
    headerStore.setMenuModal(props.item.name);
  }
};
</script>
