<template>
  <div ref="root" class="relative">
    <button
      type="button"
      class="w-full h-8 rounded-full bg-[#0D0D12] border px-4 flex items-center gap-2 text-xs"
      :class="open ? 'border-teal-400' : 'border-[#4b8585] hover:border-teal-400'"
      @click="open = !open"
    >
      <span class="w-2 h-2 rounded-full shrink-0 bg-green-500" />
      <span class="font-semibold truncate">{{ selected?.name }}</span>
      <span class="grow truncate text-right text-2xs text-gray-400">{{ selected?.host }}</span>
      <svg class="w-3 h-3 shrink-0 text-[#7fb3b3] transition-transform" :class="open ? 'rotate-180' : ''" viewBox="0 0 12 12" fill="none">
        <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <!-- opens upwards: it sits at the bottom of the dialog's scrolling body, which would cut it off below -->
    <div
      v-if="open"
      data-escape-layer
      class="absolute bottom-9 left-0 right-0 z-20 max-h-[220px] overflow-y-auto rounded-lg bg-linear-to-br from-[#1A1A20] to-[#0D0D12] border border-[#4b8585] shadow p-1 flex flex-col gap-0.5"
    >
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        class="flex items-center gap-2 h-8 shrink-0 rounded-full border px-3 text-xs"
        :class="option.value === modelValue ? 'bg-[#224141] border-[#4b8585]' : 'border-transparent hover:bg-[#1f2a2a]'"
        @click="choose(option.value)"
      >
        <span class="w-2 h-2 rounded-full shrink-0" :class="option.value === modelValue ? 'bg-green-500' : 'bg-[#4b8585]'" />
        <span class="font-semibold truncate">{{ option.name }}</span>
        <span class="grow truncate text-right text-2xs text-gray-400">{{ option.host }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps({
  modelValue: { type: String, default: "" },
  // [{ value, name, host }]
  options: { type: Array, required: true },
});
const emit = defineEmits(["update:modelValue"]);

const open = ref(false);
const root = ref(null);
const selected = computed(() => props.options.find((o) => o.value === props.modelValue) ?? props.options[0]);

const choose = (value) => {
  open.value = false;
  if (value !== props.modelValue) emit("update:modelValue", value);
};

const onMousedown = (event) => open.value && root.value && !root.value.contains(event.target) && (open.value = false);
// the dialog leaves Escape to an open [data-escape-layer], so it closes the dropdown only
const onKeydown = (event) => {
  if (!open.value || event.key !== "Escape") return;
  event.stopImmediatePropagation();
  open.value = false;
};
onMounted(() => {
  document.addEventListener("mousedown", onMousedown);
  window.addEventListener("keydown", onKeydown, true);
});
onBeforeUnmount(() => {
  document.removeEventListener("mousedown", onMousedown);
  window.removeEventListener("keydown", onKeydown, true);
});
</script>
