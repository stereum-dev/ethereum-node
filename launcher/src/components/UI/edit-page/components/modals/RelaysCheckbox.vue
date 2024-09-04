import { watch, watchEffect } from 'vue';
<template>
  <label
    :for="fieldId"
    class="w-5/6 h-8 py-1 px-2 border rounded-md shadow-md grid grid-cols-12 items-center mx-auto mt-1 cursor-pointer"
    :class="
      relay.isSelected
        ? 'bg-blue-400 border-blue-300 hover:bg-blue-500 hover:border-blue-400 text-gray-800'
        : 'bg-[#1f2123] hover:bg-[#282a2d] border-gray-700 hover:border-gray-600'
    "
  >
    <input :id="fieldId" v-model="relay.isSelected" type="checkbox" :value="relay" class="hidden" @change="getRelays" />
    <div v-if="icon" class="col-start-1 col-span-1 w-[15px] h-[15px] flex justify-center items-center mr-1 bg-black rounded-full">
      <img class="self-center rounded-full" :src="icon" alt="Relay Icon" />
    </div>
    <span class="col-start-3 col-end-12 text-sm" :class="relay.isSelected ? 'text-gray-800' : 'text-gray-300'">{{ label }}</span>
    <div v-if="relay.freeCensorship == false" class="col-start-12 col-span-1" data-tooltip="OFAC Compliant - censored">
      <img class="w-5" src="/img/icon/one-click-icons/mevboost-icons/ofac-compliant-icon.png" alt="flag-icon" />
    </div>
  </label>
</template>

<script setup>
const props = defineProps({
  fieldId: {
    type: Number,
    required: true,
  },
  checked: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: "",
  },
  relay: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["getRelays"]);

const getRelays = () => {
  emit("getRelays", props.relay);
};
</script>
