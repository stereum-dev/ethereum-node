<template>
  <div class="amsterdam-parent">
    <div
      class="icoTitle"
      @mouseenter="cursorLocation = `${footerInfo} ${currentNetwork.name}`"
      @mouseleave="cursorLocation = ''"
    >
      <div class="icoContainer">
        <img :src="networkIcon" />
      </div>
      <span>{{ $t("controlPage.node") }}</span>
    </div>
    <div class="docBox">
      <div class="proposed-part">
        <div class="proposed-rows-title">
          <span>proposed</span>
        </div>
        <!-- <div class="justfied-rows"><div v-for="n in 32" :key="n" class="square"></div></div> -->
        <div class="proposed-rows"><div v-for="n in 32" :key="n" class="proposed-square"></div></div>
      </div>
      <div class="justfied-part">
        <div class="justfied-rows">
          <span>justified</span>
        </div>
        <div class="justfied-rows"><div v-for="n in 32" :key="n" class="square"></div></div>
        <div class="justfied-rows"><div v-for="n in 32" :key="n" class="square"></div></div>
      </div>
      <div class="finilized-part">
        <div class="finilized-row-title"><span>finalized</span></div>
        <div class="finilized-row"><div v-for="n in 32" :key="n" class="finilized-square"></div></div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "pinia";
import { useNodeManage } from "@/store/nodeManage";
import { mapWritableState } from "pinia";
import { useFooter } from "@/store/theFooter";
export default {
  data() {
    return {
      showSyncInfo: false,
      counter: null,
      networkIcon: "",
      defaultIcon: "/img/icon/control/spinner.gif",
      days: null,
      date: "",
      pattern: [],
      footerInfo: this.$t("controlPage.netSel"),
    };
  },
  computed: {
    ...mapState(useNodeManage, {
      currentNetwork: "currentNetwork",
    }),
    ...mapWritableState(useFooter, {
      cursorLocation: "cursorLocation",
    }),
  },

  mounted() {
    this.networkIcon = this.currentNetwork.network ? this.currentNetwork.icon : this.defaultIcon;
  },
};
</script>
<style scoped>
.amsterdam-parent {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-content: center;
  color: #c1c1c1;
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
  justify-content: center;
  align-items: flex-start;
  border-radius: 0 10px 10px 0;
}

.justfied-part {
  width: 95%;
  height: 45%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-top: 1px solid #c1c1c1;
}
.justfied-rows {
  width: 100%;
  height: 30%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.justfied-rows span {
  margin-left: 2.5%;
  font-size: 45%;
  font-weight: 700;
  text-transform: uppercase;
}
.finilized-part,
.proposed-part {
  width: 95%;
  height: 25%;

  border-radius: 0 0 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding-top: 1%;
}
.proposed-part {
  margin-bottom: 1%;
}
.finilized-part {
  border-top: 1px solid #c1c1c1;
}
.finilized-row-title,
.proposed-rows-title {
  width: 95%;
  height: 40%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 50%;
  font-weight: 700;
  text-transform: uppercase;
  margin: 1% 0;
}
.finilized-row,
.proposed-rows {
  width: 100%;
  height: 60%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  font-size: 60%;
  font-weight: 600;
  text-transform: uppercase;
  margin-top: 1.5%;
}
.finilized-square {
  width: 3%;
  height: 90%;
  margin: 0 0.5%;
  background: blue;
}
.proposed-square {
  width: 3%;
  height: 90%;
  margin: 0 0.5%;
  background: blue;
}
.square {
  width: 23%;
  height: 40%;
  margin: 0 0.5%;
  background: #c1c1c1;
}
</style>
