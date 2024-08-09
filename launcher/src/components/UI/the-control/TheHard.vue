<template>
  <div class="storageParent">
    <div class="storageBox">
      <div class="storageIco">
        <div class="icoContainer">
          <img src="/img/icon/control-page-icons/hdd.svg" />
        </div>
        <div class="icoTitle">
          <span>{{ $t("controlPage.hard") }}</span>
        </div>
      </div>
      <div class="storageProcPart">
        <div class="freePart">
          <span>{{ availDisk }} GB {{ $t("controlPage.free") }}</span>
        </div>
        <div class="totalPart">
          <span>/ {{ totalDisk }} GB {{ $t("controlPage.total") }}</span>
        </div>
        <div class="valueBarPart">
          <div class="valueBarPart_loader">
            <div class="valueBarPart_loader_value_bg">
              <div class="valueBarPart_loader-value" :style="combinedStyles" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue";
import { useControlStore } from "@/store/theControl";

const controlStore = useControlStore();

const availDisk = computed(() => controlStore.availDisk);
const totalDisk = computed(() => controlStore.totalDisk);
const usedPerc = computed(() => controlStore.usedPerc);

const getPerc = computed(() => {
  return `calc(${parseInt(usedPerc.value)}%)`;
});

const storageStatus = computed(() => {
  const usedPercentage = parseInt(usedPerc.value);

  if (usedPercentage < 60) {
    return "#448f49";
  } else if (usedPercentage <= 75) {
    return "#ffff00";
  } else if (usedPercentage <= 85) {
    return "#f7b800";
  } else {
    return "#ff0000";
  }
});

const combinedStyles = computed(() => ({
  width: getPerc.value,
  backgroundColor: storageStatus.value,
}));
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
.icoTitle {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 45%;
  font-weight: bold;
  color: #c1c1c1;
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
  font-size: 90%;
  font-weight: 800;
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
  font-size: 80%;
  font-weight: 600;
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
  height: 100%;
  border: 1px solid #33393e;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 5%;
  box-shadow: 1px 1px 11px 1px #1f1f1f;
}
.valueBarPart_loader-value {
  height: 100%;
  border-radius: 5px;
}
.valueBarPart_loader_value_bg {
  width: 99%;
  background-image: #33393e;
  height: 88%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-radius: 5px;
}
</style>
