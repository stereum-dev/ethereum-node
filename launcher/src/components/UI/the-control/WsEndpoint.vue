<template>
  <div class="ws-parent">
    <control-dialog :open="openDialog">
      <div class="dialogBox">
        <div class="dialogIcon"><img :src="dialogIcon" /></div>
        <div class="dialogMessage uppercase">
          <span>{{ dialogValue }}</span>
        </div>
      </div>
    </control-dialog>
    <div v-if="showData && filteredWSItems.length > 0" class="ws-box">
      <!-- removed node-connection-row template start -->
      <div class="rowParent">
        <div class="title">
          <span>{{ $t("controlPage.ws") }}</span>
        </div>
        <div class="btn" :class="{ active: isActive }" @click="toggle">
          <span>{{ onoff }}</span>
          <img v-show="!toggleAllowed" class="bttnLoading" :src="bttnLoading" />
        </div>
      </div>
      <!-- removed node-connection-row template end -->
      <div class="scrollable">
        <div v-for="item in filteredWSItems" :key="item.id" ref="clone" class="ws-data" @click="copy(item.value, item.title)">
          <span>{{ item.title }}</span>
        </div>
      </div>
    </div>
    <div v-if="showData && filteredWSItems.length > 0" class="compTtl" :class="{ active: isActive }">
      <span>{{ copyVal }}</span>
    </div>
    <div v-if="!showData || filteredWSItems.length === 0" class="spinner">
      <img src="/animation/loading/mushroom-spinner.gif" alt="loading" />
    </div>
  </div>
</template>

<script>
import ControlService from "@/store/ControlService";
import { mapWritableState, mapState } from "pinia";
import { useControlStore } from "@/store/theControl";
import { useNodeHeader } from "@/store/nodeHeader";
import ControlDialog from "./ControlDialog.vue";
import { useSetups } from "@/store/setups";
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
      copyIcon: "/img/icon/control-page-icons/ok.png",
      infoIcon: "/img/icon/control-page-icons/info.png",
      bttnLoading: "/animation/loading/loading-dots.gif",
      wsItems: [],
      dialogIcon: "",
      copyText: this.$t("dataAPIAndRPC.copy"),
      closedText: this.$t("dataAPIAndRPC.closed"),
    };
  },

  computed: {
    ...mapWritableState(useControlStore, {
      code: "code",
      wsstatus: "wsstatus",
    }),
    ...mapWritableState(useNodeHeader, {
      wsState: "wsState",
    }),
    ...mapState(useSetups, {
      selectedSetup: "selectedSetup",
    }),
    onoff() {
      if (!this.toggleAllowed) return "";
      return this.isActive ? "ON" : "OFF";
    },
    filteredWSItems() {
      if (this.selectedSetup && Array.isArray(this.selectedSetup.services)) {
        const serviceIds = this.selectedSetup.services.map((service) => service?.config?.serviceID);
        return this.wsItems.filter((item) => serviceIds.includes(item.id));
      }
      return [];
    },
  },
  watch: {
    isActive(newVal) {
      if (newVal === true) {
        this.wsState = true;
      } else {
        this.wsState = false;
      }
    },
  },
  mounted() {
    this.wsControler();
  },
  methods: {
    async copy(s, t) {
      if (!this.toggleAllowed) return;
      if (!s) {
        this.dialogValue = this.$t("dataAPIAndRPC.WSTurnOnMessage");
        this.openDialog = true;
        this.dialogIcon = this.infoIcon;
      } else {
        await navigator.clipboard.writeText(s);
        this.openDialog = !this.openDialog;
        this.dialogValue = t + " " + this.$t("dataAPIAndRPC.WSCopiedMessage");
        this.dialogIcon = this.copyIcon;
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
          await this.wsControler();
        } else {
          this.wsControler();
        }
        return;
      }
      this.refreshId = setTimeout(async () => {
        if (async) {
          await this.wsControler();
        } else {
          this.wsControler();
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
          result = await ControlService.openWsTunnel();
        } else {
          result = await ControlService.closeWsTunnel();
        }
      } catch (e) {
        console.log(e);
      }
      this.wsstatus = result.data;
      await this.refresh(true, true);
      this.toggleAllowed = true;
    },
    async wsControler() {
      let isActive = false;
      let wsItems = [];
      let wsItemsHashBefore = this.createHashByKey(this.wsItems, "id");
      if (this.code === 0 && this.wsstatus.code === 0) {
        for (let i = 0; i < this.wsstatus.data.length; i++) {
          if (this.wsstatus.data[i].now < this.lastKnownMts) {
            //console.log("---------------> DENY OUTDATED WS STATUS!");
            this.refresh();
            return;
          }
          this.lastKnownMts = this.wsstatus.data[i].now;
          wsItems.push({
            id: this.wsstatus.data[i].sid,
            title: this.wsstatus.data[i].clt,
            value: this.wsstatus.data[i].url,
          });
          isActive = this.wsstatus.data[i].url ? true : isActive;
        }
      }
      let wsItemsHashAfter = this.createHashByKey(wsItems, "id");
      this.isActive = isActive;
      this.copyVal = isActive ? this.copyText : this.closedText;
      this.wsItems = wsItems;
      if (wsItemsHashBefore != wsItemsHashAfter) {
        //console.log("WS TUNNELS NEED TO BE REFRESHED BECAUSE LIST OF CLIENTS CHANGED");
        this.toggle(true);
        return;
      }
      this.showData = wsItems.length > 0 ? true : false;
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

.ws-parent {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  border: 1px solid #343434;
  background: rgb(42, 42, 42);
  box-sizing: border-box;
  width: 35%;
  box-shadow: 1px 1px 10px 1px #171717;
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
  font-size: 70%;
  color: #eee;
}

.ws-box {
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

.ws-data {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 98%;
  height: 27%;
  margin: 2% 0;
  padding: 8%;
  font-size: 50%;
  border: 1px solid #707070;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
}
.ws-data:hover {
  background: #707070;
  color: #eee;
  border: 1px solid #707070;
}

.ws-data:active {
  background: rgba(112, 112, 112, 0.6);
  color: #eee;
  border: 1px solid #707070;
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
  color: greenyellow !important;
}

.copyactiv {
  color: greenyellow;
}

.title {
  display: flex;
  width: 70%;
  font-size: 43%;
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
  background: rgb(42, 42, 42);
}
</style>
