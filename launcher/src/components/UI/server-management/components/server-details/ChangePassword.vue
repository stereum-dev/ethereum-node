<template>
  <div class="col-start-1 col-span-full row-start-4 row-span-full grid grid-cols-2 grid-rows-4 justify-start items-start space-y-1">
    <div class="w-full h-full col-start-1 col-span-full row-start-1 row-span-1 flex justify-center items-center">
      <span v-if="!error" class="text-gray-300 text-md font-semibold uppercase">{{ $t("multiServer.chngResPass") }}</span>
      <span
        v-else
        :class="{ 'text-red-500': error, 'text-gray-300': !error }"
        class="col-start-1 col-span-full row-start-1 row-span-1 text-xs font-semibold"
      >
        {{ error ? errorMessage : "" }}
      </span>
    </div>
    <div
      v-if="serverStore.isChangingPasswordActive"
      class="w-full h-full col-start-1 col-span-full row-start-2 row-span-full grid grid-cols-2 grid-rows-2 justify-start gap-y-1"
    >
      <div class="h-full col-start-1 col-span-full row-start-1 row-span-1 flex flex-col justify-evenly items-start">
        <input
          id="new"
          v-model="serverStore.newPassword"
          type="password"
          :name="password"
          class="w-full h-8 text-sm col-start-1 col-end-11 row-start-2 row-span-1 bg-gray-300 text-gray-700 font-semibold px-2 outline-none border rounded-sm"
          :class="error ? 'border-red-500' : 'border-transparent'"
          :placeholder="`${$t('multiServer.EnterNewPass')}`"
          @mouseenter="footerStore.cursorLocation = `${t('serverDetail.confirmPass')}`"
          @mouseleave="footerStore.cursorLocation = ''"
          @input="handleInput"
        />
      </div>
      <div class="w-full h-full col-start-1 col-span-full row-start-2 row-span-1 flex flex-col justify-evenly items-start">
        <div class="col-start-1 col-span-full row-start-2 row-span-2 w-full h-full rounded-md grid grid-cols-12 items-center">
          <input
            id="pass"
            v-model="serverStore.verifyPassword"
            type="password"
            :name="verifyPassword"
            class="col-start-1 col-span-full w-full h-8 text-sm bg-gray-300 text-gray-700 font-semibold px-2 outline-none border rounded-sm"
            :class="error ? 'border-red-500' : 'border-transparent'"
            :placeholder="`${$t('multiServer.verifyPass')}`"
            @mouseenter="footerStore.cursorLocation = `${t('serverDetail.confirmPass2')}`"
            @mouseleave="footerStore.cursorLocation = ''"
            @input="handleInput"
            @keydown.enter="changePassword"
          />
        </div>
      </div>
      <div class="w-full h-full col-start-1 col-span-full row-start-3 row-span-1 flex justify-center items-center space-x-4 py-1">
        <div
          class="w-1/3 h-7 flex items-center justify-center rounded-sm bg-teal-800 hover:bg-teal-950 p-[3px] border border-teal-800 hover:border-gray-200 shadow-md shadow-black active:shadow-none active:scale-95 transition duration-150 ease-in-out cursor-pointer text-gray-100 text-sm font-semibold uppercase"
          @click="changePassword"
          @mouseenter="footerStore.cursorLocation = `${t('serverDetail.confirmBtn')}`"
          @mouseleave="footerStore.cursorLocation = ''"
        >
          Confirm
        </div>
        <div
          class="w-1/3 h-7 flex items-center justify-center rounded-sm bg-red-800 hover:bg-red-950 p-[3px] border border-red-800 hover:border-gray-200 shadow-md shadow-black active:shadow-none active:scale-95 transition duration-150 ease-in-out cursor-pointer text-gray-100 text-sm font-semibold uppercase"
          @click="denyPassChange"
          @mouseenter="footerStore.cursorLocation = `${t('serverDetail.cancel')}`"
          @mouseleave="footerStore.cursorLocation = ''"
        >
          Cancel
        </div>
      </div>
    </div>
    <div v-else class="w-full h-full col-start-1 col-span-full row-start-2 row-span-1 flex justify-center items-center">
      <button
        class="w-full h-10 bg-teal-700 hover:bg-teal-900 text-gray-200 font-semibold py-1 px-4 rounded-md flex justify-center items-center cursor-pointer space-x-2 transition-all duration-200 ease-in-out active:scale-95 shadow-lg shadow-black active:shadow-none"
        @mouseenter="footerStore.cursorLocation = `${t('serverDetail.chngPass')}`"
        @mouseleave="footerStore.cursorLocation = ''"
        @click="(serverStore.isChangingPasswordActive = true), (footerStore.cursorLocation = '')"
      >
        <span class="text-md uppercase font-semibold text-gray-100">{{ t("multiServer.chngPass") }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useServers } from "@/store/servers";
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";

const t = i18n.global.t;

const footerStore = useFooter();

const emit = defineEmits(["changePassword"]);

const serverStore = useServers();
const password = ref("");
const verifyPassword = ref("");
const error = ref(false);
const errorMessage = ref("");

const isPasswordValid = (pass) => {
  return pass.length >= 8 && !/\s/.test(pass);
};

const handleInput = () => {
  error.value = false;
  errorMessage.value = "";
};

const changePassword = () => {
  footerStore.cursorLocation = "";
  if (!isPasswordValid(serverStore.newPassword) || !isPasswordValid(serverStore.verifyPassword)) {
    error.value = true;
    errorMessage.value = "Password must be at least 8 characters and contain no spaces";
    return;
  }

  if (serverStore.newPassword !== serverStore.verifyPassword) {
    error.value = true;
    errorMessage.value = "Passwords do not match";
    return;
  }

  emit("changePassword", serverStore.newPassword.trim());
};

const denyPassChange = () => {
  footerStore.cursorLocation = "";
  serverStore.newPassword = "";
  serverStore.verifyPassword = "";
  error.value = false;
  errorMessage.value = "";
  serverStore.isChangingPasswordActive = false;
};
</script>
