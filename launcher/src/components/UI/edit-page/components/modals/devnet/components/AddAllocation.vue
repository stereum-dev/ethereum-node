<template>
  <div class="w-full mt-4 mx-auto px-4">
    <div class="w-full">
      <div v-if="allocDataReview">
        <div
          class="max-h-[190px] flex flex-col justify-start space-y-4 p-2 items-center overflow-x-hidden overflow-y-auto"
        >
          <div
            v-for="(accountData, address) in allocData"
            :key="address"
            class="w-full h-fit bg-[#336666] rounded-md p-2 flex flex-col justify-start items-start space-y-1"
          >
            <div class="w-full flex justify-between items-center mb-2">
              <h3 class="text-md font-normal text-white">{{ address }}</h3>
              <button
                class="w-7 h-7 bg-red-500 text-white p-1 rounded shadow-sm shadow-gray-700 flex justify-center items-center hover:bg-red-700 active:scale-90 active:shadow-none"
                :class="{ 'opacity-50 pointer-events-none': isDeleting }"
                @click="deleteAccount(address)"
              >
                <svg
                  v-if="isDeleting === address"
                  class="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-white border-r-white border-b-white border-l-red-500"
                  viewBox="0 0 24 24"
                ></svg>
                <img
                  v-else
                  src="/img/icon/terminal-page-icons/trash.png"
                  alt="Trash Icon"
                  class="w-4 h-4"
                />
              </button>
            </div>
            <div
              v-for="(value, key) in accountData"
              :key="key"
              class="w-full flex justify-between items-center mb-1"
            >
              <span class="text-sm text-gray-200">{{ key }}:</span>
              <div class="w-3/4 flex items-center overflow-x-clip truncate ml-2">
                <span class="text-xs text-yellow-300 mr-2 overflow-hidden">{{
                  JSON.stringify(value)
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full px-8 flex justify-center items-center mt-2">
          <div
            class="justify-self-center bg-[#336666] hover:bg-[#407d7d] cursor-pointer shadow-sm shadow-[#101111] active:scale-95 active:shadow-none text-white px-4 py-1 rounded"
            @click="allocDataReview = false"
          >
            Back to Add Account
          </div>
        </div>
      </div>
      <div v-else class="flex flex-col justify-start space-y-2 p-2 items-center">
        <div class="w-full flex justify-between items-center space-x-2">
          <input
            v-model="accountAddress"
            type="text"
            :disabled="addAccountScript"
            :class="inputClass(addAccountScript)"
            placeholder="Account Address *"
            :required="!addAccountScript"
          />
          <input
            v-model="balance"
            type="text"
            :disabled="addAccountScript"
            :class="inputClass(addAccountScript)"
            placeholder="Balance (optional)"
          />
        </div>

        <!-- Checkbox for Account Script -->
        <div class="w-full flex items-center py-1">
          <label
            for="addAccountScript"
            class="text-sm text-gray-200 cursor-pointer flex items-center"
          >
            <input
              id="addAccountScript"
              v-model="addAccountScript"
              type="checkbox"
              class="mr-2 w-4 h-4"
            />
            Enable Advanced Account Configuration
          </label>
        </div>

        <!-- Textarea for Account Details -->
        <div v-if="addAccountScript" class="w-full">
          <textarea
            v-model="accountDetails"
            class="w-full h-[100px] text-sm font-semibold p-2 bg-zinc-200 text-gray-800 rounded-md"
            :placeholder="JSON.stringify(placeHolderSample, null, 2)"
          ></textarea>
        </div>

        <!-- Display Added Account Details -->
        <div v-else-if="Object.keys(allocData).length > 0" class="w-full">
          <pre
            class="w-full h-[100px] p-2 bg-black text-amber-300 rounded-md text-sm overflow-auto max-h-[200px]"
            >{{ JSON.stringify(allocData, null, 2) }}</pre
          >
        </div>

        <div class="w-full flex justify-center items-center space-x-2">
          <!-- Add Account Button -->
          <div
            class="w-1/3 h-[35px] rounded-md shadow-sm shadow-[#101111] cursor-pointer active:scale-95 active:shadow-none flex justify-center items-center bg-[#336666] hover:bg-[#407d7d]"
            :class="buttonDisabled ? 'opacity-50 pointer-events-none' : ''"
            @click="addAccount"
          >
            <span class="text-xs text-center text-gray-200 font-normal">Add Account</span>
          </div>
          <!-- Review Button -->
          <div
            v-if="Object.keys(allocData).length > 0"
            class="w-1/3 h-[35px] rounded-md shadow-sm shadow-[#101111] cursor-pointer active:scale-95 active:shadow-none flex justify-center items-center text-white px-4 py-2 bg-[#336666] hover:bg-[#407d7d]"
            @click="allocDataReview = true"
          >
            <span class="text-xs text-center text-gray-200 font-normal"
              >Edit Allocation
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGenesis } from "@/store/genesis";
import { computed, ref } from "vue";

const genesisStore = useGenesis();

const accountAddress = ref("");
const balance = ref("");
const addAccountScript = ref(false);
const accountDetails = ref("");
const errorMsg = ref("");
const allocDataReview = ref(false);
const isDeleting = ref(false);

const placeHolderSample = ref({
  "0x0420420420420420420420420420420420420420": {
    balance: "0x0",
    code: "0x6080604052600436106",
    storage: {
      "00000000022": "0xf5a5fd4",
      "00000000023": "0x0",
    },
  },
});

const allocData = computed(() => genesisStore.genesis.alloc);

const buttonDisabled = computed(() => {
  return (
    (!addAccountScript.value && !accountAddress.value) ||
    (addAccountScript.value && !accountDetails.value)
  );
});

const inputClass = (disabled) => {
  return `w-full h-[35px] text-sm font-semibold pl-2 rounded-md ${
    disabled ? "bg-zinc-400 text-gray-600" : "bg-zinc-200 text-gray-800"
  }`;
};

const deleteAccount = async (address) => {
  isDeleting.value = true;

  try {
    const updatedAlloc = { ...allocData.value };
    delete updatedAlloc[address];
    await genesisStore.updateGenesisAlloc(updatedAlloc);
  } catch (e) {
    console.error("Error deleting account:", e);
  } finally {
    setTimeout(() => {
      isDeleting.value = false;
    }, 1000);
  }
};

const addAccount = () => {
  errorMsg.value = "";

  if (!addAccountScript.value && !accountAddress.value) {
    errorMsg.value = "Account Address is required";
    return;
  }

  let newAccount = {};

  if (addAccountScript.value) {
    try {
      newAccount = JSON.parse(accountDetails.value);
    } catch (jsonError) {
      try {
        newAccount = new Function(`return ${accountDetails.value}`)();
        if (typeof newAccount !== "object" || newAccount === null) {
          throw new Error("Invalid object");
        }
      } catch (evalError) {
        errorMsg.value = "Invalid JSON or JavaScript object format";
        console.error(evalError);
        return;
      }
    }
  } else {
    newAccount[accountAddress.value] = { balance: balance.value || "0x0" };
  }

  genesisStore.updateGenesisAlloc({ ...allocData.value, ...newAccount });

  accountAddress.value = "";
  balance.value = "";
  addAccountScript.value = false;
  accountDetails.value = "";
};
</script>
