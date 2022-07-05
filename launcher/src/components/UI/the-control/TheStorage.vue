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
          <span>{{ countFreeVal }} MB FREE</span>
        </div>
        <div class="totalPart">
          <span>/ {{ total }} MB TOTAL</span>
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
    this.storageMet();
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
    async storageMet() {
      try {
        const response = await ControlService.getServerVitals();
        let data = await response.serverVitals.stdout;
        const arr = data.split(/\r?\n/);
        this.usedStotagePer = parseInt(arr[2]);
        const arr2 = arr[3].split(" ");
        this.total = parseInt(arr2[0]);
        this.used = parseInt(arr2[1]);
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
  margin-top: 4px;
  margin-left: 11px;
  font-size: 1rem;
  font-weight: 600;
  color: #5ed966;
}
.totalPart {
  width: 94%;
  height: 15%;
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 0.5rem;
  font-weight: 700;
  color: #eee;
}
.valueBarPart {
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.valueBarPart_loader {
  width: 95%;
  height: 90%;
  border-radius: 3px;
  margin-top: 3px;
  background: #848484;
  justify-content: flex-start;
  align-items: center;
  display: flex;
}
.valueBarPart_loader-value {
  height: 90%;
  border-radius: 3px;
  background: #5ed966;
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
