import { computed } from 'vue';
<template>
  <div
    class="w-full h-8 rounded-full grid grid-cols-24 items-center p-1 cursor-pointer animate__animated animate__slideInLeft animate__delay-0.5s mt-1"
    :class="[props.item?.selected ? 'bg-blue-400 ' : 'bg-gray-700 ', props.item?.showExitText ? 'bg-red-500 z-10' : '']"
    @click="selectKey(props.item)"
  >
    <div class="col-start-1 col-span-1 self-center overflow-hidden flex justify-start items-center">
      <div
        class="w-6 h-6 rounded-full cursor-pointer p-[2px]"
        :class="setupStore.getBGColor(props.item?.color)"
        @mouseenter="footerStore.cursorLocation = `${props.item.isRemote ? rm : pk}`"
        @mouseleave="footerStore.cursorLocation = ''"
      >
        <img
          v-if="props.item.isRemote"
          class="w-full h-full"
          src="/img/icon/staking-page-icons/remote-key-icon.svg"
          alt="Key Icon"
          @mousedown.prevent
        />
        <img v-else class="w-full h-full" src="/img/icon/staking-page-icons/key-icon.png" alt="Key Icon" @mousedown.prevent />
      </div>
    </div>
    <div
      class="col-start-2 col-end-8 self-center overflow-hidden flex justify-start items-center"
      @mouseenter="footerStore.cursorLocation = `${props.item.key}`"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <span class="text-center font-semibold text-xs" :class="props.item?.selected ? 'text-gray-800' : 'text-gray-300'">{{
        displayText
      }}</span>
    </div>

    <img
      class="w-6 h-6 col-start-8 col-span-1 self-center mx-auto"
      :src="props.item?.icon"
      alt="Client Icon"
      @mousedown.prevent
      @mouseenter="footerStore.cursorLocation = `${serviceExpl}`"
      @mouseleave="footerStore.cursorLocation = ''"
    />

    <span
      class="col-start-9 col-end-12 self-center text-center text-xs text-gray-300 overflow-hidden"
      :class="props.item.selected ? 'text-gray-800' : 'text-gray-300'"
      :style="{ color: getStatusColor }"
      @mouseenter="
        footerStore.cursorLocation = `${t('displayValidator.activeExpl', {
          status: getKeyHandlingFooter,
        })}`
      "
      @mouseleave="footerStore.cursorLocation = ''"
      >{{ getKeyHandlingTime }}</span
    >

    <div
      class="w-full col-start-12 col-end-13 self-center overflow-hidden flex justify-center items-center"
      @mouseenter="footerStore.cursorLocation = `${state}`"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <img class="w-6 h-6" :src="getKeyState" alt="icon" @mousedown.prevent />
    </div>

    <span
      class="col-start-13 col-end-17 self-center text-center text-xs text-gray-300 overflow-hidden"
      :class="props.item.selected ? 'text-gray-800' : 'text-gray-300'"
      @mouseenter="footerStore.cursorLocation = `${balExpl}`"
      @mouseleave="footerStore.cursorLocation = ''"
      >{{ props.item.balance }}</span
    >

    <div class="h-full col-start-17 col-span-full bg-[#151618] rounded-full grid grid-cols-6 items-center" @mousedown.prevent>
      <div
        class="col-start-1 col-span-1 w-full h-full rounded-md justify-self-center flex justify-center items-center"
        @mouseenter="footerStore.cursorLocation = `Beaconcha.in`"
        @mouseleave="footerStore.cursorLocation = ''"
      >
        <img
          class="w-5 h-5 hover:scale-105 active:scale-95 cursor-pointer transition-all duration-150"
          src="/img/icon/staking-page-icons/beaconcha.png"
          alt="Icon"
          @mousedown.prevent
          @click="navToBeaconcha(props.item.network)"
        />
      </div>
      <div
        class="col-start-2 col-span-1 w-full h-full rounded-md justify-self-center flex justify-center items-center"
        @mouseenter="footerStore.cursorLocation = `${copyPub}`"
        @mouseleave="footerStore.cursorLocation = ''"
      >
        <img
          class="w-5 h-5 bg-[#343434] rounded-sm hover:scale-105 active:scale-95 cursor-pointer transition-all duration-150"
          src="/img/icon/staking-page-icons/copy.png"
          alt="Icon"
          @mousedown.prevent
          @click="copyHandler(props.item)"
        />
      </div>
      <div
        class="col-start-3 col-span-1 w-full h-full rounded-md justify-self-center flex justify-center items-center"
        @mouseenter="footerStore.cursorLocation = `${renameVal}`"
        @mouseleave="footerStore.cursorLocation = ''"
      >
        <img
          class="w-5 h-5 hover:scale-105 active:scale-95 cursor-pointer transition-all duration-150"
          src="/img/icon/staking-page-icons/rename.png"
          alt="Icon"
          @mousedown.prevent
          @click="renameKey(props.item)"
        />
      </div>
      <div
        class="col-start-4 col-span-1 w-full h-full rounded-md justify-self-center flex justify-center items-center"
        @mouseenter="footerStore.cursorLocation = `${setFee}`"
        @mouseleave="footerStore.cursorLocation = ''"
      >
        <img
          class="w-5 h-5 hover:scale-105 active:scale-95 cursor-pointer transition-all duration-150"
          src="/img/icon/staking-page-icons/option-fee-recepient.png"
          alt="Icon"
          @mousedown.prevent
          @click="FeeRecepient"
        />
      </div>
      <div
        class="col-start-5 col-span-1 w-full h-full rounded-md justify-self-center flex justify-center items-center"
        @mouseenter="footerStore.cursorLocation = `${removVal}`"
        @mouseleave="footerStore.cursorLocation = ''"
      >
        <img
          class="w-5 h-5 hover:scale-105 active:scale-95 cursor-pointer transition-all duration-150"
          src="/img/icon/staking-page-icons/option-remove.png"
          alt="Icon"
          @mousedown.prevent
          @click="removeSingle(props.item)"
        />
      </div>
      <div
        class="col-start-6 col-span-1 w-full h-full rounded-md justify-self-center flex justify-center items-center"
        @mouseenter="footerStore.cursorLocation = `${exitChain}`"
        @mouseleave="footerStore.cursorLocation = ''"
      >
        <img
          class="w-5 h-5 hover:scale-105 active:scale-95 cursor-pointer transition-all duration-150"
          src="/img/icon/staking-page-icons/option-withdraw.png"
          alt="Icon"
          @mousedown.prevent
          @click="withdrawHandler"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStakingStore } from "@/store/theStaking";
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";
import { useSetups } from "@/store/setups";

