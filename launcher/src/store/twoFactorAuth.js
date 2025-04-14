import { defineStore } from "pinia";

export const useTwoFactorAuth = defineStore("twoFactorAuth", {
  state: () => {
    return {
      varificationCode: "",
      validVerificationCode: false,
      scratchCodeSaved: false,
      isBarcodeModalActive: false,
      QRcode: "",
      isSendingCode: false,
      isSetupConfirming: false,
    };
  },
  actions: {},
});
