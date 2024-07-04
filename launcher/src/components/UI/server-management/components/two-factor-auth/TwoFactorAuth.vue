<template>
  <div
    class="2-fa-auth w-full h-full col-start-1 col-span-full row-start-1 row-span-full bg-[#1b1b1d] rounded-md grid grid-cols-24 grid-rows-14 p-2 gap-1"
  >
    <span class="top-ttl row-start-1 text-gray-300">{{ titleManager }}</span>
    <TwoFactorBtn
      v-if="!twoFactorIsEnabled && !twoFactorSetupIsActive && !configured2fa"
      class="row-start-7 row-span-1"
      btn-name="Setup"
      @btnClick="enableTwoFactor"
      @mouseenter="footerStore.cursorLocation = `${t('twoFactor.setup')} `"
      @mouseleave="footerStore.cursorLocation = ''"
    />
    <div
      v-if="!twoFactorIsEnabled && !twoFactorSetupIsActive && !configured2fa"
      class="col-start-1 col-span-full row-start-2 row-end-6 flex flex-col justify-start items-start text-red-500"
    >
      <h3 class="text-lg font-semibold">{{ expr }}</h3>
      <span class="text-sm">{{ beforeUse }} </span>
      <span class="text-sm">- {{ useUrOwnRisk }}</span>
      <span class="text-sm">- {{ havSSH }}</span>
      <span class="text-sm">- {{ havBackup }} </span>
      <span class="text-sm">- {{ havSnapshot }}</span>
    </div>

    <TwoFactorBtn
      v-if="!twoFactorIsEnabled && !twoFactorSetupIsActive && configured2fa"
      :class="['row-start-2 ', 'remove-btn', removeTwoFactorActive ? 'disabled' : '']"
      :btn-name="`${rem2fa}`"
      @btnClick="removeTwoFactor"
      @mouseenter="footerStore.cursorLocation = `${t('twoFactor.rem')} `"
      @mouseleave="footerStore.cursorLocation = ''"
    />
    <TwoFactorCheckLine
      v-if="twoFactorIsEnabled"
      :default-checked="true"
      class="row-start-2"
      :check-text="`${timeBased}`"
      @update="timaBaseActive"
      @mouseenter="footerStore.cursorLocation = `${t('twoFactor.timeBase')} `"
      @mouseleave="footerStore.cursorLocation = ''"
    />
    <TwoFactorCheckLine
      v-if="twoFactorIsEnabled"
      :default-checked="false"
      class="row-start-3"
      :check-text="`${increaseTime}`"
      :multi-line="true"
      @update="orgGenTimeLimit"
      @mouseenter="footerStore.cursorLocation = `${t('twoFactor.timeLimit')} `"
      @mouseleave="footerStore.cursorLocation = ''"
    />
    <TwoFactorCheckLine
      v-if="twoFactorIsEnabled"
      :default-checked="true"
      class="row-start-5"
      :check-text="`${rateLimit}`"
      @update="rateLimiting"
      @mouseenter="footerStore.cursorLocation = `${t('twoFactor.rateLimit')} `"
      @mouseleave="footerStore.cursorLocation = ''"
    />
    <!-- barcode and secret-key are passed as props to TwoFactoSetupBox and they have to bind ':' before theme to bind, at the moment is 
    hardcoded to test -->
    <div
      v-if="twoFactorSetupIsActive && !secretKey"
      class="animation-loading row-start-2 row-span-10 col-start-1 col-span-full flex flex-col justify-center items-center p-2"
    >
      <img src="/animation/servers/loading-2fa.gif" alt="loading" />
      <span class="mt-8 text-gray-300 uppercase font-semibold font-sans">{{ t("twoFactorAuth.plzWait") }}</span>
    </div>
    <TwoFactoSetupBox
      v-if="twoFactorSetupIsActive && secretKey"
      :barcode="authStore.QRcode"
      :secret-key="secretKey"
      :time-based="isTimeBaseActive"
      :class="['row-start-2', !secretKey ? 'disabled' : '']"
      @send-code="sendTheCode"
    />
    <TwoFactorBackup
      v-if="twoFactorSetupIsActive && secretKey"
      :class="['row-start-9', !authStore.validVerificationCode ? 'disabled' : '']"
      @save-backup="onSaveScratch"
      @mouseenter="footerStore.cursorLocation = `${t('twoFactor.confirm')} `"
      @mouseleave="footerStore.cursorLocation = ''"
    />
    <div
      v-if="twoFactorSetupIsActive && secretKey"
      class="row-start-10 row-span-1 col-start-1 col-span-full flex justify-center items-center p-2 mt-2"
    >
      <span class="text-xs text-gray-300 text-left font-sans">{{ t("twoFactorAuth.confirmDesc") }}</span>
    </div>
    <TwoFactorBtn
      v-if="twoFactorIsEnabled"
      :class="['row-start-13', 'col-start-8', twoFactorSetupIsActive && !authStore.scratchCodeSaved ? 'disabled' : '']"
      :btn-name="`${t('twoFactorAuth.nxt')}`"
      @btnClick="startSetup"
      @mouseenter="footerStore.cursorLocation = `${t('twoFactor.next')} `"
      @mouseleave="footerStore.cursorLocation = ''"
    />
    <TwoFactorBtn
      v-if="twoFactorSetupIsActive"
      :class="[
        'row-start-13',
        'col-start-8',
        (twoFactorSetupIsActive && !authStore.scratchCodeSaved) || finishSetupActive ? 'disabled' : '',
      ]"
      :btn-name="`${t('twoFactorAuth.conf')}`"
      @btnClick="startSetup"
      @mouseenter="footerStore.cursorLocation = `${t('twoFactor.confirm')} `"
      @mouseleave="footerStore.cursorLocation = ''"
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
import { useRouter } from "vue-router";
import i18n from "@/includes/i18n";
import { useFooter } from "@/store/theFooter";

