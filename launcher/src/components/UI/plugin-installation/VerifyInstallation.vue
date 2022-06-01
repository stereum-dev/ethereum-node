<template>
  <div class="verify-parent">
    <background-page>
      <div class="opacity-bg"></div>
      <div class="verify-modal-parent">
        <div class="verify-modal">
          <div class="verify-box">
            <div class="verify-title-box">
              <div class="verify-title">
                <span>VERIFY & INSTALL</span>
              </div>
            </div>
          </div>
          <div class="content-box">
            <div class="table-box">
              <div class="table">
                <div class="table-header">
                  <span>NAME</span>
                  <span>CATEGORY</span>
                  <span>PATH</span>
                </div>
                <div class="table-content">
                  <div
                    class="table-row"
                    v-for="(plugin, index) in selectedPreset.includedPlugins"
                    :key="index"
                  >
                    <div class="plugin-name">
                      <img :src="plugin.icon" alt="icon" />
                      <span>{{ plugin.name }}</span>
                    </div>
                    <div class="category">
                      <span>{{ plugin.category }}</span>
                    </div>
                    <div class="path">
                      <span>{{ installationPath + plugin.path }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="btn-box">
            <router-link :to="{ path: '/install' }">
              <button class="back-btn">BACK</button>
            </router-link>
            <router-link :to="{ path: '/node' }">
              <button @click="runInstalltion" class="next-btn">INSTALL</button>
            </router-link>
          </div>
        </div>
      </div>
    </background-page>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import ControlService from '@/store/ControlService'
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      selectedPreset: "getSelectedPreset",
      installationPath: "getInstallationPath",
      pluginServices: "getServiceIcons",
    }),
  },
  mounted() {
    if (Object.keys(this.selectedPreset).length === 0) {
      this.$router.push("/clickinstall");
    }
  },
  methods: {
    runInstalltion: async function(){
      console.log(await ControlService.prepareOneClickInstallation(this.installationPath));
      let services = await ControlService.writeOneClickConfiguration();
      console.log(await ControlService.startOneClickServices());
      let grafana = services.find(service => service.service.includes('Grafana'))
      let grafanaStats = this.pluginServices.find(e => e.name === 'grafana')
      let freePort = await ControlService.getAvailablePort({min: grafanaStats.minPort, max: grafanaStats.maxPort})
      await ControlService.openTunnels([{dstPort: grafana.ports[0].split(":")[2], localPort: freePort}])
      grafanaStats.linkUrl = 'http://localhost:' + freePort
      this.$store.commit("updateRunningServices", [grafanaStats]);
    }
  }
};
</script>
<style scoped>
.verify-parent {
  display: flex;
  justify-content: center;
  align-items: center;
}
.opacity-bg {
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0);
  position: fixed;
  left: 0;
  top: 0;
  opacity: 0.7;
  z-index: 1;
}
.verify-modal-parent {
  width: 80%;
  height: 75%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 11.2%;
  left: 10%;
  z-index: 2;
}
.verify-modal {
  width: 70%;
  height: 95%;
  border: 1px solid rgba(38, 38, 38, 0.5);
  border-radius: 20px;
  background-color: #334b3e;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.verify-box {
  width: 95%;
  height: 20%;
  margin-top: 5px;
  background-color: #8e8e8e;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 1px 4px 1px rgb(31, 47, 43);
}
.verify-title-box {
  width: 96%;
  height: 80%;
  border-radius: 15px;
  background-color: #5b5b5b;
  display: flex;
  justify-content: center;
  align-items: center;
}
.verify-title-box span {
  font-size: 2rem;
  font-weight: 900;
  color: #d7d7d7;
}

.content-box {
  width: 95%;
  height: 53%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.table-box {
  width: 100%;
  height: 99%;
  background-color: #5b5b5b;
  border-radius: 15px;
  box-shadow: 0 1px 4px 1px rgb(31, 47, 43);
  display: flex;
  justify-content: center;
  align-items: center;
}
.table-box .table {
  width: 100%;
  height: 100%;
  border: 9px solid #8e8e8e;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.table .table-header {
  width: 90%;
  height: 10%;
  margin-top: 10px;
  /* background-color: #334b3e; */
  background-color: #336666;
  display: grid;
  grid-template-columns: 32% 32% 36%;
  align-items: center;
}
.table .table-header span:first-child {
  width: 100%;
  color: rgb(213, 213, 213);
  font-size: 0.7rem;
  font-weight: 600;
  padding-left: 15px;
  text-align: left;
}
.table .table-header span {
  width: 100%;
  color: #d5d5d5;
  font-size: 0.7rem;
  font-weight: 600;
  text-align: left;
}
.table .table-content {
  width: 95%;
  height: 85%;
  border-top: 1px solid #8e8e8e;
  margin-top: 10px;
  display: grid;
  grid-template-columns: 100%;
  align-items: center;
  overflow-x: hidden;
  overflow-y: auto;
}
.table-content::-webkit-scrollbar {
  width: 1px;
}

.table-content .table-row {
  width: 95%;
  height: 31px;
  margin-top: 5px;
  background-color: #33393e;
  box-shadow: 0 1px 3px 1px rgb(37, 37, 37);
  border: 1px solid rgb(81, 80, 80);
  border-radius: 10px;
  justify-self: center;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  cursor: pointer;
}

.table-row .plugin-name {
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.plugin-name img {
  width: 14%;
  height: 65%;
}

.plugin-name span {
  width: 90%;
  height: 56%;
  color: #929292;
  font-size: 0.8rem;
  font-weight: 600;
  margin-left: 10px;
}

.category {
  width: 30%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.path {
  width: 35%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.table-row .category span {
  width: 100%;
  height: 100%;
  color: #4f9a71;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
}
.table-row .path span {
  width: 100%;
  height: 100%;
  color: #a9a064;
  font-size: 0.7rem;
  font-weight: 500;
  text-align: left;
}

.btn-box {
  width: 95%;
  height: 12%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.btn-box a {
  width: 95%;
  height: 90%;
  text-decoration: none;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.next-btn,
.back-btn {
  width: 55%;
  height: 60%;
  border: 2px solid rgb(125, 125, 125);
  border-radius: 20px;
  background-color: #336666;
  color: #fff;
  outline-style: none;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 1px 2px 1px rgb(49, 61, 54);
  cursor: pointer;
}
.next-btn:hover,
.back-btn:hover {
  background-color: #1a3535;
  box-shadow: 0 1px 4px 1px rgb(60, 60, 60);
}
.next-btn:active,
.back-btn:active {
  box-shadow: inset 1px 1px 5px 1px rgb(28, 36, 28);
  font-size: 0.8rem;
}
</style>
