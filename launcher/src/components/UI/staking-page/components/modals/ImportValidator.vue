<template>
  <staking-custom-modal
    main-title="Import Validator Key"
    :confirm-text="getActionButton === importValidator ? 'import' : 'ok'"
    :active-button="getActiveButton"
    :is-processing="checkProcessing"
    :click-outside-text="clickOut"
    @confirm-action="getActionButton"
  >
    <template #content>
      <div
        class="w-full col-start-1 col-span-full row-start-2 row-span-1 overflow-hidden flex justify-center items-center"
      >
        <div v-if="isSlashingActive" class="flex justify-center items-center space-x-2">
          <span
            class="w-4 h-4 rounded-full shadow-lg shadow-[#111010]"
            :class="stakingStore.doppelgangerStatus ? 'bg-green-500' : 'bg-red-500'"
          ></span>
          <span class="text-sm font-semibold text-left text-gray-300">
            Doppelgänger Protection is
            {{ stakingStore.doppelgangerStatus ? "Enabled" : "Disabled" }}.</span
          >
        </div>
      </div>

      <div
        v-if="isSlashingActive"
        class="col-start-1 col-span-full row-start-3 row-span-3 flex flex-col justify-start items-center"
      >
        <span class="col-start-1 col-end-5 row-start-1 row-span-1 text-center text-sm font-semibold text-gray-300">{{
          $t("importSlashingModal.slashModalMessage")
        }}</span>

        <fieldset class="grid grid-cols-2 gap-x-8 mt-4">
          <div>
            <input id="yes" v-model="pickedSlashing" type="radio" value="yes" class="peer hidden" />

            <label for="yes" class="flex justify-center items-center space-x-2" @click="getYes">
              <span
                class="w-6 h-6 cursor-pointer rounded-full border border-gray-100 px-2 py-1 text-sm font-medium shadow-sm hover:scale-110 flex justify-center items-center transition-all ease-in-out duration-150"
                :class="{ 'bg-blue-500': pickedSlashing === 'yes' }"
              ></span>
              <span class="text-gray-200 font-semibold text-center">YES</span>
            </label>
          </div>

          <div>
            <input id="no" v-model="pickedSlashing" type="radio" value="no" class="peer hidden" />

            <label for="no" class="flex justify-center items-center space-x-2" @click="getNo">
              <span
                class="w-6 h-6 cursor-pointer rounded-full border border-gray-100 px-2 py-1 text-sm font-medium shadow-sm hover:scale-110 flex justify-center items-center transition-all ease-in-out duration-150"
                :class="{ 'bg-blue-500': pickedSlashing === 'no' }"
              ></span>
              <span class="text-gray-200 font-semibold text-center">NO</span>
            </label>
          </div>
        </fieldset>

        <div v-if="pickedSlashing === 'yes'">
          <input ref="fileInput" type="file" accept=".json" class="hidden" @change="handleFileUpload" />
          <span class="col-start-1 col-end-5 row-start-1 row-span-1 text-center text-sm font-semibold text-gray-300">{{
            stakingStore.slashingDB ? stakingStore.slashingDB.name : "No file selected"
          }}</span>
        </div>
      </div>
      <div
        v-else-if="!activeButton && !isSlashingActive"
        class="w-full col-start-1 col-span-full row-start-2 row-end-5 grid grid-cols-3 grid-rows-3 items-center overflow-hidden"
      >
        <div
          class="w-full col-start-1 col-span-full row-start-1 row-end-3 flex justify-start items-center overflow-hidden"
        >
          <img class="h-28 sliding-animation" src="/animation/staking/alice.gif" alt="Animation" />
        </div>
        <div
          class="w-full h-10 col-start-1 col-span-full row-start-3 row-span-1 flex justify-center items-center overflow-hidden p-2 space-x-1"
        >
          <span class="text-2xl text-amber-500 font-semibold">Importing</span>
          <span class="text-2xl text-amber-500 font-semibold dot1">.</span>
          <span class="text-2xl text-amber-500 font-semibold dot2">.</span>
          <span class="text-2xl text-amber-500 font-semibold dot3">.</span>
        </div>
      </div>
      <div
        v-else-if="!isSlashingActive && description"
        class="w-full col-start-1 col-span-full row-start-3 row-end-6 overflow-hidden flex justify-center items-center"
      >
        <div class="w-2/3 h-fit flex flex-col justify-center items-center space-y-2">
          <span
            v-if="description"
            class="w-full max-h-28 overflow-x-hidden overflow-y-auto text-sm font-semibold text-left whitespace-pre-wrap break-all mx-2 px-6 py-2 bg-[#0d0d0e] rounded-md"
            :class="getDescriptionClass"
          >
            {{ description }}
          </span>
          <span
            v-if="details"
            class="w-9/12 text-md text-gray-300 font-semibold text-center whitespace-pre-wrap break-all mx-auto"
          >
            {{ details }}
          </span>
        </div>
      </div>
    </template>
  </staking-custom-modal>
