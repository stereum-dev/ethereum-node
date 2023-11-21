const activeStatusIcon = "/img/icon/the-staking/Validatorkey_Status_Active.png";
const slashedStatusIcon = "/img/icon/the-staking/Validatorkey_Status_Slashed.png";
const depositStatusIcon = "/img/icon/the-staking/Validatorkey_Status_Deposit.png";
const offlineStatusIcon = "/img/icon/the-staking/Validatorkey_Status_Offline.png";
const pendingStatusIcon = "/img/icon/the-staking/Validatorkey_Status_Pending_alternative.png";
const exitedStatusIcon = "/img/icon/the-staking/Validatorkey_Status_Exited.png";
const apiProblems = "/img/icon/the-staking/State_Icon.png";
const apiLoading = "/img/icon/task-manager-icons/turning_circle.gif";

export function useKeyStates(item) {
  switch (item.status) {
    case "active_online":
      return activeStatusIcon;
    case "active":
      return activeStatusIcon;
    case "active_offline":
      return offlineStatusIcon;
    case "slashed":
      return slashedStatusIcon;
    case "pending":
      return pendingStatusIcon;
    case "exited":
      return exitedStatusIcon;
    case "withdrawal":
      return exitedStatusIcon;
    case "NA":
      return apiProblems;
    case "loading":
      return apiLoading;
    default:
      return depositStatusIcon;
  }
}
