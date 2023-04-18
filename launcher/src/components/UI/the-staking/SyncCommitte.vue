<template>
  <div class="sync_box">
    <div class="syncCommitte">
      <div class="totalBox">
        <div class="totalTitle">
          <span>total</span>
        </div>
        <div class="totalValue">
          <span>0/0</span>
        </div>
      </div>
      <div class="statusBox">
        <div class="statusTitle">
          <span>STATUS</span>
        </div>
        <div v-if="blockIsOnline" class="statusValue">
          <span>Assigned Slot </span>
          <span>4989008</span>
        </div>
        <div v-else class="statusValue">
          <span>Not Assigned</span>
          <span>---</span>
        </div>
        <div v-if="blockIsOnline" class="nextBlock">
          <p>Next Block Proposal in: <span>44 sec</span></p>
        </div>
        <div v-else class="nextBlock">
          <p>Next Block Proposal in: <span>?? sec</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      blockIsOnline: true,
    };
  },
};
</script>

<style scoped>
.sync_box {
  grid-column: 1/7;
  grid-row: 6/10;
  width: 100%;
  height: 100%;
  margin-top: 5px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.syncCommitte {
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.committeBox {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.committeIcon {
  width: 10%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.committeIcon img {
  width: 20px;
}
.committeIcon span {
  color: #efefef;
  font-size: 0.5rem;
  font-weight: 600;
  text-align: center;
}
.committeTitle {
  width: 70%;
  height: 100%;
  padding: 0 3px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: #318d1f;
  border: 1px solid #9e9e9e;
  border-radius: 3px;
}
.committeTitle span {
  color: #fff;
  font-size: 0.5rem;
  font-weight: 600;
  text-transform: uppercase;
  overflow: hidden;
}
.statusBox {
  width: 100%;
  height: 20%;
  margin-top: 5px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.statusTitle,
.startEpoch_title,
.endEpoch_title {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 30px;
}
.statusTitle span,
.startEpoch_title span,
.endEpoch_title span {
  color: #efefef;
  font-size: 0.5rem;
  font-weight: 600;
  text-align: center;
  text-transform: capitalize;
}
.statusValue {
  width: 50%;
  height: 100%;
  padding: 0 3px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.statusValue span {
  color: #4cab39;
  font-size: 0.5rem;
  font-weight: 600;
  text-transform: uppercase;
  overflow: hidden;
}

.startEpoch,
.endEpoch {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.startEpoch_value,
.endEpoch_value {
  width: 50%;
  height: 95%;
  padding: 3px 3px 0 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #171717;
  border: 1px solid #9e9e9e;
  border-radius: 3px;
}
.startEpoch_value span,
.endEpoch_value span {
  color: #efd96bdf;
  font-size: 0.6rem;
  font-weight: 600;
  text-align: center;
  overflow: hidden;
}
</style>
