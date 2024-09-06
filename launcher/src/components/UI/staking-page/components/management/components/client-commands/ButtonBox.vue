<template>
  <div class="h-full col-start-1 col-span-full row-start-2 row-span-full grid grid-cols-1 grid-rows-5 py-1 px-2">
    <ButtonRow
      v-for="button in buttonState"
      :key="button.text"
      :button="button"
      @mouseenter="footerStore.cursorLocation = `${button.tooltip}`"
      @mouseleave="footerStore.cursorLocation = ''"
    />
  </div>
</template>
<script setup>
import ButtonRow from "./ButtonRow.vue";
import { ref } from "vue";
import { useStakingStore } from "@/store/theStaking";
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";

const t = i18n.global.t;

const footerStore = useFooter();

const emit = defineEmits(["removeMultiple", "importRemote", "withdrawMultiple", "graffitiPanel"]);

const stakingStore = useStakingStore();

const graffitiPanel = () => {
  emit("graffitiPanel");
};
const removeMultiple = () => {
  const keys = stakingStore.keys.filter((key) => key.validatorID === stakingStore.selectedServiceToFilter.config.serviceID);
  stakingStore.removeKeys = [...keys];
  stakingStore.setActiveModal("removeValidator");
};

const withdrawMultiple = () => {
  emit("withdrawMultiple");
};

const importRemote = () => {
  stakingStore.setActivePanel("remote");
};

const buttonState = ref([
  {
    text: "CHANGE ALL GRAFFITI",
    icon: "/img/icon/staking-page-icons/option-graffiti.png",
    events: graffitiPanel,
    tooltip: t("displayValidator.graffitiPanel"),
  },
  {
    text: "REMOVE ALL KEYS",
    icon: "/img/icon/staking-page-icons/option-remove.png",
    events: removeMultiple,
    tooltip: t("displayValidator.removeMultiple"),
  },
  {
    text: "WITHDRAW & EXIT ALL KEYS",
    icon: "/img/icon/staking-page-icons/option-withdraw.png",
    events: withdrawMultiple,
    tooltip: t("displayValidator.withdrawMultiple"),
  },
  {
    text: "Import Remote Keys",
    icon: "/img/icon/staking-page-icons/remote-key-icon.svg",
    events: importRemote,
    tooltip: t("displayValidator.importRemote"),
  },
]);
</script>
