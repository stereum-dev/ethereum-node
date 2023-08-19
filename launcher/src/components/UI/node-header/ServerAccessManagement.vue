<template>
  <div class="dashboard-parent">
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
  </div>
</template>

<script>
import { mapState } from "pinia";
import { useControlStore } from "@/store/theControl";
import ControlService from "@/store/ControlService";
export default {
  data() {
    return {
      selectedConnection: {},
    };
  },
  computed: {
    ...mapState(useControlStore, {
      ServerName: "ServerName",
      ipAddress: "ipAddress",
    }),
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
  },
};
</script>

<style scoped>
.dashboard-parent {
  width: 100vw;
  height: 94.5vh;
  background-color: #383838;
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
  height: 30%;
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
</style>
