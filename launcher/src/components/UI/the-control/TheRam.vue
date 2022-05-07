<template>
  <div class="theRamParent">
    <div class="inputBox">
      <div class="ramTtl"><span>RAM</span></div>
      <input type="text" />
    </div>
    <div class="valueBoxes">
      <div class="vlaueR">
        <span>{{ usedR }} / {{ totalR }}</span>
      </div>
      <span class="lblVal">GB</span>
      <div class="loadingVal">
        <div class="loadingVal_value" :style="verticalBar"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      usedR: 13.2,
      totalR: 45.2,
      loadingValueBar: 70,
    };
  },
  computed: {
    verticalBar() {
      return { height: this.loadingValueBar + "%" };
    },
  },
};
</script>

<style scoped>
.loadingVal_value {
  width: 98%;
  background: #568d50;
  height: 50%;
}
.loadingVal {
  width: 45%;
  background: #282828;
  height: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
}
.valueBoxes {
  display: flex;
  width: 85%;

  justify-content: flex-start;
  align-items: center;
}
.lblVal {
  width: 20%;
  font-weight: bold;
  background: #181f1c;
}
.vlaueR {
  width: 35%;
  background: #33393e;
  font-size: 80%;
  font-weight: bold;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.theRamParent {
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
}
.inputBox {
  display: flex;
  width: 99%;
  background: #171a1c;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  height: 30%;
}
.inputBox input {
  width: 150%;
  background: #171a1c;
  color: #eee;
  z-index: 1;
  position: relative;
  left: -2%;
  border: 2px solid #171a1c;
  border-radius: 10px;
  padding-left: 3%;
  outline: none;
}
.inputBox input:active,
.inputBox input:hover {
  outline: none;
}
.ramTtl {
  width: 40%;
  z-index: 5;
  background: #33393e;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  display: flex;
}
.ramTtl span {
  font-size: 90%;
  font-weight: bold;
}
</style>
