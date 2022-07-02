<template>
  <div class="peer2peerParent">
    <div class="p2pTtl">PEER CONNECTION</div>
    <div class="p2pBox">
      <div class="p2pIco">
        <img src="../../../../public/img/icon/control/PeerToPeerIcon.svg" />
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
  width: 98%;
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
  height: 79%;
  display: flex;
  box-sizing: border-box;
}
.p2pIco {
  box-sizing: border-box;
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.p2pIco img {
  width: 70%;
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
  height: 90%;
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
  top: 52%;
  left: 52%;
  font-size: 1.5rem;
  font-weight: bold;
  text-shadow: -2px 2px 0 #000;
}
</style>
