<template>
  <div class="rpc-parent">
    <control-dialog :open="openDialog"
      ><div class="dialogBox">
        <div class="dialogIcon"><img :src="copyIcon" /></div>
        <div class="dialogMessage">
          <span>{{ dialogValue }}</span>
        </div>
      </div></control-dialog
    >
    <div v-show="showData" class="rpc-box">
      <!-- removed node-connection-row template start -->
      <div class="rowParent">
        <div class="title">
          <span>RPC-ENDPOINT</span>
        </div>
        <div class="btn" :class="{ active: isActive }" @click="toggle">
          <span>{{ onoff }}</span>
        </div>
      </div>
      <!-- removed node-connection-row template end -->
      <div
        class="rpc-data"
        v-for="item in rpcItems"
        :key="item.id"
        ref="clone"
        @click="copy(item.value, item.title)"
      >
        <span>{{ item.title }}</span>
      </div>
    </div>
    <div v-show="showData" class="compTtl">
      <span>{{ copyVal }}</span>
    </div>
    <div v-show="!showData" class="spinner">
      <img src="../../../../public/img/icon/control/spinner.gif" alt="loading" />
    </div>
  </div>
</template>
<script>
import ControlService from "@/store/ControlService";
import { mapState } from "pinia";
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
      copyVal: "click to copy",
      openDialog: false,
      dialogValue: "",
      copyIcon: "/img/icon/control/ok.png",
      rpcItems: [
        {
          id: 1,
          title: "DUMMY",
          value: "123456",
        },
      ],
    };
  },
  created() {
    this.rpcControler();
  },
  computed: {
    ...mapState(useControlStore, {
      code: "code",
      rpcstatus: "rpcstatus",
    }),
    onoff() {
      return this.isActive ? "ON" : "OFF";
    },
  },
  methods: {
    async copy(s, t) {
      if (!s) {
        this.dialogValue = "Please turn ON the RPC tunnel first!";
        this.openDialog = true;
      } else {
        await navigator.clipboard.writeText(s);
        this.openDialog = !this.openDialog;
        this.dialogValue = t + " RPC-URL copied to clipboard!";
      }
      if (this.openDialog === true) {
        setTimeout(() => {
          this.openDialog = false;
        }, 3000);
      }
    },
    async toggle() {
      if (!this.showData) return;
      if (!this.toggleAllowed) return;
      this.toggleAllowed = false;
      let isActive = this.isActive ? false : true;
      let result;
      try {
        if (isActive) {
          const localPorts = await ControlService.getAvailablePort({
            min: 8545,
            max: 8999,
            amount: 1,
          });
          result = await ControlService.openRpcTunnel({
            force_local_port: localPorts.pop(),
          });
        } else {
          result = await ControlService.closeRpcTunnel();
        }
      } catch (e) {
        console.log(e);
      }
      this.rpcstatus.data.url = result.data.url;
      this.isActive = !result || result.code ? this.isActive : isActive;
      this.copyVal = this.isActive ? "click to copy" : "tunnel closed";
      this.rpcItems[0].value = this.rpcstatus.data.url;
      this.toggleAllowed = true;
    },
    rpcControler() {
      this.isActive = false;
      this.showData = false;
      if (this.code === 0 && this.rpcstatus.code === 0) {
        this.rpcItems[0].title = this.rpcstatus.data.clt;
        this.rpcItems[0].value = this.rpcstatus.data.url;
        this.isActive = this.rpcstatus.data.url ? true : false;
        this.copyVal = this.isActive ? "click to copy" : "tunnel closed";
        this.showData = true;
        return;
      }
      if (this.waitForData) clearTimeout(this.waitForData);
      this.waitForData = setTimeout(() => {
        this.rpcControler();
      }, 250);
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
.rpc-parent {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  border: 1px solid #343434;
  background: rgb(42, 42, 42);
  box-sizing: border-box;
  width: 38%;
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
  font-weight: 600;
  font-size: 90%;
}
.rpc-box {
  width: 100%;
  height: 75%;
  display: flex;
  flex-direction: column;
}
.compTtl {
  display: flex;
  width: 100%;
  height: 20%;
  font-size: 50%;
  justify-content: center;
  align-items: center;
}
.rpc-data {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 98%;
  height: 27%;
  margin: 2% 0;
  padding: 2%;
  font-size: 55%;
  border: 1px solid #707070;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
}
.rpc-data:hover,
.rpc-data:active {
  /* color: rgb(246, 250, 141);
  font-weight: 800;
  background: #313131; */
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
  width: 100%;
  height: 35%;
  border-radius: 10px;
  margin: 1% 0;
}
.active {
  color: greenyellow !important;
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
  font-size: 50%;
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
