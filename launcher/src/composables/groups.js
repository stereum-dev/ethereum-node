import { useStakingStore } from "@/store/theStaking";
import ControlService from "@/store/ControlService"; // Adjust the import path accordingly

export const useListGroups = () => {
  const stakingStore = useStakingStore();

  const listGroups = async (item) => {
    if (!Array.isArray(item)) {
      console.log("item is not an array");
    }
    const existingKeys = await ControlService.readKeys();
    const groups = {};

    if (existingKeys) {
      for (const [pubkey, keyData] of Object.entries(existingKeys)) {
        if (keyData.groupName && keyData.groupID) {
          if (!groups[keyData.groupID]) {
            groups[keyData.groupID] = {
              id: keyData.groupID,
              name: keyData.groupName,
              keys: [],
              validatorClientID: keyData.validatorClientID,
            };
          }
          const matchingKey = item.find((key) => key.key === pubkey);
          if (matchingKey) {
            groups[keyData.groupID].keys.push(matchingKey);
          }
        }
      }

      stakingStore.validatorKeyGroups = Object.values(groups);
    } else {
      console.error("Error fetching keys from server");
    }
  };

  return { listGroups };
};
