<template>
  <div
    class="w-full h-5/6 rounded-md bg-[#393939] col-start-1 col-span-full row-span-6 grid-cols-12 grid-rows-6 grid p-2 items-center justify-center"
  >
    <div
      class="secret-key-row w-full h-5/6 col-start-1 col-span-full row-start-1 row-span-1 bg-[#A0A0A0] rounded-lg flex justify-start items-center"
    >
      <span class="w-40 h-full text-xs text-black flex justify-normal items-center pl-2">Your secret key is:</span>
      <div class="key-code w-[65%] bg-black h-full flex justify-center items-center rounded-lg text-gray-50 pl-2 text-xs">
        {{ !props.secretKey ? "wait..." : props.secretKey }}
      </div>
    </div>
    <div
      class="secret-key-row w-full h-5/6 col-start-1 col-span-full row-start-2 row-span-1 bg-[#A0A0A0] rounded-lg flex justify-start items-center relative"
    >
      <span class="w-40 h-full text-xs text-black flex justify-normal items-center pl-2"
        >Your verification code is:</span
      >
      <input
        v-model="authStore.varificationCode"
        type="text"
        class="key-code w-[65%] bg-black h-full flex justify-center items-center rounded-lg text-gray-50 pl-2 text-xs"
      />
      <div
        v-if="props.timeBased"
        class="send-btn w-16 h-[95%] rounded-xl text-xs uppercase bg-teal-700 hover:bg-teal-900 flex justify-center items-center text-gray-100 cursor-pointer absolute right-0"
        @click="sendCode"
      >
        <span>send</span>
      </div>
    </div>
    <span
      class="row-start-3 row-span-1 col-start-1 col-end-9 flex justify-start items-end pl-2 text-left text-2xs text-gray-100 w-full h-full"
      >SCAN THE CODE WITH YOUR AUTHENTICATOR APP</span
    >
    <span
      class="row-start-4 row-span-1 col-start-1 col-end-9 flex justify-strat items-end pl-2 text-left text-2xs text-gray-100 w-full h-full"
      >CLICK TO ENLARGEN</span
    >
    <div
      class="barcode-box w-full h-full flex justify-center items-center col-start-9 col-span-4 row-start-3 row-span-full"
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

const authStore = useTwoFactorAuth();

const emit = defineEmits(["sendCode"]);

const props = defineProps({
  timeBased: { type: Boolean, default: true },
  barcode: { type: String, default: "" },
  secretKey: { type: String, default: "" },
});

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
