<template>
  <div class="plugins-parent">
    <div class="shape"></div>
    <div class="plugins-title">
      <span>PLUG-INs</span>
    </div>
    <div class="plugins-table-bg">
      <div class="arrow-up">
        <img
          src="../../../../public/Img/icon/manage-node-icons/up-arrow.png"
          alt="icon"
        />
      </div>
      <div class="plugins-table">
        <div class="plugins-row"></div>
      </div>
      <div class="arrow-down">
        <img
          src="../../../../public/Img/icon/manage-node-icons/down-arrow.png"
          alt="icon"
        />
      </div>
    </div>
  </div>
</template>
<style scoped>
.plugins-parent {
  width: 90%;
  height: 98%;
  background-color: #2b4035;
  border-radius: 0 45px 45px 45px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.shape {
  width: 80px;
  height: 43px;
  background-color: black;
  position: absolute;
  top: 0;
  left: 0;
  border-top-right-radius: 1% 0;
  border-bottom-right-radius: 107% 155%;
  border-bottom-left-radius: 74% 66%;
}
.plugins-title {
  width: 40%;
  height: 22px;
  background-color: #29322d;
  padding: 2px;
  border: 1px solid #71a489;
  border-radius: 10px;
}
.plugins-title span {
  color: rgb(223, 223, 223);
  font-size: 16px;
  font-weight: 900;
}
.plugins-table-bg {
  width: 90%;
  height: 85%;
  background-color: #527162;
  border-radius:35px 35px 45px 45px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.arrow-up img,
.arrow-down img {
  width: 100%;
  height: 25px;
  border-radius: 15px;
  box-shadow:0 1px 3px 1px #3b4a43;
}
.plugins-table {
  width: 97%;
  height: 87%;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.plugins-row {
  width: 94%;
  height: 17%;
  border: 5px solid #71a489;
  border-radius: 15px;
  background-color: #2b4035;
}
</style>
