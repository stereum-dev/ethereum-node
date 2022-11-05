<template>
  <div class="peer2peerParent">
    <div class="p2pBox">
      <div class="p2pIco">
        <div class="p2pIco-container">
          <img src="../../../../public/img/icon/control/PeerToPeerIcon.svg" />
        </div>
        <span>P2P</span>
      </div>
      <div class="p2pBarBox">
        <div class="p2pBarCont">
          <div class="p2pVal">
            <div class="p2pVal_value" :style="firstBar"></div>
          </div>
          <div class="titleVal">
            <span>{{ consensusClient }}</span>
          </div>
        </div>
        <div class="p2pBarCont">
          <div class="p2pVal">
            <div class="p2pVal_value" :style="secondBar"></div>
          </div>
          <div class="titleVal">
            <span>{{ executionClient }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="firstVlaueType">
      <span>{{ consensusNumPeer }}</span>
    </div>
    <div class="secondVlaueType">
      <span>{{ executionNumPeer }}</span>
    </div>
    <div class="arrowBox">
      <div class="arrowUp" @click="nextPage">
        <img
          src="../../../../public/img/icon/control/arrowIcon.png"
          alt="arrow"
        />
      </div>
      <div class="pageNumber">
        <span>{{ pageNumber }}</span>
      </div>
      <div class="arrowDown" @click="backPage">
        <img
          src="../../../../public/img/icon/control/arrowIcon.png"
          alt="arrow"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { useControlStore } from "../../../store/theControl";
export default {
  data() {
    return {
      pageNumber: 1,
    };
  },
  computed: {
    firstBar() {
      return { height: this.consensusValPeer + "%" };
    },
    secondBar() {
      return { height: this.executionValPeer + "%" };
    },
    ...mapState(useControlStore, {
      consensusClient: "consensusClient",
      consensusNumPeer: "consensusNumPeer",
      consensusValPeer: "consensusValPeer",
      executionClient: "executionClient",
      executionNumPeer: "executionNumPeer",
      executionValPeer: "executionValPeer",
    }),
  },
  methods: {
    nextPage() {
      if (this.pageNumber >= 99) {
        this.pageNumber = 99;
      } else {
        this.pageNumber++;
      }
    },
    backPage() {
      if (this.pageNumber <= 1) {
        this.pageNumber = 1;
      } else {
        this.pageNumber--;
      }
    },
  },
};
</script>
<style scoped>
.pageNumber {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 70%;
  width: 98%;
  height: 30%;
}
.arrowBox {
  width: 6%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.arrowUp,
.arrowDown {
  height: 30%;
  justify-content: center;
  align-items: center;
  display: flex;
  cursor: pointer;
}
.arrowDown img {
  transform: rotate(180deg);
}
.p2pBarBox {
  width: 70%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.titleVal {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 5%;
  font-size: 60%;
  font-weight: 600;
  color: #c1c1c1;
}
.peer2peerParent {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
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
  width: 90%;
  height: 100%;
  display: flex;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
}
.p2pIco {
  box-sizing: border-box;
  width: 37%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
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
  width: 60%;
}

.p2pBarCont {
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 90%;
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
.firstVlaueType {
  position: absolute;
  top: 15%;
  left: 42%;
  font-size: 1.5rem;
  font-weight: bold;
  text-shadow: 2px 2px 0 rgb(37, 75, 54);
  color: #c1c1c1;
  display: flex;
  width: 7%;
  justify-content: center;
  align-items: center;
}
.secondVlaueType {
  position: absolute;
  top: 15%;
  left: 72%;
  font-size: 1.5rem;
  font-weight: bold;
  text-shadow: 2px 2px 0 rgb(37, 75, 54);
  color: #c1c1c1;
  display: flex;
  width: 7%;
  justify-content: center;
  align-items: center;
}
</style>
