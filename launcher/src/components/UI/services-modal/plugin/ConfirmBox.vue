<template>
  <div class="confirm-box-parent">
    <div class="title">
      <span>{{ topLine }}</span>
      <span>{{ bottomLine }}</span>
    </div>
    <div class="btn-box">
      <div
        class="btn"
        :style="{
          backgroundColor: dynamicBackgroundColor,
          color: btnNameColor,
        }"
        @mouseover="handleMouseOver"
        @mouseleave="handleMouseLeave"
        @click="confirmPluginClick"
      >
        <img v-if="imgUrl || imgUrl !== ''" style="width: 10%; margin-right: 2%" :src="imgUrl" alt="" />
        {{ btnName }}
      </div>
      <div
        v-if="secondBtnName"
        :style="{
          backgroundColor: secondBtnBgColor,
          color: !secondBtnNameColor ? btnNameColor : secondBtnNameColor,
        }"
        class="btn"
        @click="secBtnPluginClick"
      >
        {{ secondBtnName }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    topLine: {
      type: String,
      default: "",
    },
    bottomLine: {
      type: String,
      default: "",
    },
    btnName: {
      type: String,
      default: "",
    },
    secondBtnName: {
      type: String,
      default: "",
    },
    btnBgColor: {
      type: String,
      default: "",
    },
    secondBtnBgColor: {
      type: String,
      default: "",
    },
    btnNameColor: {
      type: String,
      default: "#eee",
    },
    secondBtnNameColor: {
      type: String,
      default: "",
    },
    imgUrl: {
      type: String,
      default: "",
    },
  },
  emits: ["confirmPluginClick", "secBtnPluginClick"],
  data() {
    return {
      dynamicBackgroundColor: this.btnBgColor,
    };
  },
  watch: {
    btnBgColor(newVal) {
      this.dynamicBackgroundColor = newVal;
    },
  },

  methods: {
    confirmPluginClick() {
      this.$emit("confirmPluginClick");
    },
    secBtnPluginClick() {
      this.$emit("secBtnPluginClick");
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
.confirm-box-parent {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.title {
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}
.title span:first-child {
  color: #dbdbdb;
  font-size: 0.9rem;
  font-weight: 600;
  margin-left: 10px;
  margin-top: 5px;
  text-transform: uppercase;
}
.title span:last-child {
  color: #dbdbdb;
  font-size: 0.65rem;
  font-weight: 400;
  margin-left: 10px;
  margin-top: 10px;
}
.import-title span {
  color: #dbdbdb;
  font-size: 0.9rem;
  font-weight: 600;
  margin-left: 10px;
  margin-top: 5px;
}
.btn-box {
  width: 30%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
}
.btn {
  width: 90%;
  height: 35%;
  transition-duration: 100ms;
  margin-right: 10px;
  text-decoration: none;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  transition-duration: all 200ms;
}
.btn:first-child {
  margin-top: 15px;
}
.btn:not(:first-child) {
  margin-top: 5px;
}

.btn:active {
  box-shadow: 1px 1px 10px 1px #171717 inset;
}
</style>
