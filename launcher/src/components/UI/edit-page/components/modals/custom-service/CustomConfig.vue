<template>
  <custom-modal
    :main-title="`${client.name} - ${client.category}`"
    :client="client"
    sub-title="SET CONFIGURATION"
    :confirm-text="buttonText"
    :disabled-button="disabledButton"
    :is-loading="setLoading"
    click-outside-text="Click outside to cancel"
    @close-window="closeWindow"
    @confirm-action="customInstallHandler"
  >
    <template #content>
      <Transition>
        <div
          v-if="isCustomConfigActive"
          class="w-full h-full max-h-[210px] grid grid-cols-12 grid-rows-10 gap-y-1"
          :class="{ 'animate__animated animate__fadeOut': !isCustomConfigActive }"
        >
          <div class="w-full col-start-2 col-end-12 row-start-2 row-end-4 items-center grid grid-cols-24">
            <img
              class="col-start-1 col-span-2 w-8 justify-self-center"
              src="/img/icon/manage-node-icons/image-icon.png"
              alt="Image Icon"
            />
            <span class="col-start-3 col-span-4 text-md text-gray-200 text-left font-semibold capitalize">IMAGE</span>

            <div class="col-start-8 col-end-24 flex justify-start items-center bg-gray-200 rounded-md">
              <input
                v-model="manageStore.customConfig.image"
                class="w-full h-full bg-transparent text-gray-700 p-2 text-sm"
                type="text"
                placeholder="hyperledger/besu:22.7.6"
              />
            </div>
          </div>
          <div class="w-full col-start-2 col-end-12 row-start-5 row-end-7 items-center grid grid-cols-24">
            <img
              class="col-start-1 col-span-2 w-8 justify-self-center"
              src="/img/icon/manage-node-icons/image-icon.png"
              alt="Image Icon"
            />
            <span class="col-start-3 col-span-4 text-md text-gray-300 text-left font-semibold capitalize"
              >ENTRYPOINT</span
            >

            <div class="col-start-8 col-end-24 flex justify-start items-center bg-gray-200 rounded-md">
              <input
                v-model="manageStore.customConfig.entrypoint"
                class="w-full h-full bg-transparent text-gray-700 p-2 text-sm"
                type="text"
                placeholder="besu"
              />
            </div>
          </div>
          <div class="w-full col-start-2 col-end-12 row-start-8 row-end-10 items-center grid grid-cols-24">
            <img
              class="col-start-1 col-span-2 w-8 justify-self-center"
              src="/img/icon/manage-node-icons/image-icon.png"
              alt="Image Icon"
            />
            <span class="col-start-3 col-span-4 text-md text-gray-300 text-left font-semibold capitalize">COMMAND</span>

            <div class="col-start-8 col-end-24 flex justify-start items-center bg-gray-200 rounded-md">
              <input
                v-model="manageStore.customConfig.command"
                class="w-full h-full bg-transparent text-gray-700 p-2 text-sm"
                type="text"
                placeholder="--command1 --command2"
              />
            </div>
          </div>
        </div>
        <div
          v-else-if="isCustomPathActive"
          class="animate__animated animate__fadeIn w-full h-full max-h-[210px] grid grid-cols-12 grid-rows-10 gap-y-1"
          :class="{ 'animate__animated animate__fadeOut': !isCustomPathActive }"
        >
          <div class="w-full col-start-2 col-end-12 row-start-2 row-end-4 items-center grid grid-cols-24">
            <img
              class="col-start-1 col-span-2 w-8 justify-self-center"
              src="/img/icon/manage-node-icons/volume-icon.png"
              alt="Image Icon"
            />
            <span class="col-start-3 col-span-4 text-md text-gray-200 text-left font-semibold capitalize">VOLUMES</span>

            <div class="col-start-8 col-end-24 bg-gray-200 rounded-md grid grid-cols-12 items-center p-[2px]">
              <input
                v-model="enteredPath"
                class="w-full h-full col-start-1 col-end-12 bg-transparent text-gray-700 p-2 text-sm"
                type="text"
                placeholder="/opt/stereum"
              />
              <div
                class="h-8 col-start-12 col-span-1 flex justify-center items-center bg-teal-700 cursor-pointer rounded-md hover:scale-105 active:scale-95 hover:bg-teal-600 transition-all duration-300 ease-in-out hover:shadow-md hover:shadow-[#191a1a]"
                :class="{
                  'pointer-events-none opacity-65 ': enteredPath === '',
                }"
                @click="addPathToConfig"
              >
                <span class="text-lg text-gray-50 font-semibold text-center">+</span>
              </div>
            </div>
          </div>
          <div
            class="w-full h-full max-h-[120px] col-start-2 col-end-12 row-start-5 row-span-full items-center flex flex-col justify-start bg-black rounded-md overflow-x-hidden overflow-y-auto p-1 gap-y-1"
          >
            <PathRows
              v-for="path in manageStore.customConfig.paths"
              :key="path"
              :path="path"
              @remove-path="removePaths"
            />
          </div>
        </div>
        <div
          v-else-if="isCustomPortActive"
          class="animate__animated animate__fadeIn w-full h-full max-h-[210px] grid grid-cols-12 grid-rows-10 gap-y-1"
        >
          <div class="w-full col-start-2 col-end-12 row-start-2 row-end-4 items-center grid grid-cols-24">
            <img
              class="col-start-1 col-span-2 w-8 justify-self-center"
              src="/img/icon/manage-node-icons/port.png"
              alt="Image Icon"
            />
            <span class="col-start-3 col-span-4 text-md text-gray-200 text-left font-semibold capitalize">PORTS</span>

            <div class="col-start-8 col-end-24 bg-gray-200 rounded-md grid grid-cols-12 items-center p-[2px]">
              <input
                v-model="enteredPort"
                class="w-full h-full col-start-1 col-end-12 bg-transparent text-gray-700 p-2 text-sm"
                type="text"
                placeholder="hyperledger/besu:22.7.6"
              />
              <div
                class="h-8 col-start-12 col-span-1 flex justify-center items-center bg-teal-700 cursor-pointer rounded-md hover:scale-105 active:scale-95 hover:bg-teal-600 transition-all duration-300 ease-in-out hover:shadow-md hover:shadow-[#191a1a]"
                :class="{ 'pointer-events-none opacity-65 ': enteredPort === '' }"
                @click="addPortToConfig"
              >
                <span class="text-lg text-gray-50 font-semibold text-center">+</span>
              </div>
            </div>
          </div>
          <div
            class="w-full h-full max-h-[120px] col-start-2 col-end-12 row-start-5 row-span-full items-center flex flex-col justify-start bg-black rounded-md overflow-x-hidden overflow-y-auto p-1 gap-y-1"
          >
            <PortRows
              v-for="port in manageStore.customConfig.ports"
              :key="port"
              :port="port"
              @remove-ports="removePorts"
            />
          </div>
        </div>
      </Transition>
    </template>
  </custom-modal>
