<template>
  <div class="import-box-parent">
    <div class="title">
      <span>{{ importBoxTitle }}</span>
    </div>
    <div class="inputBox">
      <input v-model="importBoxModel" type="text" :placeholder="importBoxPlaceholder" />
      <div
        :class="['btn', importBoxModel ? '' : emptyDisabled ? 'disabled' : '']"
        :style="{ backgroundColor: dynamicBackgroundColor, color: btnNameColor }"
        @mouseover="handleMouseOver"
        @mouseleave="handleMouseLeave"
        @click="importBoxHandler"
      >
        {{ btnName }}
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
  emits: ["importBoxHandler"],
  data() {
    return {
      dynamicBackgroundColor: this.btnBgColor,
    };
  },
  computed: {
    ...mapWritableState(useNodeHeader, {
      importBoxModel: "importBoxModel",
      componentCountStore: "componentCountStore",
    }),

    borderForInput() {
      return this.tryAgain ? "2px solid red" : "none";
    },
  },

  methods: {
    importBoxHandler() {
      this.$emit("importBoxHandler");
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
.inputBox input {
  width: 95%;
  height: 50%;
  border: none;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  padding-left: 10px;
}
.btn {
  width: 27%;
  height: 50%;
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
  right: 2%;
  transition-duration: 100ms;
}

.btn:active {
  box-shadow: 1px 1px 10px 1px #171717 inset;
}
</style>
