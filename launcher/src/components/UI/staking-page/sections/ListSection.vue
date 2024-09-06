<template>
  <div class="w-full h-full col-start-2 col-end-20 row-start-1 row-span-full grid grid-cols-24 grid-rows-13 space-y-[1px]">
    <StakingHeader />
    <div class="w-full h-full col-start-1 col-span-full row-start-2 row-span-full grid grid-cols-24 grid-rows-12 relative overflow-hidden">
      <ListHeader
        v-if="stakingStore.isPreviewListActive || stakingStore.isGroupListActive || stakingStore.isRemoteListActive"
        @back-list="backList"
      />
      <DisabledSection v-if="stakingStore.isStakingDisabled" />
      <ListBody
        v-else
        @on-drop="onDrop"
        @remove-single="removeSingle"
        @open-group="openGroup"
        @rename-group="renameGroup"
        @withdraw-group="withdrawGroup"
        @rename-single="renameSingle"
        @delete-preview="deletePreview"
      />
      <ListPanels
        @confirm-grouping="confirmGrouping"
        @pick-validator="pickValidator"
        @upload-file="uploadFile"
        @confirm-password="confirmPassword"
        @confirm-rename="confirmRename"
        @reset-name="resetName"
        @confirm-feerecepient="confirmFeerecepient"
        @confirm-graffiti="confirmGraffiti"
        @confirm-remote="confirmRemote"
        @remove-group="removeGroup"
      />
    </div>
  </div>
</template>
<script setup>
import ListHeader from "../components/list/ListHeader.vue";
import ListBody from "../components/list/ListBody.vue";
import ListPanels from "../components/list/ListPanels.vue";
import DisabledSection from "../sections/DisabledSection.vue";
import { useStakingStore } from "@/store/theStaking";
import { onBeforeMount, watch } from "vue";
import { useServices } from "@/store/services.js";
import StakingHeader from "../components/header/StakingHeader.vue";

const emit = defineEmits([
  "confirmGrouping",
  "pickValidator",
  "uploadFile",
  "confirmPassword",
  "onDrop",
  "removeSingle",
  "openGroup",
  "renameGroup",
  "withdrawGroup",
  "removeGroup",
  "backList",
  "confirmRename",
  "renameSingle",
  "confirmFeerecepient",
  "deletePreview",
  "resetName",
  "confirmGraffiti",
  "confirmRemote",
  "removeGroup",
]);

const stakingStore = useStakingStore();
const serviceStore = useServices();

watch(
  () => serviceStore.installedServices,
  async () => {
    const hasValidator = serviceStore.installedServices.some((s) => s.category === "validator" && s.state === "running");
    stakingStore.isStakingDisabled = !hasValidator;
  }
);

// watchEffect(() => {
//   activeStakingPanel.value = stakingStore.isStakingDisabled;
// });

onBeforeMount(() => {
  CheckValidatorExistence();
});

const CheckValidatorExistence = () => {
  const hasValidator = serviceStore.installedServices.some((s) => s.category === "validator" && s.state === "running");
  stakingStore.isStakingDisabled = !hasValidator;
};

const confirmGrouping = (groupName) => {
  emit("confirmGrouping", groupName);
};

const pickValidator = (service) => {
  emit("pickValidator", service);
};

const uploadFile = (event) => {
  emit("uploadFile", event);
};

const confirmPassword = (password) => {
  emit("confirmPassword", password);
};

const onDrop = (event) => {
  emit("onDrop", event);
};

const confirmFeerecepient = (item) => {
  emit("confirmFeerecepient", item);
};

const confirmGraffiti = (item) => {
  emit("confirmGraffiti", item);
};

const deletePreview = (item) => {
  emit("deletePreview", item);
};
const removeSingle = (item) => {
  emit("removeSingle", item);
};

const renameSingle = (item) => {
  emit("renameSingle", item);
};

const openGroup = (item) => {
  emit("openGroup", item);
};

const confirmRename = (item) => {
  emit("confirmRename", item);
};

const resetName = (item) => {
  emit("resetName", item);
};

const renameGroup = (item) => {
  emit("renameGroup", item);
};

const withdrawGroup = (item) => {
  emit("withdrawGroup", item);
};

const backList = () => {
  emit("backList");
};
const confirmRemote = () => {
  emit("confirmRemote");
};

const removeGroup = (item) => {
  emit("removeGroup", item);
};
</script>
