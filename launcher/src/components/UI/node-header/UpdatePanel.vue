<template>
  <div class="panelParent">
    <div class="panelContent">
      <div class="stereumUpdates">
        <div class="stereumUpdates-title">
          <span class="title">Stereum updates</span>
          <span class="description"
            >After downloading and installing the update Stereum will be
            restarted</span
          >
        </div>
        <div class="stereum-updateBox">
          <div class="versionBox">
            <span>current version: ALPHA </span>
            <span>latest version: 2.0</span>
            <span>auto-update: ON</span>
          </div>
          <div class="btnBox">
            <div class="searchBtn">
              <img src="/img/icon/header-icons/search.png" alt="icon" />
            </div>
            <div class="downloadBtn" @click.self="$emit('updateConfirm')">
              <img
                src="/img/icon/node-journal-icons/download2.png"
                alt="icon"
              />
            </div>

            <div class="available">
              <div class="updateIcon">
                <img src="/img/icon/header-icons/update-green.png" alt="icon" />
              </div>
              <span class="availableText">Update "2.0" available</span>
            </div>
          </div>
        </div>
      </div>
      <div class="serviceUpdates">
        <div class="serviceUpdates-title">
          <span class="title">Service updates</span>
          <span class="description"
            >After an Service update the service in question will be
            restarted</span
          >
        </div>
        <div class="service-updateBox">
          <div class="availableTable">
            <div class="tableHeader">
              <div class="tableUpdateIcon">
                <img src="/img/icon/header-icons/update-green.png" alt="icon" />
              </div>
              <span>AVAILABLE PLUG-IN UPDATES</span>
            </div>
            <div class="tableContent"></div>
            <div class="btnBox"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style scoped>
.panelParent {
  width: 36%;
  height: 91%;
  position: fixed;
  top: 10%;
  right: -37%;
  z-index: 310;
  transition-duration: 300ms;
}
.panelOpacity {
  width: 100%;
  height: 91%;
  position: fixed;
  left: 0;
  top: 52px;
  border-radius: 0 35px 0 0;
  z-index: 311;
}
.panelContent {
  width: 100%;
  height: 100%;
  border-radius: 1rem 0 0 1rem;
  background-color: #343434;
  border: 2px solid rgb(107, 107, 107);
  border-right: none;
  z-index: 312;
  opacity: 1;
  position: absolute;
  top: -6px;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.stereumUpdates {
  width: 100%;
  height: 30%;
}
.serviceUpdates {
  width: 100%;
  height: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.stereumUpdates-title,
.serviceUpdates-title {
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
.stereumUpdates-title .title,
.serviceUpdates-title .title {
  font-size: 1.2rem;
  font-weight: 800;
  color: #c6c6c6;
  margin-left: 15px;
  text-transform: uppercase;
}
.description,
.description {
  font-size: 0.6rem;
  font-weight: 400;
  color: #9f9f9f;
  margin-left: 15px;
}
.stereum-updateBox {
  width: 100%;
  height: 65%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.stereum-updateBox .versionBox {
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
.stereum-updateBox .versionBox span {
  width: 100%;
  height: 25%;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #c6c6c6;
  margin-left: 15px;
}
.stereum-updateBox .btnBox {
  width: 50%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(6, 1fr);
}
.btnBox .searchBtn {
  grid-column: 1/4;
  grid-row: 2/4;
  border-radius: 3px;
  margin-left: 20px;
  box-shadow: 0 1px 3px 1px rgb(42, 42, 42);
  width: 70%;
  height: 80%;
  border: 1px solid #17a2b8;
  background-color: #17a2b8;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.btnBox .searchBtn img {
  width: 30%;
  height: 70%;
}
.btnBox .searchBtn:hover {
  background-color: #028397;
}
.btnBox .searchBtn:active {
  border: none;
  box-shadow: none;
  transform: scale(0.95);
}
.btnBox .downloadBtn {
  grid-column: 4/7;
  grid-row: 2/4;
  margin-right: 20px;
  border: 1px solid #067c5a;
  border-radius: 3px;
  width: 70%;
  height: 80%;
  background-color: #067c5a;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.btnBox .downloadBtn img {
  width: 40%;
  height: 90%;
}
.btnBox .downloadBtn:hover {
  background-color: rgb(3, 82, 60);
}
.btnBox .downloadBtn:active {
  border: none;
  box-shadow: none;
  transform: scale(0.95);
}
.btnBox .available {
  grid-column: 1/7;
  grid-row: 4/5;
  margin: 0 auto;
  width: 90%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: 1fr;
}
.btnBox .available .updateIcon {
  grid-column: 1/2;
  grid-row: 1;
  width: 67%;
  height: 100%;
  margin: 0 auto 0 12px;
  background-color: rgb(59, 103, 100);
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
}
.btnBox .available .updateIcon img {
  width: 66%;
}
.btnBox .available .availableText {
  grid-column: 2/7;
  grid-row: 1;
  margin: 0 auto 0 8px;
  font-size: 0.6rem;
  font-weight: 600;
  color: #c6c6c6;
  align-self: center;
  text-align: left;
}
.service-updateBox {
  width: 100%;
  height: 75%;
  display: flex;
  justify-content: center;
  align-self: center;
  padding: 5px;
}
.service-updateBox .availableTable {
  width: 100%;
  height: 100%;
  background-color: #334d4d;
  border: 3px solid #434343;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-self: center;
}
.service-updateBox .availableTable .tableHeader {
  width: 100%;
  height: 10%;
  background-color: #335959;
  border-bottom: 3px solid #434343;
  border-radius: 3px;
  padding: 2px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: 1fr;
}
.tableHeader .tableUpdateIcon {
  grid-column: 2/3;
  grid-row: 1;
  width:27%;
  height:100%;
  background-color: #2a4940;
  border-radius: 100%;
  margin-right: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  justify-self: flex-end;
}
.tableHeader .tableUpdateIcon img {
  width: 10px;
  height: 10px;
}
.tableHeader span {
  grid-column: 3/6;
  grid-row: 1;
  width: 100%;
  font-size: 0.6rem;
  font-weight: 600;
  color: #c6c6c6;
  text-transform: uppercase;
  align-self: center;
}
</style>
