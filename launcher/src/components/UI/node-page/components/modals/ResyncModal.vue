<template>
  <custom-modal
    :client="props.item"
    icon="/img/icon/service-setting-icons/resync.png"
    bg-color="bg-[#151a1e]"
    :main-title="$t('resyncSeparateService.message')"
    :confirm-text="$t('resyncSeparateService.resync')"
    click-outside-text="Click outside to cancel"
    @close-window="closeWindow"
    @confirm-action="resync(item)"
  >
    <template #content>
      <div class="text-sm text-teal-500 font-semibold">
        <div class="uppercase text-lg">{{ item.name }}</div>
        <div>" {{ item.config.serviceID }} "</div>
      </div>
      <div>
        <span class="text-lg text-gray-200 font-semibold">
          {{ item.category === "consensus" ? "choose what" : "genesis" }}
          {{ $t("resyncSeparateService.msgPartTwo") }}</span
        >
      </div>

      <div class="px-20">
        <SyncCarousel :service="props.item" />
      </div>
    </template>
  </custom-modal>
</template>
<script setup>
import { useClickInstall } from "@/store/clickInstallation";
import ControlService from "@/store/ControlService";
import "vue3-carousel/dist/carousel.css";
import SyncCarousel from "../../../edit-page/components/edit/SyncCarousel.vue";
import CustomModal from "./CustomModal.vue";

//Props and Emits
const props = defineProps({
  item: Object,
});

const emit = defineEmits(["closeWindow"]);

const installStore = useClickInstall();

//Methods

const closeWindow = () => {
  emit("closeWindow");
};

const resync = async (el) => {
  emit("closeWindow");
  await ControlService.chooseServiceAction({
    action: "reSync",
    service: el.config.serviceID,
    data: installStore.checkPointSync,
  });
};
</script>
