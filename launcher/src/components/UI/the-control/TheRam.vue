<template>
  <div class="theRamParent">
    <div class="ramBox">
      <div class="ramIco">
        <div class="ramIco-container">
          <img src="../../../../public/img/icon/control/ramStick.svg" />
        </div>
        <span>RAM</span>
      </div>
      <div class="ramValue">
        <div class="valDigits">
          <div class="digits">
            <span>{{ usedRam }} / {{ entireRam }}</span>
          </div>
          <span>MiB</span>
        </div>
        <div class="valLbl"><span>used</span><span>total</span></div>
      </div>
    </div>
  </div>
</template>
<script>
import ControlService from "@/store/ControlService";
export default {
  data() {
    return {
      usedRam: null,
      entireRam: null,
    };
  },
  created() {
    this.ramMet();
  },

  methods: {
    async ramMet() {
      try {
        const response = await ControlService.getServerVitals();
        let data = await response.serverVitals.stdout;
        const arr = data.split(/\r?\n/);
        const arr2 = arr[1].split(" ");
        this.entireRam = parseInt(arr2[0]);
        this.usedRam = parseInt(arr2[1]);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
.theRamParent {
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
}
.ramBox {
  width: 100%;
  height: 100%;
  display: flex;
  box-sizing: border-box;
}
.ramIco {
  box-sizing: border-box;
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.ramIco span {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 60%;
  font-weight: bold;
}
.ramIco-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80%;
}
.ramIco-container img {
  width: 75%;
}
.ramValue {
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.valDigits {
  display: flex;
  width: 100%;
  height: 70%;
  justify-content: center;
  align-items: center;
}
.digits {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  height: 100%;
}
.valDigits,
.digits span {
  font-size: 100%;
  font-weight: bold;
}
.valLbl {
  display: flex;
  width: 40%;
  align-items: center;
  justify-content: space-between;
  font-size: 60%;
}
</style>
