<template>
  <span
    role="checkbox"
    :aria-checked="partial ? 'mixed' : checked"
    class="w-4 h-4 rounded-full border flex items-center justify-center cursor-pointer text-[9px] font-bold transition-colors"
    :class="checked || partial ? 'bg-[#336666] border-teal-300 text-white' : 'bg-[#0D0D12] border-[#4b8585] hover:border-teal-300'"
    @click.stop="$emit('toggle')"
  >
    {{ checked ? "✓" : partial ? "–" : "" }}
  </span>
</template>

<script setup>
// Round check box used to pick keys for bulk actions; clicking it never opens the key
defineProps({
  checked: { type: Boolean, default: false },
  partial: { type: Boolean, default: false },
});
defineEmits(["toggle"]);
</script>
