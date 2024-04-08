<template>
  <div
    class="absolute right-0 top-0 w-96 col-start-18 col-span-full animate__animated animate__slideInRight h-full z-20 flex flex-col justify-between bg-black border border-gray-500 rounded-l-md transform translate-x-full"
    :class="hideSideMenu ? 'animate__slideOutRight' : ''"
    @mouseleave="hideSideMenu = true"
  >
    <div class="w-full h-full grid grid-cols-12 grid-rows-12 gap-x-2 items-center">
      <w3m-button style="grid-row: 1/3; grid-column: 7/12; margin-left: 5px" />
      <w3m-network-button style="grid-row: 1/3; grid-column: 2/6; background: white; border-radius: 50px" />
    </div>
  </div>
</template>

<script setup>
import { useNodeHeader } from "@/store/nodeHeader";
import { ref, watch } from "vue";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi";

import { mainnet, arbitrum } from "viem/chains";
import { reconnect } from "@wagmi/core";

const hideSideMenu = ref(false);
const headerStore = useNodeHeader();
// 1. Define constants
const projectId = "51f595d21a6e919111f612da72d5ed09";

// 2. Create wagmiConfig
const metadata = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "https://web3modal.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const chains = [mainnet, arbitrum];
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  // ...wagmiOptions, // Optional - Override createConfig parameters
});

watch(hideSideMenu, (value) => {
  if (value) {
    setTimeout(() => {
      headerStore.displayWalletConnectModal = false;
    }, 300);
  }
});

reconnect(config);
// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true, // Optional - false as default
});
</script>

<style scoped></style>
