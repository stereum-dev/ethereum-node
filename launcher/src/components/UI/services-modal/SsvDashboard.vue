<template>
  <div class="pubkey-parent" @click="$emit('openPubkey')">
    <div class="pubkey-box">
      <div class="pub-key">
        <span class="input-text">{{ $t("registerSSV.pubKey") }}</span>
        <input v-model="localpubkey" type="hidden" class="pubkey-input" disabled :placeholder="`${$t('serviceModal.pubKey')}`" />
        <div class="copy-icon" @click="copyPubKey">
          <img src="/img/icon/service-modals-icons/copy.png" alt="icon" />
          <span>copied!</span>
        </div>
      </div>
    </div>
    <div class="browser-box">
      <div class="operator-box">
        <div class="operator-btn">
          <a :href="ssvNetworkUrl.operatorUrl" target="_blank">{{ $t("ssvDashboard.operatorPage") }}</a>
        </div>
      </div>
      <div class="grafana-box">
        <div class="grafana-btn">
          <a :href="ssvNetworkUrl.grafanaDashboardUrl" target="_blank">{{ $t("ssvDashboard.SSVNodeGrafna") }}</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapWritableState } from "pinia";
import { useNodeStore } from "@/store/theNode";
import { useServices } from "@/store/services";
import { useNodeManage } from "@/store/nodeManage";
export default {
  props: {
    operatorData: {
      type: Object,
      required: false,
    },
    pubkey: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      localpubkey: this.pubkey,
    };
  },

  computed: {
    ...mapWritableState(useNodeStore, {
      ssvNetworkUrl: "ssvNetworkUrl",
    }),
    ...mapState(useServices, {
      installedServices: "installedServices",
    }),
    ...mapState(useNodeManage, {
      currentNetwork: "currentNetwork",
    }),
  },
  mounted() {
    this.getURL();
  },

  methods: {
    copyPubKey() {
      let pubkeyToCopy = this.localpubkey;
      navigator.clipboard
        .writeText(pubkeyToCopy)
        .then(() => {
          console.log("copied!");
        })
        .catch(() => {
          console.log(`can't copy`);
        });
    },
    async getURL() {
      const grafana = this.installedServices.find((service) => service.service === "GrafanaService");
      this.ssvNetworkUrl.operatorUrl = `https://${
        ["holesky"].includes(this.currentNetwork.network) ? this.currentNetwork.network + "." : ""
      }explorer.ssv.network/operators/${this.operatorData?.id ? this.operatorData?.id : ""}`;
      this.ssvNetworkUrl.grafanaDashboardUrl = grafana.linkUrl ? grafana.linkUrl + "/d/QNiMrdoVz/node-dashboard?orgId=1" : "";
    },
  },
};
</script>
<style scoped>
.pubkey-parent {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.operator-box,
.pubkey-box,
.grafana-box {
  width: 90%;
  height: 42px;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.pub-key {
  width: 100%;
  height: 65%;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #373737;
  border: 1px solid #c3c3c3;
  box-shadow: 1px 1px 2px 1px rgb(21, 21, 21);
}
.pubkey-input {
  width: 100%;
  height: 100%;
  border-radius: 8px 0 0 8px;
  background-color: rgb(212, 212, 212);
  padding: 0;
  padding-left: 10px;
  font-size: 2rem;
  font-weight: 600;
  color: rgb(51, 129, 239);
}
.input-text {
  width: 94%;
  font-size: 0.9rem;
  padding-left: 30px;
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
  color: #71b1e1;
}
.pub-key .copy-icon {
  justify-self: end;
  width: 5%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.copy-icon img {
  width: 20px;
  height: 20px;
}
.copy-icon:active img {
  transform: scale(0.95);
}
.pub-key .copy-icon:active span {
  display: block;
}
.secret-key .copy-icon:active span {
  display: block;
}

.copy-icon span {
  display: none;
  background-color: transparent;
  color: rgb(96, 150, 120);
  font-size: 0.5rem;
  position: absolute;
  top: -15px;
  right: 0;
}
.browser-box {
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.operator-btn,
.grafana-btn {
  width: 100%;
  height: 85%;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #20a9f8;
  box-shadow: 1px 1px 2px 1px rgb(21, 21, 21);
  transition-duration: 50ms;
  cursor: pointer;
}
.operator-btn a,
.grafana-btn a {
  width: 100%;
  height: 100%;
  text-align: center;
  align-self: center;
  padding-top: 5px;
  font-size: 1rem;
  font-weight: 600;
  color: rgb(57, 57, 57);
  transition-duration: 50ms;
}
.operator-btn:hover,
.grafana-btn:hover {
  background-color: rgb(9, 140, 216);
  border: 1px solid #91caf3;
  border-radius: 10px;
  transition-duration: 100ms;
}
.operator-btn:hover a,
.grafana-btn:hover a {
  color: rgb(222, 222, 222);
}
.operator-btn:active,
.grafana-btn:active {
  box-shadow: 1px 1px 10px 1px #171717 inset !important;
  border: none;
  background-color: rgb(6, 116, 180);
  box-shadow: none;
}
.operator-btn:active a,
.grafana-btn:active a {
  box-shadow: 1px 1px 10px 1px #171717 inset !important;

  color: rgb(222, 222, 222);
}

.pub-key {
  width: 100%;
  height: 85%;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #373737;
  border: 1px solid #c3c3c3;
  box-shadow: 1px 1px 2px 1px rgb(21, 21, 21);
}
.pub-key .copy-icon {
  width: 5%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.copy-icon img {
  width: 20px;
  height: 20px;
}
.copy-icon span {
  position: absolute;
}
.pubkey-input {
  width: 100%;
  height: 100%;
  border-radius: 8px 0 0 8px;
  background-color: rgb(212, 212, 212);
  padding: 0;
  padding-left: 10px;
  font-size: 2rem;
  font-weight: 600;
  color: rgb(51, 129, 239);
}
</style>
