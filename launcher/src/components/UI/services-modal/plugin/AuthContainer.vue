<template>
  <div class="auth-parent">
    <div class="info-part">
      <div class="info-row">
        <span>{{ $t("authenticatorModal.keyText") }}</span>
        <div class="val-part" @click="copy('secretKey')">
          {{ secretCopied ? "COPIED" : secretKey }}
        </div>
      </div>
      <div class="info-row">
        <span>{{ $t("authenticatorModal.codeText") }}</span>
        <input v-if="timeBase" v-model="verificationCode" type="text" class="val-part" />
        <div v-if="!timeBase" class="val-part" @click="copy('')">
          {{ codeCopied ? "COPIED" : verificationCode }}
        </div>
      </div>
      <div class="info-row">
        <span>{{ $t("authenticatorModal.saveText") }}</span>
        <div :class="['save-btn', checkSave]" @click="saveClick">
          {{ $t("authenticatorModal.saveButton") }}
        </div>
      </div>
    </div>
    <div class="qrcode-part">
      <div class="qrcode"><img :src="qrCode" alt="" /></div>
    </div>
  </div>
</template>

<script>
import { mapWritableState } from "pinia";
import { useNodeHeader } from "@/store/nodeHeader";
export default {
  props: {
    secretKey: {
      type: String,
      default: "",
    },
    qrCode: {
      type: String,
      default: "",
    },
    timeBase: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      secretCopied: false,
      codeCopied: false,
    };
  },
  computed: {
    ...mapWritableState(useNodeHeader, {
      verificationCode: "verificationCode",
      validVerificationCode: "validVerificationCode",
      QRcode: "QRcode",
      authKeyTimeBase: "authKeyTimeBase",
    }),
    checkSave() {
      return this.validVerificationCode === this.verificationCode ? "" : "disable-save";
    },
  },
  mounted() {
    this.verificationCode = "";
  },
  methods: {
    async copy(type) {
      const text = type === "secretKey" ? this.secretKey : this.verificationCode;
      await navigator.clipboard.writeText(text);
      if (type === "secretKey") {
        this.secretCopied = true;
        setTimeout(() => (this.secretCopied = false), 1500);
      } else {
        this.codeCopied = true;
        setTimeout(() => (this.codeCopied = false), 1500);
      }
    },
    saveClick() {
      if (this.checkSave !== "disable-save") {
        this.$emit("saveClick");
      }
    },
  },
};
</script>

<style scoped>
.disable-save {
  background: rgb(51, 102, 102, 0.5) !important;
  cursor: not-allowed !important;
  pointer-events: none;
  transition: background-color 0.3s ease, color 0.3s ease, opacity 0.3s ease;
}
.auth-parent {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}
.info-part {
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
}
.qrcode-part {
  width: 30%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.qrcode {
  width: 60%;
  height: 90%;
  background: #010101;

  border-radius: 15px;

  display: flex;
  align-items: center;
  justify-content: center;
}
.qrcode img {
  width: 100%;
  height: 100%;
}
.info-row {
  width: 95%;
  height: 28%;
  background: #a0a0a0;
  margin-left: 10px;
  border-radius: 15px;
  padding-left: 5%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.info-row span {
  color: #131414;
  font-size: 0.65rem;
  font-weight: 600;
}
.val-part {
  color: #d7d4d4;
  font-size: 0.65rem;
  font-weight: 400;
  background: #131414;
  cursor: text;
  width: 60%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  text-align: center;
}
.save-btn {
  color: #eee;
  font-size: 0.65rem;
  font-weight: 400;
  background: #336666;
  cursor: pointer;
  width: 45%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
}
.save-btn:active {
  box-shadow: 1px 1px 10px 1px #171717 inset;
}
</style>
