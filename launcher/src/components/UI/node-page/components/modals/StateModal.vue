<template>
  <custom-modal
    icon-size="w-14"
    bg-color="bg-[#1c1d1d]"
    :btn-color="props.mainIcon ? 'green' : 'red'"
    :icon="getIcon"
    :main-title="`${getButtonText} The Node `"
    sub-title="getSubTitles"
    :message-text="getMessageText"
    :confirm-text="getButtonText"
    click-outside-text="Click outside to cancel"
    @close-window="closeWindow"
    @confirm-action="confirmAction"
  >
    <template #content>
      <div class="w-full h-20 flex justify-center items-center">
        <span class="text-xl font-semibold" :class="props.mainIcon ? 'text-teal-500' : 'text-red-400'">{{ getContentText }}</span>
      </div>
    </template>
  </custom-modal>
</template>

<script setup>
import CustomModal from "./CustomModal.vue";
import i18n from "../../../../../includes/i18n";
import { computed } from "vue";

const props = defineProps({
  mainIcon: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["closeWindow", "turnOn", "turnOff"]);

const t = i18n.global.t;

const off = t("confirmModal.off");
const offMsg = t("confirmModal.messageOff");

const on = t("confirmModal.on");
const onMsg = t("confirmModal.messageOn");

const getIcon = computed(() => {
  return props.mainIcon ? "/img/icon/node-page-icons/turn-on.png" : "/img/icon/node-page-icons/turn-off.png";
});

const getMessageText = computed(() => {
  return props.mainIcon ? on : off;
});

const getButtonText = computed(() => {
  return props.mainIcon ? "turn on" : "turn off";
});

const getContentText = computed(() => {
  return props.mainIcon ? onMsg : offMsg;
});

const closeWindow = () => {
  emit("closeWindow");
};

const confirmAction = () => {
  if (props.mainIcon) {
    emit("turnOn");
  } else {
    emit("turnOff");
  }
};
</script>
