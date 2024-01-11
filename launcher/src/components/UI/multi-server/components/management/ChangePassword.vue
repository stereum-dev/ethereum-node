<template>
  <div
    class="col-start-1 col-span-full row-start-4 row-span-2 grid grid-cols-2 grid-rows-2 justify-start items-start space-y-1"
  >
    <div class="h-full col-start-1 col-span-full row-start-1 row-span-1 grid grid-cols-12 grid-rows-2">
      <label
        for="new"
        :class="{ 'text-red-500': error, 'text-gray-300': !error }"
        class="col-start-1 col-span-full row-start-1 row-span-1 text-xs font-semibold"
        >New Password</label
      >
      <input
        id="new"
        v-model="password"
        type="password"
        :name="password"
        class="col-start-1 col-end-11 row-start-2 row-span-1 w-full h-full text-xs bg-gray-300 text-gray-700 font-semibold px-2 outline-none border rounded-sm"
        :class="error ? 'border-red-500' : 'border-transparent'"
        placeholder="Enter a new password"
        @input="handleInput"
      />
    </div>
    <div class="w-full h-full col-start-1 col-span-full row-start-2 row-span-1 grid grid-cols-12 grid-rows-2">
      <label
        for="pass"
        :class="{ 'text-red-500': error, 'text-gray-300': !error }"
        class="col-start-1 col-span-full row-start-1 row-span-1 text-xs font-semibold"
      >
        {{ error ? errorMessage : "Verify Password" }}
      </label>
      <div
        class="col-start-1 col-span-full row-start-2 row-span-1 w-full h-full bg-gray-800 rounded-l-md grid grid-cols-12"
      >
        <input
          id="pass"
          v-model="verifyPassword"
          type="password"
          :name="verifyPassword"
          class="col-start-1 col-end-11 w-full h-full text-xs bg-gray-300 text-gray-700 font-semibold px-2 outline-none border rounded-sm"
          :class="error ? 'border-red-500' : 'border-transparent'"
          placeholder="Enter a new password"
          @input="handleInput"
          @keydown.enter="changePassword"
        />
        <img
          class="col-start-11 col-span-1 w-6 h-full justify-self-end self-center flex items-center justify-center rounded-sm bg-teal-500 hover:bg-teal-800 p-[3px] shadow-md shadow-black active:shadow-none hover:scale-105 active:scale-95 transition duration-150 ease-in-out cursor-pointer"
          src="/img/icon/access-management/check.png"
          alt="Confirm"
          @click="changePassword"
        />
        <img
          class="col-start-12 col-span-1 w-6 h-full justify-self-center self-center flex items-center justify-center rounded-sm bg-gray-300 shadow-md shadow-black active:shadow-none hover:scale-105 active:scale-95 transition duration-150 ease-in-out cursor-pointer"
          src="/img/icon/access-management/close.png"
          alt="Cancel"
          @click="denyPassChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["changePassword"]);

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
  if (!isPasswordValid(password.value) || !isPasswordValid(verifyPassword.value)) {
    error.value = true;
    errorMessage.value = "Password must be at least 8 characters and not contain spaces.";
    return;
  }

  if (password.value !== verifyPassword.value) {
    error.value = true;
    errorMessage.value = "Passwords do not match.";
    return;
  }

  emit("changePassword", password.value.trim());
};

const denyPassChange = () => {
  password.value = "";
  verifyPassword.value = "";
  error.value = false;
  errorMessage.value = "";
};
</script>