const props = defineProps({
  item: {
    type: Object || String,
    required: true,
  },
});

const stakingStore = useStakingStore();
const footerStore = useFooter();
const setupStore = useSetups();

const t = i18n.global.t;
//Key Status Icons
const activeStatusIcon = "/img/icon/staking-page-icons/validator-state-active.png";
const slashedStatusIcon = "/img/icon/staking-page-icons/validator-state-slashed.png";
const depositStatusIcon = "/img/icon/staking-page-icons/validator-state-not-deposited.png";
const offlineStatusIcon = "/img/icon/staking-page-icons/validator-state-offline.png";
const pendingStatusIcon = "/img/icon/staking-page-icons/validator-state-in-activation-queue.png";
const exitedStatusIcon = "/img/icon/staking-page-icons/validator-state-exited.png";
const apiProblems = "/img/icon/staking-page-icons/validator-state-unknown.png";
const apiLoading = "/animation/loading/turning-circle.gif";
const pk = t("displayValidator.pk");
const rm = t("displayValidator.rm");
const state = t("displayValidator.state");
const serviceExpl = t("displayValidator.serviceExpl");
const balExpl = t("displayValidator.balExpl");
const copyPub = t("displayValidator.copyPub");
const setFee = t("displayValidator.setFee");
const renameVal = t("displayValidator.renameVal");
const removVal = t("displayValidator.removVal");
const exitChain = t("displayValidator.exitChain");

const getKeyState = computed(() => {
  const item = props.item.status;
  switch (item) {
    case "active_online":
      return activeStatusIcon;
    case "active":
      return activeStatusIcon;
    case "active_offline":
      return offlineStatusIcon;
    case "slashed":
      return slashedStatusIcon;
    case "pending":
      return pendingStatusIcon;
    case "exited":
      return exitedStatusIcon;
    case "withdrawal":
      return exitedStatusIcon;
    case "NA":
      return apiProblems;
    case "loading":
      return apiLoading;
    default:
      return depositStatusIcon;
  }
});

