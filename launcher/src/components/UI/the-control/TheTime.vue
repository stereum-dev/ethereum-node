<template>
  <div class="timeParent">
    <div class="clockIco"><sand-clock></sand-clock></div>
    <div class="timeBox">
      <div class="lastBlock">
        <div class="lastBlock_input"><input type="text" /></div>
        <div class="lastBlock_ico">
          <img src="../../../../public/img/icon/control/lastBlock.png" />
        </div>
      </div>
      <div class="averageBlock">
        <div class="averageBlock_ico">
          <img src="../../../../public/img/icon/control/average.png" />
        </div>
        <div class="averageBlock_input"><input type="text" /></div>
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
.timeParent {
  width: 95%;
  height: 95%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.clockIco {
  width: 40%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.timeBox {
  width: 70%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.lastBlock {
  width: 100%;
  height: 50%;
  justify-content: center;
  align-items: center;
  display: flex;
}
.lastBlock_input {
  width: 70%;
  height: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
}
.lastBlock_input input {
  width: 80%;
  height: 40%;
  font-size: 60%;
}
.lastBlock_ico {
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.lastBlock_ico img {
  width: 80%;
}
.averageBlock {
  width: 60%;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.averageBlock_ico {
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.averageBlock_ico img {
  width: 80%;
}
.averageBlock_input {
  width: 65%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.averageBlock_input input {
  width: 100%;
  height: 40%;
  font-size: 60%;
}
</style>
