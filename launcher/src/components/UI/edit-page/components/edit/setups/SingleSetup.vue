<template>
  <div
    class="w-[130px] h-[120px] col-span-1 row-span-1 items-center border rounded-md mx-auto relative grid grid-cols-2 grid-rows-12 cursor-pointer"
    :class="getDynamicClasses(props.setup)"
    @click="props.setup.isActive = true"
    @mouseenter="keepMenu"
    @mouseleave="hideMenu"
  >
    <div
      class="w-full h-full col-start-1 col-span-full row-start-1 row-span-2 text-2xs text-center font-semibold capitalize overflow-hidden whitespace-nowrap truncate p-1 rounded-t-[0.28rem]"
      :class="[textColor, bgColor]"
    >
      <span>{{ props.setup.setupName }}</span>
    </div>

    <SetupLayout :setup="props.setup" />
    <Transition name="slide-fade">
      <SetupMenu
        v-if="props.setup.isActive && !props.setup.isRemoveProcessing"
        :setup="props.setup"
        @delete-setup="deleteSetup"
        @connect-setup="connectSetup"
        @info-modal="infoModal"
        @open-configs="openConfigs"
      />
    </Transition>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount } from "vue";
import { useSetups } from "../../../../../../store/setups";
import SetupLayout from "./SetupLayout.vue";
import SetupMenu from "./SetupMenu.vue";

// props & emits
const props = defineProps({
  setup: Object,
});

const emit = defineEmits(["deleteSetup", "connectSetup", "infoModal", "openConfigs"]);

//Store

const setupStore = useSetups();
// refs

//Computed
const getDynamicClasses = (item) => {
  if (item.hasOwnProperty("isRemoveProcessing") && item.isRemoveProcessing) {
    return "border bg-red-500 border-white";
  } else {
    return "border-gray-500";
  }
};
const textColor = computed(() => setupStore.getColor(props.setup.color, "text"));
const bgColor = computed(() => setupStore.getColor(props.setup.color, "background"));

//Lifecycle Hooks

//Methods
// the menu closes a moment after the pointer leaves the card, so a brief slip past its edge does not close it
let hideTimer = null;
const keepMenu = () => clearTimeout(hideTimer);
const hideMenu = () => {
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => (props.setup.isActive = false), 400);
};
onBeforeUnmount(() => clearTimeout(hideTimer));

const deleteSetup = (item) => {
  emit("deleteSetup", item);
};

const connectSetup = (item) => {
  emit("connectSetup", item);
};

const infoModal = (item) => {
  emit("infoModal", item);
};

const openConfigs = (item) => {
  emit("openConfigs", item);
};
</script>
<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

/* fade only: a sliding menu moved its icons under a resting pointer */
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}
</style>
