import { useClickInstall } from "../../src/store/clickInstallation";
import { useRouter } from "vue-router";

//Computed

//Functions

export function goToNext() {
  const installStore = useClickInstall();
  const router = useRouter();
  const fullPath = router.currentRoute.value.fullPath;

  switch (fullPath) {
    case "/oneClick/preset":
      return "/oneClick/config";
    case "/oneClick/config":
      if (installStore.selectedPreset.includedPlugins.some((plugin) => plugin.service === "FlashbotsMevBoostService")) {
        return "/oneClick/mevboost";
      } else {
        return "/oneClick/sync";
      }
    case "/oneClick/mevboost":
      return "/oneClick/sync";
    case "/oneClick/sync":
      return "/oneClick/verify";
    case "/oneClick/verify":
      return "/oneClick/launch";
    default:
      return "/welcome";
  }
}
