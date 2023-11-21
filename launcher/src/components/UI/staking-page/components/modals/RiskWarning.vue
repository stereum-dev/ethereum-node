<template>
  <staking-custom-modal
    main-title="Import Validator Key"
    confirm-text="OK"
    :disabled-button="activeButton"
    @confirm-action="okHandler"
  >
    <template #content>
      <div
        class="w-full col-start-1 col-span-full row-start-2 row-end-5 grid grid-cols-3 grid-rows-3 items-center overflow-hidden"
      >
        <div class="col-start-1 col-span-full row-start-1 row-span-3 flex justify-center items-center space-x-1">
          <span class="text-2xl text-teal-500 font-semibold">WARNING RISK</span>
          <span class="text-2xl text-gray-200 font-semibold">key(s) imported.</span>
        </div>
      </div>
    </template>
  </staking-custom-modal>
</template>
<script setup>
import { useStakingStore } from "@/store/theStaking";

const stakingStore = useStakingStore();

//Methods

const okHandler = () => {
  stakingStore.setActiveModal(null);
  stakingStore.setActivePanel("validator");
};
</script>
