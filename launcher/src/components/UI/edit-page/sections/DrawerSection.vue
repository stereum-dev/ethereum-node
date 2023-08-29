<template>
  <div
    class="w-28 h-full flex flex-col justify-between items-center fixed right-0 top-0"
    @mouseleave="store.isDrawerOpen = false"
  >
    <DrawerBox :start-drag="startDrag" @add-service="emitServiceToParent" />
  </div>
</template>
<script setup>
import DrawerBox from "../components/drawer/DrawerBox";
import { useNodeManage } from "@/store/nodeManage";

defineProps({
  startDrag: {
    type: Function,
    required: true,
  },
});

const emit = defineEmits(["addServices"]);

const store = useNodeManage();

const emitServiceToParent = (item) => {
  emit("addServices", item);
};
</script>
