<template>
  <div class="col-start-1 col-span-full row-start-4 row-span-1 flex flex-col justify-start items-start space-y-1">
    <label for="pass" :class="{ 'text-red-500': error, 'text-gray-300': !error }" class="text-xs font-semibold">
      {{ error ? errorMessage : "Change Password" }}
    </label>
    <div class="w-full h-full bg-gray-800 rounded-l-md grid grid-cols-12">
      <input
        id="pass"
        v-model="password"
        type="text"
        :name="password"
        class="col-start-1 col-end-11 w-full h-full text-xs bg-gray-300 text-gray-700 font-semibold px-2 outline-none border"
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
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["changePassword"]);

const password = ref("");
const error = ref(false);
const errorMessage = ref("");

const validatePassword = () => {
  if (password.value.trim().length < 8) {
    error.value = true;
    errorMessage.value = "Entered password is not valid.";
  } else {
    error.value = false;
    errorMessage.value = "";
  }
};

const handleInput = (event) => {
  password.value = event.target.value.trim();
  validatePassword();
};

const changePassword = () => {
  if (!error.value && password.value.trim() !== "") {
    const pass = password.value.trim();
    emit("changePassword", pass);
  }
};

const denyPassChange = () => {
  password.value = "";
  error.value = false;
  errorMessage.value = "";
};
</script>
