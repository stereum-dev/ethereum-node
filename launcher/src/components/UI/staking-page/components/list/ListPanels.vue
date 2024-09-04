<template>
  <div
    class="w-full h-full min-h-9 col-start-1 col-span-full row-start-12 row-span-1 grid grid-cols-12 items-center border border-gray-600 rounded-b-md bg-[#151618] px-1 pr-0"
  >
    <div class="w-full h-full col-start-1 col-end-4 grid grid-cols-3 py-1">
      <div
        class="w-2/3 h-full col-start-1 col-span-1 flex justify-center items-center rounded-sm bg-[#336666] hover:bg-[#234545] transition-all duration-100 cursor-pointer px-1 active:scale-95"
        :class="stakingStore.isPreviewListActive || stakingStore.isStakingDisabled ? 'opacity-50 pointer-events-none ' : ''"
      >
        <img
          v-if="stakingStore.isGroupListActive"
          class="w-5 h-5"
          src="/img/icon/staking-page-icons/ungroup.png"
          alt="Group Icon"
          @click="removeGroup"
          @mousedown.prevent
          @mouseenter="footerStore.cursorLocation = `${removGrp}`"
          @mouseleave="footerStore.cursorLocation = ''"
        />
        <img
          v-else
          class="w-5 h-5"
          src="/img/icon/staking-page-icons/group.png"
          alt="Group Icon"
          @click="groupingPanel"
          @mousedown.prevent
          @mouseenter="footerStore.cursorLocation = `${crteGrp}`"
          @mouseleave="footerStore.cursorLocation = ''"
        />
      </div>
      <div
        class="w-2/3 h-full col-start-2 col-span-1 flex justify-center items-center rounded-sm bg-[#336666] hover:bg-[#234545] transition-all duration-100 cursor-pointer active:scale-95 px-1"
        :class="
          stakingStore.isGroupListActive || stakingStore.isPreviewListActive || stakingStore.isStakingDisabled
            ? 'opacity-50 pointer-events-none '
            : ''
        "
        @mouseenter="footerStore.cursorLocation = `${openSrch}`"
        @mouseleave="footerStore.cursorLocation = ''"
      >
        <img class="h-6" src="/img/icon/staking-page-icons/filter.png" alt="Insert Icon" @click="searchPanel" @mousedown.prevent />
      </div>
      <div
        class="w-2/3 h-full col-start-3 col-span-1 flex justify-center items-center rounded-sm bg-[#336666] hover:bg-[#234545] transition-all duration-100 cursor-pointer active:scale-95 px-1"
        :class="
          stakingStore.isGroupListActive || stakingStore.isPreviewListActive || stakingStore.isStakingDisabled
            ? 'opacity-50 pointer-events-none '
            : ''
        "
        @mouseenter="footerStore.cursorLocation = `${nameNumber}`"
        @mouseleave="footerStore.cursorLocation = ''"
      >
        <img class="h-6" :src="aliasIcon" alt="Insert Icon" @click="displayKeyAlias" @mousedown.prevent />
      </div>
    </div>

    <div class="w-full h-full col-start-4 col-end-13 grid grid-cols-12 items-center self-center px-1 relative">
      <component :is="activePanel.component" v-bind="activePanel.props" v-on="activePanel.events" />
    </div>
  </div>
</template>

<script setup>
import { useStakingStore } from "@/store/theStaking";
import { computed, defineAsyncComponent, watchEffect, shallowRef } from "vue";
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";

const t = i18n.global.t;

const footerStore = useFooter();
const stakingStore = useStakingStore();

const crteGrp = t("displayValidator.crteGrp");
const removGrp = t("displayValidator.removGrp");
const openSrch = t("displayValidator.openSrch");
const showValKey = t("displayValidator.showValKey");
const showKeyNam = t("displayValidator.showKeyNam");

//Emits
const emit = defineEmits([
  "confirmGrouping",
  "pickValidator",
  "uploadFile",
  "confirmPassword",
  "removeGroup",
  "confirmRename",
  "confirmFeerecepient",
  "resetName",
  "confirmGraffiti",
  "confirmRemote",
]);

//Stores

const panels = {
  insert: defineAsyncComponent(() => import("./panels/InsertPanel.vue")),
  validator: defineAsyncComponent(() => import("./panels/ValidatorPanel.vue")),
  password: defineAsyncComponent(() => import("./panels/PasswordPanel.vue")),
  search: defineAsyncComponent(() => import("./panels/SearchPanel.vue")),
  fee: defineAsyncComponent(() => import("./panels/FeePanel.vue")),
  grouping: defineAsyncComponent(() => import("./panels/GroupingPanel.vue")),
  renameKey: defineAsyncComponent(() => import("./panels/RenameKey.vue")),
  graffiti: defineAsyncComponent(() => import("./panels/GraffitiPanel.vue")),
  remote: defineAsyncComponent(() => import("./panels/RemotePanel.vue")),
  manualRemote: defineAsyncComponent(() => import("./panels/ManualRemote.vue")),
};

const activePanel = shallowRef({
  component: "insert",
  props: {},
  events: {},
});

//Computed & Watchers

const aliasIcon = computed(() => {
  if (!stakingStore.isPubkeyVisible) {
    return "/img/icon/staking-page-icons/display-name.png";
  } else {
    return "/img/icon/staking-page-icons/hide.png";
  }
});

const nameNumber = computed(() => {
  if (!stakingStore.isPubkeyVisible) {
    return showValKey;
  } else {
    return showKeyNam;
  }
});

watchEffect(() => {
  const panelName = stakingStore.activePanel;
  if (panels[panelName]) {
    activePanel.value = {
      component: panels[panelName],

      events: {
        // Define event handlers for each panel
        uploadFile: (file) => emit("uploadFile", file),
        pickValidator: (validator) => emit("pickValidator", validator),
        confirmPassword: (password) => emit("confirmPassword", password),
        confirmGrouping: (groupName) => emit("confirmGrouping", groupName),
        confirmRename: (newName) => emit("confirmRename", newName),
        resetName: (item) => emit("resetName", item),
        confirmFeerecepient: (item) => emit("confirmFeerecepient", item),
        confirmGraffiti: (graffiti) => emit("confirmGraffiti", graffiti),
        confirmRemote: () => emit("confirmRemote"),
      },
    };
  } else {
    activePanel.value.component = null;
  }
});

watchEffect(() => {
  if (stakingStore.activePanel === null || stakingStore.isStakingDisabled) {
    stakingStore.setActivePanel("insert");
  }
});

//Methods

const displayKeyAlias = () => {
  stakingStore.isPubkeyVisible = !stakingStore.isPubkeyVisible;
  footerStore.cursorLocation = "";
  !stakingStore.isPubkeyVisible ? (footerStore.cursorLocation = `${showValKey}`) : (footerStore.cursorLocation = `${showKeyNam}`);
};

const groupingPanel = () => {
  stakingStore.isPreviewListActive = false;
  stakingStore.setActivePanel("grouping");
  stakingStore.isGroupingAllowed = true;
};
const removeGroup = () => {
  if (stakingStore.currentGroup) {
    stakingStore.isGroupListActive = false;
    stakingStore.setActivePanel("insert");
    emit("removeGroup", stakingStore.currentGroup);
  }
};

const searchPanel = () => {
  stakingStore.isPreviewListActive = false;
  if (stakingStore.activePanel === "search") {
    stakingStore.setActivePanel(null);
    stakingStore.searchContent = "";
  } else {
    stakingStore.setActivePanel("search");
  }
};
</script>
