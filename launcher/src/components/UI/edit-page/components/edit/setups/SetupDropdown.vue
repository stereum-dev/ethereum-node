<template>
  <div class="relative col-start-1 col-span-full grid grid-cols-6 gap-x-1">
    <!-- Dropdown toggle button -->
    <button
      class="w-full col-start-1 col-end-6 relative z-10 p-2 text-gray-800 bg-[#232528] rounded-sm grid grid-cols-12 border border-gray-600"
      @click="isOpen = !isOpen"
    >
      <span
        class="col-start-1 col-end-11 text-sm text-gray-200 overflow-hidden truncate"
        >{{
          setupStore.selectedSetup !== null
            ? setupStore.selectedSetup.name
            : "Select Setup"
        }}</span
      >
      <svg
        class="w-5 h-5 text-white col-start-12 col-end-13"
        :class="{ 'transform rotate-180': isOpen }"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
    <div
      class="w-full h-full col-start-6 col-span-1 flex justify-center items-center bg-[#333539] border border-gray-600 rounded-sm p-[2px]"
      @click="renameSetup"
      @mouseenter="footerStore.cursorLocation = 'Rename Node Setup'"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <img
        class="w-5 hover:scale-105 active:scale-95 cursor-pointer transition-all duration-150"
        src="/img/icon/edit-node-icons/rename.png"
        alt="Icon"
        @mousedown.prevent
      />
    </div>

    <!-- Dropdown menu -->
    <div
      v-if="isOpen"
      class="absolute right-8 top-9 z-20 w-40 py-2 mt-2 origin-top-right rounded-md shadow-xl bg-gray-700 transition-all duration-100"
      @click="isOpen = false"
      @mouseleave="isOpen = false"
    >
      <span
        v-for="setup in props.setupList"
        :key="setup.name"
        class="block px-4 py-3 capitalize transition-colors duration-300 transform text-gray-300 hover:bg-gray-100 hover:text-gray-700 cursor-pointer text-sm font-semibold overflow-hidden truncate"
        @click="selectSetup(setup)"
      >
        {{ setup.name }}
      </span>
    </div>
  </div>
</template>
<script setup>
import { useFooter } from "@/store/theFooter";
import { ref } from "vue";
import { useSetups } from "../../../../../../store/setups";

const props = defineProps({
  setupList: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["renameSetup", "selectSetup"]);

const setupStore = useSetups();
const footerStore = useFooter();

const isOpen = ref(false);

const renameSetup = () => {
  emit("renameSetup", setupStore.selectedSetup);
};

const selectSetup = (setup) => {
  setupStore.selectedSetup = setup;
  emit("selectSetup", setup);
};
</script>
