<template>
  <div class="MachineNameParent">
    <div class="ubuntuIcon">
      <img src="/img/icon/control/ubuntuIco.svg" />
    </div>
    <div class="machineNam">
      <span>{{ ServerName }}</span>
    </div>
  </div>
</template>
<script>
import { defineComponent, computed } from "vue";
import { useControlStore } from "@/store/theControl";

export default defineComponent({
  setup() {
    const controlStore = useControlStore();

    const ServerName = computed(() => controlStore.ServerName);

    return {
      ServerName,
    };
  },
});
</script>

<style scoped>
.MachineNameParent {
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
  border: 1px solid #343434;
  box-shadow: 1px 1px 10px 1px #171717;
  border-radius: 10px;
  background: #2a2a2a;
}
.machineNam {
  width: 88%;
  height: 100%;
  font-size: 65%;
  font-weight: bold;
  color: rgb(122, 204, 255);
  text-transform: uppercase;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 0 0 3%;
}

.MachineNameParent:hover {
  background: #313131;
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
