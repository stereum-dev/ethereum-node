<template>
  <div class="absolute inset-x-0 w-full h-full flex justify-center items-center z-10" @mousedown.prevent>
    <div class="w-2/3 h-2/3 grid grid-cols-2 grid-rows-2 bg-gray-800 p-1 rounded-md gap-1">
      <img
        v-if="item.category !== 'execution'"
        class="w-7 bg-gray-900 hover:bg-gray-500 p-1 cursor-pointer active:scale-90 transition duration-200 border border-gray-700 rounded-md"
        src="/img/icon/manage-node-icons/connection.png"
        alt="Trash Icon"
        @click="modifyService"
      />
      <img
        class="w-7 border border-gray-700 bg-gray-900 rounded-md hover:bg-gray-500 p-1 cursor-pointer active:scale-90 transition duration-200"
        src="/img/icon/manage-node-icons/switch-client.png"
        alt="Trash Icon"
        @click="switchClient"
      />
      <img
        class="w-7 border border-gray-700 bg-gray-900 rounded-md hover:bg-gray-500 p-1 cursor-pointer active:scale-90 transition duration-200"
        src="/img/icon/manage-node-icons/trash.png"
        alt="Trash Icon"
        @click="deleteService"
      />
      <img
        class="w-7 border border-gray-700 bg-gray-900 rounded-md hover:bg-gray-500 p-1 cursor-pointer active:scale-90 transition duration-200"
        src="/img/icon/manage-node-icons/info.png"
        alt="Trash Icon"
        @click="infoModal"
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

const emit = defineEmits(["deleteService", "switchClient", "modifyService", "infoModal"]);

const deleteService = () => {
  emit("deleteService", props.item);
};

const switchClient = () => {
  emit("switchClient", props.item);
};

const modifyService = () => {
  emit("modifyService", props.item);
};

const infoModal = () => {
  emit("infoModal", props.item);
};
</script>
