<template>
  <div class="footer-parent">
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
  z-index: 1;
}

.footer-status-info {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-left: 3.8%;
  font-size: 80%;
  color: #c1c1c1;
  font-weight: 700;
  text-transform: capitalize;
}
</style>
