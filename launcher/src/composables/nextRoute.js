import { useClickInstall } from "@/store/clickInstallation";
import { useRouter } from "vue-router";

export function goToNext() {
  const installStore = useClickInstall();
  const router = useRouter();
  const fullPath = router.currentRoute.value.fullPath;

  let nextPath;
  switch (fullPath) {
    case "/oneClick/preset":
      nextPath = "/oneClick/config";
      break;
    case "/oneClick/config":
      if (installStore.selectedPreset.includedPlugins.some((plugin) => plugin.service === "FlashbotsMevBoostService")) {
        nextPath = "/oneClick/mevboost";
      } else if (installStore.selectedPreset.name === "op full node" || installStore.selectedPreset.name === "op node archive") {
        nextPath = "/oneClick/verify";
      } else {
        nextPath = "/oneClick/sync";
      }
      break;
    case "/oneClick/mevboost":
      nextPath = "/oneClick/sync";
      break;
    case "/oneClick/sync":
      nextPath = "/oneClick/verify";
      break;
    case "/oneClick/verify":
      nextPath = "/oneClick/launch";
      break;
    default:
      nextPath = "/welcome";
  }

  return nextPath;
}
