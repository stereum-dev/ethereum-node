<template>
  <div class="footer-parent bg-[#33393E]">
    <div
      class="w-24 h-6 absolute left-[34px] bottom-[2px] z-50 flex justify-start items-center bg-[#161717] rounded-r-full px-2"
      @mouseenter="cursorLocation = stereumStatus ? `stereum status` : `Attempting to reconnect...`"
      @mouseleave="cursorLocation = ''"
    >
      <span class="animate-pulse w-3 h-3 rounded-full" :class="stereumStatus ? 'bg-green-500 ' : 'offlineState'">
      </span>
      <div class="w-2/3 h-full flex justify-center items-center">
        <span class="text-sm font-semibold" :class="stereumStatus ? 'text-green-500 ' : 'text-red-500'">{{
          stereumStatus ? "Online" : "Offline"
        }}</span>
      </div>
    </div>
    <div class="w-full absolute left-32 bottom-0 text-sm text-gray-200 capitalize z-20">
      <span class="ml-2">{{ cursorLocation }}</span>
    </div>
  </div>
</template>

<script>
import { mapWritableState } from "pinia";
import { useFooter } from "@/store/theFooter";
export default {
  name: "TheFooter",
  computed: {
    ...mapWritableState(useFooter, {
      cursorLocation: "cursorLocation",
      stereumStatus: "stereumStatus",
    }),
  },
};
</script>

<style scoped lang="css">
.footer-parent {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: default;
}
.footer-status-info {
  width: 85%;
  height: 4%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  left: 14%;
  font-size: 80%;
  color: #c1c1c1;
  font-weight: 700;
  text-transform: uppercase;
  position: absolute;
  bottom: 0.5%;
}
.stereum-status {
  width: 10%;
  height: 3.5%;
  background: #1f1f1f;
  border-radius: 0 30px 30px 0;
  margin-left: 35px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: absolute;
  bottom: 0.5%;
  z-index: 50;
}
.stereum-stateIcon {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin: 0 5%;
}
.online {
  color: green;
}

.offline {
  color: red;
}
.onlineState {
  background-color: green;
  z-index: 50;
}
.offlineState {
  background-color: red;
  z-index: 50;
}
.stereum-status-state {
  width: 80%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 90%;
  z-index: 50;
}
</style>
