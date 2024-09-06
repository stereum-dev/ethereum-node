<template>
  <div class="MachineNameParent" @mouseenter="footerStore.cursorLocation = `${machine}`" @mouseleave="footerStore.cursorLocation = ''">
    <div class="ubuntuIcon">
      <img src="/img/icon/control-page-icons/ubuntuIco.svg" />
    </div>
    <div class="machineNam">
      <span>{{ controlStore.ServerName }}</span>
    </div>
  </div>
</template>
<script setup>
import { useControlStore } from "@/store/theControl";
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";

const controlStore = useControlStore();
const footerStore = useFooter();

const t = i18n.global.t;

const machine = t("serverDetail.machine", { machineName: controlStore.ServerName });
</script>

<style scoped>
.MachineNameParent {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
  color: #c1c1c1;
  position: relative;
  border: 1px solid #343434;
  box-shadow: 1px 1px 10px 1px #171717;
  border-radius: 10px;
  background: #2a2a2a;
}
.MachineNameParent:hover {
  background: #313131;
}
.machineNam {
  width: 90%;
  height: 75%;
  font-size: 65%;
  font-weight: bold;
  color: rgb(122, 204, 255);
  text-transform: uppercase;
  position: absolute;
  left: 10%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 0 0 6%;
}

.machineNam:hover,
.machineNam:active {
  outline: none;
}
.ubuntuIcon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #b7c2c2;
  border-radius: 18px;
  z-index: 3;
  width: 10%;
  box-sizing: border-box;
  box-shadow: 1px 1px 10px 1px #171717;
  position: absolute;
  left: 1%;
}
.ubuntuIcon img {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>
