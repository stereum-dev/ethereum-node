import { computed, onBeforeUnmount, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useServices } from "@/store/services";
import { gloasReadiness } from "@/share/gloasFork";

// Alert entries for clients too old for a scheduled Glamsterdam fork: yellow before it, red after
export function useGloasAlerts() {
  const { t } = useI18n();
  const serviceStore = useServices();
  const now = ref(Math.floor(Date.now() / 1000));
  const timer = setInterval(() => (now.value = Math.floor(Date.now() / 1000)), 60000);
  onBeforeUnmount(() => clearInterval(timer));

  const gloasAlerts = computed(() =>
    gloasReadiness(serviceStore.installedServices, now.value).map(({ network, forkTime, forked, outdated }) => {
      const date = new Date(forkTime * 1000).toLocaleString();
      const clients = [...new Set(outdated.map((o) => o.name))].join(", ");
      const list = outdated
        .map((o) => `${o.name} ${o.version} (${o.minimum ? `${t("nodeAlert.gloasNeeds")} ${o.minimum}` : t("nodeAlert.gloasNoRelease")})`)
        .join(", ");
      // whole days left, 0 in the last day
      const days = Math.max(0, Math.floor((forkTime - now.value) / 86400));
      return {
        network,
        level: forked ? "red" : "yellow",
        title: forked ? t("nodeAlert.gloasPassed") : t("nodeAlert.gloasSoon", days),
        detail: `${t("nodeAlert.gloasUpdate")} ${clients}`,
        hover: forked ? t("nodeAlert.gloasHoverPassed", { network, date, list }) : t("nodeAlert.gloasHover", { network, date, list }),
      };
    })
  );

  return { gloasAlerts };
}
