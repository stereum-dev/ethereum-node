<template>
  <div class="relative col-start-1 col-span-full grid grid-cols-6 gap-x-1">
    <!-- Dropdown toggle button -->
    <label
      v-if="setupStore.isRenameSetupActive && route.path === '/edit'"
      for="rename"
      class="w-full h-full col-start-1 col-end-6 text-gray-800 bg-[#232528] rounded-sm border border-gray-600 flex justify-center items-center"
    >
      <input
        id="rename"
        v-model="setupStore.setupToRename"
        type="text"
        class="w-full h-8 pl-2 bg-[#232528] text-gray-200 text-xs"
        focusable
      />
    </label>
    <button
      v-else
      class="w-full col-start-1 col-end-6 relative z-10 p-2 text-gray-800 bg-[#232528] rounded-sm grid grid-cols-12 border border-gray-600"
      @click="isOpen = !isOpen"
    >
      <span
        v-if="setupStore.selectedSetup !== null"
        class="col-start-1 col-span-1 w-4 h-4 rounded-full self-center justify-self-center z-10 shadow-md shadow-black"
        :class="getBGColor"
      ></span>
      <span
        class="col-start-2 col-end-11 text-sm font-semibold overflow-hidden truncate"
        :class="getTextColor"
        >{{
          setupStore.selectedSetup !== null
            ? setupStore.selectedSetup?.name
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
      v-if="setupStore.isRenameSetupActive && route.path === '/edit'"
      class="w-full h-full col-start-6 col-span-1 flex justify-center items-center bg-teal-800 border border-gray-600 rounded-sm p-[2px]"
      @click="confirmRename"
      @mouseenter="footerStore.cursorLocation = 'Rename Node Setup'"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <img
        class="w-5 hover:scale-105 active:scale-95 cursor-pointer transition-all duration-150"
        src="/img/icon/service-setting-icons/confirm.png"
        alt="Avatar"
      />
    </div>
    <div
      v-else
      class="w-full h-full col-start-6 col-span-1 flex justify-center items-center bg-[#333539] border border-gray-600 rounded-sm p-[2px]"
      :class="{
        'pointer-events-none opacity-45 ':
          setupStore.selectedSetup === null || route.path !== '/edit',
      }"
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
      class="absolute right-8 top-9 z-20 w-40 min-h-20 py-2 mt-2 origin-top-right rounded-md shadow-xl bg-gray-200 transition-all duration-100 divide-y-2 divide-gray-500 shadow-black"
      @click="isOpen = false"
      @mouseleave="isOpen = false"
    >
      <div
        v-for="setup in list"
        :key="setup.name"
        class="p-2 bg-gray-300 capitalize transition-colors duration-300 transform text-gray-700 hover:bg-blue-300 hover:text-gray-700 cursor-pointer text-sm font-bold overflow-hidden truncate grid grid-cols-6 gap-x-1"
        @click="selectSetup(setup)"
      >
        <span
          class="col-start-1 col-span-1 w-5 h-5 rounded-full self-center justify-self-start z-10 shadow-sm shadow-black boxShadow"
          :class="getBGColor"
        ></span>
        <span
          class="col-start-2 col-span-full self-center text-sm font-bold overflow-hidden truncate"
          >{{ setup.name }}</span
        >
      </div>
    </div>
  </div>
</template>
<script setup>
import { useFooter } from "@/store/theFooter";
import { computed, ref } from "vue";
import { useSetups } from "@/store/setups";
import { useRoute } from "vue-router";

const { list } = defineProps({
  list: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["renameSetup", "selectSetup", "confirmRename"]);

const route = useRoute();
const setupStore = useSetups();
const footerStore = useFooter();

const isOpen = ref(false);

const getBGColor = computed(() => {
  let bg;
  if (setupStore.selectedSetup !== null) {
    if (setupStore.selectedSetup?.color === "default") {
      bg = "bg-gray-100";
    } else if (setupStore.selectedSetup?.color === "blue") {
      bg = "bg-[#1d4ed8]";
    } else if (setupStore.selectedSetup?.color === "red") {
      bg = "bg-[#C51605]";
    } else if (setupStore.selectedSetup?.color === "yellow") {
      bg = "bg-[#F7C566]";
    } else if (setupStore.selectedSetup?.color === "orange") {
      bg = "bg-[#FF9800]";
    } else if (setupStore.selectedSetup?.color === "green") {
      bg = "bg-[#436850]";
    } else if (setupStore.selectedSetup?.color === "beige") {
      bg = "bg-[#D1BB9E]";
    } else if (setupStore.selectedSetup?.color === "purple") {
      bg = "bg-[#8E7AB5]";
    } else if (setupStore.selectedSetup?.color === "brown") {
      bg = "bg-[#503C3C]";
    } else if (setupStore.selectedSetup?.color === "gray") {
      bg = "bg-[#5E5E5E]";
    }
  } else {
    bg = "white";
  }

  return bg;
});

const getTextColor = computed(() => {
  let text;
  if (setupStore.selectedSetup !== null) {
    if (setupStore.selectedSetup?.color === "default") {
      text = "text-gray-100";
    } else if (setupStore.selectedSetup?.color === "blue") {
      text = "text-[#074173]";
    } else if (setupStore.selectedSetup?.color === "red") {
      text = "text-[#C51605]";
    } else if (setupStore.selectedSetup?.color === "yellow") {
      text = "text-[#F7C566]";
    } else if (setupStore.selectedSetup?.color === "orange") {
      text = "text-[#FF9800]";
    } else if (setupStore.selectedSetup?.color === "green") {
      text = "text-[#436850]";
    } else if (setupStore.selectedSetup?.color === "beige") {
      text = "text-[#D1BB9E]";
    } else if (setupStore.selectedSetup?.color === "purple") {
      text = "text-[#8E7AB5]";
    } else if (setupStore.selectedSetup?.color === "brown") {
      text = "text-[#503C3C]";
    } else if (setupStore.selectedSetup?.color === "gray") {
      text = "text-[#5E5E5E]";
    }
  } else {
    text = "text-white";
  }

  return text;
});

const renameSetup = () => {
  if (setupStore.selectedSetup !== null) {
    emit("renameSetup", setupStore.selectedSetup);
  } else {
    return;
  }
};

console.log("setupStore.selectedSetup", setupStore.selectedSetup);

const confirmRename = () => {
  emit("confirmRename", setupStore.selectedSetup);
};

const selectSetup = (setup) => {
  setupStore.selectedSetup = setup;
  emit("selectSetup", setup);
};
</script>

<style scoped>
.boxShadow {
  box-shadow: inset 1px 1px 10px 0px #adaca8, 0px 1px 3px 1px #3d3b40;
}
</style>
