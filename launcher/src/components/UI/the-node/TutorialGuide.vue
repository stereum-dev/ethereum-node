<template>
  <div class="bg-dark">
    <div v-if="rpcOne" :key="rpcOne" class="wrapper">
      <div class="header-node" @click.prevent="rpcStepOne">
        <div class="title">{{ $t("pagesnav.control") }}</div>
      </div>
      <img src="../../../../public/img/icon/arrows/curved-arrow.png" class="header-arrow" />
      <div class="step-one"><span>Lorem ipsum dolor, sit amet consectetur adipisicing.</span></div>
    </div>
    <div v-if="rpcTwo" class="wrapper">
      <div class="secondContainer"><RpcEndpoint class="big" /></div>
    </div>
  </div>
</template>

<script>
import { mapWritableState } from "pinia";
import { useNodeHeader } from "../../../store/nodeHeader";
import RpcEndpoint from "../the-control/RpcEndpoint.vue";
export default {
  components: { RpcEndpoint },
  data() {
    return {};
  },
  computed: {
    ...mapWritableState(useNodeHeader, {
      tutorial: "tutorial",
      rpcOne: "rpcOne",
      rpcTwo: "rpcTwo",
    }),
  },
  methods: {
    rpcStepOne() {
      this.rpcOne = false;
      console.log(this.rpcOne);
      setTimeout(() => {
        this.$router.push("/control");
      }, 10);
      this.rpcTwo = true;
    },
  },
};
</script>

<style scoped>
.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
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
.header-arrow {
  filter: invert(1);
  transform: rotate(180deg);
  width: 20%;
  position: absolute;
  left: 25%;
  top: 7%;
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
.step-one {
  color: #eee;
  display: flex;
  width: 80%;
  height: 20%;
  font-size: 140%;
  justify-content: center;
  align-items: center;
  font-weight: 600;
}
.secondContainer {
  width: 20%;
  height: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: blue;
}
.big {
  width: 100%;
  height: 100%;
}
</style>
