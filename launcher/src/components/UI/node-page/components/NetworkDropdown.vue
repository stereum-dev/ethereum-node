<template>
  <div class="w-[49%] relative inline-block">
    <!-- Dropdown toggle button -->
    <button
      class="w-full relative z-10 flex justify-evenly items-center p-2 text-sm border border-transparent rounded-md text-white bg-[#212629]"
      @click="isOpen = !isOpen"
    >
      <span class="mx-1">{{ $t("editModals.selectNet") }}</span>
      <svg class="w-5 h-5 mx-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 15.713L18.01 9.70299L16.597 8.28799L12 12.888L7.40399 8.28799L5.98999 9.70199L12 15.713Z" fill="currentColor"></path>
      </svg>
    </button>

    <!-- Dropdown menu -->
    <div
      v-if="isOpen"
      transition:enter="transition ease-out duration-100"
      transition:enter-start="opacity-0 scale-90"
      transition:enter-end="opacity-100 scale-100"
      transition:leave="transition ease-in duration-100"
      transition:leave-start="opacity-100 scale-100"
      transition:leave-end="opacity-0 scale-90"
      class="absolute left-0 z-20 w-56 py-2 mt-2 overflow-hidden origin-top-right bg-gray-400 rounded-md shadow-xl divide-y"
      @mouseleave="isOpen = false"
      @click="isOpen = false"
    >
      <a
        href="#"
        class="flex items-center p-2 text-sm text-gray-600 transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
      >
        <img
          class="flex-shrink-0 object-cover mx-1 rounded-full w-8 h-8"
          src="/img/icon/network-icons/ethereum-mainnet-circle.png"
          alt="mainnet icon"
        />
        <div class="mx-1">
          <p class="text-sm font-semibold text-gray-100">Mainnet</p>
        </div>
      </a>

      <a
        href="#"
        class="flex items-center p-2 text-sm text-gray-600 transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
      >
        <img
          class="flex-shrink-0 object-cover mx-1 rounded-full w-8 h-8"
          src="/img/icon/network-icons/ethereum-mainnet-circle.png"
          alt="mainnet icon"
        />
        <div class="mx-1">
          <p class="text-sm font-semibold text-gray-100">Mainnet</p>
        </div>
      </a>

      <a
        href="#"
        class="flex items-center p-2 text-sm text-gray-600 transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
      >
        <img
          class="flex-shrink-0 object-cover mx-1 rounded-full w-8 h-8"
          src="/img/icon/network-icons/ethereum-mainnet-circle.png"
          alt="mainnet icon"
        />
        <div class="mx-1">
          <p class="text-sm font-semibold text-gray-100">Mainnet</p>
        </div>
      </a>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isOpen: false,
    };
  },
};
</script>
