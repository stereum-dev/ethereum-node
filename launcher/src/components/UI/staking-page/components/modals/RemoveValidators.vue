<template>
  <staking-custom-modal
    main-title="Remove Validator Key(s)"
    title-color="remove"
    message-text="Are you sure you want to remove this Key(s)?"
    click-outside-text="Click outside to cancel"
    confirm-text="remove"
    :active-button="activeButton"
    @confirm-action="removeValidator"
    @close-modal="closeModal"
  >
    <template #content>
      <div
        class="col-start-2 col-end-12 row-start-4 row-end-6 w-full h-full flex flex-col justify-start item-center overflow-x-hidden overflow-y-auto max-h-[182px] bg-[#151618] rounded-lg p-2 gap-y-2"
      >
        <div
          v-for="key in stakingStore.removeKeys"
          :key="key.key"
          class="h-7 col-start-1 col-span-full row-span-1 flex justify-center items-center px-3 border border-gray-700 rounded-md bg-[#111213] p-1"
        >
          <span class="text-sm text-amber-400 text-left font-semibold">{{
            `${key.key.substring(0, 28)} . . . ${key.key.substring(key.key.length - 28)}`
          }}</span>
        </div>
      </div>
    </template>
  </staking-custom-modal>
</template>

<script setup>
import { useStakingStore } from "@/store/theStaking";
import { computed } from "vue";

const emit = defineEmits(["removeValidator"]);

const stakingStore = useStakingStore();

const activeButton = computed(() => {
  if (stakingStore.selectedKeyToRemove !== null || stakingStore.removeKeys.length > 0) {
    return true;
  }
  return false;
});

const removeValidator = () => {
  emit("removeValidator", stakingStore.selectedKeyToRemove);
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
