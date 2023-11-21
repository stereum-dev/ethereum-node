<template>
  <div
    class="w-full max-h-[35px] col-start-1 col-span-full bg-[#2e3335] rounded-md flex justify-center items-center cursor-pointer border border-gray-600 p-1 shadow-md shadow-[#171D22]"
  >
    <div class="w-full h-full grid grid-cols-12 grid-rows-1">
      <img
        class="w-6 h-6 self-center col-start-1 col-span-1 justify-self-center"
        src="/img/icon/the-staking/group.png"
        alt="Group Icon"
        @mousedown.prevent
      />

      <input
        id="input1"
        v-model="groupName"
        class="col-start-2 col-end-11 w-full bg-[#171D22] border border-[#283139] px-4 py-1 rounded-sm outline-none text-xs text-gray-400"
        type="text"
        autofocus
        placeholder="Pick a name for your group..."
      />

      <div class="col-start-11 col-span-1 flex justify-center items-center p-1">
        <div
          class="w-6 h-6 rounded-md bg-[#171D22] p-1 flex justify-center items-center hover:scale-110 border border-[#171D22] active:scale-100 hover:shadow-md hover:shadow-[#101214] hover:border-[#3f4851] active:shadow-none transition-all duration-150"
          @click="cancelGrouping"
        >
          <img class="w-4 h-4" src="/img/icon/the-staking/close.png" alt="Close Icon" @mousedown.prevent />
        </div>
      </div>
      <div class="col-start-12 col-span-1 flex justify-center items-center p-1">
        <div
          class="w-6 h-6 rounded-md bg-[#171D22] p-1 flex justify-center items-center hover:scale-110 border border-[#171D22] active:scale-100 hover:shadow-md hover:shadow-[#101214] hover:border-[#3f4851] active:shadow-none transition-all duration-150"
          @click="confirmGrouping"
        >
          <img class="w-4 h-4" src="/img/icon/the-staking/check.png" alt="Check Icon" @mousedown.prevent />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useStakingStore } from "@/store/theStaking";
import { ref } from "vue";

const emit = defineEmits(["confirmGrouping"]);

const stakingStore = useStakingStore();
let groupName = ref(null);

const cancelGrouping = () => {
  groupName.value = "";
  stakingStore.setActivePanel(null);
};

const confirmGrouping = () => {
  emit("confirmGrouping", groupName.value.trim());
};
</script>
