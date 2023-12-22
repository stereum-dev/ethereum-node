<template>
  <div
    class="w-full col-start-1 col-span-full row-start-12 row-end-13 grid grid-cols-12 grid-rows-1 items-center z-10 border border-gray-600 rounded-b-md bg-[#151618] px-1 pr-0"
  >
    <div class="w-full h-full col-start-1 col-end-4 grid grid-cols-3 py-1">
      <div
        class="w-2/3 h-full col-start-1 col-span-1 flex justify-center items-center rounded-sm bg-[#336666] hover:bg-[#234545] transition-all duration-100 cursor-pointer px-1 active:scale-95"
        :class="stakingStore.isPreviewListActive ? 'opacity-50 pointer-events-none ' : ''"
      >
        <img
          v-if="stakingStore.isGroupListActive"
          class="w-5 h-5"
          src="/img/icon/the-staking/ungroup.png"
          alt="Group Icon"
          @click="removeGroup"
          @mousedown.prevent
        />
        <img
          v-else
          class="w-5 h-5"
          src="/img/icon/the-staking/group.png"
          alt="Group Icon"
          @click="groupingPanel"
          @mousedown.prevent
        />
      </div>
      <div
        class="w-2/3 h-full col-start-2 col-span-1 flex justify-center items-center rounded-sm bg-[#336666] hover:bg-[#234545] transition-all duration-100 cursor-pointer active:scale-95 px-1"
        :class="
          stakingStore.isGroupListActive || stakingStore.isPreviewListActive ? 'opacity-50 pointer-events-none ' : ''
        "
      >
        <img
          class="h-6"
          src="/img/icon/the-staking/filter.png"
          alt="Insert Icon"
          @click="searchPanel"
          @mousedown.prevent
        />
      </div>
      <div
        class="w-2/3 h-full col-start-3 col-span-1 flex justify-center items-center rounded-sm bg-[#336666] hover:bg-[#234545] transition-all duration-100 cursor-pointer active:scale-95 px-1"
        :class="
          stakingStore.isGroupListActive || stakingStore.isPreviewListActive ? 'opacity-50 pointer-events-none ' : ''
        "
      >
        <img class="h-6" :src="aliasIcon" alt="Insert Icon" @click="displayKeyAlias" @mousedown.prevent />
      </div>
    </div>

    <div
      class="w-full h-full col-start-4 col-end-13 row-start-1 grid grid-cols-12 items-center self-center px-1 relative"
    >
      <component
        :is="activePanel?.component"
        v-bind="activePanel?.props"
        v-on="
          activePanel?.events
            ? Object.keys(activePanel?.events).reduce((acc, eventName) => {
                acc[eventName] = (args) => handleEvent(eventName, args);
                return acc;
              }, {})
            : {}
        "
      />
    </div>
  </div>
</template>
<script setup>
import InsertPanel from "./panels/InsertPanel.vue";
import ValidatorPanel from "./panels/ValidatorPanel.vue";
import PasswordPanel from "./panels/PasswordPanel.vue";
import SearchPanel from "./panels/SearchPanel.vue";
import FeePanel from "./panels/FeePanel.vue";
import GroupingPanel from "./panels/GroupingPanel.vue";
import RenameKey from "./panels/RenameKey.vue";
import GraffitiPanel from "./panels/GraffitiPanel.vue";
import RemotePanel from "./panels/RemotePanel.vue";
import ManualRemote from "./panels/ManualRemote.vue";
import { useStakingStore } from "@/store/theStaking";
import { computed, watchEffect } from "vue";

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
const stakingStore = useStakingStore();

const panels = {
  insert: {
    component: InsertPanel,
    events: {
      uploadFile: uploadFile,
    },
  },
  validator: {
    component: ValidatorPanel,
    events: {
      pickValidator: pickValidator,
    },
  },
  password: {
    component: PasswordPanel,
    events: {
      confirmPassword: () => confirmPassword,
    },
  },
  search: {
    component: SearchPanel,
  },
  fee: {
    component: FeePanel,
    events: {
      confirmFeerecepient: () => confirmFeerecepient,
    },
  },
  grouping: {
    component: GroupingPanel,
    events: {
      confirmGrouping: confirmGrouping,
    },
  },
  renameKey: {
    component: RenameKey,
    events: {
      confirmRename: confirmRename,
      resetName: resetName,
    },
  },
  graffiti: {
    component: GraffitiPanel,
    events: {
      confirmGraffiti: () => confirmGraffiti,
    },
  },
  remote: {
    component: RemotePanel,
  },
  manualRemote: {
    component: ManualRemote,
    events: {
      confirmRemote: () => confirmRemote,
    },
  },
};

//Computed & Watchers
const activePanel = computed(() => {
  const panelConfig = panels[stakingStore.activePanel] || {};
  if (panelConfig) {
    return {
      component: panelConfig.component || null,
      props: panelConfig.props || {},
      events: panelConfig.events || {},
    };
  }
  return { component: "insert" };
});

const aliasIcon = computed(() => {
  if (!stakingStore.isPubkeyVisible) {
    return "/img/icon/the-staking/display-name.png";
  } else {
    return "/img/icon/the-staking/hide.png";
  }
});

watchEffect(() => {
  if (stakingStore.activePanel === null) {
    stakingStore.setActivePanel("insert");
  }
});

//Methods
const handleEvent = (eventName, args) => {
  emit(eventName, args);
};
const confirmRemote = () => {
  handleEvent("confirmRemote");
};

const confirmGrouping = (groupName) => {
  handleEvent("confirmGrouping", groupName);
};
const confirmFeerecepient = (item) => {
  handleEvent("confirmFeerecepient", item);
};

const pickValidator = (service) => {
  handleEvent("pickValidator", service);
};

const confirmRename = (newName) => {
  handleEvent("confirmRename", newName);
};

const resetName = (item) => {
  handleEvent("resetName", item);
};

const uploadFile = (event) => {
  handleEvent("uploadFile", event);
};

const confirmPassword = (pass) => {
  handleEvent("confirmPassword", pass);
};

const confirmGraffiti = (graffiti) => {
  handleEvent("confirmGraffiti", graffiti);
};

const displayKeyAlias = () => {
  stakingStore.isPubkeyVisible = !stakingStore.isPubkeyVisible;
};

const groupingPanel = () => {
  stakingStore.isPreviewListActive = false;
  stakingStore.setActivePanel("grouping");
  stakingStore.isGroupingAllowed = true;
};
const removeGroup = () => {
  stakingStore.isGroupListActive = false;
  stakingStore.setActivePanel("insert");
  if (stakingStore.currentGroup) {
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
