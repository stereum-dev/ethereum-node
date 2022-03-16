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
          alt=""
        />
      </div>
      <div class="plugins-table">
        <div class="plugins-row">
          <div class="plugins-status-color"></div>
          <div class="plugins-row-content">
            <div class="row-xyz">
              <span>XYZ</span>
            </div>
            <div class="row-category">
              <span>Consensus Client</span>
            </div>
          </div>
        </div>
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
  border-radius: 35px 35px 45px 45px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.arrow-down,
.arrow-up {
  width: 50%;
  height: 25px;
  margin: 5px;
  border: 1px solid #464f4b;
  border-radius: 15px;
  box-shadow: 0 1px 3px 1px #3b4a43;
}
.arrow-up img {
  width: 100%;
  height: 100%;
}
.arrow-down img {
  width: 100%;
  height: 100%;
}
.arrow-down:hover,
.arrow-up:hover {
  border: 1px solid rgb(100, 109, 100);
}
.arrow-down:active,
.arrow-up:active {
  border: 1px solid rgb(85, 94, 85);
  box-shadow: none;
}
.plugins-table {
  width: 97%;
  height: 87%;
  overflow-x: hidden;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(6, 1fr);
}
.plugins-table::-webkit-scrollbar {
  width: 0;
}
.plugins-row {
  width: 94%;
  height: 40px;
  justify-self: center;
  margin-top: 5px;
  background-color: #33393e;
  display: flex;
  justify-content: flex-start;
}
.plugins-status-color {
  width: 20%;
  height: 100%;
  background-color: #22b53f;
}
.plugins-row-content {
  width: 75%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-evenly;
  align-items: center;
  margin-left: 5px;
}
.row-xyz,
.row-category {
  width: 90%;
  height: 40%;
  color: #333;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
}

.row-xyz span,
.row-category span {
  font-size: 0.7rem;
  font-weight: 700;
}
</style>
