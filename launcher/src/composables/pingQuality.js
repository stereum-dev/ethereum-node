import { useNodeStore } from "@/store/theNode";
import ControlService from "@/store/ControlService.js";
import { ref, onUnmounted } from "vue";

export function usePingQuality() {
  const nodeStore = useNodeStore();
  let connectionStatus = ref(null);
  let intervalId = null;

  // Compare real-time ping with predefined ping quality levels
  const getConnectionQuality = (pingTime) => {
    for (let i = 0; i < nodeStore.pingQuality.length; i++) {
      if (pingTime <= nodeStore.pingQuality[i].maxRate) {
        return nodeStore.pingQuality[i];
      }
    }
    return {
      status: "unknown",
      description: "Unable to determine connection quality.",
    };
  };

  const checkConnectionQuality = async () => {
    try {
      const res = await ControlService.checkConnectionQuality();
      const quality = getConnectionQuality(res.pingTime);
      connectionStatus.value = {
        status: quality.status,
        pingTime: res.pingTime,
        description: quality.description,
      };
      nodeStore.connectionStatus = connectionStatus.value;
    } catch (err) {
      console.error("Failed to check connection quality:", err);
      connectionStatus.value = {
        status: "failed",
        pingTime: null,
        description: "Unable to determine connection quality.",
      };
    }
  };

  const startPolling = () => {
    if (!intervalId) {
      intervalId = setInterval(async () => {
        await checkConnectionQuality();
      }, 10000); // Polling interval
    }
  };

  const stopPolling = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  onUnmounted(() => {
    stopPolling(); // Clean up interval on component unmount
  });

  return {
    checkConnectionQuality,
    startPolling,
    stopPolling,
  };
}
