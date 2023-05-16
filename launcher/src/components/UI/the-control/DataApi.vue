<template>
  <div class="dataApi-parent">
    <control-dialog :open="openDialog"
      ><div class="dialogBox">
        <div class="dialogIcon"><img :src="dialogIcon" /></div>
        <div class="dialogMessage">
          <span>{{ dialogValue }}</span>
        </div>
      </div></control-dialog
    >
    <div v-show="showData" class="dataApi-box">
      <!-- removed node-connection-row template start -->
      <div class="rowParent">
        <div class="title">
          <span>DATA-API</span>
        </div>
        <div class="btn" :class="{ active: isActive }" @click="toggle">
          <span>{{ onoff }}</span>
          <img v-show="!toggleAllowed" class="bttnLoading" :src="bttnLoading" />
        </div>
      </div>
      <!-- removed node-connection-row template end -->
      <div class="scrollable">
        <div
          v-for="item in dataApiItems"
          :key="item.id"
          ref="clone"
          class="dataApi-data"
          @click="copy(item.value, item.title)"
        >
          <span>{{ item.title }}</span>
        </div>
      </div>
    </div>
    <div v-show="showData" class="compTtl" :class="{ active: isActive }">
      <span>{{ copyVal }}</span>
    </div>
    <div v-show="!showData" class="spinner">
      <img src="../../../../public/img/icon/control/spinner.gif" alt="" />
    </div>
  </div>
</template>
<script>
import ControlService from "@/store/ControlService";
import { mapWritableState } from "pinia";
import { useControlStore } from "../../../store/theControl";
import ControlDialog from "./ControlDialog.vue";
export default {
  components: { ControlDialog },
  data() {
    return {
      waitForData: null,
      toggleAllowed: true,
      showData: false,
      isActive: false,
      refreshId: undefined,
      lastKnownMts: 0.0,
      copyVal: "click to copy",
      openDialog: false,
      dialogValue: "",
      copyIcon: "/img/icon/control/ok.png",
      infoIcon: "/img/icon/control/info.png",
      bttnLoading: "/img/icon/control/loading.gif",
      dataApiItems: [],
      dialogIcon: "",
      copyText: this.$t("dataAPIAndRPC.copy"),
      closedText: this.$t("dataAPIAndRPC.closed"),
    };
  },

  computed: {
    ...mapWritableState(useControlStore, {
      code: "code",
      beaconstatus: "beaconstatus",
    }),
    onoff() {
      if (!this.toggleAllowed) return "";
      return this.isActive ? "ON" : "OFF";
    },
  },
  created() {
    this.beaconControler();
  },
  methods: {
    async copy(s, t) {
      if (!this.toggleAllowed) return;
      if (!s) {
        this.dialogValue = this.$t("dataAPIAndRPC.turnOnMessage");
        this.dialogIcon = this.infoIcon;
        this.openDialog = true;
      } else {
        await navigator.clipboard.writeText(s);
        this.openDialog = !this.openDialog;
        this.dialogIcon = this.copyIcon;
        this.dialogValue = t + " " + this.$t("dataAPIAndRPC.copiedMessage");
      }
      if (this.openDialog === true) {
        setTimeout(() => {
          this.openDialog = false;
        }, 3000);
      }
    },
    async refresh(timeout = 3000, async = false) {
      let instant = isNaN(timeout) ? true : false;
      if (this.refreshId) {
        clearTimeout(this.refreshId);
        this.refreshId = undefined;
      }
      if (instant) {
        if (async) {
          await this.beaconControler();
        } else {
          this.beaconControler();
        }
        return;
      }
      this.refreshId = setTimeout(async () => {
        if (async) {
          await this.beaconControler();
        } else {
          this.beaconControler();
        }
      }, timeout);
    },
    clearRefresh() {
      if (this.refreshId) {
        clearTimeout(this.refreshId);
        this.refreshId = undefined;
      }
    },
    createHashByKey(arr, key = null) {
      let hash = "";
      if (Array.isArray(arr) && arr.length > 0 && typeof key === "string" && key != "") {
        arr.sort((a, b) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0));
        for (let i = 0; i < arr.length; i++) {
          hash += arr[i].hasOwnProperty(key) ? arr[i][key] : "";
        }
      }
      return hash;
    },
    async toggle(clientListChanged = null) {
      if (clientListChanged !== true) {
        if (!this.showData) return;
        if (!this.toggleAllowed) return;
      }
      this.toggleAllowed = false;
      this.clearRefresh();
      let isActive = clientListChanged === true ? this.isActive : this.isActive ? false : true;
      let result = {
        code: 9999,
        info: "error: unknown issue on toggling tunnels",
        data: "",
      };
      try {
        if (isActive) {
          result = await ControlService.openBeaconTunnel();
        } else {
          result = await ControlService.closeBeaconTunnel();
        }
      } catch (e) {
        console.log(e);
      }
      this.beaconstatus = result.data;
      await this.refresh(true, true);
      this.toggleAllowed = true;
    },
    async beaconControler() {
      let isActive = false;
      let dataApiItems = [];
      let dataApiItemsHashBefore = this.createHashByKey(this.dataApiItems, "id");
      if (this.code === 0 && this.beaconstatus.code === 0) {
        for (let i = 0; i < this.beaconstatus.data.length; i++) {
          if (this.beaconstatus.data[i].now < this.lastKnownMts) {
            //console.log("---------------> DENY OUTDATED BEACON STATUS!");
            this.refresh();
            return;
          }
          this.lastKnownMts = this.beaconstatus.data[i].now;
          dataApiItems.push({
            id: this.beaconstatus.data[i].sid,
            title: this.beaconstatus.data[i].clt,
            value: this.beaconstatus.data[i].url,
          });
          isActive = this.beaconstatus.data[i].url ? true : isActive;
        }
      }
      let dataApiItemsHashAfter = this.createHashByKey(dataApiItems, "id");
      this.isActive = isActive;
      this.copyVal = isActive ? this.copyText : this.closedText;
      this.dataApiItems = dataApiItems;
      if (dataApiItemsHashBefore != dataApiItemsHashAfter) {
        //console.log("BEACON TUNNELS NEED TO BE REFRESHED BECAUSE LIST OF CLIENTS CHANGED");
        this.toggle(true);
        return;
      }
      this.showData = dataApiItems.length > 0 ? true : false;
      this.refresh();
    },
  },
};
</script>
<style scoped>
.spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
.spinner img {
  width: 80%;
}
.dataApi-parent {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  border: 1px solid #343434;
  background: rgb(42, 42, 42);
  box-sizing: border-box;
  box-shadow: 1px 1px 10px 1px #171717;
  width: 35%;
  height: 95%;
  border-radius: 10px;
  flex-direction: column;
  color: #c1c1c1;
  position: relative;
}

