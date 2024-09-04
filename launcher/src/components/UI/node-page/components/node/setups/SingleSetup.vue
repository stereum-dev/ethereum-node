<template>
  <div
    class="w-[180px] h-[100px] col-span-1 row-span-1 grid grid-cols-2 grid-rows-12 items-center border border-gray-500 rounded-md mx-auto box-border"
  >
    <div
      class="w-full h-full col-start-1 col-span-full row-start-1 row-span-2 text-[10px] text-center font-semibold capitalize overflow-hidden whitespace-nowrap truncate rounded-t-[0.28rem]"
      :class="[textColor, bgColor]"
    >
      <span class="font-sans">{{ props.setup.setupName }}</span>
    </div>
    <SetupLayout :setup="props.setup" />

    <SetupButtons :setup="props.setup" @open-setup="openSetup" @export-setup="exportSetup" @state-handler="setupState" />
  </div>
</template>

<script setup>
import SetupLayout from "./SetupLayout.vue";
import SetupButtons from "./SetupButtons.vue";
import { computed } from "vue";
import { useSetups } from "../../../../../../store/setups";

const props = defineProps({
  setup: Object,
});

const emit = defineEmits(["openSetup", "exportSetup", "setupState"]);

const setupStore = useSetups();

const textColor = computed(() => setupStore.getColor(props.setup.color, "text"));
const bgColor = computed(() => setupStore.getColor(props.setup.color, "background"));

const openSetup = (item) => {
  emit("openSetup", item);
};

const exportSetup = (item) => {
  emit("exportSetup", item);
};

const setupState = (item) => {
  emit("setupState", item);
};
</script>
