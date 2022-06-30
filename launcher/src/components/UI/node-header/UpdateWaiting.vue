<template>
  <div class="remove-modal-parent">
    <div class="modal-opacity"></div>
    <div class="remove-modal-content">
      <div class="title-box">
        <img src="../../../../public/img/icon/header-icons/update.gif" alt="" />
      </div>
      <div class="update-message">
        <span>Updating . . .</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style scoped>
.remove-modal-parent {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 10%;
  left: 5%;
  z-index: 310;
}
.modal-opacity {
  width: 100%;
  height: 100%;
  background-color: black;
  position: fixed;
  left: 0;
  top: 0;
  opacity: 0.7;
  z-index: 311;
}
.remove-modal-content {
  width: 50%;
  height: 40%;
  border-radius: 1rem;
  background-color: #324844;
  border: 4px solid rgb(171, 170, 170);
  z-index: 312;
  opacity: 1;
  position: fixed;
  top: 30%;
  left: 25%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: 1px 1px 5px 1px rgb(6, 6, 6);
}
.title-box {
  width: 100%;
  height: 100px;
  margin-top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.title-box img {
  width: 150px;
  height: 100px;
}
.update-message {
  width: 90%;
  height: 40%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.update-message span:first-child {
  color: rgb(124, 162, 197);
  font-size: 0.9rem;
  font-weight: 700;
}
</style>
