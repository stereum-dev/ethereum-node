<template>
  <div class="w-full relative col-start-1 col-span-full grid grid-cols-6 gap-x-1" :class="newHeight">
    <label
      v-if="setupStore.isRenameSetupActive && route.path === '/edit'"
      for="rename"
      class="w-full h-full col-start-1 col-end-6 text-gray-800 bg-[#232528] rounded-sm border border-gray-600 flex justify-center items-center"
    >
      <input
        id="rename"
        v-model="setupStore.setupToRename"
        type="text"
        class="w-full h-full pl-2 bg-[#232528] text-gray-200 text-xs"
        focusable
      />
    </label>

    <!-- Dropdown toggle button -->

    <div
      v-else
      class="col-start-1 relative p-1 grid rounded-[4px] border border-gray-600"
      :class="route.path === '/edit' ? 'col-end-6 grid-cols-9' : 'col-span-full  grid-cols-12'"
      @click="toggleDropdown"
    >
      <span
        v-if="setupStore.selectedSetup !== null && setupStore.selectedSetup?.isActive"
        class="col-start-1 col-span-1 w-4 h-4 rounded-full self-center justify-self-center shadow-sm shadow-black"
        :class="setupStore.getBGColor(setupStore.selectedSetup?.color)"
      ></span>
      <img
        v-else
        class="col-start-1 col-span-1 w-4 h-4 rounded-full self-center justify-self-center shadow-sm shadow-black"
        src="/img/icon/stereum-icons/stereum-logo.png"
        alt="Server View"
      />
      <span
        class="self-center col-start-2 text-sm font-sans font-[500] overflow-hidden truncate text-gray-200 ml-2"
        :class="route.path === '/edit' ? 'col-end-9' : 'col-end-11'"
        >{{ getSelectedOption }}</span
      >

      <svg
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        class="h-3 w-3 text-white self-center col-span-1 transform transition-transform duration-200 ease-in-out"
        :class="[isOpen ? 'rotate-180' : 'rotate-0', route.path === '/edit' ? 'col-start-9' : 'col-start-12']"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>

    <!-- Dropdown menu -->
    <Transition
      enter-active-class="transform transition duration-500 ease-custom"
      enter-class="-translate-y-1/2 scale-y-0 opacity-0"
      enter-to-class="translate-y-0 scale-y-100 opacity-100"
      leave-active-class="transform transition duration-300 ease-custom"
      leave-class="translate-y-0 scale-y-100 opacity-100"
      leave-to-class="-translate-y-1/2 scale-y-0 opacity-0"
    >
      <div
        v-if="isOpen"
        class="absolute top-9 z-20 min-h-20 mt-1 origin-top-right shadow-md bg-gray-200 transition-all duration-100 divide-y divide-gray-400 shadow-black rounded-md p-1"
        :class="getDropdownWidth"
        @mouseleave="isOpen = false"
      >
        <div
          v-if="(setupStore.isConfigViewActive || setupStore.isEditConfigViewActive) && notShowServerViewInControl"
          class="p-2 bg-gray-300 capitalize transition-colors duration-300 transform text-[#336666] hover:bg-blue-300 cursor-pointer grid grid-cols-6 items-center"
          @click="selectServerView"
        >
          <img
            class="col-start-1 col-span-1 w-5 h-5 rounded-full border border-gray-200 self-center bg-gray-100"
            src="/img/icon/stereum-icons/stereum-logo.png"
            alt="Node Server View"
          />
          <span class="col-start-2 col-span-full self-center text-left text-sm font-semibold overflow-hidden truncate font-sans"
            >Server View</span
          >
        </div>
        <div
          v-for="setup in setupsList"
          v-show="setup.setupId !== setupStore.selectedSetup?.setupId"
          :key="setup.setupName"
          class="p-2 bg-gray-200 capitalize transition-colors duration-300 transform text-gray-600 hover:bg-blue-300 hover:text-gray-700 cursor-pointer text-sm font-bold overflow-hidden truncate grid grid-cols-6 gap-x-1"
          :class="{
            'pointer-events-none opacity-50': noValidatorHandler(setup),
          }"
          @click="selectSetup(setup)"
        >
          <span
            class="col-start-1 col-span-1 w-5 h-5 rounded-full border border-gray-300 self-center justify-self-start"
            :class="setupStore.getBGColor(setup.color)"
          ></span>
          <span class="col-start-2 col-span-full self-center text-sm font-bold overflow-hidden truncate font-sans">{{
            setup.setupName
          }}</span>
        </div>
      </div>
    </Transition>

    <!-- Rename setup button -->
    <!-- Rename Button  -->
    <RenameSetup v-if="route.path === '/edit'" @confirm-rename="confirmRename" @rename-setup="selectRename" />
  </div>
</template>
<script setup>
import { useSetups } from "@/store/setups";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";

import RenameSetup from "./RenameSetup.vue";
import { useServices } from "@/store/services";
import { useDeepClone } from "@/composables/utils";

const { newHeight } = defineProps({
  list: {
    type: Array,
    required: true,
  },
  newHeight: {
    type: String,
    required: false,
    default: "h-full",
  },
});

const emit = defineEmits(["selectRename", "selectSetup", "serverView", "confirmRename"]);

const route = useRoute();
const setupStore = useSetups();
const serviceStore = useServices();

const isOpen = ref(false);

const setupsList = computed(() => {
  const validators = serviceStore.installedServices.filter((s) => s.category === "validator").map((v) => v.service);

  let output = setupStore.allSetups.filter((s) => s.setupName !== "commonServices");
  output = output.map((setup) => {
    if (!setup.services || setup.services.length === 0) {
      setup.noValidator = true;
    } else {
      const hasValidator = setup.services.some((service) => validators.includes(service.service));
      if (!hasValidator) {
        setup.noValidator = true;
      }
    }

    return setup;
  });
  return useDeepClone(output);
});

const getDropdownWidth = computed(() => {
  let width;
  if (route.path === "/edit") {
    width = "w-40 right-8";
  } else if (route.path === "/node") {
    width = "w-48 right-0";
  } else if (route.path === "/staking") {
    width = "w-52 right-1";
  } else if (route.path === "/control") {
    width = "w-44";
  } else {
    width = "w-48";
  }
  return width;
});

const notShowServerViewInControl = computed(() => {
  return route.path !== "/control";
});

const getSelectedOption = computed(() => {
  let option;
  if (setupStore.selectedSetup === null) {
    option = "Server View";
  } else {
    option = setupStore.selectedSetup?.setupName;
  }

  return option;
});

//watchers
watch(
  () => setupsList.value,
  () => {
    setupStore.stakingSetups = setupsList.value;
  }
);

// Methods

const noValidatorHandler = (setup) => {
  return !!(route.path === "/staking" && setup.noValidator);
};

const toggleDropdown = () => {
  if (setupsList.value.length > 1 && route.path === "/control") {
    isOpen.value = !isOpen.value;
  } else if (setupsList.value.length > 0 && route.path !== "/control") {
    isOpen.value = !isOpen.value;
  }
};

const selectRename = () => {
  if (setupStore.selectedSetup) {
    emit("selectRename", setupStore.selectedSetup);
  }
};

const confirmRename = () => {
  setupStore.isRenameSetupActive = false;

  emit("confirmRename");
};

const selectSetup = (setup) => {
  isOpen.value = false;
  emit("selectSetup", setup);
};

const selectServerView = () => {
  isOpen.value = false;
  emit("serverView");
};
</script>

<style scoped>
.ease-custom {
  transition-timing-function: cubic-bezier(0.61, -0.53, 0.43, 1.43);
}
</style>
