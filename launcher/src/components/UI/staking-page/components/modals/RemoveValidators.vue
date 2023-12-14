<template>
  <staking-custom-modal
    main-title="Remove Validator Key(s)"
    title-color="remove"
    message-text="Are you sure you want to remove this Key(s)?"
    click-outside-text="Click outside to cancel"
    confirm-text="remove"
    :active-button="activeButton"
    :is-processing="checkProcessing"
    @confirm-action="removeValidator"
    @close-modal="closeModal"
  >
    <template #content>
      <div
        class="col-start-2 col-end-12 row-start-3 row-end-6 w-full h-full item-center rounded-lg p-2 gap-y-2 grid grid-cols-3 grid-rows-4 mt-1"
      >
        <div
          class="col-start-1 col-span-full row-start-1 row-span-2 flex flex-col justify-start items-center overflow-y-auto overflow-x-hidden p-1"
        >
          <div
            v-for="key in stakingStore.removeKeys"
            :key="key.key"
            class="h-7 col-start-1 col-span-full row-span-1 flex justify-center items-center px-3 border border-gray-700 rounded-md bg-[#111213] p-1 gap-y-1"
          >
            <span class="text-sm text-amber-400 text-left font-semibold">{{
              `${key.key.substring(0, 28)} . . . ${key.key.substring(key.key.length - 28)}`
            }}</span>
          </div>
        </div>

        <div class="col-start-1 col-span-full row-start-3 row-span-2 flex flex-col justify-start items-center">
          <span class="text-sm text-gray-400 font-semibold">{{ $t("removeSingleModal.question") }}</span>

          <fieldset class="grid grid-cols-2 gap-x-8 mt-2">
            <div>
              <input id="yes" v-model="stakingStore.pickedSlashing" type="radio" value="yes" class="peer hidden" />

              <label
                for="yes"
                class="flex justify-center items-center space-x-2"
                @click="stakingStore.pickedSlashing === 'yes'"
              >
                <span
                  class="w-6 h-6 cursor-pointer rounded-full border border-gray-100 px-2 py-1 text-sm font-medium shadow-sm hover:scale-110 flex justify-center items-center transition-all ease-in-out duration-150"
                  :class="{ 'bg-blue-500': stakingStore.pickedSlashing === 'yes' }"
                ></span>
                <span class="text-gray-200 font-semibold text-center">YES</span>
              </label>
            </div>

            <div>
              <input id="no" v-model="stakingStore.pickedSlashing" type="radio" value="no" class="peer hidden" />

              <label
                for="no"
                class="flex justify-center items-center space-x-2"
                @click="stakingStore.pickedSlashing === 'no'"
              >
                <span
                  class="w-6 h-6 cursor-pointer rounded-full border border-gray-100 px-2 py-1 text-sm font-medium shadow-sm hover:scale-110 flex justify-center items-center transition-all ease-in-out duration-150"
                  :class="{ 'bg-blue-500': stakingStore.pickedSlashing === 'no' }"
                ></span>
                <span class="text-gray-200 font-semibold text-center">NO</span>
              </label>
            </div>
          </fieldset>
        </div>
      </div>
    </template>
  </staking-custom-modal>
</template>

<script setup>
import { useStakingStore } from "@/store/theStaking";
import { computed, ref, onMounted } from "vue";

const emit = defineEmits(["removeValidator"]);

const stakingStore = useStakingStore();
const checkProcessing = ref(false);

const activeButton = computed(() => {
  if (stakingStore.selectedKeyToRemove !== null || stakingStore.removeKeys.length > 0) {
    return true;
  }
  return false;
});

onMounted(() => {
  stakingStore.pickedSlashing = "no";
});

const removeValidator = () => {
  emit("removeValidator", stakingStore.selectedKeyToRemove, stakingStore.pickedSlashing);
  checkProcessing.value = true;
};

const closeModal = () => {
  if (stakingStore.selectedKeyToRemove !== null) {
    stakingStore.keys.find((key) => key.key === stakingStore.selectedKeyToRemove.key).showExitText = false;
    stakingStore.selectedKeyToRemove = null;
  }
  stakingStore.removeKeys = [];
  stakingStore.setActiveModal(null);
};
</script>
