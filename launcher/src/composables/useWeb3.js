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
    url: "https://web3modal.com",
    icons: ["https://avatars.githubusercontent.com/u/37784886"],
  };

  // Define reactive properties if needed
  const chains = ref([mainnet]);
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
      themeMode: "light",
      themeVariables: {
        "--w3m-color-mix": "#00BB7F",
        "--w3m-border-radius-master": "0.5rem",
      },
      wagmiConfig: wagmiConfig.value,
      projectId,
      enableAnalytics: true,
      enableOnramp: true,
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
