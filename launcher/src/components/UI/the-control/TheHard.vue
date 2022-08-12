<template>
  <div class="storageParent">
    <div class="storageBox">
      <div class="storageIco">
        <div class="icoContainer">
          <img src="../../../../public/img/icon/control/hdd.svg" />
        </div>
        <span>HARD DISK</span>
      </div>
      <div class="storageProcPart">
        <div class="freePart">
          <span>{{ availDisk }} GB FREE</span>
        </div>
        <div class="totalPart">
          <span>/ {{ totalDisk }} GB TOTAL</span>
        </div>
        <div class="valueBarPart">
          <div class="valueBarPart_loader">
            <div class="valueBarPart_loader_value_bg">
              <div class="valueBarPart_loader-value" :style="getPerc"></div>
            </div>
          </div>
        </div>
      </div>
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
      availDisk: "availDisk",
      totalDisk: "totalDisk",
      usedPerc: "usedPerc",
    }),
    availableDisk() {},
    getPerc() {
      return { width: 100 - parseInt(this.usedPerc) + "%" };
    },
  },
};
</script>
<style scoped>
.storageParent {
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
}

.storageBox {
  width: 100%;
  height: 100%;
  display: flex;
  box-sizing: border-box;
}
.storageIco {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 30%;
  height: 100%;
}
.icoContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80%;
}
.storageIco img {
  width: 80%;
  height: 80%;
}
.storageIco span {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50%;
  font-weight: bold;
}
.storageProcPart {
  width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 80%;
}
.freePart {
  width: 90%;
  height: 35%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 1.3rem;
  font-weight: 600;
  color: #448f49;
  text-align: center;
  margin-top: 10px;
}
.totalPart {
  width: 90%;
  height: 25%;
  margin-top: 0 1%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 0.6rem;
  font-weight: 700;
  color: #c1c1c1;
}
.valueBarPart {
  width: 100%;
  height: 15%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.valueBarPart_loader {
  width: 90%;
  background: #33393e;
  height: 80%;
  border: 1px solid #33393e;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 5%;
}
.valueBarPart_loader-value {
  height: 100%;
  background: #33393e;
}
.valueBarPart_loader_value_bg {
  width: 99%;
  background-image: linear-gradient(to right, green 35%, yellow, red);
  height: 88%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
