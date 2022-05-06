<template>
  <div class="parentVal">
    <div class="vldTtl"><span>Validator</span></div>
    <div class="bParts">
      <div class="lSide">
        <div class="lCont">
          <img src="../../../../public/img/icon/Control/keyEth.svg" /><span
            class="vldCnt"
            >{{ vldCnt }}</span
          ><span>ACTIVE</span>
        </div>
        <div class="gewiParent">
          <div class="vldcontIn">
            <div class="vldIco">
              <img src="../../../../public/img/icon/Control/ethBag.svg" />
            </div>
            <div class="contVldNo">
              <div class="vldNo">
                <span>{{ vldIndex }}</span>
              </div>
              <div class="gewiNo">
                <span class="cnt">{{ gewiNo }}</span
                ><span>GEWI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="rSide">
        <div class="rTtl"><span>RATING</span></div>
        <div class="val">
          <span>{{ rateVal1 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      vldCnt: 1,
      vldIndex: 32.00000001,
      gewiNo: 1,
      rateVal1: "S",
    };
  },
};
</script>

<style scoped>
.bParts {
  display: flex;
  width: 80%;
  box-sizing: border-box;
  justify-content: center;
  align-content: center;
  gap: 20%;
}
.rSide {
  display: flex;
  width: 40%;
  flex-direction: column;
  box-sizing: border-box;
  box-sizing: border-box;
  justify-content: center;
  align-content: center;
}
.rTtl {
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
.rTtl span {
  font-size: 50%;
}
.val {
  text-align: center;
  font-size: 150% !important;
  color: #4dfff3;
  width: 100%;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lSide {
  width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.parentVal {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.vldTtl {
  width: 100%;
  font-size: 60%;
  color: grey;
}
.lCont {
  display: flex;
  gap: 5%;
}
.lCont img {
  width: 20%;
}
.lCont span {
  font-size: 80%;
}

.vldcontIn {
  display: flex;
}
.vldIco {
  width: 40%;
  box-sizing: border-box;
}
.vldIco img {
  width: 80%;
}
.contVldNo {
  width: 70%;
  display: flex;
  flex-direction: column;
}
.vldNo span {
  color: #74fa65;
  font-size: 70%;
}
.gewiNo {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10%;
}
.gewiNo span {
  font-size: 80%;
  font-weight: bold;
}
.cnt {
  font-size: 70% !important;
  margin: 5%;
}
</style>
