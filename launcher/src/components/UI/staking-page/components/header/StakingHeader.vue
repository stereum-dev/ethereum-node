<template>
  <div
    class="w-full h-full col-start-1 col-span-full row-start-1 row-span-1 grid grid-cols-24 items-center rounded-md bg-[#151618] border border-gray-600 px-[2px] space-x-1"
  >
    <div class="col-start-1 col-end-8 h-8 flex justify-end items-center">
      <TotalBalance />
    </div>
    <div class="col-start-8 col-end-18 h-8 flex justify-center items-center relative">
      <NetworkStatus :copatible-size="getNetworkSize" />
    </div>
    <div class="col-start-18 col-span-full h-8 flex justify-end items-center">
      <SetupDropdown
        :list="setupList"
        :new-height="newHeight"
        @select-setup="selectSetup"
        @server-view="serverView"
      />
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue";
import { useSetups } from "../../../../../store/setups";
import SetupDropdown from "../../../edit-page/components/edit/setups/SetupDropdown.vue";
import { useMultiSetups } from "@/composables/multiSetups";
import TotalBalance from "../management/components/val-rewards/TotalBalance.vue";
import NetworkStatus from "../../../../layers/NetworkStatus.vue";
import { useServices } from "@/store/services";
import { useDeepClone } from "@/composables/utils";

const setupStore = useSetups();
const serviceStore = useServices();
const { getSelectedSetup, getServerView } = useMultiSetups();

const newHeight = "h-8";

const setupList = computed(() => {
  const validators = serviceStore.installedServices
    .filter((s) => s.category === "validator")
    .map((v) => v.service);
  let output = setupStore.allSetups.filter((s) => s.setupName !== "commonServices");

  output = output.map((setup) => {
    if (!setup.services || setup.services.length === 0) {
      setup.noValidator = true;
    } else {
      const hasValidator = setup.services.some((service) =>
        validators.includes(service.service)
      );
      if (!hasValidator) {
        setup.noValidator = true;
      }
    }
    return useDeepClone(setup);
  });

  return output;
});

const getNetworkSize = computed(() => {
  return "w-full h-full flex justify-center items-center";
});

const selectSetup = (setup) => {
  getSelectedSetup(setup);
};

const serverView = () => {
  getServerView();
};
</script>
