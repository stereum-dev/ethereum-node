import { useStakingStore } from "@/store/theStaking";
import ControlService from "@/store/ControlService";

export const useListGroups = () => {
  const stakingStore = useStakingStore();

  const listGroups = async () => {
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
          const matchingKey = stakingStore.filteredKeys.find((key) => key.key === pubkey);
          if (matchingKey) {
            groups[keyData.groupID].keys.push(matchingKey);
          }
        }
      }

      stakingStore.validatorKeyGroups = Object.values(groups);
      // console.log(stakingStore.validatorKeyGroups);
    } else {
      console.error("Error fetching keys from server");
    }
  };

  return { listGroups };
};
