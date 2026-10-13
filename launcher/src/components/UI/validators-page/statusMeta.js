const ICONS = "/img/icon/staking-page-icons/";

// Icon, icon tint and text color per status bucket, shared by the summary cards and the key rows.
// There is no amber icon in the set, so exiting tints the red exit cart to match its text
export const STATUS_META = {
  active: { icon: ICONS + "validator-state-active.png", color: "text-green-400" },
  exiting: { icon: ICONS + "validator-state-exited.png", iconClass: "hue-rotate-[35deg] brightness-125", color: "text-amber-400" },
  pending: { icon: ICONS + "validator-state-in-activation-queue.png", color: "text-sky-400" },
  queued: { icon: ICONS + "csm-q.png", color: "text-sky-400" },
  exited: { icon: ICONS + "validator-state-exited.png", color: "text-red-400" },
  withdrawn: { icon: ICONS + "option-withdraw.png", color: "text-teal-300" },
  slashed: { icon: ICONS + "validator-state-slashed.png", color: "text-red-500" },
  unknown: { icon: ICONS + "validator-state-not-deposited.png", color: "text-gray-400" },
};
