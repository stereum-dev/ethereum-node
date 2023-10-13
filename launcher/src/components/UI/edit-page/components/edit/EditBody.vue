<template>
  <div class="w-full h-full flex flex-col justify-between items-center">
    <EditHeader />
    <div
      class="w-full h-full max-h-[430px] rounded-md border overflow-hidden mt-1 bg-[#151618] relative"
      :class="[
        isOverDropZone ? 'border-dashed border-2 border-blue-500 ' : 'border-gray-600',
        manageStore.disableConfirmButton ? 'opacity-70 pointer-events-none' : '',
      ]"
    >
      <div
        class="absolute top-0 w-full mx-auto grid grid-cols-3 h-6 bg-[#33393E] border border-gray-950 rounded-t-[5px] text-gray-200 text-[10px] font-semibold z-20"
      >
        <span class="col-start-1 justify-self-center self-center">Execution Clients</span>
        <span class="col-start-2 justify-self-center self-center">Consensus Clients</span>
        <span class="col-start-3 justify-self-center self-center">Validator</span>
      </div>
      <div
        ref="dropZoneRef"
        class="w-full h-full max-h-[428px] grid grid-cols-3 pt-5 z-10"
        :class="{
          'scrollbar scrollbar-rounded-* scrollbar-thumb-teal-800 scrollbar-track-transparent overflow-y-auto':
            activateScrollBar,
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
        <ExecutionClients
          v-if="!isOverDropZone"
          @delete-service="deleteService"
          @switch-client="switchClient"
          @confirm-consensus="confirmConsensus"
          @info-modal="infoModal"
          @mouse-over="lineDrawHandler"
        />

        <ConsensusClients
          v-if="!isOverDropZone"
          @delete-service="deleteService"
          @confirm-connection="confirmConnection"
          @switch-client="switchClient"
          @modify-service="modifyService"
          @info-modal="infoModal"
          @mouse-over="lineDrawHandler"
        />
        <ValidatorClients
          v-if="!isOverDropZone"
          @delete-service="deleteService"
          @switch-client="switchClient"
          @modify-service="modifyService"
          @info-modal="infoModal"
          @mouse-over="lineDrawHandler"
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
import LeaderLine from "leader-line-new";
import { computed, ref } from "vue";
import { useNodeManage } from "@/store/nodeManage";

const emit = defineEmits([
  "onDrop",
  "confirmConnection",
  "switchClient",
  "deleteService",
  "confirmConsensus",
  "infoModal",
  "modifyService",
]);

//Pinia stores
const manageStore = useNodeManage();

// refs
const isOverDropZone = ref(false);

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

const activateScrollBar = computed(() => {
  const validators = manageStore.newConfiguration.filter((service) => service.category === "validator");
  const consensus = manageStore.newConfiguration.filter((service) => service.category === "consensus");
  const execution = manageStore.newConfiguration.filter((service) => service.category === "execution");
  if (validators.length > 3 || consensus.length > 3 || execution.length > 3) {
    return true;
  } else {
    return false;
  }
});

// methods

const oneWayConnection = (start, end) => {
  let lineOne = null;
  if (start && end) {
    lineOne = new LeaderLine(start, end, { dash: { animation: true } }, { hide: true });
    lineOne.setOptions({
      startPlugSize: 1,
      endPlugSize: 2,
      size: 2,
      color: "#DBEF6A",
      endPlug: "behind",
    });

    setTimeout(() => {
      lineOne.remove();
    }, 2000);
  }
};

const twoWaysConnections = (start, middle, end) => {
  let lineOne = null;
  let lineTwo = null;
  if (start && middle && end) {
    lineOne = new LeaderLine(start, middle, { dash: { animation: true } }, { hide: true });
    lineOne.setOptions({
      startPlugSize: 1,
      endPlugSize: 2,
      size: 2,
      color: "#6FD9F0",
      endPlug: "behind",
    });
    lineTwo = new LeaderLine(middle, end, { dash: { animation: true } }, { hide: true });
    lineTwo.setOptions({
      startPlugSize: 1,
      endPlugSize: 2,
      size: 2,
      color: "#DBEF6A",
      endPlug: "behind",
    });

    setTimeout(() => {
      lineOne.remove();
      lineTwo.remove();
    }, 2000);
  }
};

const lineDrawHandler = (item) => {
  let start;
  let middle;
  let end;
  let lineOne = null;
  let lineTwo = null;

  // Remove the previous line if it exists
  if (lineOne || lineTwo) {
    lineOne.remove();
    lineTwo.remove();
  }

  if (item) {
    if (item.category === "consensus") {
      const execution = item.config?.dependencies.executionClients[0];
      start = manageStore.executionRefList.find((el) => el.refId === execution?.id)?.ref;
      middle = manageStore.consensusRefList.find((el) => el.refId === item.config?.serviceID)?.ref;

      const validator = manageStore.newConfiguration.find(
        (el) =>
          el.category === "validator" && el.config?.dependencies.consensusClients[0]?.id === item.config?.serviceID
      );

      end = manageStore.validatorRefList.find((el) => el.refId === validator?.config?.serviceID)?.ref;
      if (start && middle && end) {
        twoWaysConnections(start, middle, end);
      } else if (start && middle) {
        oneWayConnection(start, middle);
      }
    } else if (item.category === "validator") {
      const consensus = item.config?.dependencies.consensusClients[0];
      start = manageStore.consensusRefList.find((el) => el.refId === consensus?.id)?.ref;
      end = manageStore.validatorRefList.find((el) => el.refId === item.config?.serviceID)?.ref;

      oneWayConnection(start, end);
    } else if (item.category === "execution") {
      const consensus = manageStore.newConfiguration.find(
        (el) =>
          el.category === "consensus" && el.config?.dependencies.executionClients[0]?.id === item.config?.serviceID
      );

      start = manageStore.executionRefList.find((el) => el.refId === item.config?.serviceID)?.ref;
      end = manageStore.consensusRefList.find((el) => el.refId === consensus?.config?.serviceID)?.ref;

      oneWayConnection(start, end);
    }
  }
};

const onDrop = (event) => {
  isOverDropZone.value = false;
  emit("onDrop", event);
};

const confirmConnection = (item) => {
  emit("confirmConnection", item);
};

const switchClient = (item) => {
  emit("switchClient", item);
};

const modifyService = (item) => {
  emit("modifyService", item);
};
const deleteService = (item) => {
  emit("deleteService", item);
};

const confirmConsensus = (item) => {
  emit("confirmConsensus", item);
};

const infoModal = (item) => {
  emit("infoModal", item);
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
