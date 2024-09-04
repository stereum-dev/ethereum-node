<template>
  <div class="w-full h-full absolute inset-0 border-none">
    <div class="w-full h-full absolute inset-0 bg-black bg-opacity-80 z-10 rounded-md" @click="closeModal"></div>
    <div class="relative top-20 mx-auto px-5 py-2 border w-3/5 rounded-[35px] bg-[#1c1d1d] shadow-xl shadow-black z-30">
      <div class="mt-1 text-center">
        <h3 class="text-xl leading-6 font-semibold text-amber-500 uppercase">
          {{ $t("multiServer.genSshKey") }}
        </h3>
        <form class="mt-2 grid grid-cols-12 grid-rows-8 items-center gap-y-2">
          <div class="col-start-1 col-span-full row-start-1 row-span-1 grid grid-cols-12 items-center">
            <span class="col-start-1 col-end-4 w-full text-left self-center text-md font-semibold text-gray-200 uppercase">{{
              $t("multiServer.keyType")
            }}</span>
            <div class="col-start-4 col-span-full relative inline-block w-full">
              <button
                class="h-7 relative z-10 block w-full px-4 py-1 text-sm text-gray-600 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-opacity-40 focus:ring-blue-300"
                @click.prevent.stop="isOpen = !isOpen"
              >
                <span class="text-center font-semibold">{{ serverStore.selectedKeyType || `${$t("multiServer.selectKeyType")}` }}</span>
                <span class="float-right">
                  <svg class="w-4 h-4 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>

              <div v-show="isOpen" class="absolute w-full mt-1 bg-white rounded-md shadow-lg z-20" @click="isOpen = false">
                <div
                  v-for="type in serverStore.keyTypes"
                  :key="type"
                  class="py-1 px-4 text-sm text-gray-800 hover:bg-blue-100 cursor-pointer"
                  @click.prevent.stop="selectKeyType(type)"
                >
                  {{ type }}
                </div>
              </div>
            </div>
          </div>
          <div class="col-start-1 col-span-full row-start-2 row-span-1 grid grid-cols-12 items-center">
            <label for="savePath" class="col-start-1 col-end-4 w-full text-left self-center text-md font-semibold text-gray-200 uppercase">
              {{ $t("multiServer.savePath") }}
            </label>
            <div class="col-start-4 col-span-8 relative bg-gray-100 rounded-l-md">
              <input
                id="savePath"
                v-model="serverStore.savePath"
                type="text"
                readonly
                class="h-7 shadow rounded-l-md py-2 px-3 text-gray-800 leading-tight w-full"
              />
            </div>
            <div class="h-full col-start-12 col-span-1 bg-gray-100 rounded-r-md flex justify-center items-center">
              <label
                for="keypath-file"
                class="col-start-12 col-span-full row-start-2 row-span-2 w-full h-full flex justify-center items-center cursor-pointer"
                @click.prevent.stop="openDirectoryPicker"
              >
                <div class="w-6 h-6 border border-gray-400 rounded-full flex justify-center items-center">
                  <span
                    class="text-xl text-teal-700 text-center font-bold hover:scale-125 active:scale-100 transition-all duration-150 ease-in-out"
                    >+</span
                  >
                </div>
              </label>
            </div>
          </div>

          <div class="col-start-1 col-span-full row-start-3 row-span-1 grid grid-cols-12 items-center">
            <label
              for="sshPassword"
              class="col-start-1 col-end-4 w-full text-left self-center text-md font-semibold text-gray-200 uppercase"
              >{{ $t("multiServer.sshPass") }}</label
            >

            <input
              id="sshPassword"
              v-model="serverStore.sshPassword"
              type="text"
              class="col-start-4 col-span-full h-7 shadow border rounded py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
              :placeholder="`${$t('multiServer.optionalSshPass')}`"
            />
          </div>

          <!-- Toggle -->
          <div class="col-start-1 col-span-full row-start-4 row-span-1 grid grid-cols-12 items-center">
            <span class="col-start-1 col-end-8 w-full text-left self-center text-md font-semibold text-gray-200 uppercase">
              {{ $t("multiServer.unlockExpertOptions") }}</span
            >
            <label
              for="AcceptConditions"
              class="col-start-11 col-span-full flex justify-center items-center relative h-7 w-full cursor-pointer [-webkit-tap-highlight-color:_transparent]"
            >
              <input
                id="AcceptConditions"
                v-model="expertOptions"
                type="checkbox"
                class="peer sr-only [&:checked_+_span_svg[data-checked-icon]]:block [&:checked_+_span_svg[data-unchecked-icon]]:hidden"
              />

              <span
                class="absolute inset-y-0 start-0 z-10 m-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-gray-400 transition-all peer-checked:start-6 peer-checked:text-green-600"
              >
                <svg data-unchecked-icon xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>

                <svg data-checked-icon xmlns="http://www.w3.org/2000/svg" class="hidden h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>

              <span class="w-[53px] absolute inset-0 rounded-full bg-gray-300 transition peer-checked:bg-green-500"></span>
            </label>
          </div>
          <div
            class="col-start-1 col-span-full row-start-5 row-span-1 grid grid-cols-12 items-center"
            :class="{
              'opacity-50 pointer-events-none cursor-not-allowed': disableDiv,
            }"
          >
            <span class="col-start-1 col-end-4 w-full text-left self-center text-md font-semibold text-gray-200 uppercase">{{
              $t("multiServer.specCypher")
            }}</span>
            <div class="col-start-4 col-span-full relative inline-block w-full">
              <button
                class="h-7 relative z-10 block w-full px-4 py-1 text-sm text-gray-600 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-opacity-40 focus:ring-blue-300"
                :class="{
                  'opacity-50 pointer-events-none cursor-not-allowed': !expertOptions,
                }"
                @click="isCustomCyperActive = !isCustomCyperActive"
              >
                <span class="text-center font-semibold">{{ serverStore.selectedCyper || `${$t("multiServer.useCostumCypher")}` }}</span>
                <span class="float-right">
                  <svg class="w-4 h-4 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>

              <div
                v-show="isCustomCyperActive"
                class="absolute w-full max-h-[150px] mt-1 bg-white rounded-md shadow-lg z-20 overflow-x-hidden overflow-y-auto"
                @click="isCustomCyperActive = false"
              >
                <div
                  v-for="size in typesAmount"
                  :key="size"
                  class="py-1 px-4 text-sm text-gray-800 hover:bg-blue-100 cursor-pointer"
                  @click.prevent.stop="selectKeySize(size)"
                >
                  {{ size }}
                </div>
              </div>
            </div>
          </div>
          <div class="col-start-1 col-span-full row-start-6 row-span-1 grid grid-cols-12 items-center">
            <span class="col-start-1 col-end-4 w-full text-left self-center text-md font-semibold text-gray-200 uppercase">{{
              $t("multiServer.bitAmount")
            }}</span>
            <div class="col-start-4 col-span-full relative inline-block w-full">
              <button
                class="h-7 relative z-10 block w-full px-4 py-1 text-sm text-gray-600 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-opacity-40 focus:ring-blue-300"
                :class="{
                  'opacity-50 pointer-events-none cursor-not-allowed': !expertOptions,
                }"
                @click="isSpecifyAmountActive = !isSpecifyAmountActive"
              >
                <span class="text-center font-semibold">{{ serverStore.bitAmount || `${$t("multiServer.specSshBitAmount")}` }}</span>
                <span class="float-right">
                  <svg class="w-4 h-4 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>

              <div
                v-show="isSpecifyAmountActive"
                class="absolute w-full max-h-32 mt-1 bg-white rounded-md shadow-lg z-20 overflow-x-hidden overflow-y-auto"
                @click="isSpecifyAmountActive = false"
              >
                <div
                  v-for="item in serverStore.specifyCipherItems"
                  :key="item"
                  class="py-1 px-4 text-sm text-gray-800 hover:bg-blue-100 cursor-pointer"
                  @click.prevent.stop="selectSpecifyAmount(item)"
                >
                  {{ item }}
                </div>
              </div>
            </div>
          </div>
          <!--Submit button -->
          <div class="w-full h-full col-start-1 col-span-full row-start-7 row-span-2 grid grid-cols-12 items-center">
            <button
              class="h-9 col-start-9 col-span-full bg-teal-500 hover:bg-teal-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline shadow-md shadow-black active:scale-95"
              type="button"
              :class="{
                'opacity-50 pointer-events-none cursor-not-allowed': isDisabled,
              }"
              :disabled="isDisabled"
              @click.prevent.stop="generateKey"
            >
              {{ $t("multiServer.gen") }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect, onMounted } from "vue";
