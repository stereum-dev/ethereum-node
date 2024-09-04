<template>
  <staking-custom-modal
    main-title="Import Validator Key"
    height="450"
    :confirm-text="getActionButton === importValidator ? 'import' : 'ok'"
    :active-button="getActiveButton"
    :is-processing="checkProcessing"
    :click-outside-text="clickOut"
    @confirm-action="getActionButton"
  >
    <template #content>
      <div
        v-if="isSlashingActive"
        class="w-full col-start-1 col-span-full row-start-2 row-span-1 overflow-hidden flex justify-center items-center"
      >
        <div class="flex justify-center items-center space-x-2">
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

      <div v-if="isSlashingActive" class="col-start-1 col-span-full row-start-3 row-span-3 flex flex-col justify-start items-center">
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
              <span class="text-gray-200 font-semibold text-center">{{ $t("stakingPage.yes") }}</span>
            </label>
          </div>

          <div>
            <input id="no" v-model="pickedSlashing" type="radio" value="no" class="peer hidden" />

            <label for="no" class="flex justify-center items-center space-x-2" @click="getNo">
              <span
                class="w-6 h-6 cursor-pointer rounded-full border border-gray-100 px-2 py-1 text-sm font-medium shadow-sm hover:scale-110 flex justify-center items-center transition-all ease-in-out duration-150"
                :class="{ 'bg-blue-500': pickedSlashing === 'no' }"
              ></span>
              <span class="text-gray-200 font-semibold text-center">{{ $t("stakingPage.no") }}</span>
            </label>
          </div>
        </fieldset>

        <div v-if="pickedSlashing === 'yes'">
          <input ref="fileInput" type="file" accept=".json" class="hidden" @change="handleFileUpload" />
          <span class="col-start-1 col-end-5 row-start-1 row-span-1 text-center text-sm font-semibold text-gray-300">{{
            stakingStore.slashingDB ? stakingStore.slashingDB.name : `${$t("stakingPage.noFile")}`
          }}</span>
        </div>
      </div>
      <div
        v-else-if="!activeButton && !isSlashingActive"
        class="w-full col-start-1 col-span-full row-start-3 row-end-6 grid grid-cols-3 grid-rows-3 items-center overflow-hidden"
      >
        <div class="w-full col-start-1 col-span-full row-start-1 row-end-3 flex justify-start items-center overflow-hidden">
          <img class="h-24 sliding-animation" src="/animation/staking/alice.gif" alt="Animation" />
        </div>
        <div
          class="w-full h-10 col-start-1 col-span-full row-start-3 row-span-1 flex justify-center items-center overflow-hidden p-2 space-x-1"
        >
          <span class="text-2xl text-amber-500 font-semibold">{{ $t("stakingPage.imp") }}</span>
          <span class="text-2xl text-amber-500 font-semibold dot1">.</span>
          <span class="text-2xl text-amber-500 font-semibold dot2">.</span>
          <span class="text-2xl text-amber-500 font-semibold dot3">.</span>
        </div>
      </div>
      <div
        v-else-if="!isSlashingActive && getMessage"
        class="w-full col-start-2 col-end-12 row-start-2 row-end-6 overflow-hidden flex justify-center items-center"
      >
        <div class="w-full h-fit flex flex-col justify-center items-center space-y-2">
          <span class="w-full text-lg font-semibold text-left text-gray-300">{{ $t("stakingPage.impDet") }}</span>
          <div class="w-full max-h-32 overflow-x-hidden overflow-y-auto border border-gray-700 rounded-md bg-[#111213] mx-2 p-2 space-y-2">
            <div
              v-for="(line, index) in getMessage"
              :key="index"
              class="w-full h-10 max-h-10 border border-gray-700 rounded-md bg-[#242628] p-1 flex justify-center items-center space-x-1"
              :class="getDescriptionClass(line)"
            >
              <span class="text-sm font-semibold text-left whitespace-pre-wrap">{{ line }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </staking-custom-modal>
</template>
<script setup>
import { computed, ref, watch, onMounted, nextTick, onUnmounted } from "vue";
import { useStakingStore } from "@/store/theStaking";
import { useListKeys } from "@/composables/validators";

const emit = defineEmits(["importKey"]);

//  Props

const stakingStore = useStakingStore();
const activeButton = ref(false);
const isSlashingActive = ref(true);
const pickedSlashing = ref(null);
const fileInput = ref(null);
const checkProcessing = ref(false);
const clickOut = ref("Click outside to close");

const getMessage = computed(() => {
  return stakingStore.importKeyMessage.split("\n");
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

const getDescriptionClass = (line) => {
  let className;
  if (line && line.toLowerCase().includes("failed" || "error" || "invalid" || "incorrect")) {
    stakingStore.doppelgangerKeys = [];
    className = "text-red-400";
  } else if (line && line.includes("duplicate")) {
    className = "text-amber-400";
  } else if (line && line.includes("imported")) {
    className = "text-teal-400";
  } else {
    className = "text-gray-300";
  }
  return className;
};

watch(pickedSlashing, (newValue, oldValue) => {
  if (newValue === "yes" && oldValue !== "yes") {
    nextTick(() => {
      fileInput.value.click();
    });
  }
});

watch(getMessage, () => {
  if (getMessage.value) {
    activeButton.value = true;
    checkProcessing.value = false;
  }
});

onMounted(() => {
  pickedSlashing.value = "no";
  stakingStore.slashingDB = null;
});

onUnmounted(() => {
  pickedSlashing.value = null;
  stakingStore.importKeyMessage = "";
  stakingStore.forceRefresh = !stakingStore.forceRefresh;
  isSlashingActive.value = true;
  checkProcessing.value = false;
  activeButton.value = false;
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
    transform: translateX(-100%) translateY(-5px);
  }
  50% {
    transform: translateX(270px) translateY(-5px);
  }
  100% {
    transform: translateX(580px) translateY(-5px);
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
