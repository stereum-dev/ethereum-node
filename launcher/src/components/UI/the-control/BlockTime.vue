<template>
  <div class="blockTimeParent">
    <div class="clockPart">
      <sand-clock class="clockPart_sand"></sand-clock>
    </div>
    <div class="blockTimeBox">
      <div class="reschteck">
        <div class="reschteckInput">
          <input type="text" />
        </div>
        <div class="reschteckIco">
          <img src="../../../../public/img/icon/Control/reschteIco.png" />
        </div>
      </div>
      <div class="averagePart">
        <div class="averageIco">
          <img src="../../../../public/img/icon/Control/average.png" />
        </div>
        <div class="averageInput"><input type="text" /></div>
      </div>
    </div>
  </div>
</template>
<script>
import SandClock from "./SandClock.vue";
export default {
  components: {
    SandClock,
  },
};
</script>
<style scoped>
.blockTimeParent {
  width: 50%;
  height: 95%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.clockPart {
  width: 30%;
  height: 100%;
}
.clockPart_sand {
  width: 210%;
}
.blockTimeBox {
  width: 70%;
  height: 95%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.reschteck {
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.reschteckInput {
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
}
.reschteckInput input {
  width: 90%;
  height: 50%;
}
.reschteckIco {
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000;
  border: 1px solid #eee;
  border-radius: 5px;
}
.reschteckIco img {
  width: 100%;
}
.averagePart {
  width: 70%;
  height: 50%;
  justify-content: center;
  align-items: center;
  display: flex;
}
.averageIco {
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000;
  border: 1px solid #eee;
  border-radius: 5px;
}
.averageIco img {
  width: 100%;
}
.averageInput {
  width: 70%;
  height: 95%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.averageInput input {
  width: 100%;
  height: 50%;
}
</style>
