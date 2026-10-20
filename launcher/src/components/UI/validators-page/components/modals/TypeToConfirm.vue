<template>
  <label class="flex flex-col gap-1 text-xs">
    <span>
      {{ parts[0]
      }}<code class="mx-0.5 px-1.5 py-0.5 rounded bg-[#0D0D12] border border-red-500 text-red-300 font-semibold">{{ token }}</code
      >{{ parts[1] }}
    </span>
    <input
      v-model.trim="typed"
      :placeholder="token"
      class="h-9 w-40 rounded-full bg-[#0D0D12] border border-[#4b8585] px-4 text-sm outline-hidden focus:border-red-400 placeholder:text-gray-600"
      @keydown.enter="$emit('enter')"
    />
  </label>
</template>

<script setup>
import { computed } from "vue";
import i18n from "@/includes/i18n";

// a label like "Type {token} to confirm" with the token marked, so it is clear what to type
const props = defineProps({
  keypath: { type: String, required: true },
  param: { type: String, required: true },
  token: { type: String, required: true },
});
defineEmits(["enter"]);
const typed = defineModel({ type: String, default: "" });

const MARK = "\u0000";
const parts = computed(() => {
  const [before, after = ""] = i18n.global.t(props.keypath, { [props.param]: MARK }).split(MARK);
  return [before, after];
});
</script>
