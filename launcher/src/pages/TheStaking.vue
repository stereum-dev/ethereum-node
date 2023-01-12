<template>
  <div class="thestaking-parent">
    <div class="header">
      <node-header></node-header>
    </div>
    <StakingGrid />
  </div>
</template>
<script>
import StakingGrid from "../components/UI/the-staking/StakingGrid.vue";
import ControlService from "@/store/ControlService";
import { mapWritableState } from "pinia";
import { useStakingStore } from "@/store/theStaking";
import { thisTypeAnnotation } from '@babel/types';

export default {
  components: {
    StakingGrid,
  },
  computed:{
    ...mapWritableState(useStakingStore, {
      validatorBalances:'validatorBalances'
    }),
  },
  created(){
    this.validatorState();
  },
  methods:{
    async validatorState(){
      const data = await ControlService.getValidatorState();
      this.validatorBalances=data;
    },
  }
};
</script>
<style scoped>
.header {
  height: 50px;
  position: fixed;
  top: 0;
  z-index: 10;
}
.thestaking-parent {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}
</style>
