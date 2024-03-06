<template>
  <div class="footer-parent bg-[#33393E]">
    <div
      class="stereum-status"
      @mouseenter="cursorLocation = stereumStatus ? `stereum status` : `Attempting to reconnect...`"
      @mouseleave="cursorLocation = ''"
    >
      <div class="stereum-stateIcon" :class="stereumStatus ? 'onlineState' : 'offlineState'" />
      <div class="stereum-status-state">
        <span :class="stereumStatus ? 'online' : 'offline'">{{ stereumStatus ? "Online" : "Offline" }}</span>
      </div>
    </div>
    <div class="footer-status-info">
      <span>{{ cursorLocation }}</span>
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
