<template>
  <div class="dashboard-parent">
    <GenerateKeyModal v-if="generateModalShow" />
    <div class="management-title">server access management</div>
    <div class="management-info">
      <div class="management-info_box">
        <div class="management-info_box_row">
          <span>SERVER NAME</span><span>{{ selectedConnection.name }}</span>
        </div>
        <div class="management-info_box_row">
          <span>IP or HOSTNAME</span><span>{{ ipAddress }}</span>
        </div>
        <div class="management-info_box_row">
          <span>USERNAME</span><span>{{ selectedConnection.user }}</span>
        </div>
      </div>
      <div class="management-info_box">
        <div class="management-info_box_row">
          <span>MACHINENAME</span><span>{{ ServerName }}</span>
        </div>
        <div class="management-info_box_row">
          <span>PORT</span><span>{{ selectedConnection.port }}</span>
        </div>
        <div class="management-info_box_row" />
      </div>
    </div>
    <div class="login-info-box">
      <div class="login-info-box_info-part">
        <div class="helf-part left">
          <div class="half-part_row">
            <span>PASSWORD</span>
            <div class="btn-part"><div class="login-info-btn">CHANGE PASSWORD</div></div>
          </div>
          <div class="half-part_row">
            <span>SSH Key</span>
            <div class="btn-part">
              <div class="login-info-btn" @click="generateModal">create a new key</div>
              <div class="login-info-btn">add an existing key</div>
            </div>
          </div>
        </div>
      </div>
      <div class="key-info-part">
        <div v-for="(key, index) in keys" :key="index" class="key-row">
          <div class="name">{{ key }}</div>
          <div class="btn-box">
            <KeyRowBtn @delete-key="confirmDelete(key)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapWritableState } from "pinia";
import { useControlStore } from "@/store/theControl";
import ControlService from "@/store/ControlService";
import KeyRowBtn from "./KeyRowBtn.vue";
import GenerateKeyModal from "./GenerateKeyModal";
export default {
  components: { KeyRowBtn, GenerateKeyModal },
  data() {
    return {
      selectedConnection: {},
      keys: ["key 1", "key 2", "key 3"],
    };
  },
  computed: {
    ...mapWritableState(useControlStore, {
      ServerName: "ServerName",
      ipAddress: "ipAddress",
      generateModalShow: "generateModalShow",
    }),
    passSSHRow() {
      return !this.selectedConnection.useAuthKey ? "pass" : "ssh";
    },
  },
  mounted() {
    this.loadStoredConnections();
  },
  methods: {
    loadStoredConnections: async function () {
      const savedConnections = await ControlService.readConfig();
      let selectedConnection = savedConnections.savedConnections.find((item) => item.host === this.ipAddress);
      this.selectedConnection = selectedConnection;
    },
    confirmDelete(key) {
      console.log(key);
    },
    generateModal() {
      this.generateModalShow = !this.generateModalShow;
    },
  },
};
</script>

<style scoped>
.dashboard-parent {
  width: 100vw;
  height: 94.5vh;
  background-color: #33393e;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 49;
  border-radius: 10px;
  border: 5px solid #c1c1c1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
}
.management-title {
  width: 85%;
  height: 14%;
  color: #eee;
  text-transform: uppercase;
  font-size: 300%;
  font-weight: 600;
  display: flex;
  border-bottom: 1px solid #c1c1c1;
  justify-content: flex-start;
  align-items: center;
  padding-left: 2%;
}
.management-info {
  width: 95%;
  height: 25%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #c1c1c1;
}
.management-info_box {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.management-info_box_row {
  width: 100%;
  height: 33%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2%;
  color: #eee;
}
.management-info_box_row span {
  width: 50%;
}
.management-info_box_row > span:nth-child(1) {
  font-size: 150%;
}
.login-info-box {
  width: 95%;
  height: 58%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
}
.login-info-box_info-part {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  height: 25%;
}

.helf-part {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
}

.half-part_row {
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2%;
  color: #eee;
}
.pass {
  height: 50%;
}
.ssh {
  height: 100%;
}
.half-part_row span {
  width: 50%;
}
.half-part_row > span:nth-child(1) {
  font-size: 150%;
}

.btn-part {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.login-info-btn {
  width: 48.5%;
  height: 60%;
  color: #eee;
  font-size: 60%;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 15px;
  background: #336666;
  text-transform: uppercase;
  box-shadow: 1px 1px 5px 1px rgb(45, 44, 44);
}
.login-info-btn:hover {
  background: #35a835;
}
.login-info-btn:active {
  background: rgba(51, 102, 102, 0.6);
  border: none;
  box-shadow: none;
  transform: scale(0.98);
}
.key-info-part {
  width: 100%;
  height: 75%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  background: #242529;
  border: 1px solid grey;
  box-shadow: 1px 1px 6px 1px #001717;
  border-radius: 10px;
}
.key-row {
  width: 95%;
  height: 12%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 2%;
  color: #eee;
  background: #33393e;
  margin-top: 1%;
  border-radius: 5px;
  border: 1px solid #707070;
  box-shadow: 1px 1px 6px 1px #1d2525;
}
.btn-box {
  width: 7%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}
</style>
