<template>
  <div class="MachineNameParent">
    <div class="ubuntuIcon">
      <img src="../../../../public/img/icon/control/ubuntuIco.svg" />
    </div>
    <div class="machineNam">
      <span>{{ maschinName }}</span>
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
  created() {
    this.maschinNameMet();
  },
  methods: {
    async maschinNameMet() {
      try {
        const response = await ControlService.getServerVitals();
        let data = await response.serverVitals.stdout;
        const arr = data.split(/\r?\n/);
        this.maschinName = arr[0];
      } catch (error) {
        console.log(error);
      }
    },
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
  color: #eee;
  border: 2px solid #b7c2c2;
  border-radius: 4px;
  left: -5%;
  position: relative;
  z-index: 2;
  width: 80%;
  height: 90%;
  padding-left: 6%;
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
  border: 2px solid #b7c2c2;
  border-radius: 18px;
  z-index: 3;
  width: 10%;
}
.ubuntuIcon img {
  width: 100%;
}
</style>
