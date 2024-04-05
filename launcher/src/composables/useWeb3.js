import { ref } from "vue";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi";
import { mainnet, arbitrum } from "viem/chains";
import { reconnect } from "@wagmi/core";

export function useWeb3() {
  // Configuration details
  const projectId = "51f595d21a6e919111f612da72d5ed09";
  const metadata = {
    name: "Web3Modal",
    description: "Web3Modal Example",
    url: "https://web3modal.com", // origin must match your domain & subdomain
    icons: ["https://avatars.githubusercontent.com/u/37784886"],
  };

  // Define reactive properties if needed
  const chains = ref([mainnet, arbitrum]);
  const wagmiConfig = ref(
    defaultWagmiConfig({
      chains: chains.value,
      projectId,
      metadata,
    })
  );

  // Methods
  const setupWeb3Modal = () => {
    reconnect(wagmiConfig.value);

    createWeb3Modal({
      wagmiConfig: wagmiConfig.value,
      projectId,
      enableAnalytics: true, // Optional - defaults to your Cloud configuration
      enableOnramp: true, // Optional - false as default
    });
  };

  // Run setupWeb3Modal or expose it so it can be run from a component
  // setupWeb3Modal();

  // Return reactive properties and methods
  return {
    chains,
    wagmiConfig,
    setupWeb3Modal,
  };
}
