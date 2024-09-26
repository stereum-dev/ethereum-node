<template>
  <div class="col-start-6 col-end-20 row-start-11 row-end-12 w-full h-full">
    <div v-if="active" class="bg-[#1E2429] rounded-full flex justify-evenly items-center p-2 text-gray-300 font-normal text-md">
      {{ t("installitionMenu.osCheck") }}
      <svg
        class="animate-spin h-5 w-5 mr-3 border-2 border-gray-200 border-r-2 border-r-transparent rounded-full"
        viewBox="0 0 24 24"
      ></svg>
    </div>

    <div v-if="!active" class="bg-[#1E2429] rounded-full flex justify-center items-center p-2 text-gray-300 font-normal text-md">
      <img v-if="isSupported" src="/img/icon/welcome-page-icons/like.png" alt="icon" class="w-5 h-5 mr-2" />
      <img v-else src="/img/icon/welcome-page-icons/dislike.png" alt="icon" class="w-5 h-5 mr-2" />
      <span :class="{ 'text-gray-300': isSupported, 'text-red-500': !isSupported }" class="font-semibold text-md">
        {{ message }}
      </span>
    </div>
  </div>
</template>

<script setup>
import ControlService from "@/store/ControlService";
import { ref, onMounted } from "vue";
import i18n from "../../../../includes/i18n";

const t = i18n.global.t;

const supportMessage = t("installitionMenu.osSupported");

const active = ref(true);
const isSupported = ref(false);
let message = ref(null);

// Lifecycle Hooks
onMounted(() => {
  checkOsRequirements();
});

//Methods
const display = async (osResponse, suResponse) => {
  const osData = await osResponse;
  const suData = await suResponse;
  const osName = osData && osData.hasOwnProperty("name") && osData.name ? osData.name : "";
  const osVers = osData && osData.hasOwnProperty("version") && osData.version ? osData.version : "";
  if (osName === "Ubuntu" && (osVers === "22.04" || osVers === "24.04")) {
    message.value = osName.toUpperCase() + " " + osVers + " " + supportMessage;
    if (suData.rc) {
      // Description of return codes (suData.rc):
      // 1 = FAIL: user can not sudo without password!
      // 2 = ERROR: Executed code failed to run (<errmsg>)
      // There could also be unknown return codes that may happen on the OS!
      // Those are usually 127 but they could also overwrite the "known" codes
      // mentioned above. Therefore it's a good idea to parse stdout value in
      // addition to the return code.
      let errnum = parseInt(suData.rc);
      let errmsg = suData.stdout.toLowerCase();
      if (errnum === 1 && errmsg.indexOf("can not sudo without password")) {
        // User needs to added in the sudoers file with "%<username> ALL = (ALL) NOPASSWD: ALL"
        message.value += " BUT YOU NEED TO ENABLE PASSLESS SUDO";
      } else if (errnum === 2 && errmsg.indexOf("code failed to run")) {
        // We could not check due to interactive syntax error - allow install but show a warning
        message.value += " BUT MAKE SURE TO ENABLE PASSLESS SUDO (" + errnum + ")";
        isSupported.value = true;
      } else {
        // We could not check due to unknonw error - allow install but show a warning
        message.value += " BUT MAKE SURE TO ENABLE PASSLESS SUDO (" + errnum + ")";
        isSupported.value = true;
      }
    } else {
      // OS supported, passless sudo avail - allow install :)
      isSupported.value = true;
    }
  } else {
    message.value = "UNSUPPORTED OS";
  }
  active.value = false;
};
const checkOsRequirements = async () => {
  const osResponse = await ControlService.checkOS();
  const suResponse = await ControlService.checkSudo();
  display(osResponse, suResponse);
};
</script>
