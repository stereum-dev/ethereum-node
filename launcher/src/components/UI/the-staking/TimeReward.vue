<template>
  <div class="reward-parent">
    <div class="time-reward-box">
      <div class="time-reward">
        <div class="time-reward-title">
          <span
            >{{ $t("timeReward.totalText") }} {{ keys.length }}
            {{ $t("timeReward.validators") }}</span
          >
        </div>
        <div class="time-reward-value">
          <span>{{ totalBalance }}</span>
        </div>
      </div>
      <div class="proposed">
        <comming-soon></comming-soon>
        <div class="left-side">
          <div class="proposed-title">
            <span>{{ $t("timeReward.proposed") }}</span>
          </div>
          <div class="cube">
            <img
              src="../../../../public/img/icon/the-staking/cube-icon.png"
              alt="icon"
            />
            <div class="cube-value">
              <span></span>
            </div>
          </div>
          <div class="rate-title">
            <span>{{ $t("timeReward.attestRate") }}</span>
          </div>
          <div class="attention-rate">
            <span>%</span>
            <div class="attention-rate-value"></div>
          </div>
        </div>
        <div class="right-side">
          <div class="attentions">
            <span class="attentions-text">{{
              $t("timeReward.attention")
            }}</span>
            <span class="attentions-value"></span>
          </div>
          <div class="missed">
            <span class="missed-text">{{ $t("timeReward.missed") }}</span>
            <span class="missed-value"></span>
          </div>
          <div class="agregations">
            <span class="agregations-text">{{
              $t("timeReward.aggregations")
            }}</span>
            <span class="agregations-value"></span>
          </div>
          <div class="slashed">
            <span class="slashed-text">{{ $t("timeReward.slashed") }}</span>
            <span class="slashed-value"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "pinia";
import { useStakingStore } from "../../../store/theStaking";

export default {
  computed: {
    ...mapState(useStakingStore, {
      totalBalance: "totalBalance",
      keys: "keys",
    }),
  },
};
</script>
<style scoped>
.reward-parent {
  width: 100%;
  height: 95%;
  margin-top: 8px;
  grid-column: 10/13;
  grid-row: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.time-reward-box {
  width: 90%;
  position: relative;
  height: 95%;
  background-color: #bfbfbf;
  margin: 0 auto;
  border-radius: 10px;
  padding: 3px;
}
.time-reward-box .time-reward {
  width: 100%;
  height: 35%;
  background-color: #464a44;
  margin: 0 auto;
  border-radius: 10px;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.time-reward .time-reward-title {
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  margin-left: 10px;
}
.time-reward .time-reward-value {
  width: 92%;
  height: 22px;
  margin: 0 auto 3px auto;
  background-color: #242529;
  border-radius: 25px;
}
.time-reward .time-reward-value span {
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  margin: 2% auto 0 6px;
  display: flex;
  justify-content: left;
  align-items: flex-end;
}
.time-reward-box .proposed {
  width: 100%;
  height: 63%;
  background-color: #464a44;
  margin: 3px auto 0 auto;
  border-radius: 10px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  position: relative;
}
.proposed .left-side {
  width: 95%;
  grid-column: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  color: #fff;
  margin-top: 5px;
}
.left-side .proposed-title,
.left-side .rate-title {
  font-size: 10px;
  font-weight: bold;
  text-align: left;
  margin-left: 10px;
}
.left-side .cube {
  width: 80%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.left-side img {
  width: 15px;
  height: 17px;
}
.attention-rate {
  width: 80%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.cube .cube-value,
.attention-rate .attention-rate-value {
  width: 40px;
  height: 17px;
  background-color: #242424;
  border-radius: 20px;
}

.proposed .right-side {
  width: 90%;
  grid-column: 2;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: space-evenly;
  margin-top: 2px;
}
.attentions,
.missed,
.agregations,
.slashed {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.attentions-text,
.missed-text,
.agregations-text,
.slashed-text {
  color: #fff;
  font-size: 10px;
  font-weight: 600;
}
.attentions-value,
.missed-value,
.agregations-value,
.slashed-value {
  width: 28px;
  height: 16px;
  background-color: rgb(35, 35, 35);
  border-radius: 20px;
}
</style>
