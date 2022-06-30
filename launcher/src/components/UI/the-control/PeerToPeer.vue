<template>
  <div class="peer2peerParent">
    <div class="p2pTtl">PEER CONNECTION</div>
    <div class="p2pBox">
      <div class="p2pIco">
        <img src="../../../../public/img/icon/control/PeerToPeerIcon.svg" />
      </div>
      <div class="circBarCont">
        <div class="circleProc">
          <div class="circProc_value" :style="verticalBar">
            <span class="circCounter">{{ valPeer }}</span>
          </div>
        </div>
      </div>
      <div class="p2pBarCont">
        <div class="p2pVal">
          <div class="p2pVal_value" :style="verticalBar"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      valPeer: 80,
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
.circBarCont {
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.circCounter {
  font-weight: bold;
  font-size: large;
}
.circleProc {
  width: 72%;
  background: #33393e;
  height: 90%;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  border: 2px solid #707070;
  overflow: hidden;
}
.circProc_value {
  width: 100%;
  background: #336666;
  display: flex;
  justify-content: center;
  align-content: center;
}
.p2pBarCont {
  width: 40%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.p2pVal {
  width: 70%;
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
</style>
