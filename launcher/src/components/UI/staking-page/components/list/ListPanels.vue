<template>
  <div class="w-full h-10 absolute inset-x-0 -bottom-4 row-end-13 grid grid-cols-12 grid-rows-1 items-center z-10">
    <div class="col-start-2 col-span-1 flex justify-center items-center justify-self-start self-center">
      <img
        class="w-7 h-7 shadow-md hover:scale-110 hover:shadow-lg hover:shadow-black shadow-black cursor-pointer active:scale-100 transition-all duration-150 rounded-full"
        src="/img/icon/the-staking/group.png"
        alt="Group Icon"
        @click="groupingPanel"
      />
    </div>
    <div class="col-start-3 col-span-1 flex justify-center items-center justify-self-start self-center">
      <img
        class="w-7 h-7 shadow-md hover:scale-110 hover:shadow-lg hover:shadow-black shadow-black cursor-pointer active:scale-100 transition-all duration-150 rounded-full"
        src="/img/icon/the-staking/search.png"
        alt="Insert Icon"
        @click="searchPanel"
      />
    </div>

    <div
      class="w-full h-full col-start-4 col-end-12 row-start-1 grid grid-cols-12 overflow-hidden items-center self-center relative"
    >
      <transition
        tag="div"
        class="w-full h-full"
        enter-to-class="opacity-0 translate-y-0 duration-300 delay-100"
        leave-to-class="opacity-0 -translate-y-6 duration-300"
      >
        <component
          :is="activePanel?.component"
          v-bind="activePanel?.props"
          v-on="
            activePanel?.events
              ? Object.keys(activePanel.events).reduce((acc, eventName) => {
                  acc[eventName] = (args) => handleEvent(eventName, args);
                  return acc;
                }, {})
              : {}
          "
        />
      </transition>
    </div>
  </div>
</template>
<script setup>
import InsertPanel from "./panels/InsertPanel.vue";
import ValidatorPanel from "./panels/ValidatorPanel.vue";
import PasswordPanel from "./panels/PasswordPanel.vue";
import SearchPanel from "./panels/SearchPanel.vue";
import GrafitiPanel from "./panels/GrafitiPanel.vue";
import GroupingPanel from "./panels/GroupingPanel.vue";
import { useStakingStore } from "@/store/theStaking";
import { computed, watchEffect } from "vue";

//Emits
const emit = defineEmits(["confirmGrouping", "pickValidator", "uploadFile", "confirmPassword"]);

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
  grafiti: {
    component: GrafitiPanel,
  },
  grouping: {
    component: GroupingPanel,
    events: {
      confirmGrouping: confirmGrouping,
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

watchEffect(() => {
  if (stakingStore.activePanel === null) {
    stakingStore.setActivePanel("insert");
  }
});

//Methods
const handleEvent = (eventName, args) => {
  emit(eventName, args);
};

const confirmGrouping = (groupName) => {
  handleEvent("confirmGrouping", groupName);
};

const pickValidator = (service) => {
  handleEvent("pickValidator", service);
};

const uploadFile = (event) => {
  handleEvent("uploadFile", event);
};

const confirmPassword = (pass) => {
  handleEvent("confirmPassword", pass);
};

const groupingPanel = () => {
  stakingStore.setActivePanel("grouping");
  stakingStore.isGroupingAllowed = true;
};

const searchPanel = () => {
  if (stakingStore.activePanel === "search") {
    stakingStore.setActivePanel(null);
  } else {
    stakingStore.setActivePanel("search");
  }
};
</script>
