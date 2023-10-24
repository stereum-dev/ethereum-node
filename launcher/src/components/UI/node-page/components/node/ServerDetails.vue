<template>
  <div
    class="col-start-1 col-span-3 h-[55px] flex flex-col justify-between items-center border border-gray-600 rounded-md bg-[#151618]"
  >
    <div class="w-full flex justify-center items-center px-2 h-[25px]">
      <span class="text-md font-semibold ml-1 text-yellow-500 overflow-hidden whitespace-pre text-center">{{
        newServerName
      }}</span>
    </div>
    <div v-if="newServerIp" class="w-full flex justify-center items-center px-2 h-[25px]">
      <span class="text-xs text-left text-gray-100 overflow-hidden whitespace-pre ml-[5px]">IP :</span>
      <span class="text-sm pl-2 text-yellow-500 overflow-hidden whitespace-pre">{{ newServerIp }}</span>
    </div>
  </div>
</template>
<script setup>
import { useControlStore } from "@/store/theControl";
import { onMounted, ref } from "vue";

const controlStore = useControlStore();

let newServerName = ref("");
let newServerIp = ref("");

const props = defineProps({
  disabledButton: Boolean,
  serverName: String,
  serverIp: String,
});

onMounted(() => {
  newServerName.value = props.serverName !== null ? props.serverName : controlStore.ServerName;
  newServerIp.value = props.serverIp !== null ? props.serverIp : controlStore.ipAddress;
});
</script>
