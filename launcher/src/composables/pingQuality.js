import { useNodeStore } from "@/store/theNode";
import ControlService from "@/store/ControlService.js";
import { ref } from "vue";

export function usePingQuality() {
  const nodeStore = useNodeStore();
  let connectionStatus = ref(null);

  // Compare real-time ping with predefined ping quality levels
  const getConnectionQuality = (pingTime) => {
    nodeStore.pingHistory.push(pingTime);
    if (nodeStore.pingHistory.length > 3) {
      nodeStore.pingHistory.shift();
    }

    if (nodeStore.pingHistory.every((val) => val === "unknown") && nodeStore.pingHistory.length === 3) {
      return {
        status: "unknown",
        description: "Unable to determine connection quality.",
      };
    }

    if (pingTime === "unknown") {
      pingTime = nodeStore.pingHistory.find((val) => val !== "unknown");
    }

    for (let i = 0; i < nodeStore.pingQuality.length; i++) {
      if (pingTime <= nodeStore.pingQuality[i].maxRate) {
        return {
          ...nodeStore.pingQuality[i],
          pingTime: pingTime,
        };
      }
    }
  };

  const checkConnectionQuality = async () => {
    try {
      const res = await ControlService.checkConnectionQuality();
      const quality = getConnectionQuality(res.pingTime);
      connectionStatus.value = {
        status: quality.status,
        pingTime: quality.pingTime,
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

  return {
    checkConnectionQuality,
  };
}
