<template>
  <teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60" @mousedown.self="$emit('close')">
      <div
        class="max-w-[90vw] flex flex-col rounded-xl border border-[#4b8585] bg-linear-to-br from-[#1f2a2a] to-[#0D0D12] shadow-[0_0_24px_rgba(0,0,0,0.6)] text-gray-200"
        :class="[wide ? 'w-[640px]' : 'w-[520px]', fill ? 'h-[min(92vh,64rem)]' : 'max-h-[85vh]']"
      >
        <div class="flex items-center gap-2 px-4 py-3 border-b border-[#4b8585]/50">
          <span v-if="icon" class="w-8 h-8 rounded-full bg-[#0D0D12] border border-[#4b8585] flex items-center justify-center">
            <img :src="icon" class="w-5 h-5 rounded-xs" :class="iconClass" alt="" />
          </span>
          <span class="grow text-sm font-bold uppercase tracking-wide">{{ title }}</span>
          <button class="w-7 h-7 rounded-full text-sm text-gray-400 hover:text-white hover:bg-[#336666]" @click="$emit('close')">✕</button>
        </div>
        <div class="flex flex-col gap-3 px-4 py-4" :class="fill ? 'flex-1 min-h-0 overflow-y-auto' : 'overflow-y-auto'">
          <slot />
        </div>
        <div v-if="$slots.footer" class="flex items-center justify-end gap-2 px-4 py-3 border-t border-[#ffffff10]">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { onBeforeUnmount, onMounted } from "vue";

defineProps({
  title: { type: String, required: true },
  icon: { type: String, default: null },
  iconClass: { type: String, default: "" },
  wide: { type: Boolean, default: false },
  // a fixed height, and the content arranges its own scrolling
  fill: { type: Boolean, default: false },
});
const emit = defineEmits(["close"]);

// capture, so Escape closes the modal and not the drawer underneath
const onKeydown = (event) => {
  if (event.key !== "Escape") return;
  event.stopImmediatePropagation();
  emit("close");
};
onMounted(() => window.addEventListener("keydown", onKeydown, true));
onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown, true));
</script>
