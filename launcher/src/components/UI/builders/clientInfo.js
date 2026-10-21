import i18n from "@/includes/i18n";

const t = i18n.global.t;

export const SHORT_NAMES = {
  LodestarValidatorService: "Lodestar",
  PrysmValidatorService: "Prysm",
  TekuValidatorService: "Teku",
  NimbusValidatorService: "Nimbus",
  LighthouseValidatorService: "Lighthouse",
  CharonService: "Charon",
  PlutoService: "Pluto",
};
export const shortName = (service) => SHORT_NAMES[service] ?? service;

/** label, text color and tab dot of a validator client's builder status */
export function clientStatus(client, setup) {
  const s = client.support;
  if (s.reason === "update")
    return {
      label: s.minimum
        ? t("builders.status.update", { client: shortName(client.service), minimum: s.minimum })
        : t("builders.status.noRelease"),
      text: "text-red-400",
      dot: "bg-red-500",
    };
  // nothing to do before the fork: these clients get their builders with the first save after it
  if (s.reason === "after-fork") return { label: "", text: "", dot: null };
  if (s.reason === "dvt-update")
    return {
      label: s.minimum
        ? t("builders.status.update", { client: shortName(s.middleware ?? "CharonService"), minimum: s.minimum })
        : t("builders.status.dvtNoRelease", { client: shortName(s.middleware ?? "PlutoService") }),
      text: "text-red-400",
      dot: "bg-red-500",
    };
  if (s.reason === "dvt-pending") return { label: t("builders.status.dvtPending"), text: "text-amber-300", dot: "bg-amber-400" };
  if (s.reason === "not-scheduled")
    return { label: t("builders.status.notScheduled", { network: setup.network }), text: "text-gray-400", dot: null };
  const cluster = client.clusterId ? setup.clusters?.find((c) => c.id === client.clusterId) : null;
  // a cluster's validator client loads Charon's proposer config when it starts
  if (cluster?.inSync === false)
    return {
      label: t("builders.status.charonFlags", { middleware: shortName(cluster.service) }),
      text: "text-amber-300",
      dot: "bg-amber-400",
    };
  if (cluster && client.inSync === false) return { label: t("builders.status.dvtRestart"), text: "text-amber-300", dot: "bg-amber-400" };
  const outOfSync = client.inSync === false && setup.saved;
  const set = client.running ? t("builders.status.applyRestart") : t("builders.status.apply");
  return {
    // a cluster in sync needs no line: the cluster note already says where its builders go
    label: outOfSync ? t("builders.status.outOfSync") : cluster ? "" : set,
    text: outOfSync ? "text-amber-300" : "text-[#7fb3b3]",
    dot: outOfSync ? "bg-amber-400" : null,
  };
}
