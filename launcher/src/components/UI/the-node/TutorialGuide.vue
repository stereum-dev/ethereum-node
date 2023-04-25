<template>
  <div class="bg-dark" @click="tutorial = false">
    <router-link to="/control" class="header-node"
      ><div class="title">{{ $t("pagesnav.control") }}</div></router-link
    >
    <img src="../../../../public/img/icon/arrows/curved-arrow.png" class="header-arrow" />
    <div class="step-one"><span>Lorem ipsum dolor, sit amet consectetur adipisicing.</span></div>
  </div>
</template>

<script>
import { mapWritableState } from "pinia";
import { useNodeHeader } from "../../../store/nodeHeader";
export default {
  computed: {
    ...mapWritableState(useNodeHeader, {
      tutorial: "tutorial",
    }),
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
.header-node {
  width: 11%;
  height: 7%;

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
  cursor: pointer;
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
</style>
