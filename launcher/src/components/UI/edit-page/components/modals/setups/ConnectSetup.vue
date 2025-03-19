<template>
  <div
    class="min-w-screen h-screen fixed flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover rounded-lg"
  >
    <div class="absolute bg-black opacity-80 inset-0 z-0 rounded-lg" @click="closeWindow"></div>
    <div
      class="w-2/3 min-h-[450px] max-h-[450px] py-1 px-2 relative mx-auto my-auto rounded-[55px] shadow-lg bg-[#1c1d1d] border-4 border-gray-400"
    >
      <div class="h-full flex flex-col justify-between gap-4">
        <div class="text-center pt-4 flex-auto justify-center space-y-2">
          <div class="flex justify-center items-center px-4 mx-auto">
            <img class="w-[55px] h-[55px] mr-2" src="/img/icon/setup-icons/op-icon.png" alt="Service Icon" />
            <div class="flex flex-col justify-center items-start">
              <span class="text-[26px] font-bold text-teal-600 uppercase">OpNode Connection</span>
              <span v-if="currentSubTitle" class="text-[22px] font-bold text-amber-600 uppercase">{{ currentSubTitle }}</span>
            </div>
          </div>
        </div>

        <div class="flex flex-col items-center py-2 px-4 space-y-2 max-h-[400px] overflow-y-auto relative">
          <!-- Step 1: Select OP Node -->
          <div
            v-if="currentStep === 1"
            :class="[
              'w-full space-y-2',
              animateNextClicked ? 'animate__animated animate__fadeOutLeft animate__duration-1s' : 'animate__animated animate__fadeIn',
            ]"
          >
            <div
              v-for="service in getOpNodeFromOpSetup"
              :key="service?.config?.serviceID"
              class="w-full p-2 border border-gray-700 rounded-md shadow-md transition cursor-pointer"
              :class="isOpNodeSelected(service) ? 'bg-teal-700' : 'bg-neutral-900/90 hover:bg-gray-700'"
              @click="toggleOpNodeSelection(service)"
            >
              <div class="flex items-center justify-between w-full">
                <div class="flex items-center">
                  <img v-if="service" :src="service.icon" alt="Setup Icon" class="w-6 h-6 rounded-full mr-3" />
                  <div class="flex flex-col">
                    <span class="text-sm font-semibold text-gray-200 uppercase">
                      {{ service.service }}
                    </span>
                    <span class="text-xs text-gray-400"> ID: {{ service.config.serviceID }} </span>
                  </div>
                </div>

                <div v-if="isOpNodeSelected(service)" class="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2: Select Setup -->
          <div
            v-if="currentStep === 2"
            :class="[
              'w-full space-y-2',
              animateNextClicked ? 'animate__animated animate__fadeOutUp animate__duration-1s' : 'animate__animated animate__fadeIn',
            ]"
          >
            <div
              v-for="setup in filteredSetups"
              :key="setup.setupId"
              class="w-full p-2 border border-gray-700 rounded-md shadow-md transition cursor-pointer flex justify-between items-center"
              :class="isSetupSelected(setup) ? 'bg-teal-700' : 'bg-neutral-900/90 hover:bg-gray-700'"
              @click="selectSetup(setup)"
            >
              <div class="flex items-center mb-2">
                <img v-if="setup.services.length > 0" :src="setup.services[0].icon" alt="Setup Icon" class="w-6 h-6 rounded-full mr-3" />
                <div class="flex flex-col">
                  <span class="text-sm font-semibold text-gray-200 uppercase">{{ setup.setupName }}</span>
                  <span class="text-xs text-gray-400">Network: {{ setup.network }}</span>
                </div>
              </div>
              <div class="flex items-center">
                <span class="w-5 h-5 rounded-full" :class="setupStore.getBGColor(setup.color)"></span>

                <div v-if="isSetupSelected(setup)" class="ml-2 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <p v-if="filteredSetups.length === 0" class="text-gray-400 italic">No valid setups available.</p>
          </div>

          <!-- Step 3: Select Services (Revised) -->

          <div
            v-if="currentStep === 3"
            class="max-h-[240px] overflow-y-auto p-2 overflow-x-hidden"
            :class="[
              'w-full space-y-1',
              animateNextClicked ? 'animate__animated animate__fadeOut animate__duration-1s' : 'animate__animated animate__fadeIn',
            ]"
          >
            <div class="text-xs text-center mt-4">
              <p class="text-gray-400">Select a consensus service first, then choose one or more execution services.</p>
            </div>
            <div v-for="(group, index) in serviceGroups" :key="index" class="w-full mb-4">
              <div class="flex items-center gap-2 bg-neutral-900/90 rounded-lg p-1">
                <div
                  class="w-[125px] h-[65px] flex-shrink-0 p-1 rounded-md cursor-pointer transition-colors duration-200"
                  :class="[
                    isServiceSelected(group.consensus) ? 'bg-teal-700' : 'bg-neutral-800 hover:bg-neutral-700',
                    'border border-gray-700',
                  ]"
                  @click="toggleConsensusSelection(group)"
                >
                  <div class="flex flex-col items-start justify-center gap-2">
                    <div class="flex items-center gap-2">
                      <img :src="group.consensus.icon" alt="Consensus" class="w-6 h-6" />

                      <div class="uppercase text-xs font-medium text-gray-200">
                        {{ group.consensus?.name }}
                      </div>
                    </div>
                    <div class="w-full flex justify-center items-center">
                      <span class="w-full text-[10px] text-gray-300 text-center">{{
                        useTruncate(group?.consensus.config?.serviceID, 0, 10)
                      }}</span>
                    </div>
                  </div>
                </div>

                <!-- Execution Services -->
                <template v-for="execution in group.executions" :key="execution.id">
                  <div
                    class="w-[125px] h-[65px] flex-shrink-0 p-1 rounded-md transition-colors duration-200"
                    :class="[
                      {
                        'bg-teal-700': isServiceSelected(execution),
                        'bg-neutral-800 hover:bg-neutral-700': !isServiceSelected(execution),
                        'cursor-pointer': isServiceSelected(group.consensus),
                        'opacity-50 cursor-not-allowed': !isServiceSelected(group.consensus),
                      },
                      'border border-gray-700',
                    ]"
                    @click="isServiceSelected(group.consensus) && toggleExecutionSelection(group, execution)"
                  >
                    <div class="flex flex-col items-start justify-center gap-2">
                      <div class="flex items-center gap-2">
                        <img :src="execution?.icon" alt="Consensus" class="w-6 h-6" />

                        <div class="uppercase text-xs font-medium text-gray-200">
                          {{ execution?.name }}
                        </div>
                      </div>
                      <div class="w-full flex justify-center items-center">
                        <span class="w-full text-[10px] text-gray-300 text-center">{{
                          useTruncate(execution.config?.serviceID, 0, 10)
                        }}</span>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>

            <p v-if="serviceGroups.length === 0" class="text-gray-400 italic text-center">No valid service groups available.</p>
          </div>
        </div>

        <div class="w-full h-fit flex justify-between items-center text-md font-bold py-3 mt-2 space-y-4 absolute bottom-4 px-6">
          <button
            v-if="currentStep > 1"
            class="min-w-[100px] h-10 bg-gray-600 border border-gray-600 px-5 py-2 text-sm shadow-xl shadow-[#141516] font-medium tracking-wider text-white rounded-full uppercase hover:bg-gray-700 active:scale-95 transition duration-200"
            @click="goBack"
          >
            Back
          </button>
          <div v-else class="min-w-[100px]"></div>
          <button
            v-if="!isLoading"
            class="min-w-[100px] h-10 bg-green-500 border border-green-500 px-5 py-2 text-sm shadow-xl shadow-[#141516] font-medium tracking-wider text-white rounded-full uppercase"
            :class="!canProceed ? 'opacity-40 pointer-events-none' : 'hover:bg-green-600 active:scale-95 transition duration-200'"
            @click="handleNextOrConfirmAction"
          >
            {{ currentStep === 3 ? "Confirm" : "Next" }}
          </button>
          <div
            v-if="isLoading"
            class="min-w-[100px] bg-green-500 border border-green-500 px-5 py-2 text-sm shadow-xl shadow-[#141516] font-medium tracking-wider text-white rounded-full uppercase opacity-40 pointer-events-none flex justify-center items-center"
          >
            <svg
              class="animate-spin h-6 w-6 border-2 border-gray-400 border-tr-2 border-r-white border-t-white rounded-full"
              viewBox="0 0 24 24"
            ></svg>
          </div>
        </div>
        <span class="absolute bottom-1 left-[40%] text-xs flex justify-center items-center text-red-500 mx-auto">
          Click outside to cancel
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSetups } from "@/store/setups";
import { useServices } from "@/store/services";
import { useDeepClone } from "@/composables/utils";
import { useSetupConnection } from "@/composables/useSetupConnection";
import { useTruncate } from "../../../../../../composables/utils";

const emit = defineEmits(["closeWindow", "confirmAction"]);
const setupStore = useSetups();
const serviceStore = useServices();

const {
  currentStep,
  animateNextClicked,
  isLoading,
  getOpNodeFromOpSetup,
  filteredSetups,
  serviceGroups,
  canProceed,
  currentSubTitle,
  goBack,
  isOpNodeSelected,
  toggleOpNodeSelection,
  isSetupSelected,
  selectSetup,
  isServiceSelected,
  toggleConsensusSelection,
  toggleExecutionSelection,
  handleNextOrConfirmAction,
  closeWindow,
} = useSetupConnection(setupStore, serviceStore, (event, data) => {
  if (event === "confirmAction") {
    emit(event, useDeepClone(data));
  } else {
    emit(event);
  }
});
</script>

<style scoped>
.max-height-400px {
  max-height: 400px;
  overflow-y: auto;
}
</style>
