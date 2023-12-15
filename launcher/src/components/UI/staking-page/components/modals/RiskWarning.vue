<template>
  <staking-custom-modal
    main-title="Risk Warning"
    title-color="warning"
    :message-text="getTextMessage"
    confirm-text="Accept"
    :disabled-button="activeButton"
    @confirm-action="acceptRisk"
  >
    <template #content>
      <div
        class="w-full col-start-1 col-span-full row-start-2 row-end-5 grid grid-cols-3 grid-rows-3 items-center overflow-hidden"
      >
        <div class="col-start-1 col-span-full row-start-1 row-span-3 flex justify-center items-center space-x-1">
          <div class="warning-container">
            <div class="icon-part">
              <img src="/img/icon/the-staking/stereum-error.png" alt="warning" />
            </div>
            <div class="top-message">
              <p>
                {{ $t("displayValidator.warningMessage") }}
              </p>
            </div>
            <div class="warning-alarm">
              <span>{{ $t("displayValidator.warningAlarm") }}</span>
            </div>
            <div class="warning-question">
              <span> {{ $t("displayValidator.warningQuestion") }}</span>
            </div>
            <div class="button-box">
              <div class="sure-button" @click="acceptRisk">
                <span>{{ $t("displayValidator.sure") }}</span>
              </div>
              <div class="cancel-button" @click="cancelHandler">
                <span>{{ $t("displayValidator.cancel") }}</span>
              </div>
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

const getTextMessage = computed(() => {
  return t("displayValidator.warningMessage");
});

//Methods

const acceptRisk = () => {
  emit("acceptRisk");
};

const cancelHandler = () => {
  stakingStore.setActiveModal(null);
  stakingStore.setActivePanel(null);
};
</script>
