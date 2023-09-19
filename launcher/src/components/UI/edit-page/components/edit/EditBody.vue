<template>
  <div class="w-full h-full flex flex-col justify-between items-center">
    <EditHeader />
    <div
      class="w-full h-full max-h-[430px] rounded-md border overflow-hidden mt-1 bg-[#151618] relative"
      :class="isOverDropZone ? 'border-dashed border-2 border-blue-500 ' : 'border-gray-500'"
    >
      <div
        class="absolute top-0 w-full mx-auto grid grid-cols-3 h-6 bg-[#4f585f] border border-gray-950 rounded-t-[5px] text-gray-200 text-sm"
      >
        <span class="col-start-1 justify-self-center">Validator </span>
        <span class="col-start-2 justify-self-center">Consensus Clients</span>
        <span class="col-start-3 justify-self-center">Execution Clients</span>
      </div>
      <div
        ref="dropZoneRef"
        class="w-full h-full max-h-[428px] grid grid-cols-3 pt-5"
        :class="{
          'scrollbar scrollbar-rounded-* scrollbar-thumb-teal-800 scrollbar-track-transparent overflow-y-auto':
            scrollBox,
        }"
        @drop="onDrop($event)"
        @dragover.prevent="isOverDropZone = true"
        @dragleave.prevent="isOverDropZone = false"
      >
        <span
          v-if="isOverDropZone"
          class="col-start-2 col-span-1 self-center justify-self-center flex justify-center items-center text-xl text-blue-400"
          >+</span
        >
        <ValidatorClients
          v-if="!isOverDropZone"
          @delete-service="removeInstalledService"
          @switch-client="switchClient"
        />
        <ConsensusClients
          v-if="!isOverDropZone"
          @delete-service="removeInstalledService"
          @confirm-connection="confirmConnection"
          @switch-client="switchClient"
        />
        <ExecutionClients
          v-if="!isOverDropZone"
          @delete-service="removeInstalledService"
          @switch-client="switchClient"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import EditHeader from "./EditHeader.vue";
import ExecutionClients from "./ExecutionClients.vue";
import ConsensusClients from "./ConsensusClients.vue";
import ValidatorClients from "./ValidatorClients.vue";
import { computed, ref, watchEffect } from "vue";
import { useNodeManage } from "@/store/nodeManage";
import { useServices } from "@/store/services";

const emit = defineEmits(["onDrop", "confirmConnection", "switchClient"]);

//Pinia stores
const manageStore = useNodeManage();
const serviceStore = useServices();

// refs
const isOverDropZone = ref(false);
const scrollBox = ref(false);

// computed & watchers properties
// eslint-disable-next-line no-unused-vars
const displayDropZone = computed(() => {
  let dropClass;
  if (isOverDropZone.value) {
    dropClass = "border-dashed border-4 border-gray-500 z-50";
  } else {
    dropClass = "border-0";
  }
  return dropClass;
});

watchEffect(serviceStore.installedServices, () => {
  const validators = serviceStore.installedServices.filter((service) => service.category === "validator");

  const consensus = serviceStore.installedServices.filter((service) => service.category === "consensus");

  const execution = serviceStore.installedServices.filter((service) => service.category === "execution");

  if (validators.length > 3 || consensus.length > 3 || execution.length > 3) {
    scrollBox.value = true;
  } else {
    scrollBox.value = false;
  }
});

// methods

const onDrop = (event) => {
  isOverDropZone.value = false;
  emit("onDrop", event);
};

const removeInstalledService = (item) => {
  console.log(item);
  manageStore.confirmChanges.push({
    id: item.config.serviceID,
    content: "DELETE",
    contentIcon: "/img/icon/manage-node-icons/trash.png",
    service: manageStore.currentNetwork,
  });
};

const confirmConnection = (item) => {
  emit("confirmConnection", item);
};

const switchClient = (item) => {
  emit("switchClient", item);
};
</script>

<style scoped>
::-webkit-scrollbar {
  width: 3px;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter {
  transform: scaleY(0);
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-leave-to {
  transform: scaleY(0);
  transition: opacity 0.5s ease-in-out;
}
</style>
