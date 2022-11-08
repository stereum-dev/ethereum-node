<template>
  <div class="Sync-parent">
    <div class="sync-box">
      <div class="sync-icon">
        <div class="sync-icon_container">
          <img :src="syncSituation()" />
        </div>
        <span>{{ $t("controlPage.syncStatus") }}</span>
      </div>
      <div class="sync-box_value">
        <div
          v-show="syncItemsShow"
          v-for="item in syncstatus.data"
          :key="item.id"
          class="sync-box_row"
          :class="syncItemSytle(item)"
        >
          <div class="sync-box-row_title">
            <span>{{ item.title }}</span>
          </div>
          <div class="sync-box-row_val">
            <span>{{ item.frstVal }} / {{ item.scndVal }}</span>
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
      isMultiService: true,
      pageNumber: 1,
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
    syncItemSytle(item) {
      item = JSON.parse(JSON.stringify(item)); // toRaw()
      if (!item.hasOwnProperty("style")) {
        return "";
      }
      return item.style;
    },
    syncSituation() {
      if (this.syncIcoError) {
        return this.errorIco;
      }
      if (this.syncIcoUnknown) {
        return this.unknownIco;
      }
      if (this.syncIcoSituation) {
        return this.activeIco;
      }
      return this.synchedIco;
    },
    syncControler() {
      let syncItemsShow = false;
      let syncIcoUnknown = true;
      let syncIcoError = false;
      let syncIcoSituation = false;
      let fonts = {
        red: [], // client error (for example docker container not running) - icon red
        orange: [], // abnormal client data during init (for example: lowerslot > higherslot) - icon unknown
        grey: [], // zero client data: lowerslot and higherslot are zero (usually the case while the EC waits for the CC to go in sync)
        blue: [], // client not in-sync, thus currently synchronizing
        green: [], // client in-sync, thus synchronized
      };
      if (
        this.code === 0 &&
        this.syncstatus.code === 0 &&
        Array.isArray(this.syncstatus.data) &&
        this.syncstatus.data[0].hasOwnProperty("title")
      ) {
        syncItemsShow = true;
        syncIcoUnknown = false;
        for (let k in this.syncstatus.data) {
          let lo = parseInt(this.syncstatus.data[k].frstVal);
          let hi = parseInt(this.syncstatus.data[k].scndVal);
          let st = this.syncstatus.data[k].state;
          if (st != "running") {
            fonts.red.push(k);
            syncIcoError = true;
            continue;
          }
          if (lo > hi) {
            fonts.orange.push(k);
            syncIcoUnknown = true;
            continue;
          }
          if (lo < 1 && hi < 1) {
            fonts.grey.push(k);
            syncIcoSituation = true;
            continue;
          }
          if (lo < hi) {
            fonts.blue.push(k);
            syncIcoSituation = true;
            continue;
          }
          fonts.green.push(k);
        }
        if (
          fonts.grey.length &&
          fonts.grey.length == this.syncstatus.data.length
        ) {
          syncIcoUnknown = true; // all clients 0/0 -> show unknown icon
        }
        for (let col in fonts) {
          if (fonts[col].length) {
            for (let i = 0; i < fonts[col].length; i++) {
              let k = fonts[col][i];
              // let ct = this.syncstatus.data[k].type;
              // console.log(ct + " client (" + this.syncstatus.data[k].title + ") needs color " + col + " by class: client" + col + "!)");
              this.syncstatus.data[k].style = "client" + col;
            }
          }
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
.Sync-parent {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: flex-start;
  box-sizing: border-box;
  height: 100%;
}
.sync-box {
  width: 90%;
  height: 100%;
  display: flex;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
}
.sync-icon {
  box-sizing: border-box;
  width: 31%;
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
  font-size: 43%;
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
  width: 69%;
  height: 95%;
  flex-direction: column;
  overflow-y: auto;
  color: #c1c1c1;
  overflow-y: auto;
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

/* Client font colors */
.clientred * {
  color: rgb(248, 67, 67);
}
.clientorange * {
  color: darkorange;
}
.clientgrey * {
  color: grey;
}
.clientblue * {
  color: lightblue;
}
.clientgreen * {
  color: rgb(0, 190, 0);
}
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
