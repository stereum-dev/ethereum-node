<template>
  <div class="sync_box divide-y divide-gray-600">
    <div class="totalBox">
      <div class="totalTitle">
        <span>total</span>
      </div>
      <div class="totalValue">
        <span>0/0</span>
      </div>
    </div>
    <div class="statusBox">
      <div class="status">
        <div class="statusTitle">
          <span>STATUS</span>
        </div>
        <div class="statusValue">
          <span v-if="blockIsOnline">PARTICIPATING</span>
          <span v-else>NOT PARTICIPATING</span>
        </div>
      </div>
      <div class="startEpoch">
        <div class="startTitle">
          <span>Start Epoch</span>
        </div>
        <div class="startValue">
          <span>134345235</span>
        </div>
      </div>
      <div class="endEpoch">
        <div class="endTitle">
          <span>End Epoch</span>
        </div>
        <div class="endValue">
          <span>134345235</span>
        </div>
      </div>
    </div>
    <div class="statusTiming">
      <p v-if="blockIsOnline">New Sync Committee in <span>256</span> Epochs</p>
      <p v-else>New Sync Committee in <span>??</span> Epochs</p>
      <p v-if="blockIsOnline"><span>12</span> hours</p>
      <p v-else>(?? days ?? hours)</p>
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
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  height: 100%;
}
.totalBox {
  width: 100%;
  height: 18%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.statusBox {
  width: 100%;
  height: 55%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.statusTitle {
  width: 40%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.statusTitle span {
  color: #efefef;
  font-size: 0.5rem;
  font-weight: 600;
  text-align: center;
  text-transform: capitalize;
}
.statusValue {
  width: 60%;
  height: 30%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.statusValue span {
  color: #4cab39;
  font-size: 0.6rem;
  font-weight: 600;
  text-transform: uppercase;
}
.totalTitle,
.startTitle,
.endTitle {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.totalTitle span,
.startTitle span,
.endTitle span {
  color: #efefef;
  font-size: 0.6rem;
  font-weight: 600;
  text-align: center;
  text-transform: capitalize;
}
.totalValue {
  width: 50%;
  height: 100%;
  padding: 0 3px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.totalValue span {
  color: #e1e1e1;
  font-size: 0.6rem;
  font-weight: 600;
  text-transform: uppercase;
  overflow: hidden;
}

.status,
.startEpoch,
.endEpoch {
  width: 100%;
  height: 30%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.startValue,
.endValue {
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
.startValue span,
.endValue span {
  color: #efd96bdf;
  font-size: 0.6rem;
  font-weight: 600;
  text-align: center;
  overflow: hidden;
}
.statusTiming {
  width: 100%;
  height: 25%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
}
.statusTiming p {
  color: #eeeeee;
  font-size: 0.5rem;
  font-weight: 600;
  text-align: right;
  text-transform: capitalize;
}
.statusTiming p span {
  color: #efd96bdf;
  font-size: 0.5rem;
  font-weight: 600;
  text-align: center;
  text-transform: capitalize;
}
</style>
