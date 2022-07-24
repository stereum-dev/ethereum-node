<template>
  <div class="amsterdamparent">
    <div class="icoTitle">
      <div class="icoContainer">
        <img :src="networkIcon" />
      </div>
      <span>NODE</span>
    </div>
    <div class="docBox">
      <div class="upSide">
        <div class="epochBox">
          <div class="ttlEpoch"><span>EPOCH</span></div>
          <div class="epochText">
            <span>{{ counter }} #</span>
          </div>
          <div class="downTtl"><span class="downTtl">CONFIRMED</span></div>
        </div>
      </div>
      <div class="downSide">
        <div class="fahrradIco">
          <img src="../../../../public/img/icon/control/amsterdam.png" />
        </div>
        <div class="dateBox">
          <span>000000000 days</span>
          <span>-00h - 00m - 00s</span>
        </div>
        <!-- <div class="circleArrow">
          <sync-info v-if="showSyncInfo">
            <div class="serviceName">
              <div class="serviceName_val">
                <div class="serviceName-row">
                  <span>[SERVICE NAME]</span>
                </div>
                <div class="serviceName-greenRow">
                  <span>12345678910</span>
                  <span>/</span>
                  <span>12345678910</span>
                  <span>100%</span>
                </div>
              </div>
              <div class="serviceName_val">
                <div class="serviceName-row">
                  <span>[SERVICE NAME]</span>
                </div>
                <div class="serviceName-blueRow">
                  <span>12345678910</span>
                  <span>/</span>
                  <span>12345678910</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </sync-info>
          <img :src="errorIco" />
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
import SyncInfo from "./SyncInfo.vue";
import { mapState } from "pinia";
import { useServices } from "@/store/services";
export default {
  components: { SyncInfo },
  data() {
    return {
      showSyncInfo: false,
      counter: 0,
      networkIcon: "",
      mainnetIcon: "/img/icon/control/mainnetIconControl.png",
      testnetIcon: "/img/icon/control/testnetIconControl.png",
    };
  },

  mounted() {
    if (this.network === "mainnet") {
      this.networkIcon = this.mainnetIcon;
    } else {
      this.networkIcon = this.testnetIcon;
    }
  },
  computed: {
    ...mapState(useServices, {
      network: "network",
    }),
  },
};
</script>
<style scoped>
.serviceName {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  flex-direction: column;
}
.serviceName_val {
  display: flex;
  width: 100%;
  height: 50%;
  justify-content: space-between;
  align-items: center;
  font-size: 80%;
}
.serviceName-row {
  display: flex;
  width: 25%;
  justify-items: center;
  align-items: center;
}
.serviceName-greenRow,
.serviceName-blueRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 70%;
  font-weight: bold;
}
.serviceName-greenRow {
  color: #5ed966;
}
.serviceName-blueRow {
  color: #4dfff3;
}
.amsterdamparent {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-content: center;
}
.icoTitle {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 30%;
  height: 100%;
}
.icoContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80%;
}
.icoContainer img {
  width: 70%;
}
.icoTitle span {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 60%;
}
.docBox {
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.upSide {
  height: 50%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.epochBox {
  width: 95%;
  height: 98%;
  display: flex;
  background: #33393e;
  flex-direction: column;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
}
.ttlEpoch {
  width: 90%;
  display: flex;
  height: 22%;
  font-size: 50%;
  margin-bottom: 2%;
  font-weight: bold;
}
.epochText {
  width: 90%;
  height: 50%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border: 1px solid #c1c1c1;
  background: #000;
  font-size: 80%;
  padding-right: 2%;
  border-radius: 3px;
}
.downTtl {
  width: 90%;
  height: 22%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 15%;
  margin-top: 1%;
}
.downSide {
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.fahrradIco {
  height: 85%;
  width: 20%;
  background: #33393e;
  border: 1px solid #191b1d;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.fahrradIco img {
  width: 80%;
}
.dateBox {
  width: 40%;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 45%;
  background: #33393e;
  border-radius: 5px;
  border: 1px solid #191b1d;
}

.circleArrow {
  width: 20%;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 5%;
  background: #33393e;
  border-radius: 5px;
  border: 1px solid #191b1d;
}
.circleArrow img {
  width: 60%;
}
</style>
