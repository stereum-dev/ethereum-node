<template>
  <staking-custom-modal
    main-title="Import Validator Key"
    confirm-text="OK"
    :active-button="activeButton"
    @confirm-action="okHandler"
  >
    <template #content>
      <div
        v-if="!activeButton"
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
        v-else
        class="w-full col-start-1 col-span-full row-start-3 row-end-6 overflow-hidden flex justify-center items-center"
      >
        <!-- <div
          v-if="importedKeyNumber"
          class="col-start-1 col-span-full row-start-1 row-span-3 flex justify-center items-center space-x-1"
        >
          <span class="text-2xl text-teal-500 font-semibold">{{ importedKeyNumber }}</span>
          <span class="text-2xl text-gray-200 font-semibold">key(s) imported.</span>
        </div> -->
        <div class="w-full h-fit flex flex-col justify-center items-center space-y-2">
          <span
            v-if="description"
            class="w-fit max-w-lg text-sm font-semibold text-left whitespace-pre-wrap break-all mx-auto"
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
import { computed, ref, watch } from "vue";
import { useStakingStore } from "@/store/theStaking";

//  Props

const stakingStore = useStakingStore();
let description = ref("");
let details = ref("");
const activeButton = ref(false);

const getMessage = computed(() => {
  return stakingStore.importKeyMessage ? stakingStore.importKeyMessage : "";
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

watch(getMessage, () => {
  if (getMessage.value) {
    splitedTexts(getMessage.value);
    activeButton.value = true;
  }
});

//Methods

const splitedTexts = (text) => {
  text = getMessage.value;
  const lines = text.split("\n");
  const lastThreeLinesIndex = lines.length - 3;

  description.value = lines.slice(0, lastThreeLinesIndex).join("\n");
  details.value = lines.slice(lastThreeLinesIndex).join("\n");
};

const okHandler = () => {
  stakingStore.setActiveModal(null);
  stakingStore.setActivePanel(null);
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
