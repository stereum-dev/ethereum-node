<template>
  <div class="col-start-19 col-span-full grid grid-cols-5 items-center">
    <SingleMenu v-for="item in items" :key="item.name" :item="item" />
  </div>
</template>

//
<script setup>
import SingleMenu from "./SingleMenu.vue";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import ControlService from "@/store/ControlService";
import UpdatePanel from "../modals/UpdatePanel.vue";
import LogoutModal from "../modals/LogoutModal.vue";
import ReconnectModal from "../modals/ReconnectModal.vue";
import SupportModal from "../modals/SupportModal.vue";
import NotifModal from "../modals/NotifModal.vue";
import TutorialGuide from "../../../the-node/TutorialGuide.vue";
import StakeGuide from "../../../the-node/StakeGuide.vue";
import { useUpdateCheck } from "@/composables/version";
import { useFooter } from "@/store/theFooter";
import { useNodeHeader } from "@/store/nodeHeader";
import { useServices } from "@/store/services";
import { useServers } from "@/store/servers";

const items = ref([
  {
    name: "Help",
    icon: "/img/icon/header-icons/question-mark.png",
    action: supportModalOpen,
  },
  {
    name: "Notifications",
    icon: "/img/icon/header-icons/megaphone9.png",
    action: notifModalOpen,
  },
  {
    name: "Available Update",
    icon: "/img/icon/header-icons/update-green.png",
    activeIcon: "/img/icon/header-icons/update-blue.png",
    action: updateModalHandler,
  },
  {
    name: "Settings",
    icon: "/img/icon/header-icons/setting4.png",
    path: "/setting",
  },
  {
    name: "Logout",
    icon: "/img/icon/header-icons/exit9.png",
    action: logoutModalHandler,
  },
]);

// Component imports
const updatePanel = UpdatePanel;
const logoutModal = LogoutModal;
const reconnectModal = ReconnectModal;
const supportModal = SupportModal;
const notifModal = NotifModal;
const tutorialGuide = TutorialGuide;
const stakeGuide = StakeGuide;

// Using the stores
const footerStore = useFooter();
const headerStore = useNodeHeader();
const serviceStore = useServices();
const serverStore = useServers();
const router = useRouter();

// Reactive data
const test = ref(true);
const logoutModalIsActive = ref(false);
const reconnectModalIsActive = ref(false);
const supportModalIsActive = ref(false);
// ... other reactive states

// Computed properties
const isUpdateAvailable = computed(() => nodeHeaderStore.isUpdateAvailable);
// ... other computed properties using nodeHeaderStore, servicesStore, etc.

// Methods are now functions
const updateConfirmationHandler = async () => {
  // ... your logic here
};

const runUpdate = async (item) => {
  // ... your logic here
};

const runOsUpdate = async () => {
  // ... your logic here
};

const clickToCancelLogout = () => {
  logoutModalIsActive.value = false;
};

const logoutModalHandler = () => {
  logoutModalIsActive.value = true;
};

const loggingOut = async () => {
  // ... your logic here
};

const reconnect = async () => {
  // ... your logic here
};

const updateModalHandler = () => {
  // ... your logic here
};

const removeUpdateModal = () => {
  // ... your logic here
};

const notifModalOpen = () => {
  // ... your logic here
};

const notifModalClose = () => {
  // ... your logic here
};

const supportModalOpen = () => {
  // ... your logic here
};

const supportModalClose = () => {
  // ... your logic here
};

// Lifecycle hooks (like mounted)
onMounted(async () => {
  // ... your logic here
});
</script>
