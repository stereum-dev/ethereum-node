<template>
  <div class="h-full col-start-1 col-span-full row-start-2 row-span-full grid grid-cols-1 grid-rows-5 py-1 px-2">
    <ButtonRow
      v-for="button in filteredButtonState"
      v-show="!button.isHidden"
      :key="button.text"
      :button="button"
      @mouseenter="footerStore.cursorLocation = `${button.tooltip}`"
      @mouseleave="footerStore.cursorLocation = ''"
    />
  </div>
</template>

<script setup>
import ButtonRow from "./ButtonRow.vue";
import { computed, ref } from "vue";
import { useStakingStore } from "@/store/theStaking";
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";

const t = i18n.global.t;

const footerStore = useFooter();
const stakingStore = useStakingStore();

const emit = defineEmits(["removeMultiple", "importRemote", "withdrawMultiple", "graffitiPanel"]);

// Define Button Functions
const graffitiPanel = () => {
  emit("graffitiPanel");
};
const removeMultiple = () => {
  const keys = stakingStore.keys.filter((key) => key.validatorID === stakingStore.selectedServiceToFilter?.config.serviceID);
  stakingStore.removeKeys = [...keys];
  stakingStore.setActiveModal("removeValidator");
};
const withdrawMultiple = () => {
  emit("withdrawMultiple");
};
const importRemote = () => {
  stakingStore.setActivePanel("remote");
};

// Define Button States
const buttonState = ref([
  {
    text: "CHANGE ALL GRAFFITI",
    icon: "/img/icon/staking-page-icons/option-graffiti.png",
    events: graffitiPanel,
    tooltip: t("displayValidator.graffitiPanel"),
    isHidden: false,
  },
  {
    text: "REMOVE ALL KEYS",
    icon: "/img/icon/staking-page-icons/option-remove.png",
    events: removeMultiple,
    tooltip: t("displayValidator.removeMultiple"),
    isHidden: false,
  },
  {
    text: "WITHDRAW & EXIT ALL KEYS",
    icon: "/img/icon/staking-page-icons/option-withdraw.png",
    events: withdrawMultiple,
    tooltip: t("displayValidator.withdrawMultiple"),
    isHidden: false,
  },
  {
    text: "Import Remote Keys",
    icon: "/img/icon/staking-page-icons/remote-key-icon.svg",
    events: importRemote,
    tooltip: t("displayValidator.importRemote"),
    isHidden: false,
  },
  //Testnet https://csm.testnet.fi/?ref=stereum
  //Mainnet https://csm.lido.fi/
  // {
  //   text: "GO TO CSM WEBSITE",
  //   icon: "/img/icon/staking-page-icons/remote-key-icon.svg",
  //   events: () => window.open("https://example.com", "_blank"),
  //   tooltip: "Visit our website",
  //   isHidden: false,
  // },
]);

// Computed Property to Filter Button Visibility
const filteredButtonState = computed(() => {
  const selectedService = stakingStore.selectedServiceToFilter?.service;

  return buttonState.value.map((button) => {
    if (selectedService === "CharonService" || selectedService === "SSVNetworkService" || stakingStore.displayAllKeysActive) {
      return { ...button, isHidden: true };
    }

    return { ...button, isHidden: false };
  });
});
</script>
