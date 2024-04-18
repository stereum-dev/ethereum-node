<template>
  <div
    class="w-[130px] h-[110px] col-span-1 row-span-1 flex justify-center items-center p-1 border border-gray-500 rounded-md mx-auto relative"
  >
    <SetupLayout :setup="props.setup" />

    <Transition name="slide-fade">
      <SetupMenu
        v-if="setupStore.isSetupMenuActive"
        :setup="props.setup"
        @delete-setup="deleteSetup"
        @connect-setup="connectSetup"
        @info-modal="infoModal"
      />
    </Transition>
  </div>
</template>

<script setup>
import SetupLayout from "./SetupLayout.vue";
import SetupMenu from "./SetupMenu.vue";
import { useSetups } from "../../../../../../store/setups";

// props & emits
const props = defineProps({
  setup: Object,
});

const emit = defineEmits(["deleteSetup", "connectSetup", "infoModal"]);

//Store

const setupStore = useSetups();
// refs

//Methods
const deleteSetup = (item) => {
  emit("deleteSetup", item);
};

const connectSetup = (item) => {
  emit("connectSetup", item);
};

const infoModal = (item) => {
  emit("infoModal", item);
};
</script>
<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(50px);
  opacity: 0;
}
</style>
