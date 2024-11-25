<template>
  <div
    class="server-name-parent total-setup-services-parent MachineNameParent bg-[#151618] rounded-md w-full h-full relative flex justify-start items-center"
    @mouseenter="footerStore.cursorLocation = `${serverName}`"
    @mouseleave="footerStore.cursorLocation = ''"
  >
    <span class="server-name text-xs text-amber-300 font-semibold flex items-center justify-start pl-2">{{
      serverStore.selectedServerConnection?.name ? serverStore.selectedServerConnection?.name : controlStore.ServerName
    }}</span>
  </div>
</template>

<script setup>
import { useFooter } from "@/store/theFooter";
import { useServers } from "@/store/servers";
import { useControlStore } from "@/store/theControl";

import i18n from "@/includes/i18n";

const t = i18n.global.t;

const serverStore = useServers();
const footerStore = useFooter();
const controlStore = useControlStore();

const serverName = t("serverDetail.serverName", {
  serverName: serverStore.selectedServerConnection?.name ? serverStore.selectedServerConnection?.name : controlStore.ServerName,
});
</script>

<style scoped>
.server-name {
  white-space: nowrap;
  overflow-x: scroll;
  display: inline-block;
  scrollbar-width: none;
}

.server-name::-webkit-scrollbar {
  display: none;
}
</style>
