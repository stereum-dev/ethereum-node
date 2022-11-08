<template>
  <div class="portlist_parent">
    <comming-soon></comming-soon>
    <div class="portlist_box">
      <div class="portlist_icon">
        <div class="portlist_icon_contaniner">
          <img
            src="../../../../public/img/icon/control/PORT_LIST_ICON.png"
            alt="portlist"
          />
        </div>
        <span>PORT LIST</span>
      </div>
      <div class="portlist-data_box"></div>
    </div>
  </div>
</template>
<style scoped>
.portlist_parent {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
  position: relative;
}
.portlist_box {
  width: 100%;
  height: 100%;
  display: flex;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
}
.portlist_icon {
  box-sizing: border-box;
  width: 35%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.portlist_icon span {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50%;
  font-weight: bold;
  color: #c1c1c1;
}
.portlist_icon_contaniner {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 75%;
}
.portlist_icon_contaniner img {
  width: 72%;
  height: 90%;
}
.portlist-data_box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 70%;
  height: 100%;
  flex-direction: column;
  overflow-y: auto;
}
</style>
