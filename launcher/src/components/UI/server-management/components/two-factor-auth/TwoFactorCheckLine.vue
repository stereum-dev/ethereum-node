<template>
  <div
    :class="[
      'check-line-parent bg-[#393939] w-full h-full rounded-md col-start-1 col-span-full pl-2 flex justify-start items-center',
      { 'row-span-2': multiLine, 'row-span-1': !multiLine },
    ]"
  >
    <span class="text-xs text-gray-100 w-5/6 flex justify-start items-center h-full leading-5">{{ props.checkText }} </span>
    <div class="checkBox-container w-1/6 h-full flex justify-center items-center">
      <div class="checkBox w-4 h-4 bg-white rounded-sm flex justify-center items-center" :style="checkboxStyle" @click="toggleCheckbox">
        <span v-if="isChecked" class="text-[greenyellow]">✓</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const isChecked = ref(false);

// Defining props
const props = defineProps({
  checkText: String,
  defaultChecked: {
    type: Boolean,
    default: false,
  },
  multiLine: {
    type: Boolean,
    default: false,
  },
});

onMounted(() => {
  isChecked.value = props.defaultChecked;
});

// Computed property to style the checkbox
const checkboxStyle = computed(() => {
  return {
    backgroundColor: isChecked.value ? "rgba(0, 128, 0, 0.4)" : "rgba(255, 0, 0, 0.4)",
    border: "1px solid",
    borderColor: isChecked.value ? "greenyellow" : "red",
    cursor: "pointer",
  };
});

// Function to emit the event
const emit = defineEmits(["update"]);

const toggleCheckbox = () => {
  isChecked.value = !isChecked.value;
  emit("update", isChecked.value);
};
</script>
