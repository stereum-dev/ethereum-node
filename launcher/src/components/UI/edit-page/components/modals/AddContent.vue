import { onMounted } from 'vue';
<template>
  <div>INSTALL ITEM</div>
</template>
<script setup>
const { list } = defineProps({
  list: {
    type: Array,
    default: null,
  },
  client: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["selectService"]);

const selectService = (option) => {
  option = {
    ...option,
    isSelected: true,
  };
  emit("selectService", option);
};
</script>
