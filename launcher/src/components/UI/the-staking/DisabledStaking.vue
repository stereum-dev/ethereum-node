<template>
  <div class="disabled-parent">
    <div class="modal-opacity"></div>
    <div class="disabledModalContent">
      <div class="title-box">
        <img
          src="../../../../public/img/icon/the-staking/stereum-error.png"
          alt="icon"
        />
      </div>
      <div class="disabledMessage">
        <span>There is no validator client installed!</span>
        <p>
          Install at least one validator client to activate importing validator
          keys.
        </p>
      </div>
    </div>
  </div>
</template>
<script>
export default {};
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
  width: 55%;
  height: 60%;
  border-radius: 75px;
  border: 3px solid #bfbfbf;
  position: absolute;
  top: 8%;
  left: 22%;
  background-color: #b40e0e;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: 1px 1px 5px 1px rgb(6, 6, 6);
  z-index: 1000;
}
.title-box {
  width: 100%;
  height: 35%;
  margin-top: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.title-box img {
  width: 25%;
  height: 100%;
}
.disabledMessage {
  width: 95%;
  height: 65%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.disabledMessage p {
  width: 80%;
  margin-top: 5%;
  color: rgb(197, 197, 197);
  font-size: 1rem;
  font-weight: 600;
  word-break: break-all;
  text-align: left;
}
.disabledMessage span {
  color: rgb(213, 213, 213);
  font-size: 1.2rem;
  font-weight: 700;
  margin-top: 5px;
  text-align: center;
  text-transform: uppercase;
}

</style>
