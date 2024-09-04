<template>
  <div
    class="animate__animated animate__fadeIn w-full h-full max-h-[32px] col-start-1 col-span-full rounded-sm flex justify-center items-center cursor-pointer border border-[#3e4347] px-[1px]"
  >
    <div class="w-full h-7 grid grid-cols-12 bg-[#171D22] space-x-1">
      <input
        id="input1"
        v-model="remoteKey"
        class="col-start-1 col-end-20 w-full h-full bg-[#171D22] border px-4 rounded-sm outline-none text-xs text-gray-400 border-gray-500 placeholder:text-gray-400"
        type="text"
        autofocus
        placeholder="Add Public Key to import remote keys"
        @change="changeActive"
      />
      <div class="col-start-21 col-span-1 h-full flex justify-center items-center px-1">
        <div
          class="w-6 h-6 rounded-md bg-[#3e4347] p-1 flex justify-center items-center hover:scale-110 border border-[#171D22] active:scale-100 hover:shadow-md hover:shadow-[#101214] hover:border-[#3f4851] active:shadow-none transition-all duration-150"
          :class="remoteKey !== '' ? 'cursor-pointer' : 'pointer-events-none opacity-50'"
          @click="addNewRemoteKey"
        >
          <img class="w-5" src="/img/icon/server-management-icons/plus-icon.png" alt="Check Icon" @mousedown.prevent />
        </div>
      </div>

      <div class="col-start-23 col-span-1 h-full flex justify-center items-center px-1">
        <div
          class="w-6 h-6 rounded-md bg-[#3e4347] p-1 flex justify-center items-center hover:scale-110 border border-[#171D22] active:scale-100 hover:shadow-md hover:shadow-[#101214] hover:border-[#3f4851] active:shadow-none transition-all duration-150"
          :class="stakingStore.previewRemoteKeys.filter((k) => k.selected).length ? 'cursor-pointer' : 'pointer-events-none opacity-50'"
          @click="confirmRemote"
        >
          <img class="w-4 h-4" src="/img/icon/staking-page-icons/check.png" alt="Check Icon" @mousedown.prevent />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useStakingStore } from "@/store/theStaking";

const emit = defineEmits(["confirmRemote"]);

const stakingStore = useStakingStore();
const remoteKey = ref("");

//Temprorary function to test adding new remote keys
const addNewRemoteKey = () => {
  if (remoteKey.value !== "") {
    stakingStore.previewRemoteKeys.push({
      pubkey: remoteKey.value,
      selected: false,
      url: stakingStore.remoteUrl,
    });
  }

  remoteKey.value = "";
};

const confirmRemote = () => {
  emit("confirmRemote");
};
</script>
