<template>
  <div class="w-full h-8 grid grid-cols-12 items-center border border-gray-500 rounded-sm p-1 bg-[#2f373c]">
    <span class="col-start-1 col-end-12 text-xs text-gray-300">{{ sshKey }}</span>
    <img
      class="col-start-12 col-span-1 justify-self-center self-center h-6 border border-transparent rounded-md p-1 bg-black hover:border-red-500 active:scale-90 cursor-pointer"
      src="/img/icon/edit-node-icons/service-delete.png"
      alt="Delete Icon"
      @click="deleteKey"
    />
  </div>
</template>

<script setup>
import { useTruncate } from "@/composables/utils";
import { computed } from "vue";
const props = defineProps({
  item: {
    type: String,
    required: true,
  },
});

const sshKey = computed(() => useTruncate(props.item, 0, 40));

const emit = defineEmits(["deleteKey"]);

const deleteKey = () => {
  emit("deleteKey", props.item);
};
</script>
