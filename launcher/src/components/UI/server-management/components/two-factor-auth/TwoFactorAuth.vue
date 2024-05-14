<template>
  <div
    class="2-fa-auth w-full h-full col-start-1 col-span-full row-start-1 row-span-full bg-[#1b1b1d] rounded-md grid grid-cols-24 grid-rows-14 p-2 gap-1"
  >
    <span class="top-ttl row-start-1">{{ titleManager }}</span>
    <TwoFactorBtn
      v-if="!twoFatorIsEnabled && !TwoFactoSetupIsActive && !configured2fa"
      class="row-start-2"
      btn-name="Setup"
      @btnClick="enableTwoFactor"
    />
    <TwoFactorBtn
      v-if="!twoFatorIsEnabled && !TwoFactoSetupIsActive && configured2fa"
      class="row-start-2 remove-btn"
      btn-name="Remove 2FA"
      @btnClick="removeTwoFactor"
    />
    <TwoFactorCheckLine
      v-if="twoFatorIsEnabled"
      default-checked="true"
      class="row-start-2"
      check-text="Do you want authentication tokens to be time-based?"
      @update="timaBaseActive"
    />
    <TwoFactorCheckLine
      v-if="twoFatorIsEnabled"
      default-checked="false"
      class="row-start-3"
      check-text="Increase the original generation time limit? This will permit a time skew of up to 4 minutes!"
      multi-line="true"
      @update="orgGenTimeLimit"
    />
    <TwoFactorCheckLine
      v-if="twoFatorIsEnabled"
      default-checked="true"
      class="row-start-5"
      check-text="Do you want to enable rate-limiting?"
      @update="rateLimiting"
    />
    <!-- barcode and secret-key are passed as props to TwoFactoSetupBox and they have to bind ':' before theme to bind, at the moment is 
    hardcoded to test -->
    <TwoFactoSetupBox
      v-if="TwoFactoSetupIsActive"
      :barcode="QRcode"
      :secret-key="secretKey"
      :time-based="isTimeBaseActive"
      :class="['row-start-2', !secretKey ? 'disabled' : '']"
      @send-code="sendTheCode"
    />
    <TwoFactorBackup
      v-if="TwoFactoSetupIsActive"
      :class="['row-start-7', !authStore.validVerificationCode ? 'disabled' : '']"
      @save-backup="onSaveScratch"
    />
    <TwoFactorBtn
      v-if="twoFatorIsEnabled || TwoFactoSetupIsActive"
      :class="['row-start-13', 'col-start-8', TwoFactoSetupIsActive && !authStore.scratchCodeSaved ? 'disabled' : '']"
      btn-name="Setup"
      @btnClick="startSetup"
    />
  </div>
</template>

<script setup>
import TwoFactorBtn from "./TwoFactorBtn.vue";
import TwoFactorCheckLine from "./TwoFactorCheckLine.vue";
import TwoFactoSetupBox from "./TwoFactoSetupBox";
import TwoFactorBackup from "./TwoFactorBackup.vue";
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useTwoFactorAuth } from "@/store/twoFactorAuth";
import { useControlStore } from "@/store/theControl";
import ControlService from "@/store/ControlService";
import { saveAs } from "file-saver";

const authStore = useTwoFactorAuth();
const controlStore = useControlStore();
//enable two factor authentication
const twoFatorIsEnabled = ref(false);
//setup two factor authentication
const TwoFactoSetupIsActive = ref(false);
//first check box value to enable time based authentication
const isTimeBaseActive = ref(true);
//second check box value to increase the original generation time limit
const isOrgGenTimeLimit = ref(false);
//third check box value to enable rate limiting
const isRateLimiting = ref(true);

const verificationOutput = ref("");
const secretKey = ref("");
const QRcode = ref("");
const configured2fa = ref();

onMounted(() => {
  checkAuth();
  ControlService.addListener("2FAEvents", authenticatorHandler);
});
onUnmounted(() => {
  ControlService.removeListener("2FAEvents", authenticatorHandler);
});

//function to enable two factor authentication
const enableTwoFactor = () => {
  twoFatorIsEnabled.value = true;
};

//setup button functions
const startSetup = async () => {
  if (twoFatorIsEnabled.value) {
    //first check box value to enable time based authentication
    twoFatorIsEnabled.value = false;
    TwoFactoSetupIsActive.value = true;
    authStore.varificationCode = "";
    authStore.validVerificationCode = false;
    authStore.scratchCodeSaved = false;
    await ControlService.beginAuthSetup(isTimeBaseActive.value, isOrgGenTimeLimit.value, isRateLimiting.value);
  } else {
    //setup two factor authentication
    await ControlService.finishAuthSetup();
  }
};

//title manager
const titleManager = computed(() => {
  if (twoFatorIsEnabled.value) {
    return "2 FACTOR AUTHENTICATION CONFIGURATION";
  } else if (TwoFactoSetupIsActive.value) {
    return "2 FACTOR SETUP";
  }
  return "2 FACTOR AUTHENTICATION";
});

//function to enable time based authentication
const timaBaseActive = (value) => {
  isTimeBaseActive.value = value;
};

//function to increase the original generation time limit
const orgGenTimeLimit = (value) => {
  isOrgGenTimeLimit.value = value;
};

//function to enable rate limiting
const rateLimiting = (value) => {
  isRateLimiting.value = value;
};

//function to send the code
const sendTheCode = async () => {
  await ControlService.authenticatorVerification(authStore.varificationCode);
};

//function to save the scratch Code
const onSaveScratch = () => {
  const blob = new Blob([verificationOutput.value], { type: "text/plain;charset=utf-8" });
  saveAs(blob, "2FA_ScratchCodes.txt");
  authStore.scratchCodeSaved = true;
};

const authenticatorHandler = (event, data) => {
  loadOutput(data);
};

const loadOutput = (data) => {
  if (data[0] != "skip") {
    secretKey.value = data[1].split(": ").pop();
    let QRadress = `https://quickchart.io/qr?chs=200x200&chld=M|0&cht=qr&text=otpauth://totp/${controlStore.ipAddress}@${controlStore.ServerName}%3Fsecret%3D[SECRETKEY]%26issuer%3D${controlStore.ServerName}`;
    QRcode.value = QRadress.replace("[SECRETKEY]", secretKey.value);
  }

  if (data.length > 5) {
    if (data[0] != "skip") {
      QRcode.value = QRcode.value.replace("totp", "hotp");
      authStore.varificationCode = data[2].split("is ").pop();
    }
    authStore.validVerificationCode = true;
    verificationOutput.value = data.slice(3, 9);
  }
};

const checkAuth = async () => {
  configured2fa.value = await ControlService.checkForAuthenticator();
};

const removeTwoFactor = async () => {
  await ControlService.removeAuthenticator();
};
</script>
<style scoped>
.top-ttl {
  grid-column-start: 1;
  grid-column-end: span full;
  grid-row-end: span 1;
  color: #f5f5f5;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}
.remove-btn {
  background: #ff0000;
}
</style>
