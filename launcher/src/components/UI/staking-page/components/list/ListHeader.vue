<template>
  <div
    class="w-full col-start-1 col-span-full row-start-1 row-span-1 rounded-t-md border-b-2 grid grid-cols-12 bg-[#151618] border-gray-500"
  >
    <div
      v-if="stakingStore.isPreviewListActive"
      class="w-full h-full col-start-1 col-span-full flex justify-center items-center rounded-t-md bg-[#17A2B8] space-x-4"
    >
      <span class="text-md font-semibold text-gray-200 uppercase">{{ $t("displayValidator.inserValidator") }}</span>
      <img class="w-4 h-5" src="/img/icon/staking-page-icons/black-key.png" alt="icon" />
    </div>
    <div
      v-else-if="stakingStore.isGroupListActive"
      class="w-full h-full col-start-1 col-span-full rounded-t-md bg-[#336666] grid grid-cols-24 items-center px-3"
    >
      <img
        class="w-6 h-6 col-start-1 col-span-1 justify-self-center"
        src="/img/icon/staking-page-icons/group.png"
        alt="Manage Icon"
        @mousedown.prevent
      />
      <span class="col-start-2 col-span-10 justify-self-start text-md font-semibold text-gray-200 uppercase">{{
        stakingStore.currentGroup.name
      }}</span>

      <button
        class="w-7 h-7 col-start-24 col-span-full rounded-md flex justify-center items-center cursor-pointer border border-gray-600 bg-[#222526]"
        @mouseenter="footerStore.cursorLocation = `${backList}`"
        @mouseleave="footerStore.cursorLocation = ''"
        @click="close"
        @mousedown.prevent
      >
        <img
          class="w-3 h-3 hover:scale-110 active:scale-95 transition-all duration-150"
          src="/img/icon/staking-page-icons/backtolist.png"
          alt="Back Icon"
        />
      </button>
    </div>
    <div
      v-else-if="stakingStore.isRemoteListActive"
      class="w-full h-full col-start-1 col-span-full rounded-t-md bg-[#336666] grid grid-cols-24 items-center px-3"
    >
      <img
        class="w-6 h-6 col-start-1 col-span-1 justify-self-center"
        :src="stakingStore.selectedServiceToFilter.sIcon"
        alt="Manage Icon"
        @mousedown.prevent
      />
      <span class="col-start-2 col-end-6 justify-self-start text-xs font-semibold text-gray-200 uppercase">{{
        stakingStore.selectedServiceToFilter.name
      }}</span>
      <span class="col-start-7 col-end-20 text-center text-sm font-semibold text-gray-200 uppercase">{{ web3Import }}</span>

      <button
        class="w-7 h-7 shadow-md shadow-[#242c29] col-start-24 col-span-full rounded-md flex justify-center items-center cursor-pointer hover:scale-105 active:scale-95 transition-all duration-150 bg-[#578f84] border border-[#6c7e78] active:shadow-none"
        @mouseenter="footerStore.cursorLocation = `${backList}`"
        @mouseleave="footerStore.cursorLocation = ''"
        @click="close"
        @mousedown.prevent
      >
        <img class="w-5 h-5" src="/img/icon/staking-page-icons/close.png" alt="Back Icon" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { useStakingStore } from "@/store/theStaking";
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";

const t = i18n.global.t;

const stakingStore = useStakingStore();
const footerStore = useFooter();

const backList = t("displayValidator.backList");
const web3Import = t("displayValidator.web3Import");

const close = () => {
  stakingStore.setActivePanel(null);
  stakingStore.isRemoteListActive = false;
  stakingStore.isGroupListActive = false;
  stakingStore.previewRemoteKeys = [];
  stakingStore.remoteUrl = "";
};
</script>
