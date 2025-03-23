<template>
  <div
    class="animate__animated animate__fadeIn w-full h-full max-h-[32px] col-start-1 col-span-full bg-[#3e4347] rounded-sm grid grid-cols-12 items-center cursor-pointer shadow-md shadow-gray-800 border border-gray-600"
    :class="{ 'border-blue-500': isDragging, 'border-gray-600': !isDragging }"
    @dragover.prevent="onDragOver"
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
  >
    <div class="w-full h-full col-start-1 col-end-11 relative flex justify-start items-center">
      <button class="absolute right-2 focus:outline-none rtl:left-0 rtl:right-auto" @click="togglePasswordVisibility">
        <img v-if="isPasswordVisible" class="w-4" src="/img/icon/staking-page-icons/visible.png" alt="Visible Icon" @mousedown.prevent />
        <img v-else class="w-4" src="/img/icon/staking-page-icons/invisible.png" alt="Invisible Icon" @mousedown.prevent />
      </button>

      <input
        v-model="enteredPassword"
        :type="isPasswordVisible ? 'text' : 'password'"
        placeholder="Enter password or drop a file"
        class="w-full max-h-[28px] text-gray-400 placeholder-gray-400/70 rounded-sm items-center py-1 pl-4 bg-[#171D22]"
      />
    </div>
    <div class="col-start-11 col-span-1 flex justify-center items-center p-1">
      <div
        class="w-6 h-6 rounded-md bg-[#171D22] p-1 flex justify-center items-center hover:scale-110 border border-[#171D22] active:scale-100 hover:shadow-md hover:shadow-[#101214] hover:border-[#3f4851] active:shadow-none transition-all duration-150"
        @click="cancelPassword"
      >
        <img class="w-4 h-4" src="/img/icon/staking-page-icons/close.png" alt="Close Icon" @mousedown.prevent />
      </div>
    </div>
    <div class="col-start-12 col-span-1 flex justify-center items-center p-1">
      <div
        class="w-6 h-6 rounded-md bg-[#171D22] p-1 flex justify-center items-center hover:scale-110 border border-[#171D22] active:scale-100 hover:shadow-md hover:shadow-[#101214] hover:border-[#3f4851] active:shadow-none transition-all duration-150"
        @click="confirmPassword"
      >
        <img class="w-4 h-4" src="/img/icon/staking-page-icons/check.png" alt="Check Icon" @mousedown.prevent />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStakingStore } from "@/store/theStaking";
import { onMounted, onUnmounted, ref } from "vue";

const emit = defineEmits(["confirmPassword"]);

const stakingStore = useStakingStore();
let enteredPassword = ref("");
let isPasswordVisible = ref(false);
let isDragging = ref(false);

// Methods

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

const cancelPassword = () => {
  enteredPassword.value = "";
  stakingStore.isPreviewListActive = false;
  stakingStore.setActivePanel(null);
  stakingStore.previewKeys = [];
  stakingStore.doppelgangerKeys = [];
};

const confirmPassword = () => {
  emit("confirmPassword", enteredPassword.value.trim());
  enteredPassword.value = "";
  isPasswordVisible.value = false;
};

const onDragOver = () => {
  isDragging.value = true;
};

const onDragLeave = () => {
  isDragging.value = false;
};

const onDrop = (event) => {
  isDragging.value = false;
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    const file = files[0];
    if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = () => {
        enteredPassword.value = reader.result.trim();
      };
      reader.readAsText(file);
    } else {
      alert("Only plain text files are allowed!");
    }
  }
};

onMounted(() => {
  enteredPassword.value = "";
});

onUnmounted(() => {
  enteredPassword.value = "";
});
</script>
