<template>
  <button
    class="shrink-0 rounded-full bg-[#0D0D12] border border-[#4b8585]/70 flex items-center justify-center transition-all"
    :class="[
      small ? 'w-6 h-6' : 'w-8 h-8',
      disabled ? 'opacity-30 cursor-not-allowed' : 'hover:border-teal-300 hover:scale-105 active:scale-95',
    ]"
    :aria-disabled="disabled"
    @mouseenter="footerStore.cursorLocation = label"
    @mouseleave="footerStore.cursorLocation = ''"
    @click.stop="!disabled && $emit('click')"
  >
    <img :src="icon" class="rounded-xs" :class="small ? 'w-3.5 h-3.5' : 'w-5 h-5'" :alt="label" />
  </button>
</template>

<script setup>
import { onBeforeUnmount } from "vue";
import { useFooter } from "@/store/theFooter";

// Round icon action; its name shows in the footer on hover like everywhere else in the launcher
defineProps({
  icon: { type: String, required: true },
  label: { type: String, required: true },
  small: { type: Boolean, default: false },
  // still hoverable, so the footer can say why it is disabled
  disabled: { type: Boolean, default: false },
});
defineEmits(["click"]);

const footerStore = useFooter();
onBeforeUnmount(() => (footerStore.cursorLocation = ""));
</script>
