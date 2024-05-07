<template>
  <div
    class="2-fa-auth w-full h-full col-start-1 col-span-full row-start-1 row-span-full bg-[#1b1b1d] rounded-md grid grid-cols-24 grid-rows-14 p-2 gap-1"
  >
    <span class="top-ttl row-start-1">{{ titleManager }}</span>
    <TwoFactorBtn
      v-if="!twoFatorIsEnabled && !TwoFactoSetupIsActive"
      class="row-start-2"
      btn-name="Setup"
      @btnClick="enableTwoFactor"
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
    <TwoFactoSetupBox
      v-if="TwoFactoSetupIsActive"
      barcode=""
      secret-key="test"
      :time-based="isTimeBaseActive"
      class="row-start-2"
      @send-code="sendTheCode"
    />
    <TwoFactorBackup v-if="TwoFactoSetupIsActive" class="row-start-7" @save-backup="onSaveBackup" />
    <TwoFactorBtn
      v-if="twoFatorIsEnabled || TwoFactoSetupIsActive"
      class="row-start-13 col-start-8"
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
import { ref, computed } from "vue";
import { useTwoFactorAuth } from "@/store/twoFactorAuth";

const authStore = useTwoFactorAuth();

const twoFatorIsEnabled = ref(false);
const TwoFactoSetupIsActive = ref(false);
const isTimeBaseActive = ref(true);
const isOrgGenTimeLimit = ref(false);
const isRateLimiting = ref(true);

const enableTwoFactor = () => {
  twoFatorIsEnabled.value = true;
};
const startSetup = () => {
  if (twoFatorIsEnabled.value) {
    twoFatorIsEnabled.value = false;
    TwoFactoSetupIsActive.value = true;
  } else {
    console.log("Setup is already active");
  }
};

const titleManager = computed(() => {
  if (twoFatorIsEnabled.value) {
    return "2 FACTOR AUTHENTICATION CONFIGURATION";
  } else if (TwoFactoSetupIsActive.value) {
    return "2 FACTOR SETUP";
  }
  return "2 FACTOR AUTHENTICATION";
});

const timaBaseActive = (value) => {
  isTimeBaseActive.value = value;
  console.log(value);
};

const orgGenTimeLimit = (value) => {
  isOrgGenTimeLimit.value = value;
  console.log(value);
};

const rateLimiting = (value) => {
  isRateLimiting.value = value;
  console.log(value);
};

const sendTheCode = () => {
  console.log("Code sent", authStore.varificationCode);
  authStore.varificationCode = "";
};

const onSaveBackup = () => {
  console.log("Backup saved");
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
</style>
