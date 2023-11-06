<template>
  <div class="ipscan-modal-parent">
    <div class="ipscan-modal-bg" @click="closeIpscan"></div>
    <div class="ipscan-modal">
      <div class="ipscan-icon-container">
        <img src="/img/icon/the-staking/stereum-error.png" alt="" />
      </div>
      <div class="ipscan-text-container">
        <p class="text">
          {{ $t("ipScanModal.message") }}
        </p>
      </div>
      <div class="ipscan-search-container">
        <div class="ipscan-search-ip-place">{{ scannedIp }}</div>
        <div class="ipscan-search-btn" :style="{ backgroundColor: btnColor }" @click="btnFunction">
          {{ btnState }}
        </div>
      </div>
      <div class="click-close">{{ $t("ipScanModal.clockClose") }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    scannedIp: {
      type: String,
      required: true,
    },
    btnState: {
      type: String,
      required: true,
    },
  },
  emits: ["closeIpscan", "searchingIp", "copyIp", "btnFunction"],
  computed: {
    btnColor() {
      if (this.btnState === "search") {
        return "#70E763";
      } else if (this.btnState === "pending") {
        return "#7EB5E6";
      } else if (this.btnState === "copy") {
        return "#70E763";
      }
      return "#70E763";
    },
  },
  methods: {
    closeIpscan() {
      this.$emit("closeIpscan");
    },
    searchingIp() {
      this.$emit("searchingIp");
    },
    copyIp() {
      this.$emit("copyIp");
    },
    btnFunction() {
      this.$emit("btnFunction");
    },
  },
};
</script>

<style scoped>
.ipscan-modal-parent {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
}
.ipscan-modal-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
}
.ipscan-modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  height: 70%;
  background-color: #336666;
  border-radius: 45px;
  border: 3px solid #8a8f8f;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.ipscan-icon-container {
  margin-top: 1%;
  width: 20%;
  height: 28%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.ipscan-icon-container img {
  width: 80%;
  height: 100%;
}
.ipscan-text-container {
  margin-top: 1%;
  width: 90%;
  height: 35%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 100%;
  font-weight: 500;
  color: #eee;
}
.ipscan-text-container .text {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.ipscan-search-container {
  width: 89%;
  height: 20%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  font-size: 100%;
  font-weight: 500;
  color: #eee;
}
.ipscan-search-ip-place {
  width: 65%;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px solid #eee;
  border-radius: 15px;
  background: #254545;
}
.ipscan-search-btn {
  width: 30%;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px solid #eee;
  border-radius: 15px;
  background: #70e763;
  color: #eee;
  font-size: 100%;
  font-weight: 700;
  cursor: pointer;
  text-transform: uppercase;
}
.ipscan-search-btn:active {
  transform: scale(0.95);
}
.click-close {
  margin-top: 2%;
  width: 90%;
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 90%;
  font-weight: 400;
  color: red;
}
</style>
