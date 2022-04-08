<template>
  <div class="selection-box">
    <div class="selection-table">
      <div class="selection-row">
        <div class="row-content">
          <img
            src="../../../../public/img/icon/the-staking/option-graffiti.png"
            alt="icon"
          />
          <span>GRAFITI</span>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.selection-box {
  grid-column: 10/13;
  grid-row: 3;
  width: 90%;
  height: 90%;
  border: 4px solid #bfbfbf;
  border-radius: 15px;
  background-color: #464a44;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}
.selection-table {
  width: 95%;
  height: 90%;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.selection-row {
  width: 99%;
  height: 18%;
  border-radius: 20px;
  background-color: rgb(244, 244, 244);
  box-shadow: 1px 1px 5px 2px rgb(43, 43, 43);
  margin-top: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.row-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 90%;
  align-items: center;
}
.selection-row img {
  grid-column: 1;
  width: 25px;
  height: 25px;
}
.selection-row span {
  grid-column: 2;
  font-size: 14px;
  font-weight: 800;
  color: rgb(57, 57, 57);
}
</style>
