<template>
  <div class="disabled-parent">
    <div class="modal-opacity"></div>
    <div class="disabledModalContent">
      <div class="title-box">
        <img src="../../../../public/img/icon/the-staking/Fehlender_validatorenclient.svg" alt="icon" />
      </div>
      <div class="disabledMessage">
        <span>REQUIRES RUNNING VALIDATOR CLIENT ON SERVER TO ACCESS STAKING</span>
      </div>
      <div class="validator-icons">
        <div v-for="icon in validatorIcons" :key="icon" class="validator-icons_icon"><img :src="icon" alt="" /></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      validatorIcons: [
        "/img/icon/plugin-icons/validator/Lighthouse-Validator-Circle.png",
        "/img/icon/plugin-icons/validator/Lodestar-Validator-Circle.png",
        "/img/icon/plugin-icons/validator/Nimbus-Validator-Circle.png",
        "/img/icon/plugin-icons/validator/Prysm-Validator-Circle.png",
        "/img/icon/plugin-icons/validator/Teku-Validator-Circle.png",
        "/img/icon/plugin-icons/validator/Web3Signer-Circle.png",
      ],
    };
  },
};
</script>
<style scoped>
.disabled-parent {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 10%;
  left: 0;
  z-index: 9;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-opacity {
  width: 100%;
  height: 91%;
  background-color: black;
  border-radius: 0 20px 0 0;
  position: fixed;
  left: 0;
  bottom: 0;
  opacity: 0.4;
  z-index: 11;
}
.disabledModalContent {
  width: 98%;
  height: 82%;
  border-radius: 20px;
  border: 3px solid #bfbfbf;
  position: absolute;
  top: 2%;
  left: 1%;
  background-color: #343434;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: 1px 1px 5px 1px rgb(6, 6, 6);
  z-index: 1000;
}
.title-box {
  width: 100%;
  height: 45%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.title-box img {
  width: 70%;
  height: 100%;
}
.disabledMessage {
  width: 95%;
  height: 15%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.disabledMessage span {
  color: #04f4f4;
  font-size: 200%;
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
}
.validator-icons {
  width: 70%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.validator-icons_icon {
  width: 14%;
  height: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
}
.validator-icons_icon img {
  height: 80%;
}
</style>
