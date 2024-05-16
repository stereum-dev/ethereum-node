<template>
  <div
    class="w-full h-5/6 rounded-md col-start-1 bg-[#393939] col-span-full row-start-1 row-span-8 grid-cols-12 grid-rows-6 grid p-2 items-center justify-center relative"
    :class="isLoading ? 'z-0' : ''"
  >
    <div
      v-if="isLoading"
      class="w-full h-full absolute inset-0 z-20 rounded-sm flex justify-center items-center"
      :class="props.secretKey === '' ? 'bg-black opacity-90' : ''"
    >
      <img class="z-30" src="/animation/servers/loading-2fa.gif" alt="Loading" />
    </div>
    <div
      class="secret-key-row w-full h-5/6 col-start-1 col-span-full row-start-1 row-span-1 bg-[#A0A0A0] rounded-full flex justify-start items-center"
    >
      <span class="w-[40%] h-full text-xs text-black flex justify-normal items-center pl-2">Your secret key is:</span>
      <div
        class="key-code w-[60%] h-full bg-black flex justify-center items-center rounded-full text-gray-300 pl-2 text-xs rounded-l-none"
      >
        {{ !props.secretKey ? "Wait..." : props.secretKey }}
      </div>
    </div>
    <div
      class="secret-key-row w-full h-5/6 col-start-1 col-span-full row-start-2 row-span-1 bg-[#A0A0A0] rounded-full flex justify-start items-center relative"
    >
      <span class="w-[40%] h-full text-xs text-black flex justify-normal items-center pl-2"
        >Enter verification code :</span
      >
      <input
        v-model="authStore.varificationCode"
        type="text"
        class="key-code w-[60%] bg-black h-full flex justify-center items-center rounded-full text-gray-50 pl-2 text-xs rounded-l-none"
      />
      <div
        v-if="props.timeBased"
        class="send-btn w-16 h-[95%] rounded-xl text-xs uppercase bg-teal-700 hover:bg-teal-900 flex justify-center items-center text-gray-100 cursor-pointer absolute right-[1px]"
        @click="sendCode"
      >
        <span>send</span>
      </div>
    </div>
    <div class="col-start-1 col-end-10 row-start-3 row-span-2 w-full h-full grid grid-cols-2 grid-rows-2 py-2">
      <span class="col-start-1 col-span-full row-start-1 row-span-1 text-left text-xs text-gray-200 w-full h-full"
        ><ol>
          <li>1. Scan the code with your authenticator app</li>
          <li>2. Enter the verification code an click send</li>
          <li>3. Do a backup by pressing the save button</li>
          <li>4. Finally click on confirm to activate 2FA</li>
        </ol>
        <br />
        You will be logged out as soon as you click the final confirm button. The next login requires 2FA.
      </span>
      <!-- <span class="col-start-1 col-span-full row-start-2 row-span-1 text-left text-xs text-gray-200 w-full h-full"
        >CLICK TO ENLARGEN</span
      > -->
    </div>

    <div
      class="barcode-box w-full h-full flex justify-center items-center col-start-10 col-span-full row-start-3 row-span-full"
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
import { computed } from "vue";

const authStore = useTwoFactorAuth();

const emit = defineEmits(["sendCode"]);

const props = defineProps({
  timeBased: { type: Boolean, default: true },
  barcode: { type: String, default: "" },
  secretKey: { type: String, default: "" },
});

const isLoading = computed(() => {
  let output = false;
  if (props.secretKey === "") {
    output = true;
  }
  return output;
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
