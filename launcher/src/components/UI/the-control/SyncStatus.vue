<template>
  <div class="Sync-parent">
    <div class="sync-box">
      <div class="sync-icon">
        <div class="sync-icon_container">
          <img :src="syncSituation()" />
        </div>
        <span>SYNC STATUS</span>
      </div>
      <div class="sync-box_value">
        <div v-show="syncItemsShow" v-for="item in syncstatus.data" :key="item.id" class="sync-box_row">
          <div class="sync-box-row_title">
            <span>{{ item.title }}</span>
          </div>
          <div class="sync-box-row_val">
            <span>{{ item.frstVal }} / {{ item.scndVal }}</span>
          </div>
        </div>
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
      syncItemsShow: false,
      syncIcoUnknown: true,
      syncIcoSituation: false,
      syncIcoError: false,
      prysm: "",
      geth: "",
      lighthaouse: "",
      teko: "",
      syncIco: [
        {
          id: 1,
          name: "error",
          icon: "/img/icon/arrows/SynchronisationIconError.gif",
        },
        {
          id: 2,
          name: "active",
          icon: "/img/icon/arrows/SynchronisationIconActive.gif",
        },
        {
          id: 3,
          name: "synched",
          icon: "/img/icon/arrows/SynchronisationIconSynchronized.gif",
        },
        {
          id: 4,
          name: "unknown",
          icon: "/img/icon/arrows/SynchronisationIconUnknown.gif",
        },
      ],
      // syncStatusItems are dummy, for wire the have to change but the best stract. for the design is this one
    };
  },
  updated() {
    this.syncControler();
  },
  computed: {
    ...mapState(useControlStore, {
      code: "code",
      syncstatus: "syncstatus",
    }),
    errorIco() {
      return this.syncIco[0].icon;
    },
    activeIco() {
      return this.syncIco[1].icon;
    },
    synchedIco() {
      return this.syncIco[2].icon;
    },
    unknownIco() {
      return this.syncIco[3].icon;
    },
  },
  methods: {
    syncSituation() {
      if(this.syncIcoUnknown){
        return this.unknownIco;
      }
      if(this.syncIcoError){
        return this.errorIco;
      }
      if(this.syncIcoSituation){
        return this.activeIco;
      }
      return this.synchedIco;
    },
    syncControler() {
      let syncItemsShow = false;
      let syncIcoUnknown = true;
      let syncIcoError = false;
      let syncIcoSituation = false;
      let pooi = [];
      console.log("uopdate");
      if(this.code === 0 && this.syncstatus.code === 0 && Array.isArray(this.syncstatus.data) && this.syncstatus.data[0].hasOwnProperty("title")){
        console.log("xxxxx",this.code,this.syncstatus.code);
        syncItemsShow = true;
        syncIcoUnknown = false;
        for (let k in this.syncstatus.data) {
          let lo = parseInt(this.syncstatus.data[k].frstVal);
          let hi = parseInt(this.syncstatus.data[k].scndVal);
          let st = this.syncstatus.data[k].state;
          pooi[k] = pooi[k] || lo > hi ? true : false;
          if (!hi || !lo) {
            syncIcoError = true;
            break;
          } else if (lo < hi) {
            syncIcoSituation = true;
            continue; // fix #794
          }
        }
        // fix: keep client values zero if prometheus is out of info ("pooi") on node start
        let all = 0;
        for (let k in pooi) {
          if (pooi[k]) {
            this.syncstatus.data[k].frstVal = 0;
            this.syncstatus.data[k].scndVal = 0;
            all++;
          }
        }
        if(all == this.syncstatus.data.length){
          syncIcoUnknown = true;
        }
      }
      this.syncItemsShow = syncItemsShow;
      this.syncIcoUnknown = syncIcoUnknown;
      this.syncIcoError = syncIcoError;
      this.syncIcoSituation = syncIcoSituation;
    },
  },
};
</script>
<style scoped>
.Sync-parent {
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
}
.sync-box {
  width: 100%;
  height: 100%;
  display: flex;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
}
.sync-icon {
  box-sizing: border-box;
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.sync-icon span {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50%;
  color: #c1c1c1;
  font-weight: bold;
}
.sync-icon_container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 75%;
}
.sync-icon_container img {
  width: 60%;
}
.sync-box_value {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 70%;
  height: 95%;
  flex-direction: column;
  overflow-y: auto;
  color: #c1c1c1;
}
.sync-box_row {
  display: flex;
  width: 90%;
  height: 23%;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #c1c1c1;
  border-radius: 5px;
  padding: 2% 2%;
  margin: 1% 0;
}
.sync-box-row_title {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35%;
  font-weight: 600;
  font-size: 50%;
}
.sync-box-row_val {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 65%;
  font-weight: 400;
  font-size: 50%;
  color: #94deff;
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
