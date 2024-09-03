<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useSetups } from "../../../../../../../store/setups";

const setupStore = useSetups();
const setupName = ref("");
const setupNameInput = ref(null);
const setupColor = ref("");
const nameMsg = ref("");
const colorMsg = ref("");

const colorPalette = ref([
  { name: "default", bg: "bg-[#336666]", isSelected: false },
  { name: "blue", bg: "bg-blue-500", isSelected: false },
  { name: "red", bg: "bg-red-500", isSelected: false },
  { name: "yellow", bg: "bg-[#F7C566]", isSelected: false },
  { name: "orange", bg: "bg-[#fb923c]", isSelected: false },
  { name: "green", bg: "bg-green-500", isSelected: false },
  { name: "beige", bg: "bg-[#D1BB9E]", isSelected: false },
  { name: "purple", bg: "bg-violet-500", isSelected: false },
  { name: "brown", bg: "bg-[#503C3C]", isSelected: false },
  { name: "gray", bg: "bg-gray-500", isSelected: false },
]);

const isFormValid = computed(() => {
  return (
    setupName.value.trim() !== "" &&
    setupName.value.trim() !== "commonServices" &&
    setupColor.value !== ""
  );
});

watch(
  () => isFormValid.value,
  (newValue) => {
    setupStore.devnetButtonDisabled = !newValue;
  }
);

watch(setupName, (newValue) => {
  if (newValue.trim() === "" || newValue.trim() === "commonServices") {
    nameMsg.value = "Please enter a valid name for your setup";
  } else {
    nameMsg.value = "";
  }
});

watch(setupColor, (newValue) => {
  if (newValue === "") {
    colorMsg.value = "Please select a color for your setup";
  } else {
    colorMsg.value = "";
  }
});

onMounted(() => {
  setupNameInput.value.focus();
});

const getSetupColor = (color) => {
  colorPalette.value.forEach((col) => {
    col.isSelected = false;
  });
  color.isSelected = true;
  setupColor.value = color.name;
};
</script>

<template>
  <div
    class="w-3/4 max-h-[300px] grid grid-cols-6 grid-rows-8 py-4 px-8 mt-2 gap-y-1 mx-auto"
  >
    <div
      class="w-full max-h-full col-start-1 col-span-full row-start-2 row-end-9 flex justify-center items-center"
    >
      <form
        class="w-full h-full rounded p-1 grid grid-cols-5 grid-rows-3 items-center gap-y-1"
      >
        <div
          class="col-start-1 col-span-full row-start-1 row-span-1 grid grid-cols-2 grid-rows-2 items-center"
        >
          <span
            v-if="nameMsg"
            class="col-start-1 col-span-full row-start-1 row-span-1 text-red-400 text-xs"
            >{{ nameMsg }}</span
          >
          <span
            v-else
            class="col-start-1 col-span-full row-start-1 row-span-1 text-gray-300 text-sm"
            >Setup Name</span
          >
          <input
            id="setupName"
            ref="setupNameInput"
            v-model="setupName"
            class="col-start-1 col-span-full row-start-2 row-span-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Please enter a name for your setup"
            required
          />
        </div>

        <div
          class="col-start-1 col-span-full row-start-2 row-span-1 grid grid-cols-10 grid-rows-2 items-center"
        >
          <span
            v-if="colorMsg"
            class="col-start-1 col-span-full row-start-1 row-span-1 text-red-400 text-xs"
            >{{ colorMsg }}</span
          >
          <span
            v-else
            class="col-start-1 col-span-full row-start-1 row-span-1 text-gray-300 text-sm"
            >Setup color</span
          >
          <div
            v-for="col in colorPalette"
            :key="col.name"
            class="w-6 h-6 rounded-full col-span-1 row-start-2 cursor-pointer mt-2 mx-1 hover:scale-110 transition-all duration-100 hover:shadow-lg hover:shadow-black hover:border hover:border-gray-500 active:scale-120"
            :class="[
              `${col.bg}`,
              col.isSelected
                ? 'border border-gray-300 scale-125 shadow-black  shadow-lg'
                : '',
            ]"
            @click="getSetupColor(col)"
          >
            <input
              type="radio"
              name="ColorOption"
              :value="col.name"
              class="sr-only"
              checked
            />
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
