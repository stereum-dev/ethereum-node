<template>
  <div class="reward-parent">
    <div class="stateBox">
      <div class="balance">
        <div class="balance-title">
          <span>{{ $t("timeReward.totalText") }} {{ keys.length }} {{ $t("timeReward.validators") }}</span>
        </div>
        <div class="balance-value">
          <span>{{ totalBalance }}</span>
        </div>
      </div>
      <div class="proposed">
        <comming-soon></comming-soon>
        <div class="proposedHeader">
          <span class="header-text">VALIDATOR RECIPIENT ADDRESS</span>
          <span class="header-counter">1/1</span>
        </div>
        <div class="proposedContent">
          <div class="left-side">
            <div class="view">
              <img src="../../../../public/img/icon/the-staking/eye.png" alt="icon" />
              <div class="view-value">
                <span></span>
              </div>
            </div>
            <div class="cube">
              <img src="../../../../public/img/icon/the-staking/cube-icon.png" alt="icon" />
              <div class="cube-value">
                <span>135456456</span>
              </div>
            </div>
            <div class="meet">
              <img src="../../../../public/img/icon/the-staking/meet.png" alt="icon" />
              <div class="meet-value">
                <span></span>
              </div>
            </div>
          </div>
          <div class="right-side">
            <div class="percentage">
              <img src="../../../../public/img/icon/the-staking/percentage.png" alt="icon" />
              <div class="percentage-value">
                <span>100</span>
              </div>
            </div>
            <div class="percentage">
              <img src="../../../../public/img/icon/the-staking/percentage.png" alt="icon" />
              <div class="percentage-value">
                <span>95</span>
              </div>
            </div>
            <div class="slashing">
              <img src="../../../../public/img/icon/the-staking/slasher.png" alt="icon" />
              <div class="slashing-value">
                <span></span>
              </div>
            </div>
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
.stateBox {
  width: 90%;
  position: relative;
  height: 95%;
  background-color: #bfbfbf;
  margin: 0 auto;
  border-radius: 10px;
  padding: 3px;
}
.stateBox .balance {
  width: 100%;
  height: 35%;
  background-color: #464a44;
  margin: 0 auto;
  border-radius: 10px;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.balance .balance-title {
  color: #fff;
  font-size: 0.6rem;
  font-weight: 700;
}
.balance .balance-value {
  width: 92%;
  height: 22px;
  margin: 0 auto 3px auto;
  background-color: #242529;
  border-radius: 25px;
}
.balance .balance-value span {
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  margin: 2% auto 0 6px;
  display: flex;
  justify-content: left;
  align-items: flex-end;
}
.stateBox .proposed {
  width: 100%;
  height: 63%;
  background-color: #464a44;
  margin: 3px auto 0 auto;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.proposed {
  position: relative;
}
.proposed .proposedHeader {
  width: 100%;
  height: 25%;
  padding: 3px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.proposedHeader .header-text {
  font-size: 0.6rem;
  font-weight: 600;
  color: #dadada;
  margin-left: 2%;
}
.proposedHeader .header-counter {
  font-size: 0.7rem;
  font-weight: 600;
  text-align: center;
  color: rgb(159, 230, 136);
  width: 18%;
  height: 100%;
  margin-right: 1%;
  background-color: #242529;
  border-radius: 25px;
}
.proposed .proposedContent {
  width: 100%;
  height: 73%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.proposed .left-side {
  width: 60%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.proposed .right-side {
  width: 40%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}

.left-side .cube,
.left-side .view,
.left-side .meet {
  width: 100%;
  height: 30%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.left-side img {
  width: 12%;
  margin-left: 5%;
}
.view img,
.meet img {
  width: 13%;
  margin-left: 5%;
}

.cube .cube-value,
.view .view-value,
.meet .meet-value {
  width: 70%;
  height: 90%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: #242424;
  border-radius: 20px;
  text-align: left;
  font-size: 0.7rem;
  font-weight: 600;
  color: #dadada;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.cube-value span,
.view-value span,
.meet-value span {
  width: max-content;
  padding-top: 2px;
  padding-left: 10%;
}
.right-side .percentage,
.right-side .slashing {
  width: 100%;
  height: 30%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.percentage .percentage-value,
.slashing .slashing-value {
  width: 45%;
  height: 90%;
  background-color: #242424;
  border-radius: 20px;
  text-align: center;
  margin-right: 5%;
  font-size: 0.7rem;
  font-weight: 600;
  color: #dadada;
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.percentage-value span,
.slashing-value span {
  padding-top: 1px;
  padding-left: 10%;
}
.right-side img {
  width: 20%;
  margin-left: 10%;
}
.slashing img {
  width: 23%;
  margin-left: 10%;
}
</style>
