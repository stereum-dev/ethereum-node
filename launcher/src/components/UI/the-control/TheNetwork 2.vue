<template>
  <div class="networkParent">
    <div class="networkTtl"><span>NETWORK</span></div>
    <div class="networkBox">
      <div class="networkIco">
        <img src="../../../../public/img/icon/Control/wifiIcon.svg" />
      </div>
      <div class="totalReceived">
        <div class="receivePerSecond">
          <span>{{ receiveValue }}</span>
        </div>
        <div class="mbit"><span>mbit</span></div>
        <div class="receiveTitle">Total Received</div>
        <div class="totalReceiveValue">
          <div class="arrow">
            <img src="../../../../public/img/icon/arrows/arrowOrange.png" />
          </div>
          <div class="totalReceiveValue_data">
            <span>{{ totalReceive }} GB</span>
          </div>
        </div>
      </div>
      <div class="totalTransmitted">
        <div class="transPerSecond">
          <span>{{ transmitValue }}</span>
        </div>
        <div class="mbit"><span>mbit</span></div>
        <div class="transmitTitle">Total Transmiied</div>
        <div class="totalTransmitValue">
          <div class="arrow">
            <img src="../../../../public/img/icon/arrows/arrowGreen.png" />
          </div>
          <div class="totalTransmitValue_data">
            <span>{{ totalTransmit }} GB</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      receiveValue: 1.12,
      transmitValue: 1.12,
      totalReceive: 44.1,
      totalTransmit: 44.1,
    };
  },
};
</script>

<style scoped>
.networkParent {
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
}
.networkTtl {
  width: 98%;
  height: 20%;
  background: #33393e;
  border-radius: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
}
.networkTtl span {
  font-size: 50%;
  color: #eee;
  border: 1px solid rgb(27, 26, 26);
  width: 20%;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.networkBox {
  width: 100%;
  height: 79%;
  display: flex;
  box-sizing: border-box;
}
.networkIco {
  box-sizing: border-box;
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.networkIco img {
  width: 70%;
}
.totalReceived,
.totalTransmitted {
  width: 35%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 99%;
}
.receivePerSecond {
  width: 100%;
  height: 30%;
  font-size: 90%;
  font-weight: bold;
  color: #ec590a;
}
.mbit {
  width: 100%;
  height: 25%;
  font-weight: bold;
  font-size: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.receiveTitle,
.transmitTitle {
  width: 100%;
  height: 10%;
  font-size: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.totalReceiveValue,
.totalTransmitValue {
  width: 100%;
  height: 35%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.arrow {
  width: 20%;
  height: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
  box-sizing: border-box;
}
.arrow img {
  width: 80%;
}
.totalReceiveValue_data,
.totalTransmitValue_data {
  width: 80%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 70%;
  font-weight: bold;
}
.transPerSecond {
  width: 100%;
  height: 30%;
  font-size: 90%;
  font-weight: bold;
  color: #336666;
}
</style>
