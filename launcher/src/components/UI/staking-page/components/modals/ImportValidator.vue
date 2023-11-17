<template>
  <staking-custom-modal
    main-title="Import Validator Key"
    confirm-text="OK"
    :disabled-button="activeButton"
    @confirm-action="okHandler"
  >
    <template #content>
      <div
        v-if="showImage"
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
        class="w-full col-start-1 col-span-full row-start-2 row-end-5 grid grid-cols-3 grid-rows-3 items-center overflow-hidden"
      >
        <div
          v-if="importedKeyNumber"
          class="col-start-1 col-span-full row-start-1 row-span-3 flex justify-center items-center space-x-1"
        >
          <span class="text-2xl text-teal-500 font-semibold">{{ importedKeyNumber }}</span>
          <span class="text-2xl text-gray-200 font-semibold">key(s) imported.</span>
        </div>
        <div
          v-else
          class="col-start-1 col-span-full row-start-1 row-span-3 flex flex-col justify-center items-center space-x-1"
        >
          <span class="text-2xl text-red-500 font-semibold uppercase">Importing failed</span>
          <span class="text-2xl text-gray-200 font-semibold">{{ props.error }}</span>
        </div>
      </div>
    </template>
  </staking-custom-modal>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import { useStakingStore } from "@/store/theStaking";

//Props
const props = defineProps({
  error: {
    type: String,
    default: "Wrong password or invalid key file.",
  },
});
const importedKeyNumber = ref(null);

const stakingStore = useStakingStore();
const showImage = ref(false);

// const importedKeyNumber = computed(() => {
//   return stakingStore.keyFiles.length;
// });

const activeButton = computed(() => {
  if (importedKeyNumber.value || props.error) {
    return false;
  } else {
    return true;
  }
});

//Lifecycle Hooks

onMounted(() => {
  showImage.value = false;
});

//Methods

const okHandler = () => {
  stakingStore.setActiveModal(null);
  stakingStore.setActivePanel("validator");
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
