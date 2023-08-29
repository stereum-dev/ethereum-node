<template>
  <div class="securBtn-parent">
    <div class="securBtn-box" @click="accessSwitch" @mouseenter="tooltip = true" @mouseleave="tooltip = false">
      <img :src="stereumStatus ? '/img/icon/LOGO.png' : '/img/icon/statusOff.png'" class="main-header__brand" />
    </div>
    <div v-if="tooltip" class="server-access-tooltip">server access management</div>
  </div>
</template>

<script>
import { mapState, mapWritableState } from "pinia";
import { useNodeHeader } from "@/store/nodeHeader";
import { useFooter } from "@/store/theFooter";
export default {
  data() {
    return {
      tooltip: false,
    };
  },
  computed: {
    ...mapState(useFooter, {
      stereumStatus: "stereumStatus",
    }),
    ...mapWritableState(useNodeHeader, {
      serverAccessManagement: "serverAccessManagement",
    }),
  },
  methods: {
    accessSwitch() {
      this.serverAccessManagement = !this.serverAccessManagement;
    },
  },
};
</script>

<style scoped>
.server-access-tooltip {
  width: 220%;
  height: 50%;
  background-color: #1e2429;
  border: 1px solid #b4b4b4;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  top: 5%;
  left: 15%;
  border-radius: 10px;
  color: #eee;
  font-size: 65%;
  font-weight: 600;
  text-transform: uppercase;
}
.securBtn-parent {
  position: fixed;
  top: 0;
  left: 0;
  width: 8%;
  height: 15%;
  z-index: 50;
  cursor: pointer;
}
.securBtn-box {
  width: 100%;
  z-index: 51;
}
.securBtn-box img {
  width: 100%;
  z-index: 51;
}
.securBtn-box img:active {
  transform: scale(0.98);
}
</style>
