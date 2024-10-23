<template>
  <div class="service-line w-full h-1/3 flex justify-start items-center">
    <div class="service-name w-1/4 h-full text-gray-200 uppercase text-[45%] font-semibold flex justify-start items-center">
      {{ name }}
    </div>
    <div
      class="toggle-btn w-1/6 h-5/6 border border-gray-400 uppercase text-[45%] font-semibold flex justify-center items-center rounded-xl cursor-pointer"
      :class="isActive ? 'text-green-500' : 'text-red-500'"
      @click="emit('toggle')"
      @mouseenter="setCursorLocation(`${service.name} toggle`)"
      @mouseleave="clearCursorLocation"
    >
      {{ isActive ? "open" : "close" }}
    </div>
    <div
      class="service-icon w-6 h-full flex justify-center items-center p-[0.10rem]"
      @mouseenter="setCursorLocation(`${service.name}`)"
      @mouseleave="clearCursorLocation"
    >
      <img :src="service.icon" alt="Service Icon" class="w-3/4 h-3/4" />
    </div>
    <div
      class="service-ip w-28 h-5/6 flex justify-center items-center border border-gray-400 rounded-md text-[55%] text-gray-200 font-semibold cursor-pointer"
      @click="emitCopy"
      @mouseenter="setCursorLocation(`Click to Copy ${service.name} URL`)"
      @mouseleave="clearCursorLocation"
    >
      <span v-if="isLoading">loading...</span>
      <span v-else-if="isActive && url === ''">{{ loadingAnimation }}</span>
      <span v-else-if="!isActive || url === ''">Click to Copy!</span>
      <span v-else>{{ copied ? "copied!" : url }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useFooter } from "@/store/theFooter";

const footerStore = useFooter();

const props = defineProps({
  name: String,
  service: Object,
  isActive: Boolean,
  url: String,
  isLoading: Boolean,
});

const emit = defineEmits(["toggle", "copy"]);
const copied = ref(false);
const loadingState = ref([".", "..", "..."]);
const loadingIndex = ref(0);

const interval = ref(null);

const updateLoadingIndex = () => {
  loadingIndex.value = (loadingIndex.value + 1) % loadingState.value.length;
};

onMounted(() => {
  interval.value = setInterval(updateLoadingIndex, 500);
});

onBeforeUnmount(() => {
  clearInterval(interval.value);
});

const loadingAnimation = computed(() => {
  return loadingState.value[loadingIndex.value];
});

const emitCopy = () => {
  if (props.url) {
    emit("copy", props.url);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  }
};

const setCursorLocation = (location) => {
  footerStore.cursorLocation = location;
};

const clearCursorLocation = () => {
  footerStore.cursorLocation = "";
};
</script>
