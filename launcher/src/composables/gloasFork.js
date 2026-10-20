import { computed, onBeforeUnmount, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useServices } from "@/store/services";
import { useSetups } from "@/store/setups";
import { useNodeHeader } from "@/store/nodeHeader";
import { gloasReadiness, gloasForkTime } from "@/share/gloasFork";
import { BUILDER_CLIENTS } from "@/share/builders";

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

  // setups with MEV-Boost and no builder settings yet: after the fork MEV-Boost is no longer used
  const setupStore = useSetups();
  const headerStore = useNodeHeader();
  const router = useRouter();
  const builderAlerts = computed(() =>
    (setupStore.allSetups ?? [])
      .filter((setup) => {
        if (setup.buildersSaved || gloasForkTime(setup.network) === null) return false;
        const services = (setup.services ?? []).map((s) => s.service);
        return services.includes("FlashbotsMevBoostService") && services.some((s) => BUILDER_CLIENTS[s]);
      })
      .map((setup) => {
        const forkTime = gloasForkTime(setup.network);
        const forked = now.value >= forkTime;
        const values = { network: setup.network, setup: setup.setupName, date: new Date(forkTime * 1000).toLocaleString() };
        return {
          setupId: setup.setupId,
          level: forked ? "red" : "yellow",
          title: t("nodeAlert.buildersTitle"),
          detail: t("nodeAlert.buildersDetail", values),
          hover: forked ? t("nodeAlert.buildersHoverPassed", values) : t("nodeAlert.buildersHover", values),
        };
      })
  );
  // opens the setup on the node page and its Builders dialog
  const openBuilders = async (setupId) => {
    if (router.currentRoute.value.path !== "/node") await router.push("/node");
    const setup = setupStore.allSetups.find((s) => s.setupId === setupId);
    if (!setup) return;
    setupStore.allSetups.forEach((s) => (s.isActive = false));
    setup.isActive = true;
    setupStore.selectedSetup = setup;
    setupStore.isConfigViewActive = true;
    headerStore.setServiceModal("Builders");
  };

  return { gloasAlerts, builderAlerts, openBuilders };
}
