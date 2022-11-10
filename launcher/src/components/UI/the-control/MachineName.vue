<template>
  <div class="MachineNameParent">
    <div class="ubuntuIcon">
      <img src="../../../../public/img/icon/control/ubuntuIco.svg" />
    </div>
    <div class="machineNam">
      <span>{{ ServerName }}</span>
    </div>
  </div>
</template>
<script>
import { useControlStore } from "../../../store/theControl";
import { mapState } from "pinia";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(useControlStore, {
      ServerName: "ServerName",
    }),
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
  height: 70%;
}
.machineNam {
  background: #33393e;
  border: 1px solid #c1c1c1;
  box-shadow: 1px 1px 10px 1px #171717;
  border-radius: 4px;
  left: -5%;
  position: relative;
  z-index: 2;
  width: 80%;
  height: 75%;
  padding-left: 5%;
  padding-top: 1px;
  outline: none;
  font-size: 0.8rem;
  font-weight: bold;
  color: rgb(122, 204, 255);
  text-transform: uppercase;
}
.machineNam span {
  width: 100%;
  height: 100%;
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
}
.ubuntuIcon img {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>
