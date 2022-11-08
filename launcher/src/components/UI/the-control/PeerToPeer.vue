<template>
  <div class="peer2peerParent">
    <div class="p2pBox">
      <div class="p2pIco">
        <div class="p2pIco-container">
          <img src="../../../../public/img/icon/control/PeerToPeerIcon.svg" />
        </div>
        <span>PEER NETWORK</span>
      </div>
      <div class="p2pBarBox">
        <div class="p2pBarCont">
          <div class="titleVal">
            <span>{{ consensusClient }}</span>
          </div>
          <div class="p2pVal">
            <div class="p2pVal_value" :style="firstBar"></div>
          </div>
          <div class="valNo">
            <span>{{ consensusNumPeer }}</span>
          </div>
        </div>
        <div class="p2pBarCont">
          <div class="titleVal">
            <span>{{ executionClient }}</span>
          </div>
          <div class="p2pVal">
            <div class="p2pVal_value" :style="secondBar"></div>
          </div>
          <div class="valNo">
            <span>{{ executionNumPeer }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="arrowBox" v-if="isMultiService">
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
      isMultiService: true,
    };
  },
  computed: {
    firstBar() {
      return { width: this.consensusValPeer + "%" };
    },
    secondBar() {
      return { width: this.executionValPeer + "%" };
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
.valNo {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 65%;
  font-weight: 800;
  width: 12%;
  height: 100%;
  color: #c1c1c1;
}
.pageNumber {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 70%;
  width: 98%;
  height: 30%;
  color: #c1c1c1;
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
  width: 60%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  overflow-y: auto;
}
.titleVal {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 30%;
  height: 100%;
  font-size: 50%;
  font-weight: 500;
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
  justify-content: flex-start;
  align-items: center;
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
  font-size: 50%;
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
  width: 70%;
  height: 90%;
}

.p2pBarCont {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 40%;
}
.p2pVal {
  width: 55%;
  height: 80%;
  background: #33393e;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
}
.p2pVal_value {
  background: #568d50;
  height: 98%;
}
/* width */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  border: 1px solid #343434;
  background: rgb(42, 42, 42);
  box-sizing: border-box;
  box-shadow: 1px 1px 10px 1px rgb(23, 23, 23);
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #324b3f;
  border-radius: 10px;
}
</style>
