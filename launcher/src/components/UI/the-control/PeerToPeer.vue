<template>
  <div class="peer2peerParent">
    <div class="p2pBox">
      <div class="p2pIco">
        <div class="p2pIco-container">
          <img src="../../../../public/img/icon/control/PeerToPeerIcon.svg" />
        </div>
        <span>P2P</span>
      </div>
      <div class="p2pBarCont">
        <div class="p2pVal">
          <div class="p2pVal_value" :style="verticalBar"></div>
        </div>
      </div>
    </div>
    <div class="vlaueType">
      <span>{{ valPeer }}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // data is dummy, for wiring it has to change to null
      valPeer: 64,
    };
  },
  computed: {
    verticalBar() {
      return { height: this.valPeer + "%" };
    },
  },
};
</script>
<style scoped>
.peer2peerParent {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  box-sizing: border-box;
}
.p2pTtl {
  width: 100%;
  height: 20%;
  background: #33393e;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50%;
}

.p2pBox {
  width: 100%;
  height: 100%;
  display: flex;
  box-sizing: border-box;
}
.p2pIco {
  box-sizing: border-box;
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.p2pIco span {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 60%;
  font-weight: bold;
  color: #c1c1c1;
}
.p2pIco-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80%;
}
.p2pIco-container img {
  width: 65%;
}

.p2pBarCont {
  width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.p2pVal {
  width: 80%;
  height: 80%;
  background: #33393e;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  overflow: hidden;
}
.p2pVal_value {
  background: #568d50;
  width: 98%;
}
.vlaueType {
  position: absolute;
  top: 68%;
  left: 52%;
  font-size: 1.5rem;
  font-weight: bold;
  text-shadow: 2px 2px 0 rgb(37, 75, 54);
  color: #c1c1c1;
}
</style>
