<template>
  <staking-custom-modal
    :main-title="`${$t('stakingPage.remGrp')}`"
    title-color="remove"
    :message-text="`${$t('stakingPage.areYouSure')}`"
    :click-outside-text="clickOut"
    :confirm-text="`${$t('serviceModal.rem')}`"
    :active-button="activeButton"
    @confirm-action="removeGroup"
  >
    <template #content>
      <div class="col-start-1 col-span-full row-start-4 row-end-6 w-full h-full grid grid-cols-12 grid-rows-3">
        <div class="w-full h-full col-start-3 col-end-11 row-start-1 row-span-1 flex justify-start items-center px-1">
          <span class="w-fit text-sm font-semibold text-left text-gray-400">{{ $t("stakingPage.grpId") }} </span>
          <span class="w-fit text-amber-400 text-md font-semibold ml-5">{{ group.id }}</span>
        </div>
        <div
          class="w-full h-full col-start-3 col-end-11 row-start-2 row-span-1 text-sm text-left text-gray-300 flex justify-start items-center px-1"
        >
          <span class="w-fit text-sm font-semibold text-left text-gray-400">{{ $t("stakingPage.grpNam") }}</span>
          <span class="w-fit text-amber-400 text-md font-semibold ml-5">{{ group.name }}</span>
        </div>
        <div
          class="w-full h-full col-start-3 col-end-11 row-start-3 row-span-1 text-sm text-left text-gray-300 flex justify-start items-center px-1"
        >
          <span class="w-fit text-sm font-semibold text-left text-gray-400">{{ $t("stakingPage.keys") }}</span>
          <span class="w-fit text-amber-400 text-md font-semibold ml-5">{{ `Contains ${group.keys.length} key(s)` }}</span>
        </div>
      </div>
    </template>
  </staking-custom-modal>
</template>

<script setup>
import { useStakingStore } from "@/store/theStaking";
import { computed, ref } from "vue";

const emit = defineEmits(["removeGroup"]);

const stakingStore = useStakingStore();
const clickOut = ref("Click outside to cancel");

const group = computed(() => {
  return stakingStore.currentGroup;
});

const activeButton = computed(() => {
  if (stakingStore.currentGroup) {
    return true;
  }
  return false;
});

const removeGroup = () => {
  clickOut.value = null;
  emit("removeGroup", group.value);
};
</script>
