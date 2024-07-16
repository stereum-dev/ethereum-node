<template>
  <div class="check-parent">
    <div class="check-parent_title">
      {{ props.title }}
    </div>
    <div class="check-parent_part">
      <div class="customizedCheckBox" :style="checkboxStyle" @click="toggleCheckbox">
        <span v-if="isChecked">✓</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useNodeHeader } from "@/store/nodeHeader";
import { ref, onMounted, computed, watch } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  isCheckedProps: {
    type: Boolean,
    default: false,
  },
  reset: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update"]);

const isChecked = ref(false);
const nameChecker = ref("");

const headerStore = useNodeHeader();

const checkboxStyle = computed(() => {
  return {
    backgroundColor: isChecked.value ? "rgba(0, 128, 0, 0.4)" : "rgba(255, 0, 0, 0.4)",
    border: "1px solid",
    borderColor: isChecked.value ? "greenyellow" : "red",
    cursor: "pointer",
  };
});

watch(
  () => props.reset,
  (newValue) => {
    evaluateConditions(newValue);
  }
);

watch(
  () => headerStore.resetConfig,
  (newValue) => {
    if (newValue == true) {
      evaluateConditions(props.reset);
    }
  }
);

onMounted(() => {
  nameChecker.value = props.reset;
  evaluateConditions(nameChecker.value);
});

const toggleCheckbox = () => {
  isChecked.value = !isChecked.value;
  emit("update", isChecked.value);
};

const evaluateConditions = (val) => {
  isChecked.value = false;

  if (val === "authTimeBase" || val === "enableRateLimit") {
    isChecked.value = true;
  } else if (val === "confirmSuccessAuth" || val === "orginalGenerationTimeLimit") {
    isChecked.value = false;
  }
};
</script>

<style scoped>
.check-parent {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
}
.check-parent_title {
  color: #dbdbdb;
  font-size: 0.65rem;
  font-weight: 400;
  margin-left: 10px;
  text-transform: uppercase;
  width: 90%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.check-parent_part {
  width: 10%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.customizedCheckBox {
  width: 50%;
  height: 70%;

  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
}
.customizedCheckBox span {
  font-size: 2rem;
  color: greenyellow;
}
</style>
