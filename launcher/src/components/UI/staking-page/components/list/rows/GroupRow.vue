import { useStakingStore } from '@/store/theStaking';
<template>
  <div
    class="w-full h-8 bg-[#336666] rounded-full grid grid-cols-12 p-1 animate__animated"
    :class="isRemoveActive ? 'animate__slideOutRight animate__faster ' : 'animate__slideInLeft animate__delay-0.5s'"
  >
    <div
      class="col-start-1 col-end-4 self-center overflow-hidden flex justify-start items-center"
      @mouseenter="footerStore.cursorLocation = `${grpNam} ${groupName}`"
    >
      <img class="w-6" src="/img/icon/staking-page-icons/group-circle-icon.png" alt="Folder Icon" @mousedown.prevent />
      <span class="text-center text-sm text-gray-300 ml-1 overflow-hidden">{{ groupName }}</span>
    </div>
    <div
      class="col-start-4 col-end-7 self-center text-center text-sm text-gray-300 overflow-hidden flex justify-start items-center"
      @mouseenter="footerStore.cursorLocation = `${keyNumGrp}`"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <span class="">{{ `Contains ${getkeyNumbers} key (s)` }}</span>
    </div>

    <div
      class="col-start-7 col-end-10 self-center overflow-hidden flex justify-start items-center"
      @mouseenter="footerStore.cursorLocation = `${grpBal} `"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <span class="text-left font-semibold text-xs text-amber-300 leading-8">{{ getBalanceSum }}</span>
    </div>
    <div class="col-start-10 col-span-full bg-[#151618] rounded-full grid grid-cols-3 items-center">
      <div
        class="col-start-1 col-span-1 justify-self-center"
        @mouseenter="footerStore.cursorLocation = `${openGrp}`"
        @mouseleave="footerStore.cursorLocation = ''"
      >
        <img
          class="w-5 h-5 hover:scale-105 active:scale-95 cursor-pointer transition-all duration-150"
          src="/img/icon/staking-page-icons/open-group.png"
          alt="Icon"
          @mousedown.prevent
          @click="openGroup"
        />
      </div>
      <div
        class="col-start-2 col-span-1 justify-self-center"
        @mouseenter="footerStore.cursorLocation = `${renameGrp}`"
        @mouseleave="footerStore.cursorLocation = ''"
      >
        <img
          class="w-5 h-5 hover:scale-105 active:scale-95 cursor-pointer transition-all duration-150"
          src="/img/icon/staking-page-icons/rename.png"
          alt="Icon"
          @mousedown.prevent
          @click="renameGroup"
        />
      </div>

      <!-- <div class="col-start-3 col-span-1 justify-self-center">
        <img
          class="w-5 h-5 hover:scale-105 active:scale-95 cursor-pointer transition-all duration-150 opacity-30 pointer-events-none"
          src="/img/icon/staking-page-icons/option-withdraw.png"
          alt="Icon"
          @mousedown.prevent
        />
      </div> -->
      <div
        class="col-start-3 col-span-1 justify-self-center"
        @mouseenter="footerStore.cursorLocation = `${removGrp}`"
        @mouseleave="footerStore.cursorLocation = ''"
      >
        <img
          class="w-5 h-5 hover:scale-105 active:scale-95 cursor-pointer transition-all duration-150"
          src="/img/icon/staking-page-icons/remove-group.png"
          alt="Icon"
          @mousedown.prevent
          @click="removeGroup"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStakingStore } from "@/store/theStaking";
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";

const t = i18n.global.t;

const footerStore = useFooter();

const props = defineProps({
  item: {
    type: Object || String,
    required: true,
  },
});

const grpNam = t("displayValidator.grpNam");
const keyNumGrp = t("displayValidator.keyNumGrp");
const grpBal = t("displayValidator.grpBal");
const openGrp = t("displayValidator.openGrp");
const renameGrp = t("displayValidator.renameGrp");
const removGrp = t("displayValidator.removGrp");

const stakingStore = useStakingStore();

const isRemoveActive = ref(false);

const getBalanceSum = computed(() => {
  return props.item.keys.reduce((acc, key) => {
    if (key.balance === "-") {
      return acc;
    }
    return acc + key.balance;
  }, 0);
});

const getkeyNumbers = computed(() => {
  return props.item.keys.length;
});

const groupName = computed(() => {
  return props.item.name;
});

const emit = defineEmits(["openGroup", "renameGroup", "withdrawGroup", "removeGroup"]);

const openGroup = () => {
  emit("openGroup", props.item);
};

const renameGroup = () => {
  emit("renameGroup", props.item);
};

const removeGroup = () => {
  stakingStore.currentGroup = props.item;
  stakingStore.setActiveModal("removeGroup");
};
</script>
