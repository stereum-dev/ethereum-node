<template>
  <div class="w-full mt-4 mx-auto px-4">
    <div class="w-full">
      <div class="flex flex-col justify-start space-y-2 p-2 items-center">
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
          <label for="addAccountScript" class="text-sm text-gray-200 cursor-pointer flex items-center">
            <input id="addAccountScript" v-model="addAccountScript" type="checkbox" class="mr-2 w-4 h-4" />
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
          <pre class="w-full h-[100px] p-2 bg-black text-amber-300 rounded-md text-sm overflow-auto max-h-[200px]">{{
            JSON.stringify(allocData, null, 2)
          }}</pre>
        </div>

        <!-- Add Account Button -->
        <div
          class="w-1/3 h-[35px] rounded-md shadow-sm shadow-[#101111] cursor-pointer active:scale-95 active:shadow-none flex justify-center items-center bg-[#336666] hover:bg-[#407d7d]"
          :class="buttonDisabled ? 'opacity-50 pointer-events-none' : ''"
          @click="addAccount"
        >
          <span class="text-xs text-center text-gray-200 font-normal">Add Account</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useGenesis } from "@/store/genesis";

const genesisStore = useGenesis();

const accountAddress = ref("");
const balance = ref("");
const addAccountScript = ref(false);
const accountDetails = ref("");
const errorMsg = ref("");

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

const allocData = ref({});

const buttonDisabled = computed(() => {
  return (!addAccountScript.value && !accountAddress.value) || (addAccountScript.value && !accountDetails.value);
});

const updateAllocData = () => {
  allocData.value = genesisStore.genesis.alloc;
};

watch(() => genesisStore.genesis.alloc, updateAllocData, { immediate: true });

const inputClass = (disabled) => {
  return `w-full h-[35px] text-sm font-semibold pl-2 rounded-md ${disabled ? "bg-zinc-400 text-gray-600" : "bg-zinc-200 text-gray-800"}`;
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
      // First, try to parse as JSON
      newAccount = JSON.parse(accountDetails.value);
    } catch (jsonError) {
      // If JSON parsing fails, try to evaluate as a JavaScript object
      try {
        // Use Function constructor to safely evaluate the string as a JavaScript object
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

  // Update the store with the new account(s)
  Object.keys(newAccount).forEach((address) => {
    genesisStore.updateGenesisAlloc({ [address]: newAccount[address] });
  });

  accountAddress.value = "";
  balance.value = "";
  addAccountScript.value = false;
  accountDetails.value = "";

  console.log("Updated allocData:", genesisStore.genesis.alloc);
};
</script>
