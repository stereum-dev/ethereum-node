<template>
  <div
    class="col-start-1 col-span-full row-start-4 row-span-2 grid grid-cols-2 grid-rows-2 justify-start items-start space-y-1"
  >
    <div
      v-if="serverStore.isChangingPasswordActive"
      class="col-start-1 col-span-full row-start-1 row-span-full grid grid-cols-2 grid-rows-2 justify-start gap-y-1"
    >
      <div class="h-full col-start-1 col-span-full row-start-1 row-span-1 flex flex-col justify-evenly items-start">
        <label
          for="new"
          :class="{ 'text-red-500': error, 'text-gray-300': !error }"
          class="col-start-1 col-span-full row-start-1 row-span-1 text-xs font-semibold h-fit"
          >New Password</label
        >
        <input
          id="new"
          v-model="serverStore.newPassword"
          type="password"
          :name="password"
          class="col-start-1 col-end-11 row-start-2 row-span-1 w-full h-6 text-xs bg-gray-300 text-gray-700 font-semibold px-2 outline-none border rounded-sm"
          :class="error ? 'border-red-500' : 'border-transparent'"
          placeholder="Enter a new password"
          @input="handleInput"
        />
      </div>
      <div
        class="w-full h-full col-start-1 col-span-full row-start-2 row-span-1 flex flex-col justify-evenly items-start"
      >
        <label
          for="pass"
          :class="{ 'text-red-500': error, 'text-gray-300': !error }"
          class="col-start-1 col-span-full row-start-1 row-span-1 text-xs font-semibold"
        >
          {{ error ? errorMessage : "Verify Password" }}
        </label>
        <div
          class="col-start-1 col-span-full row-start-2 row-span-2 w-full h-full bg-gray-800 rounded-l-md grid grid-cols-12 items-center"
        >
          <input
            id="pass"
            v-model="serverStore.verifyPassword"
            type="password"
            :name="verifyPassword"
            class="col-start-1 col-end-11 w-full h-6 text-xs bg-gray-300 text-gray-700 font-semibold px-2 outline-none border rounded-sm"
            :class="error ? 'border-red-500' : 'border-transparent'"
            placeholder="Enter a new password"
            @input="handleInput"
            @keydown.enter="changePassword"
          />
          <img
            class="col-start-11 col-span-1 w-6 h-6 justify-self-end self-center flex items-center justify-center rounded-sm bg-teal-500 hover:bg-teal-800 p-[3px] shadow-md shadow-black active:shadow-none hover:scale-105 active:scale-95 transition duration-150 ease-in-out cursor-pointer"
            src="/img/icon/access-management/check.png"
            alt="Confirm"
            @click="changePassword"
          />
          <img
            class="col-start-12 col-span-1 w-6 h-6 justify-self-center self-center flex items-center justify-center rounded-sm bg-gray-300 shadow-md shadow-black active:shadow-none hover:scale-105 active:scale-95 transition duration-150 ease-in-out cursor-pointer"
            src="/img/icon/access-management/close.png"
            alt="Cancel"
            @click="denyPassChange"
          />
        </div>
      </div>
    </div>
    <div
      v-else
      class="w-full h-full col-start-1 col-span-1 row-start-1 row-span-1 flex flex-col justify-start items-start space-y-2"
    >
      <span class="text-gray-300 text-xs font-semibold uppercase">Change / Reset Password</span>
      <button
        class="w-full h-full bg-teal-700 hover:bg-teal-900 text-gray-200 font-semibold py-1 px-4 rounded-md flex justify-center items-center cursor-pointer space-x-2 transition-all duration-200 ease-in-out active:scale-95 shadow-lg shadow-black active:shadow-none"
        @click="serverStore.isChangingPasswordActive = true"
      >
        <span class="text-[12px] uppercase font-semibold text-gray-100">Change Password</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useServers } from "@/store/servers";

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
  if (!isPasswordValid(serverStore.newPassword) || !isPasswordValid(serverStore.verifyPassword)) {
    error.value = true;
    errorMessage.value = "Password must be at least 8 characters and not contain spaces";
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
  serverStore.newPassword = "";
  serverStore.verifyPassword = "";
  error.value = false;
  errorMessage.value = "";
  serverStore.isChangingPasswordActive = false;
};
</script>
