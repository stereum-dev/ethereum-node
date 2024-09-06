<template>
  <div
    class="w-full h-5/6 rounded-md col-start-1 bg-[#393939] col-span-full row-start-1 row-span-8 grid-cols-12 grid-rows-6 grid p-2 items-center justify-center relative"
  >
    <div
      class="secret-key-row w-full h-5/6 col-start-1 col-span-full row-start-1 row-span-1 bg-[#A0A0A0] rounded-full flex justify-start items-center"
    >
      <span class="w-[32%] h-full text-2xs font-bold text-black flex justify-normal items-center pl-2">{{
        t("twoFactorAuth.urSecret")
      }}</span>
      <div
        class="key-code w-[68%] h-full bg-black flex justify-between items-center rounded-full text-gray-300 pl-2 text-xs rounded-l-none"
      >
        {{ !props.secretKey ? wait : props.secretKey }}
        <div
          class="send-btn w-16 h-[95%] rounded-xl text-2xs uppercase bg-teal-700 hover:bg-teal-900 flex justify-center items-center text-gray-100 cursor-pointer right-[1px]"
          @click="copyKey"
          @mouseenter="footerStore.cursorLocation = `${t('twoFactor.copy')} `"
          @mouseleave="footerStore.cursorLocation = ''"
        >
          <span>{{ !copy ? t("twoFactorAuth.copyBtn") : t("twoFactorAuth.copied") }}</span>
        </div>
      </div>
    </div>
    <div
      class="secret-key-row w-full h-5/6 col-start-1 col-span-full row-start-6 mt-3 row-span-1 bg-[#A0A0A0] rounded-full flex justify-start items-center relative"
    >
      <span class="w-[32%] h-full text-2xs font-bold text-black flex justify-normal items-center pl-2">{{
        t("twoFactorAuth.enterCode")
      }}</span>
      <input
        v-model="authStore.varificationCode"
        type="text"
        placeholder="Enter Code Here"
        class="key-code w-[68%] bg-black h-full flex justify-center items-center rounded-full text-gray-50 pl-2 text-xs rounded-l-none"
      />
      <div
        v-if="props.timeBased"
        class="send-btn w-16 h-[95%] rounded-xl text-2xs uppercase bg-teal-700 hover:bg-teal-900 flex justify-center items-center text-gray-100 cursor-pointer absolute right-[1px]"
        @click="sendCode"
        @mouseenter="footerStore.cursorLocation = `${t('twoFactor.send')} `"
        @mouseleave="footerStore.cursorLocation = ''"
      >
        <span>{{ t("twoFactorAuth.send") }}</span>
      </div>
    </div>
    <div class="col-start-1 col-end-10 row-start-2 row-span-2 w-full h-full grid grid-cols-2 grid-rows-2 py-2">
      <span class="col-start-1 col-span-full row-start-1 row-span-1 text-left text-xs text-gray-200 w-full h-full"
        ><ol>
          <li>1. {{ t("twoFactorAuth.scanCode") }}</li>
          <li>2. {{ t("twoFactorAuth.enterCodeApp") }}</li>
          <li>3. {{ t("twoFactorAuth.doBackup") }}</li>
          <li>4. {{ t("twoFactorAuth.confirm2fa") }}</li>
        </ol>
        <br />
        {{ t("twoFactorAuth.2faAlarm") }}</span
      >
      <!-- <span class="col-start-1 col-span-full row-start-2 row-span-1 text-left text-xs text-gray-200 w-full h-full"
        >CLICK TO ENLARGEN</span
      > -->
    </div>

    <div
      class="barcode-box w-full h-full flex justify-center items-center col-start-10 col-span-full row-start-2 row-span-full cursor-pointer"
      @click="barcodeModal"
      @mouseenter="footerStore.cursorLocation = `${t('twoFactor.zoomQr')} `"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <img
        :src="props.barcode ? props.barcode : '/img/icon/base-header-icons/notification-modal-dummy-qr-code.png'"
        class="w-20 h-20"
        alt="2fa barcode"
      />
    </div>
  </div>
</template>
<script setup>
import { useTwoFactorAuth } from "@/store/twoFactorAuth";
import i18n from "@/includes/i18n";
import { useFooter } from "@/store/theFooter";
import { ref, watch } from "vue";

const t = i18n.global.t;

const wait = t("twoFactorAuth.wait");

const footerStore = useFooter();
const authStore = useTwoFactorAuth();

const emit = defineEmits(["sendCode"]);

const props = defineProps({
  timeBased: { type: Boolean, default: true },
  barcode: { type: String, default: "" },
  secretKey: { type: String, default: "" },
});

const copy = ref(false);

watch(copy, () => {
  setTimeout(() => {
    copy.value = false;
  }, 2000);
});

const barcodeModal = () => {
  authStore.isBarcodeModalActive = true;
  footerStore.cursorLocation = "";
};

const copyKey = () => {
  let generatedSecretKey = props.secretKey;
  navigator.clipboard
    .writeText(generatedSecretKey)
    .then(() => {
      copy.value = true;
    })
    .catch(() => {
      copy.value = false;
    });
};

const sendCode = () => {
  emit("sendCode");
};
</script>
<style scoped>
.send-btn:active {
  box-shadow: 1px 1px 10px 1px #171717 inset;
}
.send-btn:active span {
  transform: scale(0.95);
}
</style>
