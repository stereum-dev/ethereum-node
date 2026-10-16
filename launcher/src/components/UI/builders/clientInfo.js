import i18n from "@/includes/i18n";

const t = i18n.global.t;

export const SHORT_NAMES = {
  LodestarValidatorService: "Lodestar",
  PrysmValidatorService: "Prysm",
  TekuValidatorService: "Teku",
  NimbusValidatorService: "Nimbus",
  LighthouseValidatorService: "Lighthouse",
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
  if (s.reason === "after-fork") return { label: t("builders.status.afterFork"), text: "text-amber-300", dot: "bg-amber-400" };
  if (s.reason === "dvt") return { label: t("builders.status.dvt"), text: "text-gray-400", dot: null };
  if (s.reason === "not-scheduled")
    return { label: t("builders.status.notScheduled", { network: setup.network }), text: "text-gray-400", dot: null };
  const outOfSync = client.inSync === false && setup.saved;
  return {
    label: outOfSync ? t("builders.status.outOfSync") : client.running ? t("builders.status.applyRestart") : t("builders.status.apply"),
    text: outOfSync ? "text-amber-300" : "text-[#7fb3b3]",
    dot: outOfSync ? "bg-amber-400" : null,
  };
}