import { useServers } from "@/store/servers";
import { useDeepClone } from "@/composables/utils";
import ControlService from "@/store/ControlService";

const emit = defineEmits(["closeModal", "generateKey"]);

const serverStore = useServers();

const expertOptions = ref(false);
const isOpen = ref(false);
const isSpecifyAmountActive = ref(false);
const isCustomCyperActive = ref(false);
const isDisabled = ref(true);

// serverStore.savePath: "",
// serverStore.sshPassword: "",
// serverStore.selectedCyper: "",
// serverStore.bitAmount: "",
// serverStore.selectedKeyType: "",

onMounted(() => {
  serverStore.savePath = "";
  serverStore.sshPassword = "";
  serverStore.selectedCyper = "";
  serverStore.bitAmount = "";
  serverStore.selectedKeyType = "";
});

//Computed

const disableDiv = computed(() => {
  return expertOptions.value && (serverStore.selectedKeyType === "" || serverStore.selectedKeyType === "ED25519");
});

const typesAmount = computed(() => {
  if (serverStore.selectedKeyType === "RSA") {
    return ["1024", "2048", "3072", "4096", "8192", "16384"];
  } else if (serverStore.selectedKeyType === "ECDSA") {
    return ["256", "384", "521"];
  }
  return [];
});

watchEffect(() => {
  if (serverStore.selectedKeyType !== "" && serverStore.savePath !== "") {
    isDisabled.value = false;
  }
});

//Methods

const selectKeyType = (type) => {
  serverStore.selectedKeyType = type;
  isOpen.value = false;
};

const selectSpecifyAmount = (item) => {
  serverStore.bitAmount = item;
  isSpecifyAmountActive.value = false;
};

const selectKeySize = (size) => {
  serverStore.selectedCyper = size;
  isCustomCyperActive.value = false;
};
const openDirectoryPicker = async () => {
  try {
    const paths = await ControlService.openDirectoryDialog(useDeepClone({ properties: ["openDirectory", "createDirectory"] }));
    serverStore.savePath = paths[0];
  } catch (error) {
    // Handle case when user cancels directory picker
    if (error.name === "AbortError") {
      serverStore.savePath = "";
    } else {
      console.error("Error picking directory:", error);
    }
  }
};

const closeModal = () => {
  emit("closeModal");
};

const generateKey = () => {
  if (serverStore.selectedKeyType === "" || serverStore.savePath === "") {
    return;
  }
  emit("generateKey");
};
</script>
