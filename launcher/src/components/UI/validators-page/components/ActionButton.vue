<template>
  <button
    class="h-7 flex items-center gap-1.5 px-3 rounded-full text-2xs font-semibold uppercase whitespace-nowrap border transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    :class="primary ? 'bg-[#336666] border-[#4b8585] hover:bg-[#4b8585]' : 'bg-[#1d2023] border-gray-600 hover:bg-[#25292c]'"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <img v-if="icon" :src="icon" class="w-4 h-4 rounded-xs" :class="iconClass" alt="" />
    {{ label }}
  </button>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  icon: { type: String, default: null },
  iconClass: { type: String, default: "" },
  primary: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
});
defineEmits(["click"]);
</script>
