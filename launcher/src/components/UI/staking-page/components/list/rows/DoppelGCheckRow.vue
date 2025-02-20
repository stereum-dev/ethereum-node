import { computed, ref, onMounted, watchEffect } from 'vue';
<template>
  <div
    class="w-full h-8 rounded-full grid grid-cols-24 items-center p-1 cursor-pointer animate__animated animate animate__slideInLeft"
    :class="isRemoveBtnActive ? 'bg-red-500' : 'bg-gray-400'"
  >
    <div
      class="w-6 h-6 rounded-full cursor-pointer bg-white col-start-1 col-span-1 self-center overflow-hidden flex justify-center items-center"
    >
      <span
        class="w-4 h-4 rounded-full animate-spin border border-blue-500 border-b-transparent border-r-transparent"
      ></span>
    </div>
    <div
      class="col-start-2 col-end-16 w-full rounded-full self-center overflow-hidden flex justify-start items-center"
      @mouseenter="footerStore.cursorLocation = `${props.item.pubkey} `"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <span v-if="isRemoveBtnActive" class="text-sm font-normal text-gray-200 text-left"
        >No repsone. Please check manually in the logs.
      </span>
      <span v-else class="text-sm font-semibold text-gray-800 text-left"
        >{{ formattedPubKey }}
      </span>
    </div>

    <div
      class="w-full h-full col-start-18 col-span-full flex justify-center items-center"
    >
      <span
        v-if="isRemoveBtnActive"
        class="w-full bg-[#1d1e1f] rounded-full px-4 py-[3px] text-xs font-semibold text-gray-200 text-center hover:bg-red-700 cursor-pointer active:scale-95"
        @click="removeDoppelGanger"
      >
        {{ displayText }}
      </span>
      <span
        v-else
        class="w-full bg-[#1d1e1f] rounded-full px-4 py-[3px] text-xs font-semibold text-red-400 text-center"
      >
        {{ displayText }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watchEffect } from "vue";
import { useFooter } from "@/store/theFooter";
import { useTruncate } from "@/composables/utils";

const footerStore = useFooter();

const displayText = ref("Doppelganger Protection");
const isProtectionActive = ref(false);
const isRemoveBtnActive = ref(false);

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["removeDplg"]);

const formattedPubKey = computed(() => {
  return useTruncate(props.item.pubkey, 20, 20);
});

const warningText = () => {
  setTimeout(() => {
    displayText.value = "Waiting for response";
  }, 900000);
  setTimeout(() => {
    displayText.value = "No response";
  }, 1800000);

  setTimeout(() => {
    displayText.value = "Click To Remove";
    isRemoveBtnActive.value = true;
    removeDoppelGanger();
  }, 86400000);
};

watchEffect(() => {
  if (isProtectionActive.value) {
    warningText();
  }
});

const removeDoppelGanger = () => {
  emit("removeDplg", props.item.pubkey);
};

onMounted(() => {
  isProtectionActive.value = true;
  isRemoveBtnActive.value = false;
});
</script>

<style scoped>
.flash {
  animation: flash 2s infinite 0.2s;
}
@keyframes flash {
  0% {
    opacity: 0.2;
  }

  50% {
    opacity: 0.5;
  }

  100% {
    opacity: 0.2;
  }
}
</style>
