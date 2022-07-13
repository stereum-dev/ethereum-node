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
          <span>{{ free }} MB FREE</span>
        </div>
        <div class="totalPart">
          <span>/ {{ total }} GB TOTAL</span>
        </div>
        <div class="valueBarPart">
          <div class="valueBarPart_loader">
            <div
              class="valueBarPart_loader-value"
              :style="valueStoragePer"
            ></div>
          </div>
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
        this.total = Math.floor(parseInt(arr2[0]) / 10000);
        this.free = parseInt(arr2[1]);
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
  height: 80%;
}
.freePart {
  width: 100%;
  height: 35%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 100%;
  font-weight: 600;
  color: #5ed966;
}
.totalPart {
  width: 94%;
  height: 25%;
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 100%;
  font-weight: 700;
  color: #eee;
}
.valueBarPart {
  width: 100%;
  height: 15%;
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
  background-image: linear-gradient(to right, green 22%, yellow, red);
}
</style>
