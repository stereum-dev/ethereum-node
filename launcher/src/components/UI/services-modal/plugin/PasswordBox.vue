<template>
  <div class="import-box-parent">
    <div class="title">
      <span>{{ importBoxTitle }}</span>
    </div>
    <div class="inputBox">
      <div class="password-box">
        <img src="/img/icon/server-management-icons/eye.png" alt="" @click="passCtrlSwitch" />
        <input
          v-model="passwordBoxModel"
          :type="passCtrl ? 'text' : 'password'"
          :placeholder="importBoxPlaceholder"
          :style="{ border: borderForInput }"
        />
        <div
          :class="['btn', passwordBoxModel ? '' : emptyDisabled ? 'disabled' : '']"
          :style="{ backgroundColor: dynamicBackgroundColor, color: btnNameColor }"
          @mouseover="handleMouseOver"
          @mouseleave="handleMouseLeave"
          @click="passwordBoxHandler"
        >
          {{ btnName }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapWritableState } from "pinia";
import { useNodeHeader } from "@/store/nodeHeader";
export default {
  props: {
    importBoxTitle: {
      type: String,
      default: "",
    },
    importBoxPlaceholder: {
      type: String,
      default: "",
    },
    tryAgain: {
      type: Boolean,
      default: false,
    },
    emptyDisabled: {
      type: Boolean,
      default: true,
    },
    btnBgColor: {
      type: String,
      default: "",
    },
    btnNameColor: {
      type: String,
      default: "#eee",
    },
    btnName: {
      type: String,
      default: "",
    },
  },
  emits: ["password-box-handler"],
  data() {
    return {
      dynamicBackgroundColor: this.btnBgColor,
      passCtrl: false,
    };
  },
  computed: {
    ...mapWritableState(useNodeHeader, {
      importBoxModel: "importBoxModel",
      passwordBoxModel: "passwordBoxModel",
    }),

    borderForInput() {
      return this.tryAgain ? "2px solid red" : "none";
    },
  },

  methods: {
    passCtrlSwitch() {
      this.passCtrl = !this.passCtrl;
    },
    passwordBoxHandler() {
      this.$emit("password-box-handler");
    },
    handleMouseOver() {
      this.dynamicBackgroundColor = this.adjustOpacity(this.btnBgColor, 0.8);
    },
    handleMouseLeave() {
      this.dynamicBackgroundColor = this.btnBgColor;
    },
    adjustOpacity(color, opacity) {
      const rgbaColor = this.hexToRgba(color);
      return `rgba(${rgbaColor.r}, ${rgbaColor.g}, ${rgbaColor.b}, ${opacity})`;
    },
    hexToRgba(hex) {
      const bigint = parseInt(hex.slice(1), 16);
      return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
      };
    },
  },
};
</script>

<style scoped>
.disabled {
  opacity: 0.5;
  box-shadow: none;
  pointer-events: none;
  cursor: not-allowed;
}
.import-box-parent {
  width: 100% !important;
  height: 100% !important;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  cursor: default;
}
.title {
  width: 100%;
  height: 30%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-self: flex-start;
}
.title span {
  color: #dbdbdb;
  font-size: 0.9rem;
  font-weight: 600;
  margin-left: 10px;
  margin-top: 5px;
}
.inputBox {
  width: 100%;
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.password-box {
  width: 96%;
  height: 50%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 20px;
  position: relative;
}
.password-box img {
  width: 4%;
  margin-left: 10px;
  cursor: pointer;
  position: absolute;
  filter: invert(1);
}

.inputBox input {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  padding-left: 35px;
}
.btn {
  width: 28%;
  height: 100%;
  background-color: #1ba5f8;
  text-decoration: none;
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #dbdbdb;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  transition-duration: all 200ms;
  position: absolute;
  right: 0;
  transition-duration: 100ms;
}

.btn:active {
  box-shadow: 1px 1px 10px 1px #171717 inset;
}
</style>
