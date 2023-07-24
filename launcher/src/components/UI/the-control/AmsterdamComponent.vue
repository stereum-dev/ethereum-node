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
      <div class="justfied-part">
        <div class="justfied-rows">
          <span>justified</span>
        </div>
        <div class="justfied-rows"><div v-for="n in 32" :key="n" class="square"></div></div>
        <div class="justfied-rows"><div v-for="n in 32" :key="n" class="square"></div></div>
      </div>
      <div class="finilized-part"></div>
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
    // Call the addObject() function every sec
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
  background-color: #1e1;
}
.justfied-part {
  width: 100%;
  height: 56%;
  background-color: rgb(238, 17, 172);
  border-radius: 0 10px 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.justfied-rows {
  width: 95%;
  height: 30%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 80%;
  font-weight: 600;
  text-transform: uppercase;
}
.finilized-part {
  width: 100%;
  height: 44%;
  background-color: rgb(238, 179, 17);
  border-radius: 0 0 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.square {
  width: 2.5%;
  height: 60%;
  margin: 0 0.5%;
  background: #c1c1c1;
}
</style>
