<template>
  <div class="footer-parent">
    <div class="stereum-status">
      <div class="stateIcon" />
      <div class="status-state"><span>offline</span></div>
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
    }),
  },
};
</script>

<style scoped lang="css">
.footer-parent {
  width: 99%;
  height: 3.8%;
  left: 0.5%;
  background-color: rgb(52, 52, 52);
  border-radius: 0 0 7px 7px;
  position: fixed;
  bottom: 0.8%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.footer-status-info {
  width: 80%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-left: 1%;
  font-size: 80%;
  color: #c1c1c1;
  font-weight: 700;
  text-transform: capitalize;
}
.stereum-status {
  width: 10%;
  height: 100%;
  background: #1f1f1f;
  margin-left: 3.1%;
  border-radius: 0 30px 30px 0;
  border-right: 1px solid #707070;
  box-shadow: 0px 0px 5px 0px #001717;
}
</style>
