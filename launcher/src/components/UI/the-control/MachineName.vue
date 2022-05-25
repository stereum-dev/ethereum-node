<template>
  <div class="MachineNameParent">
    <div class="ubuntuIcon">
      <img src="../../../../public/img/icon/control/ubuntuIco.svg" />
    </div>
    <div class="machineNam">
      <span>{{ this.maschinName }}</span>
    </div>
  </div>
</template>
<script>
import ControlService from "@/store/ControlService";
export default {
  data() {
    return {
      maschinName: "",
    };
  },
  async created() {
    const response = await ControlService.getHostName();
    const { data: maschinName } = await response.json();
    this.maschinName = maschinName;
  },
};
</script>

<style scoped>
.MachineNameParent {
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.machineNam {
  background: #33393e;
  color: #eee;
  border: 2px solid #b7c2c2;
  left: -5%;
  position: relative;
  z-index: 2;
  width: 80%;
  padding-left: 6%;
  outline: none;
  font-size: 70%;
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
  border: 2px solid #b7c2c2;
  border-radius: 18px;
  z-index: 3;
  width: 10%;
}
.ubuntuIcon img {
  width: 100%;
}
</style>
