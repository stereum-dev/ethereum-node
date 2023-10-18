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
/* .footer-parent {
  width: 99%;
  height: 3.8%;
  left: 0.5%;
  border-radius: 0 0 7px 7px;
  position: fixed;
  bottom: 0.8%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: default;
  z-index: 0 !important;
} */

.footer-parent {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: default;
}
.footer-status-info {
  width: 80%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-left: 0.5%;
  font-size: 80%;
  color: #c1c1c1;
  font-weight: 700;
  text-transform: capitalize;
}
.stereum-status {
  width: 10%;
  height: 100%;
  background: #1f1f1f;
  border-radius: 0 30px 30px 0;
  border-right: 1px solid #707070;
  margin-left: 35px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
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
}
.offlineState {
  background-color: red;
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
}
</style>
