<template>
  <div class="bg-dark">
    <div v-if="stakeFirstStep" :key="stakeFirstStep" class="wrapper">
      <div class="header-node" @click.prevent="stakeGuideStep1">
        <div class="title">{{ $t("pagesnav.control") }}</div>
      </div>
      <img src="../../../../public/img/icon/arrows/curved-arrow.png" class="header-arrow" />
      <div class="step-one">
        <span>{{ $t("rpcGuide.clickNav") }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapWritableState } from "pinia";
import { useNodeHeader } from "../../../store/nodeHeader";
export default {
  data() {
    return {
      secondStep: false,
    };
  },
  computed: {
    ...mapWritableState(useNodeHeader, {
      stakeFirstStep: "stakeFirstStep",
      stakeGuide: "stakeGuide",
    }),
  },
  methods: {
    stakeGuideStep1() {
      this.stakeFirstStep = false;
      setTimeout(() => {
        this.$router.push("/control");
      }, 10);
      this.secondStep = true;
    },
  },
};
</script>
<style scoped>
.bg-dark {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 311;
}
.wrapper {
  width: 100%;
  height: 85%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.header-node {
  width: 11%;
  height: 7%;
  cursor: pointer;
  position: absolute;
  left: 16%;
  top: 1%;
  opacity: 1;
  color: #eee;
  text-transform: uppercase;
  font-weight: 800;
  z-index: 312;
}
.title {
  width: 100%;
  height: 100%;
  background: #264744;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.header-arrow {
  filter: invert(1);
  transform: rotate(180deg);
  width: 20%;
  position: absolute;
  left: 25%;
  top: 7%;
}
.step-one {
  color: #eee;
  display: flex;
  width: 80%;
  height: 20%;
  font-size: 140%;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  position: absolute;
  top: 45%;
}
</style>
