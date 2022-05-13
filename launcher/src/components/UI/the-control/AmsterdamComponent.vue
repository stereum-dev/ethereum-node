<template>
  <div class="amsterdamParent">
    <div class="amsTitle">
      <div class="amsTitle_name"><span>NODE STARTED</span></div>
      <div class="amsTitle_R">
        <div class="amsTitle_timer">{{ dateTime }}</div>
        <div class="amsTitle_runingIco">
          <img src="../../../../public/img/icon/control/amsterdam.png" />
        </div>
      </div>
    </div>
    <div class="amsBox">
      <div class="syncAndIco">
        <div class="syncIco">
          <div class="syncIco_img">
            <img
              src="../../../../public/img/icon/control/testnetIconControl.png"
            />
          </div>
          <div class="syncNetTitle"><span>NETWORK</span></div>
        </div>
        <div class="syncBox">
          <div class="syncBoxTitle"><span>SYNCHRONISATION</span></div>
          <div class="syncItems">
            <div class="procItems"><span>Execution Client</span></div>
            <div class="procItems"><span>Consensus Client</span></div>
          </div>
        </div>
      </div>
      <div class="epochBox">
        <div class="epochBox_title"><span>EPOCH</span></div>
        <div class="epochBox_input">
          <span>#{{ epochValue }}</span>
        </div>
        <div class="epochBox_footer"><span>CONFIRMED</span></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dateTime: "00:00",
      epochValue: "123455",
    };
  },
};
</script>
<style scoped>
.amsterdamParent {
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
}
.amsTitle {
  width: 98%;
  height: 20%;
  background: #33393e;
  border-radius: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
}
.amsTitle_name {
  font-size: 50%;
  color: #eee;
  border: 1px solid rgb(27, 26, 26);
  width: 30%;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.amsTitle_R {
  width: 70%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.amsTitle_timer {
  width: 60%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 60%;
  padding-right: 5%;
}
.amsTitle_runingIco {
  width: 40%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid rgb(27, 26, 26);
  border-radius: 10px;
}
.amsTitle_runingIco img {
  width: 30%;
}
.amsBox {
  display: flex;
  width: 100%;
  height: 80%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.syncAndIco {
  display: flex;
  width: 100%;
  height: 60%;
  justify-content: flex-start;
  align-items: center;
}
.syncIco {
  width: 30%;
  height: 80%;
  justify-content: center;
  align-content: center;
  display: flex;
  flex-direction: column;
}
.syncIco_img {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
}
.syncIco_img img {
  width: 40%;
}
.syncNetTitle {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40%;
}
.syncNetTitle span {
  width: 70%;
  background: #33393e;
  border-radius: 10px;
}
.syncBox {
  width: 100%;
  display: flex;
  background: #33393e;
  height: 60%;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.syncBoxTitle {
  display: flex;
  width: 98%;
  height: 30%;
  font-size: 50%;
  justify-content: center;
  align-items: center;
  background: #464a44;
  border-radius: 5px;
}
.syncItems {
  display: flex;
  width: 100%;
  height: 90%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 50%;
  flex-direction: column;
  gap: 5%;
}
.procItems {
  height: 40%;
  width: 90%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: #2f3031;
  font-size: 100%;
  padding-left: 5%;
  border-radius: 10px;
}
.epochBox {
  width: 99%;
  height: 40%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #33393e;
  border-radius: 5px;
}
.epochBox_title {
  width: 90%;
  height: 15%;
  display: flex;
  justify-content: flex-start;
  font-size: 20%;
  align-items: center;
}
.epochBox_input {
  width: 90%;
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 60%;
}
.epochBox_input span {
  width: 100%;
  height: 60%;
  background: #000;
  color: #eee;
  border: 0.5px solid #eee;
  display: flex;
  justify-content: flex-end;
  padding-right: 5%;
  align-items: center;
}
.epochBox_footer {
  width: 90%;
  height: 15%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 25%;
}
</style>