</template>
<script setup>
import { computed, ref, watch, onMounted, nextTick } from "vue";
import { useStakingStore } from "@/store/theStaking";
import { useListKeys } from "@/composables/validators";

const emit = defineEmits(["importKey"]);

//  Props

const stakingStore = useStakingStore();
let description = ref("");
let details = ref("");
const activeButton = ref(false);
const isSlashingActive = ref(true);
const pickedSlashing = ref(null);
const fileInput = ref(null);
const checkProcessing = ref(false);
const clickOut = ref("Click outside to close");

const getMessage = computed(() => {
  return stakingStore.importKeyMessage ? stakingStore.importKeyMessage : "";
});

const getActiveButton = computed(() => {
  if (pickedSlashing.value !== "") {
    return true;
  } else {
    return false;
  }
});

const getActionButton = computed(() => {
  if (isSlashingActive.value) {
    return importValidator;
  } else {
    return okHandler;
  }
});

const getDescriptionClass = computed(() => {
  let className;
  if (description.value && description.value.includes("error")) {
    className = "text-red-400";
  } else if (description.value && description.value.includes("duplicate")) {
    className = "text-amber-400";
  } else if (description.value && description.value.includes("imported")) {
    className = "text-teal-400";
  } else {
    className = "text-gray-300";
  }
  return className;
});

watch(pickedSlashing, (newValue, oldValue) => {
  if (newValue === "yes" && oldValue !== "yes") {
    nextTick(() => {
      fileInput.value.click();
    });
  }
});

watch(getMessage, () => {
  if (getMessage.value) {
    splitedTexts(getMessage.value);
    activeButton.value = true;
    checkProcessing.value = false;
  }
});

onMounted(() => {
  pickedSlashing.value = "no";
  stakingStore.slashingDB = null;
});

//Methods

const getNo = () => {
  pickedSlashing.value = "no";
  stakingStore.slashingDB = null;
};
const getYes = () => {
  pickedSlashing.value = "yes";
};
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    stakingStore.slashingDB = file;
  }
};

const splitedTexts = (text) => {
  text = getMessage.value;
  const lines = text.split("\n");
  const lastThreeLinesIndex = lines.length - 3;

  description.value = lines.slice(0, lastThreeLinesIndex).join("\n");
  details.value = lines.slice(lastThreeLinesIndex).join("\n");
};
const listKeys = async () => {
  await useListKeys(stakingStore.forceRefresh);
};

const importValidator = () => {
  clickOut.value = null;
  isSlashingActive.value = false;
  checkProcessing.value = true;
  emit("importKey");
};

const okHandler = async () => {
  stakingStore.setActiveModal(null);
  stakingStore.setActivePanel(null);
  await listKeys();
};
</script>
<style scoped>
.sliding-animation {
  animation: slide-in-out 5s linear infinite;
}

@keyframes slide-in-out {
  0% {
    transform: translateX(-100%) translateY(-10px);
  }
  50% {
    transform: translateX(270px) translateY(10px);
  }
  100% {
    transform: translateX(580px) translateY(-10px);
  }
}
.dot1,
.dot2,
.dot3 {
  opacity: 0;
  animation: appear-and-disappear 1.5s infinite;
}

.dot1 {
  animation-delay: 0s;
}

.dot2 {
  animation-delay: 0.5s;
}

.dot3 {
  animation-delay: 1s;
}

@keyframes appear-and-disappear {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
