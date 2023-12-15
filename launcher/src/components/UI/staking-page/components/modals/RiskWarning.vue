<template>
  <staking-custom-modal
    main-title="Risk Warning"
    title-color="remove"
    :message-text="getTextMessage"
    click-outside-text="Click outside to cancel"
    confirm-text="Accept"
    :active-button="true"
    @confirm-action="acceptRisk"
  >
    <template #content>
      <div
        class="w-full col-start-1 col-span-full row-start-2 row-end-5 grid grid-cols-3 grid-rows-3 items-center overflow-hidden"
      >
        <div class="col-start-3 col-span-full row-start-1 row-span-2 flex justify-center items-center px-4">
          <span>{{ t("displayValidator.warningMessage") }}</span>
        </div>
          <div >
            <span>{{ $t("displayValidator.warningAlarm") }}</span>
          </div>
          <div class="warning-question">
            <span> {{ $t("displayValidator.warningQuestion") }}</span>
          </div>
          <div class="button-box">
            <div class="sure-button" @click="acceptRisk">
              <span>{{ $t("displayValidator.sure") }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </staking-custom-modal>
</template>
<script setup>
import { useStakingStore } from "@/store/theStaking";
import i18n from "@/includes/i18n";
import { computed } from "vue";

const emit = defineEmits(["acceptRisk"]);

const t = i18n.global.t;

const stakingStore = useStakingStore();


const getBtnText = computed(() => {
  return t("displayValidator.sure");
});

const getTextMessage = computed(() => {
  return t("displayValidator.warningMessage");
});

//Methods

const acceptRisk = () => {
  emit("acceptRisk");
};
</script>
