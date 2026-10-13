<template>
  <button
    class="flex items-center gap-2 px-2.5 rounded-lg border bg-linear-to-br from-[#1A1A20] to-[#0D0D12] shadow-xs shadow-[#161515] transition-colors text-left min-w-0"
    :class="[
      selected ? 'border-[#4b8585] shadow-[0_0_10px_rgba(75,133,133,0.35)]' : 'border-[#ffffff16]',
      clickable ? 'cursor-pointer hover:border-[#336666]' : 'cursor-default',
    ]"
    :disabled="!clickable"
    :title="card.title"
    @click="$emit('select', card.filter)"
  >
    <span class="w-10 h-10 shrink-0 rounded-full bg-[#0D0D12] border border-[#4b8585]/60 flex items-center justify-center">
      <img :src="card.icon" class="w-7 h-7 object-contain" :class="card.iconClass" alt="" />
    </span>
    <span class="flex flex-col min-w-0">
      <span class="text-2xs font-semibold uppercase text-gray-400 truncate">{{ card.label }}</span>
      <span class="text-lg font-bold leading-tight truncate" :class="card.color">{{ card.value }}</span>
      <span v-if="card.sub" class="text-2xs text-gray-400 truncate">{{ card.sub }}</span>
    </span>
  </button>
</template>

<script setup>
defineProps({
  card: { type: Object, required: true },
  selected: { type: Boolean, default: false },
  clickable: { type: Boolean, default: false },
});
defineEmits(["select"]);
</script>
