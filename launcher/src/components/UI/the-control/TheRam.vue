<template>
  <div class="theRamParent">
    <div class="ramTtl">
      <span>RAM</span>
    </div>
    <div class="ramBox">
      <div class="ramIco">
        <img src="../../../../public/img/icon/control/ramStick.svg" />
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
  beforeUpdate() {
    this.usedRamMet();
  },
  created() {
    this.entireRamMet();
    this.usedRamMet();
  },

  methods: {
    async entireRamMet() {
      try {
        const response = await ControlService.getEntireRam();
        this.entireRam = await response.entireRam.stdout;
      } catch (error) {
        console.log(error);
      }
    },
    async usedRamMet() {
      try {
        const response = await ControlService.getUsedRam();
        this.usedRam = await response.usedRam.stdout;
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
.ramTtl {
  width: 98%;
  height: 20%;
  background: #33393e;
  border-radius: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
}
.ramTtl span {
  font-size: 55%;
  color: #eee;
  border: 1px solid rgb(27, 26, 26);
  width: 20%;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.ramBox {
  width: 100%;
  height: 79%;
  display: flex;
  box-sizing: border-box;
}
.ramIco {
  box-sizing: border-box;
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.ramIco img {
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
