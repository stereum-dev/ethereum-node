<template>
  <div
    class="w-28  h-full flex flex-col justify-between items-center fixed right-0 top-0"
    @mouseleave="store.isDrawerOpen = false"
  >
    <DrawerBox />
  </div>
</template>
<script setup>
import DrawerBox from "../components/drawer/DrawerBox";
import { useNodeManage } from "@/store/nodeManage";

const store = useNodeManage(); 

</script>
