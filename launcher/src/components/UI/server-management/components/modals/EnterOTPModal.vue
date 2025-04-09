<template>
  <div class="layer1 fixed inset-0 flex justify-center items-center">
    <div class="layer2 absolute bg-black opacity-80 inset-0 z-0" @click="closeWindow"></div>

    <div
      class="layer3 absolute z-30 w-2/3 min-h-[400px] py-2 px-2 mx-auto my-auto rounded-3xl shadow-lg border-4 border-gray-400 bg-[#1c1d1d]"
    >
      <div
        v-if="serverStore.isOTPVerifying"
        class="absolute inset-0 bg-white bg-opacity-60 z-40 h-full w-full flex items-center justify-center rounded-3xl"
      >
        <div class="flex items-center">
          <span class="text-3xl mr-4 z-50">Verifying...</span>
          <svg class="animate-spin h-8 w-8 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      </div>
      <div class="flex flex-col justify-between gap-5">
        <div class="text-center p-2 flex-auto justify-center space-y-4">
          <img class="-m-1 flex items-center text-red-500 mx-auto w-24" src="/img/icon/server-management-icons/2fa.png" alt="2FA Icon" />

          <div class="text-xl font-bold py-2 text-gray-200 uppercase">
            {{ t("twoFactorAuth.2faTtl") }}
          </div>

          <div class="2fa-content-parent w-full h-full grid grid-cols-24 grid-rows-6 items-center">
            <span class="col-start-5 col-end-21 row-start-1 row-end-3 text-md text-center text-gray-300">
              {{ t("twoFactorAuth.has2fa") }}
            </span>
            <input
              ref="passwordInput"
              v-model="password"
              type="text"
              class="col-start-6 col-end-20 row-start-5 row-span-2 h-full rounded-lg px-2 text-md text-gray-800"
              placeholder="Enter OTP"
            />
          </div>
        </div>

        <div class="flex justify-end text-md font-bold py-3 mt-2 text-center space-y-4 relative">
          <button
            class="w-[8rem] mr-2 px-5 py-2 shadow-sm rounded-full hover:shadow-lg transition-all duration-300 ease-in-out hover:scale-110 active:scale-100 text-gray-200 font-semibold uppercase bg-green-500 border border-green-500 hover:bg-green-600"
            :class="{ 'opacity-40 pointer-events-none': btnDisabled }"
            @click="handleEnter($event)"
            @keydown.enter="handleEnter($event)"
          >
            {{ t("twoFactorAuth.submit") }}
          </button>
          <span class="absolute bottom-1 left-[17rem] text-xs flex justify-center items-center text-red-500 mx-auto">
            {{ t("deleteModal.close") }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMagicKeys } from "@vueuse/core";
import { ref, computed, onMounted, nextTick, watch } from "vue";
import i18n from "@/includes/i18n";
import { useServers } from "../../../../../store/servers";

const emit = defineEmits(["submitAuth", "close-window"]);

const serverStore = useServers();
const password = ref("");
const passwordInput = ref(null);
const t = i18n.global.t;
const { current } = useMagicKeys();

const keys = computed(() => Array.from(current));
const btnDisabled = computed(() => !password.value);

watch(
  () => keys.value,
  () => {
    handleEnter({ type: keys.value[0] });
  }
);

const closeWindow = () => {
  password.value = "";
  emit("close-window");
};

const handleEnter = (event) => {
  if ((event.type === "enter" || event.type === "click") && !btnDisabled.value) {
    serverStore.isOTPVerifying = true;
    emit("submitAuth", password.value);
    password.value = "";
  }
};

onMounted(() => {
  nextTick(() => {
    passwordInput.value?.focus();
  });
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
