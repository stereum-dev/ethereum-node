<template>
  <div class="storageParent">
    <div class="storageTtl"><span>storage</span></div>
    <div class="storageBox">
      <div class="storageIco">
        <img src="../../../../public/img/icon/control/hdd.svg" />
      </div>
      <div class="storageProcPart">
        <div class="freePart">
          <span>{{ countFreeVal }} MiB FREE</span>
        </div>
        <div class="totalPart">
          <span> {{ total }} MiB TOTAL</span>
        </div>
        <div class="valueBarPart">
          <div class="valueBarPart_loader">
            <div
              class="valueBarPart_loader-value"
              :style="valueStoragePer"
            ></div>
          </div>
        </div>
        <div class="latencyCounter">
          <!-- <div class="latencyCounterTtl"><span>SSD LATENCY</span></div>
          <div class="write">
            <span>write</span>
            <div class="writeBox">
              <span>{{ writeValue }} kb</span>
            </div>
          </div>
          <div class="read">
            <span>Read</span>
            <div class="readBox">
              <span>{{ readValue }} mb</span>
            </div>
            css have to change to the right height 35%
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ControlService from "@/store/ControlService";
export default {
  data() {
    return {
      free: null,
      used: null,
      total: null,
      writeValue: 134.24,
      readValue: 1.05,
      usedStotagePer: null,
    };
  },
  created() {
    this.storageUsedPerMet();
    this.entireStorageMet();
    this.usedStorageMet();
  },

  computed: {
    valueStoragePer() {
      return { width: this.usedStotagePer + "%" };
    },
    countFreeVal() {
      return this.freeVall();
    },
  },

  methods: {
    async storageUsedPerMet() {
      try {
        const response = await ControlService.getUsedStoragePer();
        this.usedStotagePer = Math.floor(await response.usedStoragePer.stdout);
      } catch (error) {
        console.log(error);
      }
    },
    async entireStorageMet() {
      try {
        const response = await ControlService.getEntireStorage();
        this.total = Math.floor(await response.entireStorage.stdout);
      } catch (error) {
        console.log(error);
      }
    },
    async usedStorageMet() {
      try {
        const response = await ControlService.getUsedStorage();
        this.used = Math.floor(await response.usedStorage.stdout);
      } catch (error) {
        console.log(error);
      }
    },
    freeVall() {
      const free = this.total - this.used;
      return free;
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
.storageTtl {
  width: 98%;
  height: 20%;
  background: #33393e;
  border-radius: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
}
.storageTtl span {
  font-size: 55%;
  color: #eee;
  border: 1px solid rgb(27, 26, 26);
  width: 20%;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.storageBox {
  width: 100%;
  height: 79%;
  display: flex;
  box-sizing: border-box;
}
.storageIco {
  box-sizing: border-box;
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.storageIco img {
  width: 70%;
}
.storageProcPart {
  width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.freePart {
  width: 100%;
  height: 35%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 90%;
  font-weight: bold;
}
.totalPart {
  width: 90%;
  height: 15%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 60%;
  font-weight: bold;
  color: #25db32;
}
.valueBarPart {
  width: 100%;
  height: 14%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.valueBarPart_loader {
  width: 95%;
  height: 70%;
  background: #848484;
  justify-content: flex-start;
  align-items: center;
  display: flex;
}
.valueBarPart_loader-value {
  height: 50%;
  background: #25db32;
}
.latencyCounter {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.latencyCounterTtl {
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.latencyCounterTtl span {
  font-size: 20%;
  width: 90%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
.write {
  width: 30%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  font-size: 39%;
}
.writeBox {
  width: 100%;
  text-align: left;
  font-weight: bold;
  font-size: 140%;
}
.read {
  width: 30%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  font-size: 39%;
}
.readBox {
  width: 100%;
  text-align: left;
  font-weight: bold;
  font-size: 140%;
}
</style>
