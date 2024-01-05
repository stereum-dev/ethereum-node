import { V2_MetaFunction } from "@remix-run/react"; import { computed } from 'vue';
<template>
  <div class="w-full h-full col-start-1 col-span-full row-start-1 row-span-full flex justify-center items-center">
    <form class="w-full h-full grid grid-cols-12 grid-rows-7 space-y-1">
      <div class="col-start-1 col-span-full row-start-1 row-span-1 grid grid-cols-12 grid-rows-3">
        <label
          for="servername"
          class="col-start-1 col-span-full row-start-1 row-span-1 block text-gray-300 text-xs font-bold"
          >Server Name</label
        >
        <input
          id="servername"
          type="text"
          placeholder="Server Name"
          class="h-8 self-center col-start-1 col-end-10 row-start-2 row-span-2 shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />

        <div class="w-full h-full col-start-10 col-span-full row-start-2 row-span-2 flex justify-evenly items-center">
          <img
            class="w-8 hover:scale-110 active:scale-100 transition-all ease-in-out duration-200 cursor-pointer self-center border-4 border-gray-400 rounded-full shadow-md shadow-[#141414]"
            :src="getTrashImg"
            alt=""
            @mousedown.prevent
            @mouseenter="hovered = true"
            @mouseleave="hovered = false"
          />
          <img
            class="w-8 hover:scale-110 active:scale-100 transition-all ease-in-out duration-200 cursor-pointer self-center border-4 border-gray-400 rounded-full shadow-md shadow-[#141414]"
            src="/img/icon/PLUS_ICON.png"
            alt="icon"
            @mousedown.prevent
            @click="saveServer"
          />
        </div>
      </div>
      <div class="col-start-1 col-end-7 row-start-2 row-span-1 grid grid-cols-12 grid-rows-3 mr-1">
        <label
          for="hostname"
          class="col-start-1 col-span-full row-start-1 row-span-1 block text-gray-300 text-xs font-bold mb-2"
          >IP or Hostname</label
        >
        <input
          id="hostname"
          type="text"
          placeholder="114.72.86.90"
          class="h-8 self-center col-start-1 col-span-full row-start-2 row-span-2 shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div class="col-start-7 col-span-full row-start-2 row-span-1 grid grid-cols-12 grid-rows-3">
        <label
          for="port"
          class="col-start-1 col-span-full row-start-1 row-span-1 block text-gray-300 text-xs font-bold mb-2"
          >Port</label
        >
        <input
          id="port"
          type="text"
          placeholder="4000"
          class="h-8 self-center col-start-1 col-span-full row-start-2 row-span-2 shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div class="col-start-1 col-end-7 row-start-3 row-span-1 grid grid-cols-12 grid-rows-3">
        <label
          for="username"
          class="col-start-1 col-span-full row-start-1 row-span-1 block text-gray-300 text-xs font-bold mb-2"
          >Username</label
        >
        <input
          id="username"
          type="text"
          placeholder="root"
          class="h-8 self-center col-start-1 col-span-full row-start-2 row-span-2 shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div class="col-start-7 col-span-full row-start-3 row-span-1 grid grid-cols-12 grid-rows-3">
        <span
          class="w-full col-start-1 col-span-full row-start-1 row-span-1 text-gray-300 font-semibold text-xs ml-1 capitalize text-center"
          >{{ $t("formsetup.usessh") }}</span
        >

        <label
          for="AcceptConditions"
          class="col-start-6 col-end-9 row-start-2 row-span-full self-center relative h-6 w-12 cursor-pointer [-webkit-tap-highlight-color:_transparent] flex justify-center items-center"
        >
          <input
            id="AcceptConditions"
            v-model="useAuthKey"
            type="checkbox"
            class="peer sr-only [&:checked_+_span_svg[data-checked-icon]]:block [&:checked_+_span_svg[data-unchecked-icon]]:hidden"
            @change="changeLabel"
          />

          <span
            class="absolute inset-y-0 start-0 z-10 m-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-gray-400 transition-all peer-checked:start-6 peer-checked:text-green-600"
          >
            <svg
              data-unchecked-icon
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>

            <svg
              data-checked-icon
              xmlns="http://www.w3.org/2000/svg"
              class="hidden h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </span>

          <span class="absolute inset-0 rounded-full bg-gray-300 transition peer-checked:bg-green-500"></span>
        </label>
      </div>

      <div class="col-start-1 col-span-full row-start-4 row-span-1 grid grid-cols-12 grid-rows-3">
        <label
          for="password"
          class="col-start-1 col-span-full row-start-1 row-span-1 block text-gray-300 text-xs font-bold"
          >Password</label
        >
        <input
          id="password"
          type="password"
          class="h-8 self-center col-start-1 col-span-full row-start-2 row-span-2 shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="******************"
        />
      </div>
      <div class="col-start-1 col-span-full row-start-5 row-span-1 grid grid-cols-12 grid-rows-3">
        <label
          for="keypath"
          class="col-start-1 col-span-full row-start-1 row-span-1 block text-gray-300 text-xs font-bold"
          >Key Path</label
        >
        <input
          id="keypath"
          type="text"
          placeholder="/home/user/.ssh/id_rsa"
          class="h-8 self-center col-start-1 col-span-full row-start-2 row-span-2 shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div class="col-start-1 col-span-full row-start-7 row-span-1 flex justify-center items-center px-2 py-1">
        <button
          class="w-full h-8 bg-gray-200 hover:bg-teal-700 text-gray-700 hover:text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline active:scale-95 transition-all ease-in-out duration-100"
          type="button"
        >
          Login
        </button>
      </div>
    </form>
    <!-- <div class="flex items-center justify-between">
      <div class="inline-flex items-center">
        <input id="usesshkey" type="checkbox" class="form-checkbox h-5 w-5 text-green-600" checked /><span
          class="ml-2 text-gray-300 text-sm"
          >Use SSH Key</span
        >
      </div>
    </div>
    <button
      class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      type="button"
    >
      Login
    </button> -->

    <!-- <div v-if="alertBox" class="alert animate__animated animate__flipInX">
      {{ $t("formsetup.fillFields") }}
    </div>

    <div
      v-if="connectingAnimActive"
      class="col-start-1 col-span-full row-start-1 row-span-full flex flex-col justify-center items-center z-20"
    >
      <div class="w-full h-full absolute inset-0 bg-black rounded-md opacity-80"></div>
      <div class="w-full h-full flex flex-col justify-center items-center space-y-4 z-50">
        <img src="/img/icon/form-setup/anim3.gif" alt="anim" />
        <div
          class="w-[150px] h-12 bg-red-500 py-2 px-4 rounded-full shadow-md shadow-[#161515] hover:scale-110 active:scale-100 hover:bg-red-700 flex justify-center items-center cursor-pointer transition-all duration-200 ease-in-out"
          @click="cancelLogin"
        >
          <span class="text-gray-200 text-xl font-semibold uppercase">Cancel</span>
        </div>
      </div>
    </div>
    <div class="col-start-4 col-end-22 row-start-3 row-end-11 bg-[#1a2e2c] rounded-lg p-4">
      <RemoveModal v-if="bDialogVisible" @remove-handler="baseDialogDelete" @close-window="hideBDialog" />
      <ErrorModal v-if="errorMsgExists" :description="error" @close-window="closeErrorDialog" />
      <form
        class="w-full h-full p-1 bg-[#305c59] col-start-1 col-span-full row-start-1 row-span-full grid grid-cols-12 grid-rows-7 gap-y-2"
        @submit.prevent.stop="login"
      >
        <div
          class="w-full col-start-1 col-span-full row-start-1 row-span-1 h-12 bg-[#1a2e2c] p-2 grid grid-cols-12 rounded-full"
        >
          <div class="col-start-1 col-span-10 h-full">
            <select
              v-model="selectedName"
              class="w-full h-full rounded-full px-2 text-md text-gray-800 font-semibold"
              @change="setSelectedConnection($event)"
            >
              <option value="" disabled>Select your Server-Connection</option>
              <option v-for="connection in connections" :key="connection.name" :value="connection.name">
                {{ connection.name }}
              </option>
            </select>
          </div>
          <div
            class="w-8 h-8 bg-slate-500 rounded-full flex justify-center items-center cursor-pointer hover:bg-slate-400 justify-self-end"
            @click.prevent="addModel"
          >
            <img
              class="w-6 h-6 hover:scale-110 active:scale-100 transition-all ease-in-out duration-200"
              src="/img/icon/PLUS_ICON.png"
              alt="icon"
              @mousedown.prevent
            />
          </div>
          <div
            class="w-8 h-8 bg-slate-500 rounded-full flex justify-center items-center cursor-pointer hover:bg-slate-400 justify-self-end"
            @click.prevent="showBDialog"
            @mouseover="mouseOver('over')"
            @mouseleave="mouseOver('leave')"
          >
            <img
              class="w-6 h-6 hover:scale-110 active:scale-100 transition-all ease-in-out duration-200"
              :src="imgTrash"
              alt=""
              @mousedown.prevent
            />
          </div>
        </div>
        <div
          class="w-full col-start-1 col-span-full row-start-2 row-span-1 h-12 bg-[#1a2e2c] p-2 grid grid-cols-12 rounded-full"
          :class="{ errors: !model.name.isFilled }"
        >
          <span class="w-full col-start-1 col-span-3 text-sm text-gray-300 font-semibold self-center pl-2">{{
            $t("formsetup.servername")
          }}</span>

          <input
            v-model="model.name.value"
            class="col-start-4 col-span-full w-full h-full rounded-full px-2"
            :class="{
              notFilled: !model.host.isFilled,
              isFilled: model.host.isFilled,
            }"
            name="servername"
            type="text"
            @blur="checkInput(model.name)"
          />
        </div>
        <div
          class="w-full col-start-1 col-span-full row-start-3 row-span-1 h-12 bg-[#1a2e2c] p-2 grid grid-cols-12 rounded-full"
          :class="{ errors: !model.host.isFilled }"
        >
          <span class="w-full col-start-1 col-span-3 text-sm text-gray-300 font-semibold self-center pl-2">{{
            $t("formsetup.iphost")
          }}</span>

          <div
            class="col-start-4 col-span-1 w-8 h-8 rounded-full border-4 border-slate-500 bg-gray-200 flex justify-center items-center p-1 cursor-pointer hover:border-slate-400 shadow-md shadow-[#1c2122]"
            @click="ipScanModal = true"
          >
            <img class="w-4 h-4 hover:scale-110 active:scale-100" src="/img/icon/form-setup/local-lan.png" alt="" />
          </div>
          <input
            v-model="model.host.value"
            class="col-start-5 col-span-7 w-full h-full rounded-l-full border-r border-gray-400 px-2"
            :class="{
              notFilled: !model.host.isFilled,
              isFilled: model.host.isFilled,
            }"
            name="host"
            type="text"
            required
            @blur="checkInput(model.host)"
          />
          <input
            v-model="model.port.value"
            class="col-start-12 col-span-1 w-full h-full self-center flex justify-center items-center bg-gray-300 rounded-r-full cursor-pointer px-1"
            :class="{
              notFilled: !model.port.isFilled,
              isFilled: model.port.isFilled,
            }"
            type="text"
            placeholder="22"
            optional
            @blur="checkInput(model.port)"
          />
        </div>
        <div
          class="w-full col-start-1 col-span-full row-start-4 row-span-1 h-12 bg-[#1a2e2c] p-2 grid grid-cols-12 rounded-full"
          :class="{
            errors: !model.user.isFilled,
            isFilled: model.user.isFilled,
          }"
        >
          <span class="w-full col-start-1 col-span-3 text-sm text-gray-300 font-semibold self-center pl-2">{{
            $t("formsetup.username")
          }}</span>

          <input
            v-model="model.user.value"
            class="col-start-4 col-span-full w-full h-full rounded-full px-2"
            :class="{
              notFilled: !model.user.isFilled,
              isFilled: model.user.isFilled,
            }"
            type="text"
            name="user"
            required
            @blur="checkInput(model.user)"
          />
        </div>

        <Transition name="slide-up">
          <div
            v-if="keyAuth"
            class="col-start-1 col-span-full row-start-5 row-span-2 gap-y-2 grid grid-cols-12 grid-rows-2"
          >
            <div
              class="w-full col-start-1 col-span-full row-start-1 row-span-1 h-12 bg-[#1a2e2c] p-2 grid grid-cols-12 rounded-full cursor-default"
              :class="{
                errors: keyAuth ? !model.keylocation.isFilled : !model.pass.isFilled,
              }"
            >
              <span class="col-start-1 col-span-3 text-sm text-gray-300 font-semibold self-center pl-2">{{
                $t("formsetup.keylocation")
              }}</span>

              <input
                v-model="model.keylocation.value"
                class="col-start-4 col-span-8 w-full h-full rounded-l-full px-2"
                type="text"
                name="keylocation"
                required
                @blur="checkInput(model.keylocation)"
              />
              <div
                class="col-start-12 col-span-1 bg-gray-300 rounded-r-full flex justify-center items-center"
                @click="openUploadHandler"
              >
                <input ref="fileInput" type="file" style="display: none" @change="previewFiles" />
                <img class="w-4 h-4" src="/img/icon/form-setup/plus.png" />
              </div>
            </div>
            <div
              class="w-full col-start-1 col-span-full row-start-2 row-span-1 h-12 bg-[#1a2e2c] p-2 grid grid-cols-12 rounded-full cursor-default"
              :class="{
                errors: keyAuth ? !model.keylocation.isFilled : !model.passphrase.isFilled,
              }"
            >
              <span class="col-start-1 col-span-3 text-sm text-gray-300 font-semibold self-center pl-2">{{
                $t("formsetup.KeyPassphrase")
              }}</span>
              <input
                v-model="model.passphrase.value"
                class="col-start-4 col-span-8 w-full h-full rounded-l-full px-2"
                :class="{
                  notFilled: !model.passphrase.isFilled,
                  isFilled: model.passphrase.isFilled,
                }"
                :type="inputType"
                name="passphrase"
                @blur="checkInput(model.passphrase)"
              />
              <div
                class="col-start-12 col-span-1 w-full h-full self-center flex justify-center items-center bg-gray-300 rounded-r-full cursor-pointer px-1"
                @click="toggleShowPassword"
              >
                <img class="w-6 h-6" src="/img/icon/form-setup/eye.png" alt="eyeIcon" />
              </div>
            </div>
          </div>
          <div
            v-else
            class="w-full col-start-1 col-span-full row-start-5 row-span-1 h-12 bg-[#1a2e2c] p-2 grid grid-cols-12 rounded-full cursor-default"
            :class="{
              errors: keyAuth ? !model.keylocation.isFilled : !model.pass.isFilled,
            }"
          >
            <span class="w-full col-start-1 col-span-3 text-sm text-gray-300 font-semibold self-center pl-2">{{
              $t("formsetup.password")
            }}</span>

            <input
              v-model="model.pass.value"
              class="col-start-4 col-span-8 w-full h-full rounded-l-full px-2"
              :class="{
                notFilled: !model.pass.isFilled,
                isFilled: model.pass.isFilled,
              }"
              :type="inputType"
              name="keylocation"
              required
              @blur="checkInput(model.pass)"
            />
            <div
              class="col-start-12 col-span-1 w-full h-full self-center flex justify-center items-center bg-gray-300 rounded-r-full cursor-pointer"
              @click="toggleShowPassword"
            >
              <img class="w-6 h-6" src="/img/icon/form-setup/eye.png" alt="eyeIcon" />
            </div>
          </div>
        </Transition>
        <div
          class="w-full h-8 col-start-5 col-span-4 justify-self-center self-end row-start-7 row-span-1 bg-[#1a2e2c] p-1 rounded-full flex justify-between items-center"
        >
          <span class="w-fit text-gray-300 font-semibold text-sm ml-1">{{ $t("formsetup.usessh") }}</span>

          <label
            for="AcceptConditions"
            class="relative h-6 w-12 cursor-pointer [-webkit-tap-highlight-color:_transparent]"
          >
            <input
              id="AcceptConditions"
              v-model="model.useAuthKey"
              type="checkbox"
              class="peer sr-only [&:checked_+_span_svg[data-checked-icon]]:block [&:checked_+_span_svg[data-unchecked-icon]]:hidden"
              @change="changeLabel"
            />

            <span
              class="absolute inset-y-0 start-0 z-10 m-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-gray-400 transition-all peer-checked:start-6 peer-checked:text-green-600"
            >
              <svg
                data-unchecked-icon
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>

              <svg
                data-checked-icon
                xmlns="http://www.w3.org/2000/svg"
                class="hidden h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>

            <span class="absolute inset-0 rounded-full bg-gray-300 transition peer-checked:bg-green-500"></span>
          </label>
        </div>
        <button
          class="w-[150px] h-14 absolute bottom-4 right-4 text-center bg-[#1a2e2c] rounded-full text-gray-200 font-semibold text-xl capitalize hover:bg-[#264744] transition-all hover:scale-105 active:scale-100 hover:shadow-md active:shadow-none hover:shadow-gray-800"
        >
          {{ $t("formsetup.login") }}
        </button>
      </form>
    </div> -->
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const hovered = ref(false);
const useAuthKey = ref("");

const getTrashImg = computed(() => {
  if (hovered.value) {
    return "./img/icon/TRASH_CAN2.png";
  } else {
    return "./img/icon/TRASH_CAN.png";
  }
});

const saveServer = () => {
  console.log("saveServer");
};
</script>
