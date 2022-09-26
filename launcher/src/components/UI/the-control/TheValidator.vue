<template>
  <div class="theValidatorParent">
    <!-- <div class="theValidatorTitle">
      <span>Validator</span>
    </div> -->
    <div class="theValidatorBox">
      <div class="theValidatorBox_left">
        <div class="activePart">
          <div class="activeIco">
            <img src="../../../../public/img/icon/control/keyEth.svg" />
          </div>
          <div class="activeValue">
            <span>{{ activeVal }} ACTIVE</span>
          </div>
        </div>
        <div class="gewiPart">
          <div class="gewiIco">
            <img src="../../../../public/img/icon/control/ethBag.svg" />
          </div>
          <div class="gewiValuePart">
            <div class="green">
              <span>{{ totalBalance }}</span>
            </div>
            <div class="gewiCount">
              <div class="gewiCountValue">
                <span>{{ gewiCount }}</span>
              </div>
              <div class="gewiLabel"><span>GEWI</span></div>
            </div>
          </div>
        </div>
      </div>

      <div class="theValidatorBox_right">
        <div class="ratingLabel"><span>RATING</span></div>
        <div class="ratingValue">
          <span>{{ ratingVal }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "pinia";
import { useStakingStore } from "../../../store/theStaking";
export default {
  data() {
    return {
      activeVal: null,

      gewiCount: null,
      ratingVal: "",
    };
  },
  computed: {
    ...mapState(useStakingStore, {
      totalBalance: "totalBalance",
    }),
  },
};
</script>
<style scoped>
.theValidatorParent {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.theValidatorTitle {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20%;
  width: 100%;
  margin-bottom: 9px;
}
.theValidatorTitle span {
  font-size: 60%;
  color: gray;
}
hr {
  width: 80%;
}
.theValidatorBox {
  width: 90%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.theValidatorBox_left {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  height: 100%;
  flex-direction: column;
}
.activePart {
  width: 100%;
  height: 35%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.activeIco {
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
}
.activeIco img {
  width: 75%;
}
.activeValue {
  width: 95%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 55%;
  font-weight: bold;
  color: #c1c1c1;
}
.gewiPart {
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.gewiIco {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30%;
  height: 100%;
}
.gewiIco img {
  width: 80%;
}
.gewiValuePart {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 80%;
  height: 100%;
}
.green {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50%;
  font-size: 70%;
  font-weight: bold;
  color: #74fa65;
}
.gewiCount {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50%;
}
.gewiCountValue {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40%;
  height: 100%;
  font-size: 40%;
}
.gewiLabel {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60%;
  height: 100%;
  font-size: 50%;
  font-weight: bold;
  color: #c1c1c1;
}
.theValidatorBox_right {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 30%;
  height: 100%;
}
.ratingLabel {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 25%;
  font-size: 40%;
}

.ratingValue {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 75%;
  font-size: 200%;
  color: #4dfff3;
}
</style>