.dialogBox {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: flex-start;
  align-items: center;
  font-weight: 600;
}
.dialogIcon {
  display: flex;
  height: 100%;
  width: 20%;
  justify-content: center;
  align-items: center;
}
.dialogIcon img {
  width: 50%;
}
.dialogMessage {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 80%;
  height: 100%;
  font-weight: 500;
  font-size: 65%;
  color: #eee;
}

.dataApi-box {
  width: 100%;
  height: 75%;
  display: flex;
  flex-direction: column;
}
.scrollable {
  width: 100%;
  padding-left: 4%;
  padding-right: 2%;
  height: 75%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
.bttnLoading {
  width: 50%;
}
.compTtl {
  display: flex;
  width: 100%;
  height: 20%;
  font-size: 50%;
  justify-content: center;
  align-items: center;
}
.dataApi-data {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 98%;
  height: 27%;
  margin: 2% 0;
  padding: 8%;
  font-size: 60%;
  border: 1px solid #707070;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
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

/* ON/OFF */
.rowParent {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 97%;
  height: 35%;
  border-radius: 10px;
  margin: 1% 0;
}
.active {
  color: #adff2f !important;
}
.title {
  display: flex;
  width: 70%;
  font-size: 48%;
  justify-content: flex-start;
  align-items: center;
  margin: 0 4%;
  font-weight: 600;
}
.btn {
  display: flex;
  width: 30%;
  font-size: 60%;
  font-weight: 800;
  padding: 0 1px;
  border-radius: 5px;
  cursor: pointer;
  color: #eee;
  justify-content: center;
  align-items: center;
  height: 90%;
  border: 1px solid #343434;
  background: #2a2a2a;
}
</style>