const t = i18n.global.t;

const twoFaTtl = t("twoFactorAuth.2faTtl");
const twoFaConf = t("twoFactorAuth.2faConf");
const twoFaSetup = t("twoFactorAuth.2faSetup");
const expr = t("twoFactorAuth.expr");
const beforeUse = t("twoFactorAuth.beforeUse");
const useUrOwnRisk = t("twoFactorAuth.useUrOwnRisk");
const havSSH = t("twoFactorAuth.havSSH");
const havBackup = t("twoFactorAuth.havBackup");
const havSnapshot = t("twoFactorAuth.havSnapshot");
const rem2fa = t("twoFactorAuth.rem2fa");
const timeBased = t("twoFactorAuth.timeBased");
const increaseTime = t("twoFactorAuth.increaseTime");
const rateLimit = t("twoFactorAuth.rateLimit");

const router = useRouter();
const authStore = useTwoFactorAuth();
const controlStore = useControlStore();
const footerStore = useFooter();
//enable two factor authentication
const twoFactorIsEnabled = ref(false);
//setup two factor authentication
const twoFactorSetupIsActive = ref(false);
//first check box value to enable time based authentication
const isTimeBaseActive = ref(true);
//second check box value to increase the original generation time limit
const isOrgGenTimeLimit = ref(false);
//third check box value to enable rate limiting
const isRateLimiting = ref(true);

const verificationOutput = ref("");
const secretKey = ref("");
const configured2fa = ref();

const finishSetupActive = ref(false);
const removeTwoFactorActive = ref(false);

onMounted(() => {
  checkAuth();
  ControlService.addListener("2FAEvents", authenticatorHandler);
});
onUnmounted(() => {
  ControlService.removeListener("2FAEvents", authenticatorHandler);
});

//function to enable two factor authentication
const enableTwoFactor = () => {
  twoFactorIsEnabled.value = true;
  footerStore.cursorLocation = "";
};

//setup button functions
const startSetup = async () => {
  footerStore.cursorLocation = "";
  if (twoFactorIsEnabled.value) {
    //first check box value to enable time based authentication
    twoFactorIsEnabled.value = false;
    twoFactorSetupIsActive.value = true;
    authStore.varificationCode = "";
    authStore.validVerificationCode = false;
    authStore.scratchCodeSaved = false;
    await ControlService.beginAuthSetup(isTimeBaseActive.value, isOrgGenTimeLimit.value, isRateLimiting.value);
  } else {
    //setup two factor authentication
    finishSetupActive.value = true;
    await ControlService.finishAuthSetup();
    loggingOut();
  }
};

const loggingOut = async () => {
  try {
    await ControlService.stopShell();
    await ControlService.logout();
  } catch (e) {}
  router.push("/login").then(() => {
    location.reload();
  });
};

//title manager
const titleManager = computed(() => {
  if (twoFactorIsEnabled.value) {
    return twoFaConf;
  } else if (twoFactorSetupIsActive.value) {
    return twoFaSetup;
  }
  return twoFaTtl;
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

const loadOutput = async (data) => {
  if (data[0] != "skip") {
    secretKey.value = data[1].split(": ").pop();
    if (data.length <= 5) {
      authStore.QRcode = await ControlService.create2FAQRCode({
        type: "totp",
        name: controlStore.ServerName.replace("\n", ""),
        ip: controlStore.ipAddress,
        secret: secretKey.value,
      });
    }
  }

  if (data.length > 5) {
    if (data[0] != "skip") {
      authStore.QRcode = await ControlService.create2FAQRCode({
        type: "hotp",
        name: controlStore.ServerName.replace("\n", ""),
        ip: controlStore.ipAddress,
        secret: secretKey.value,
      });
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
  footerStore.cursorLocation = "";
  if (!removeTwoFactorActive.value) {
    removeTwoFactorActive.value = true;
    await ControlService.removeAuthenticator();
    loggingOut();
  }
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
