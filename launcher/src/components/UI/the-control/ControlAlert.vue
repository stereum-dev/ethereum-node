<template>
  <div class="alert-box">
    <div class="alert-icons">
      <div class="warning">
        <div class="yellow-warning">
          <img
            src="../../../../public/Img/icon//node-journal-icons/yellow-warning1.png"
            alt="icon"
          />
        </div>
        <div class="red-warning">
          <img
            src="../../../../public/Img/icon//node-journal-icons/red-warning.png"
            alt="icon"
          />
        </div>
      </div>
      <span>ALERTS</span>
    </div>
    <div class="alert-table">
      <div class="table-row-yellow">
        <div class="warning-icon">
          <img
            src="../../../../public/Img/icon//node-journal-icons/yellow-warning1.png"
            alt="icon"
          />
        </div>
        <div class="warning-content">
          <span class="alert-text">SYSTEM LOAD</span>
          <span class="alert-title">WARNING</span>
        </div>
      </div>
      <div class="table-row-red">
        <div class="warning-icon">
          <img
            src="../../../../public/Img/icon//node-journal-icons/red-warning.png"
            alt="icon"
          />
        </div>
        <div class="warning-content">
          <span class="alert-text">HEAVY SYSTEM LOAD</span>
          <span class="alert-title">WARNING</span>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.alert-box {
  width: 88%;
  height: 94%;
  border: 5px solid rgb(55, 55, 55);
  border-radius: 20px;
  background-color: #464a44;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.alert-icons {
  width: 65%;
  height: 18%;
  background-color: #586860;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 10px;
  border: 2px solid #747474;
  box-shadow: 0 1px 3px 1px #393939;
}
.warning {
  width: 85%;
  height: 80%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.alert-icons .yellow-warning {
  width: 30px;
  height: 30px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 1px 3px 1px #393939, inset 0 1px 3px 1px #6d766f;
}
.alert-icons .yellow-warning img {
  width: 25px;
  height: 25px;
}
.alert-icons .red-warning {
  width: 30px;
  height: 30px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 1px 3px 1px #393939, inset 0 1px 3px 1px #6d766f;
}
.alert-icons .red-warning img {
  width: 25px;
  height: 25px;
}
.alert-icons span {
  width: 75%;
  border: 1px solid #434343;
  background-color: #47594a;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 800;
  color: #fff;
  box-shadow: 0 1px 3px 1px #4d4d4d,inset 0 1px 3px 1px #6d766f;
}
.alert-table {
  width: 93%;
  height: 70%;
  background-color: #353535;
  border-radius: 10px 10px 25px 25px;
  overflow-x: hidden;
  overflow-y: auto;
  margin-top: 10px;
}
.table-row-yellow {
  width: 95%;
  height: 13%;
  background-color: #aea038;
  margin: 5px auto;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  border: 1px solid #515151;
  border-radius: 5px;
  box-shadow: 0 1px 3px 1px #151515;
}
.table-row-yellow .warning-icon {
  width: 20%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.table-row-yellow .warning-icon img {
  width: 20px;
  height: 20px;
}
.table-row-yellow .warning-content {
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.table-row-red {
  width: 95%;
  height: 13%;
  background-color: #ea564e;
  margin: 5px auto;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  border: 1px solid #515151;
  border-radius: 5px;
  box-shadow: 0 1px 3px 1px #151515;
}
.table-row-red .warning-icon {
  width: 20%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.table-row-red .warning-icon img {
  width: 22px;
  height: 22px;
}
.table-row-red .warning-content {
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}

.alert-text {
  font-size: 9px;
  font-weight: 900;
  color: rgb(255, 251, 251);
}
.alert-title {
  font-size: 8px;
  font-weight: 800;
}
</style>