const getKeyHandlingTime = computed(() => {
  const item = props.item.status;
  switch (item) {
    case "active_online":
    case "active":
    case "active_offline":
    case "slashed":
      return props.item.activeSince;
    case "pending":
      return props.item.elgibilitySince;
    case "exited":
      return props.item.exitSince;
    case "withdrawal":
      return props.item.withdrawableSince;
    case "NA":
    case "loading":
    default:
      return "-";
  }
});

const getKeyHandlingFooter = computed(() => {
  const item = props.item.status;
  switch (item) {
    case "active_online":
    case "active":
      return "activated";
    case "slashed":
      return "slashed";

    case "active_offline":
      return "offline";
    case "pending":
      return "pending";
    case "exited":
      return "exited";
    case "withdrawal":
      return "withdrawable";
    case "NA":
      return "problems";
    case "loading":
      return "loading";
    default:
      return "-";
  }
});
const getStatusColor = computed(() => {
  const item = props.item.status;
  switch (item) {
    case "active_online":
    case "active":
    case "active_offline":
    case "slashed":
      return "#eee";
    case "pending":
      return "#06a5ff";
    case "exited":
    case "withdrawal":
      return "#f00";
    case "NA":
    case "loading":
    default:
      return "yellow";
  }
});

const formattedPubKey = computed(() => {
  const pubkey = props.item.key;
  if (pubkey && pubkey.length > 20) {
    return `${pubkey.substring(0, 10)} . . . ${pubkey.substring(pubkey.length - 10)}`;
  }
  return pubkey;
});

const displayText = computed(() => {
  const item = props.item;
  if (item.displayName && !stakingStore.isPubkeyVisible) {
    return item.displayName;
  }
  return formattedPubKey.value; // Assuming formattedPubKey is the formatted version of the public key
});

//Methods
const navToBeaconcha = (network) => {
  const urls = {
    gnosis: "https://gnosischa.in/",
    sepolia: "https://sepolia.beaconcha.in/",
    mainnet: "https://beaconcha.in/",
    holesky: "https://holesky.beaconcha.in/",
  };

  const url = urls[network] + "validator/" + props.item.key;
  if (url) {
    window.open(url, "_blank");
  } else {
    console.error("Invalid network provided");
  }
};

const selectKey = (key) => {
  if (stakingStore.isGroupingAllowed) {
    const updatedKeys = stakingStore.keys.map((item) => {
      if (item.key === key.key) {
        return { ...item, selected: !item.selected }; // Toggle selection
      }
      return item;
    });

    stakingStore.keys = updatedKeys;
    stakingStore.selectedValidatorKeys = updatedKeys.filter((item) => item.selected);
  }
};

const renameKey = (key) => {
  stakingStore.keys.forEach((item) => {
    item.selected = false;
  });
  key.selected = true;
  stakingStore.selectKeyToRename = key;
  stakingStore.setActivePanel("renameKey");
};

const copyHandler = (item) => {
  let toCopy = item.key;
  navigator.clipboard
    .writeText(toCopy)
    .then(() => {
      footerStore.cursorLocation = t("displayValidator.copiedPub");
    })
    .catch(() => {
      console.log(`can't copy`);
    });
  footerStore.cursorLocation = "";
};

const removeSingle = (item) => {
  item.showExitText = true;
  stakingStore.selectedKeyToRemove = item;
  stakingStore.removeKeys.push(item);
  stakingStore.setActiveModal("removeValidator");
};

const withdrawHandler = () => {
  if (props.item) {
    props.item.showExitText = true;
    stakingStore.selectedSingleKeyToWithdraw = props.item;
    stakingStore.setActiveModal("withdraw");
  }

  stakingStore.setActiveModal("withdraw");
};

const FeeRecepient = () => {
  props.item.selected = true;
  stakingStore.selectKeyForFee = props.item;
  stakingStore.setActivePanel(null);
  stakingStore.setActivePanel("fee");
};
</script>
<style scoped>
* {
  box-sizing: border-box;
}
</style>
