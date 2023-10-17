<template>
  <div class="absolute inset-x-0 w-full h-full flex justify-center items-center z-20" @mousedown.prevent>
    <div class="flex justify-center items-center bg-gray-900 p-2 rounded-md space-x-2">
      <img
        v-if="!item.isServiceConnecting"
        class="w-6 rounded-md bg-gray-500 border border-gray-700 p-1 cursor-pointer active:scale-90 transition duration-200 hover:bg-gray-700"
        src="/img/icon/manage-node-icons/connection.png"
        alt="Trash Icon"
        @click="confirmConnection(item)"
      />
      <div v-else-if="item.isServiceConnecting" class="w-6 h-6 pt-1 bg-gray-500 rounded-md border border-gray-700">
        <svg class="animate-spin rounded-full border-t-2 border-r-2 border-blue-100 h-4 w-4 mx-auto"></svg>
      </div>
      <img
        class="w-6 bg-gray-500 rounded-md border border-gray-700 hover:bg-gray-700"
        src="/img/icon/the-staking/close.png"
        alt="CIcon"
        @click="hideConnection(item)"
      />
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["hideConnection", "confirmConsensus"]);

const hideConnection = () => {
  emit("hideConnection", props.item);
};

const confirmConnection = () => {
  emit("confirmConnection", props.item);
};
</script>
