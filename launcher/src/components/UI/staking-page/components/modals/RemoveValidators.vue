<template>
  <staking-custom-modal
    :main-title="`${$t('stakingPage.remValKey')}`"
    title-color="remove"
    :message-text="`${$t('stakingPage.areXouSure')}`"
    :click-outside-text="clickOut"
    :confirm-text="`${$t('serviceModal.rem')}`"
    height="450"
    :external-close="true"
    :active-button="activeButton"
    :is-processing="checkProcessing"
    @confirm-action="removeValidator"
    @close-modal="closeModal"
  >
    <template #content>
      <div
        class="col-start-2 col-end-12 row-start-3 row-end-7 w-full h-full item-center rounded-lg p-2 gap-y-2 grid grid-cols-3 grid-rows-4 mt-2"
      >
        <div
          class="col-start-1 col-span-full row-start-1 row-span-2 flex flex-col justify-start items-center overflow-y-auto overflow-x-hidden p-1 space-y-1 border border-gray-700 rounded-md bg-[#111213]"
        >
          <div
            v-for="key in stakingStore.removeKeys"
            v-show="stakingStore.removeKeys.length > 0"
            :key="key.key"
            class="h-7 w-full col-start-1 col-span-full row-span-1 flex justify-start items-center px-3 border border-gray-700 rounded-md bg-[#242628] p-1 gap-y-1 mx-1"
          >
            <span class="text-sm text-amber-300 text-left font-semibold">{{
              `${key.key.substring(0, 28)} . . . ${key.key.substring(key.key.length - 28)}`
            }}</span>
          </div>

          <div
            v-if="stakingStore.removeKeys.length === 0 && stakingStore.removeResponse.length > 0 && localKeyNo"
            class="h-7 w-full col-start-1 col-span-full row-span-1 flex flex-col justify-center items-center px-3 rounded-md bg-[#242628] p-1 gap-y-1 mx-1"
          >
            <span v-if="localKeyNo" class="text-sm text-red-400 text-left font-semibold">{{ `${localKeyNo} key(s) deleted ` }}</span>
          </div>
          <div
            v-if="stakingStore.removeKeys.length === 0 && stakingStore.removeResponse.length > 0 && remoteKeyNo"
            class="h-7 w-full col-start-1 col-span-full row-span-1 flex flex-col justify-center items-center px-3 rounded-md bg-[#242628] p-1 gap-y-1 mx-1"
          >
            <span v-if="remoteKeyNo" div class="text-sm text-red-400 text-left font-semibold">{{
              `${remoteKeyNo} remote key(s) deleted `
            }}</span>
          </div>
        </div>

        <div class="col-start-1 col-span-full row-start-3 row-span-1 flex flex-col justify-start items-center">
          <span class="text-sm text-gray-400 font-semibold">{{ $t("removeSingleModal.question") }}</span>

          <fieldset class="grid grid-cols-2 gap-x-8 mt-2">
            <div>
              <input id="yes" v-model="stakingStore.pickedSlashing" type="radio" value="yes" class="peer hidden" />

              <label for="yes" class="flex justify-center items-center space-x-2" @click="stakingStore.pickedSlashing === 'yes'">
                <span
                  class="w-6 h-6 cursor-pointer rounded-full border border-gray-100 px-2 py-1 text-sm font-medium shadow-sm hover:scale-110 flex justify-center items-center transition-all ease-in-out duration-150"
                  :class="{ 'bg-blue-500': stakingStore.pickedSlashing === 'yes' }"
                ></span>
                <span class="text-gray-200 font-semibold text-center">{{ $t("stakingPage.yes") }}</span>
              </label>
            </div>

            <div>
              <input id="no" v-model="stakingStore.pickedSlashing" type="radio" value="no" class="peer hidden" />

              <label for="no" class="flex justify-center items-center space-x-2" @click="stakingStore.pickedSlashing === 'no'">
                <span
                  class="w-6 h-6 cursor-pointer rounded-full border border-gray-100 px-2 py-1 text-sm font-medium shadow-sm hover:scale-110 flex justify-center items-center transition-all ease-in-out duration-150"
                  :class="{ 'bg-blue-500': stakingStore.pickedSlashing === 'no' }"
                ></span>
                <span class="text-gray-200 font-semibold text-center">{{ $t("stakingPage.no") }}</span>
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
import { computed, ref, onMounted, watchEffect } from "vue";

const emit = defineEmits(["removeValidator", "exportRemove"]);

const stakingStore = useStakingStore();
const checkProcessing = ref(false);
const clickOut = ref("Click outside to cancel");
const remoteKeyNo = ref(null);
const localKeyNo = ref(null);

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
  clickOut.value = null;
  emit("removeValidator", stakingStore.selectedKeyToRemove, stakingStore.pickedSlashing);
  checkProcessing.value = true;
};

const closeModal = () => {
  if (stakingStore.selectedKeyToRemove !== null) {
    stakingStore.selectedKeyToRemove = null;
  }
  if (stakingStore.removeKeys.length > 0) {
    stakingStore.removeKeys = [];
  }

  stakingStore.keys.forEach((key) => {
    if (key.showExitText) {
      key.showExitText = false;
    }
  });

  stakingStore.setActiveModal(null);
};

watchEffect(() => {
  if (stakingStore.removeResponse) {
    stakingStore.removeResponse.forEach((item) => {
      if (item.name === "local" && item.data.data?.length > 0) {
        localKeyNo.value = item.data?.data?.length;
      } else if (item.name === "remote" && item.data.data?.length > 0) {
        remoteKeyNo.value = item.data.data?.length;
      }
    });
  }
});
</script>
