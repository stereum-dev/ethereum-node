<template>
  <custom-modal
    main-title="CREATE A NEW SETUP"
    confirm-text="CONFIRM"
    click-outside-text="Click outside to cancel"
    :disabled-button="buttonDisabled"
    @close-window="closeWindow"
    @confirm-action="validationForm"
  >
    <template #content>
      <div class="w-3/4 max-h-[300px] grid grid-cols-6 grid-rows-8 py-4 px-8 mt-2 gap-y-1 mx-auto">
        <div class="h-full col-start-1 col-span-full row-start-1 row-span-1 flex justify-start items-center">
          <img class="w-6 h-6" :src="props.network.icon" :alt="props.network.name" />
          <span class="ml-1 text-xs text-center text-gray-100 font-sans font-semibold uppercase">{{ props.network.name }}</span>
        </div>

        <div class="w-full max-h-full col-start-1 col-span-full row-start-2 row-end-9 flex justify-center items-center">
          <form class="w-full h-full shadow-md rounded p-1 grid grid-cols-5 grid-rows-3 items-center gap-y-1">
            <div class="col-start-1 col-span-full row-start-1 row-span-1 grid grid-cols-2 grid-rows-2 items-center">
              <span v-if="nameMsg" class="col-start-1 col-span-full row-start-1 row-span-1 text-red-400 text-xs">{{ nameMsg }}</span>
              <span v-else class="col-start-1 col-span-full row-start-1 row-span-1 text-gray-200 text-xs">Setup Name</span>
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
            <div class="col-start-1 col-span-full row-start-2 row-span-1 grid grid-cols-2 grid-rows-2 items-center">
              <span v-if="layoutMsg" class="col-start-1 col-span-full row-start-1 row-span-1 text-red-400 text-xs">{{ layoutMsg }}</span>
              <span v-else class="col-start-1 col-span-full row-start-1 row-span-1 text-gray-200 text-xs">Setup Layout</span>
              <input
                id="text"
                v-model="setupLayouts"
                class="col-start-1 col-span-full row-start-2 row-span-1 shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Setup Layout"
              />
            </div>
            <div class="col-start-1 col-span-full row-start-3 row-span-1 grid grid-cols-10 grid-rows-2 items-center">
              <span v-if="colorMsg" class="col-start-1 col-span-full row-start-1 row-span-1 text-red-400 text-xs">{{ colorMsg }}</span>
              <span v-else class="col-start-1 col-span-full row-start-1 row-span-1 text-gray-200 text-xs">Setup color</span>
              <div
                v-for="col in colorPalette"
                :key="col.name"
                class="w-6 h-6 rounded-full col-span-1 row-start-2 cursor-pointer mx-1 hover:scale-110 transition-all duration-100 hover:shadow-lg hover:shadow-black hover:border hover:border-gray-500 active:scale-120"
                :class="[`${col.bg}`, col.isSelected ? 'border border-gray-300 scale-125 shadow-black  shadow-lg' : '']"
                @click="getSetupColor(col)"
              >
                <input type="radio" name="ColorOption" :value="col.name" class="sr-only" checked />
              </div>
            </div>
          </form>
        </div>
      </div>
    </template>
  </custom-modal>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import CustomModal from "../CustomModal.vue";
import { useSetups } from "@/store/setups";
import ControlService from "@/store/ControlService";
import { useMultiSetups } from "@/composables/multiSetups";

const props = defineProps({
  network: {
    type: Object,
    required: true,
  },
});

const setupStore = useSetups();
const setupName = ref("");
const setupNameInput = ref(null);
const setupColor = ref("");
const buttonDisabled = ref(true);
const layoutMsg = ref("");
const nameMsg = ref("");
const colorMsg = ref("");

const { updateDom } = useMultiSetups();

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

const setupLayouts = computed(() => {
  let layout;

  if (
    props.network?.network === "mainnet" ||
    props.network?.network === "holesky" ||
    props.network?.network === "sepolia" ||
    props.network?.network === "gnosis"
  ) {
    layout = "ETH";
  } else if (props.network?.network === "optimism") {
    layout = "OPT";
  }

  return layout;
});

watch(
  () => [setupName.value, setupColor.value, setupLayouts.value],
  () => {
    if (setupName.value.trim() !== "" && setupColor.value !== "" && setupLayouts.value !== "") {
      buttonDisabled.value = false;
      nameMsg.value = "";
      colorMsg.value = "";
      layoutMsg.value = "";
    } else {
      buttonDisabled.value = true;
      if (setupName.value.trim() === "" || setupName.value.trim() === "commonServices") {
        nameMsg.value = "Please enter a name for your setup";
      }
      if (setupColor.value === "") {
        colorMsg.value = "Please select a color for your setup";
      }
      if (setupLayouts.value === "") {
        layoutMsg.value = "Please select a layout for your setup";
      }
    }
  }
);

//Lifecycle Hooks

onMounted(() => {
  setupNameInput.value.focus();
});

//Methods

const validationForm = async () => {
  if (!buttonDisabled.value) {
    await confirm();
  }
};

const getSetupColor = (color) => {
  colorPalette.value.forEach((col) => {
    col.isSelected = false;
  });
  color.isSelected = true;
  setupColor.value = color.name;
};

const confirm = async () => {
  const data = {
    name: setupName.value.trim(),
    network: props.network.network,
    color: setupColor.value,
    type: setupLayouts.value.trim(),
    services: [],
  };

  await ControlService.createSetup(data);

  setupStore.isCreateSetupModalActive = false;
  await updateDom();
};

const closeWindow = () => {
  setupName.value = "";
  setupColor.value = "";
  setupStore.isCreateSetupModalActive = false;
};
</script>