</template>

<script setup>
import CustomModal from "../CustomModal.vue";
import PathRows from "./PathRows.vue";
import PortRows from "./PortRows.vue";
import { useNodeManage } from "@/store/nodeManage";
import { computed, ref } from "vue";

const { client } = defineProps({
  client: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["serviceInstallation", "closeWindow", "removePaths", "removePorts"]);

const manageStore = useNodeManage();
const isCustomConfigActive = ref(true);
const isCustomPathActive = ref(false);
const isCustomPortActive = ref(false);
const enteredPath = ref("");
const enteredPort = ref("");
const isLoading = ref(false);

const disabledButton = computed(() => {
  let output = false;
  if (isCustomConfigActive.value) {
    output = !(
      manageStore.customConfig.image &&
      manageStore.customConfig.entrypoint &&
      manageStore.customConfig.command
    );
  } else if (isCustomPathActive.value) {
    output = manageStore.customConfig.paths.length === 0;
  } else if (isCustomPortActive.value) {
    output = manageStore.customConfig.ports.length === 0;
  }
  return output;
});

const buttonText = computed(() => {
  let text = "";
  if (isCustomConfigActive.value) {
    text = "next";
  } else if (isCustomPathActive.value) {
    text = "next";
  } else if (isCustomPortActive.value) {
    text = "create";
  }
  return text;
});

const setLoading = computed(() => {
  return isLoading.value;
});

const closeWindow = () => {
  emit("closeWindow");
};

const customInstallHandler = () => {
  if (
    buttonText.value === "next" &&
    isCustomConfigActive.value &&
    manageStore.customConfig.image !== "" &&
    manageStore.customConfig.entrypoint !== "" &&
    manageStore.customConfig.command !== ""
  ) {
    isCustomConfigActive.value = false;
    isLoading.value = true;
    setTimeout(() => {
      isCustomPathActive.value = true;
      isLoading.value = false;
    }, 500);
  } else if (buttonText.value === "next" && isCustomPathActive.value && manageStore.customConfig.paths.length > 0) {
    isCustomConfigActive.value = false;
    isCustomPathActive.value = false;
    isLoading.value = true;
    setTimeout(() => {
      isLoading.value = false;
      isCustomPortActive.value = true;
    }, 1000);
  } else if (buttonText.value === "create" && isCustomPortActive.value && manageStore.customConfig.ports.length > 0) {
    emit("serviceInstallation");
    closeWindow();
  }
};

const addPathToConfig = () => {
  if (enteredPath.value !== "") {
    manageStore.customConfig.paths.push(enteredPath.value);
    enteredPath.value = "";
  } else {
    return;
  }
};

const addPortToConfig = () => {
  if (enteredPort.value !== "") {
    manageStore.customConfig.ports.push(enteredPort.value);
    enteredPort.value = "";
  }
};

const removePaths = (path) => {
  emit("removePaths", path);
};

const removePorts = (port) => {
  emit("removePorts", port);
};
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
