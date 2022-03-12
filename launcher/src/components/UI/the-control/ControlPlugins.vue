<template>
  <div class="plugins-parent">
    <div class="shape"></div>
    <div class="plugins-title">
      <span>PLUG-INs</span>
    </div>
    <div class="plugins-table-bg">
      <div class="arrow-up"></div>
      <div class="plugins-table">
        <div class="plugins-row"></div>
      </div>
      <div class="arrow-down"></div>
    </div>
  </div>
</template>
<style scoped>
.plugins-parent {
  width: 95%;
  height: 98%;
  background-color: #2b4035;
  border-radius: 0 55px 55px 55px;
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
  border-radius: 55px;
}
</style>
