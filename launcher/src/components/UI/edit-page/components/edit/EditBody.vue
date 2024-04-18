<template>
  <div class="w-full h-full flex flex-col justify-between items-center">
    <EditHeader />
    <ConfigBody
      v-if="setupStore.isEditConfigViewActive"
      @on-drop="onDrop"
      @confirm-connection="confirmConnection"
      @switch-client="switchClient"
      @delete-service="deleteService"
      @confirm-consensus="confirmConsensus"
      @info-modal="infoModal"
      @modify-service="modifyService"
      @remove-lines="removeConnectionLines"
      @line-draw="lineDrawHandler"
    />
    <SetupBody />
  </div>
</template>

<script setup>
import EditHeader from "./EditHeader.vue";
import ConfigBody from "./ConfigBody.vue";
import SetupBody from "./SetupBody.vue";

import LeaderLine from "leader-line-new";
import { computed, ref, watchEffect } from "vue";
import { useNodeManage } from "@/store/nodeManage";
import { useSetups } from "@/store/setups";

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
const setupStore = useSetups();

// refs

const isOverDropZone = ref(false);
const isLineDrawHandlerReady = ref(false);

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

watchEffect(
  () => manageStore.isLineHidden,
  (newValue) => {
    if (newValue) {
      removeConnectionLines();
    }
  }
);

// methods

const oneWayConnection = (start, end, startSocket, endSocket) => {
  if (start && end) {
    let newLine = new LeaderLine(
      start,
      end,
      { dash: { animation: true } },
      { hide: true }
    );
    newLine.position();
    newLine.setOptions({
      size: 2,
      color: "#DBEF6A",
      endPlug: "behind",
      startSocket: startSocket ? startSocket : "right",
      endSocket: endSocket ? endSocket : "left",
    });
    manageStore.lines.push(newLine);
  }
};

const lineDrawHandler = (item) => {
  let start;
  let end;
  if (item && !item.displayPluginMenu) {
    switch (item.category) {
      case "execution": {
        const dependencies = manageStore.newConfiguration.filter(
          (s) =>
            s.config?.dependencies?.executionClients?.length > 0 &&
            s.config?.dependencies?.executionClients.some(
              (d) => d.id === item.config?.serviceID
            )
        );
        dependencies.forEach((d) => {
          if (d.category === "consensus") {
            start = d.ref;
            end = item.ref;
            if (start && end) {
              oneWayConnection(end, start);
            }
          }
        });
        break;
      }
      case "consensus": {
        const dependencies = manageStore.newConfiguration.filter(
          (s) =>
            (s.config?.dependencies?.consensusClients?.length > 0 &&
              s.config?.dependencies?.consensusClients.some(
                (d) => d.id === item.config?.serviceID
              )) ||
            item.config?.dependencies?.executionClients.some(
              (d) => d.id === s.config?.serviceID
            )
        );
        dependencies.forEach((d) => {
          if (d.category === "validator") {
            start = d.ref;
            end = item.ref;
            if (start && end) {
              oneWayConnection(end, start);
            }
          }
          if (d.category === "execution") {
            start = d.ref;
            end = item.ref;
            if (start && end) {
              oneWayConnection(start, end);
            }
          }
        });
        break;
      }
      case "validator": {
        const dependencies = manageStore.newConfiguration.filter(
          (s) =>
            item.config?.dependencies?.executionClients.some(
              (d) => d.id === s.config?.serviceID
            ) ||
            item.config?.dependencies?.consensusClients.some(
              (d) => d.id === s.config?.serviceID
            ) ||
            s.config?.dependencies?.consensusClients.some(
              (d) => d.id === item.config?.serviceID
            )
        );
        dependencies.forEach((d) => {
          if (d.category === "validator") {
            start = d.ref;
            end = item.ref;
            if (start && end) {
              if (item.service === "CharonService") {
                oneWayConnection(end, start, "left", "left");
              } else {
                oneWayConnection(start, end, "left", "left");
              }
            }
          }
          if (d.category === "execution") {
            start = d.ref;
            end = item.ref;
            if (start && end) {
              oneWayConnection(start, end);
            }
          }
          if (d.category === "consensus") {
            start = d.ref;
            end = item.ref;
            if (start && end) {
              oneWayConnection(start, end);
            }
          }
        });
        break;
      }
    }
  } else if (item?.displayPluginMenu) {
    removeConnectionLines();
  }
  isLineDrawHandlerReady.value = true;
};

const removeConnectionLines = () => {
  // Remove all existing connections
  manageStore.lines.forEach((line) => {
    line.remove();
  });
  manageStore.lines = [];
};

const onDrop = (event) => {
  isOverDropZone.value = false;
  manageStore.isLineHidden = true;
  emit("onDrop", event);
};

const confirmConnection = (item) => {
  emit("confirmConnection", item);
};

const switchClient = (item) => {
  manageStore.isLineHidden = true;
  emit("switchClient", item);
};

const modifyService = (item) => {
  manageStore.isLineHidden = true;
  emit("modifyService", item);
};
const deleteService = (item) => {
  manageStore.isLineHidden = true;
  emit("deleteService", item);
};

const confirmConsensus = (item) => {
  emit("confirmConsensus", item);
};

const infoModal = (item) => {
  manageStore.isLineHidden = true;
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
