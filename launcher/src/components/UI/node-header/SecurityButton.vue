<template>
  <div class="securBtn-parent">
    <div
      class="securBtn-box"
      @click="securityButtonHandler"
      @mouseenter="$emit('mouseEnter')"
      @mouseleave="$emit('mouseLeave')"
    >
      <img :src="stereumStatus ? '/img/icon/LOGO.png' : '/img/icon/statusOff.png'" class="main-header__brand" />
    </div>
    <div v-if="tooltip && checkTheRouter" class="server-access-tooltip">
      {{ serverAccMange }}
    </div>
  </div>
</template>

<script>
import { mapWritableState } from "pinia";
import { useNodeHeader } from "@/store/nodeHeader";
import { useFooter } from "@/store/theFooter";

export default {
  props: {
    tooltip: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      serverAccMange: this.$t("serverManagement.serverAccMange"),
    };
  },
  computed: {
    ...mapWritableState(useFooter, {
      stereumStatus: "stereumStatus",
      cursorLocation: "cursorLocation",
    }),
    ...mapWritableState(useNodeHeader, {
      serverAccessManagement: "serverAccessManagement",
    }),
    checkTheRouter() {
      if (this.$route.fullPath !== "/login" || this.$route.fullPath !== "/oneClick/play") {
        return true;
      } else {
        return false;
      }
    },
  },

  watch: {
    securityButtonHandler() {
      if (this.$route.fullPath === "/login" || this.$route.fullPath === "/oneClick/play") {
        return;
      } else {
        this.$emit("accessSwitch");
      }
    },
  },
};
</script>

<style scoped>
.server-access-tooltip {
  width: 200px;
  height: 40px;
  background-color: #282c2f;
  border: 1px solid #57595d;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 60px;
  left: 30px;
  border-radius: 10px;
  color: #eee;
  font-size: 65%;
  font-weight: 600;
  text-transform: uppercase;
  z-index: 100;
}
.securBtn-parent {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
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
