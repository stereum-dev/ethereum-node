import { useClickInstall } from "../../src/store/clickInstallation";
import { useRouter } from "vue-router";

//Computed

//Functions

export function goToNext() {
  const installStore = useClickInstall();
  const router = useRouter();

  if (router.currentRoute.value.fullPath === "/oneClick/preset") {
    return "/oneClick/config";
  } else if (router.currentRoute.value.fullPath === "/oneClick/config") {
    if (installStore.selectedPreset.includedPlugins.some((plugin) => plugin.service === "FlashbotsMevBoostService")) {
      return "/oneClick/mevboost";
    } else {
      return "/oneClick/sync";
    }
  } else if (router.currentRoute.value.fullPath === "/oneClick/mevboost") {
    return "/oneClick/sync";
  } else if (router.currentRoute.value.fullPath === "/oneClick/sync") {
    return "/oneClick/verify";
  } else if (router.currentRoute.value.fullPath === "/oneClick/verify") {
    return "/oneClick/launch";
  }
}
