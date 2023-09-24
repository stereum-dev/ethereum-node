<template>
  <div class="absolute inset-x-0 w-full h-full flex justify-center items-center z-10" @mousedown.prevent>
    <div class="flex justify-center items-center bg-gray-800 p-2 rounded-md space-x-2">
      <img
        class="w-6 rounded-sm hover:bg-gray-500 p-1 cursor-pointer active:scale-90 transition duration-200"
        src="/img/icon/manage-node-icons/connection.png"
        alt="Trash Icon"
        @click="connectClient"
      />
      <img
        class="w-7 rounded-sm hover:bg-gray-500 p-1 cursor-pointer active:scale-90 transition duration-200"
        src="/img/icon/manage-node-icons/replace.png"
        alt="Trash Icon"
        @click="switchClient"
      />
      <img
        class="w-6 rounded-sm hover:bg-gray-500 p-1 cursor-pointer active:scale-90 transition duration-200"
        src="/img/icon/manage-node-icons/trash.png"
        alt="Trash Icon"
        @click="deleteService"
      />
    </div>
  </div>
</template>

<script setup>
const { item } = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["deleteService", "switchClient", "connectClient"]);

const deleteService = () => {
  emit("deleteService", item);
};

const switchClient = () => {
  emit("switchClient", item);
};

const connectClient = () => {
  emit("connectClient", item);
};
</script>
