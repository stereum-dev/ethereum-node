<template>
  <div class="netChkparent">
    <div class="wifiIco">
      <img
        class="wifiImg"
        src="../../../../public/img/icon/wifiIcon.svg"
        alt=""
      />
    </div>
    <div class="recive">
      <span class="rec">{{ rec }}</span>
      <span class="lblMbit">mbit</span>
      <small>Total Received</small>
      <div class="arrowPart">
        <div class="arrowIco">
          <img src="../../../../public/img/icon/arrows/arrowOrange.png" />
        </div>
        {{ ttlRec }} <span class="ttlRec">GB</span>
      </div>
    </div>
    <div class="transmit">
      <span class="tran">{{ tran }}</span>
      <span class="lblMbit">mbit</span>
      <small>Total Transmietted</small>
      <div class="arrowPart">
        <div class="arrowIco">
          <img src="../../../../public/img/icon/wifiIcon.svg" />
        </div>
        {{ ttlTrn }} <span class="ttlRec">GB</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return { rec: 1.12, tran: 1.12, ttlRec: 44.6, ttlTrn: 44.6 };
  },
};
</script>

<style scoped>
.wifiIco {
  width: 30%;
}
.wifiImg {
  width: 80%;
}
.recive {
  width: 30%;
  display: flex;
  flex-direction: column;
}
.rec {
  color: #ec590a;
  font-weight: bold;
  font-size: 1rem;
}
.transmit {
  width: 30%;
  display: flex;
  flex-direction: column;
}
small {
  font-size: 0.3rem;
}
.tran {
  color: #336666;
  font-weight: bold;
  font-size: 1rem;
}
.lblMbit {
  color: #eee;
  font-weight: bold;
  font-size: 0.9rem;
}
</style>
