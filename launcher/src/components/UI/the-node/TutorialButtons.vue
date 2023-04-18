<template>
  <div class="button-parent">
    <div class="button-info" @click="arrow = !arrow">
      <div class="icon">
        <img src="../../../../public/img/icon/click-installation/gnosis_mainnet_icon.png" alt="" />
      </div>
      <div class="title"><span>test tst tst tst</span></div>
      <div v-if="!arrow" class="up-arrow"></div>
      <div v-else class="down-arrow"></div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      arrow: false,
    };
  },
};
</script>
<style scoped>
.button-parent {
  width: 95%;
  height: 8%;
  display: flex;
  color: #eee;
  border: 2px solid #eee;
  border-radius: 5px;
}
.button-info {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
  font-size: 70%;
  font-weight: 600;
}
.icon {
  width: 20%;
  height: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
}
.icon img {
  width: 90%;
}
.up-arrow {
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 7px solid #eee;
  margin-right: 1%;
}
.down-arrow {
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 7px solid #eee;
  margin-right: 1%;
}
</style>
