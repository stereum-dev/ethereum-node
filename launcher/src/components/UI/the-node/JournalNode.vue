<template>
  <div class="config-node">
    <div class="server">
      <div class="serverBox">
        <div class="details">
          <span class="ipTitle">{{ $t("journalnode.serverip") }}</span>
          <span class="nameTitle">{{ $t("journalnode.servername") }}</span>
          <span class="ip">{{ ipAddress }}</span>
          <span class="name">{{ ServerName }}</span>
        </div>
      </div>
    </div>
    <div class="configBtn" v-if="!openLog">
      <div class="edit-btn">
        <router-link to="/manage">
          <span>{{ $t("journalnode.edit") }}</span>
          <img
            src="../../../../public/img/icon/node-journal-icons/edit-node.png"
            alt="icon"
          />
        </router-link>
      </div>
      <div class="state-btn-loading" v-if="isloading">
        <span>loading new states</span>
        <img src="/img/icon/plugin-menu-icons/turning_circle.gif" alt="icon" />
      </div>
      <div
        class="state-btn-on"
        v-else-if="checkStatus()"
        @click="stateButtonHandler('started')"
      >
        <span>Turn Node on</span>
        <img
          src="../../../../public/img/icon/node-journal-icons/turn_on.png"
          alt="icon"
        />
      </div>
      <div class="state-btn-off" v-else @click="stateButtonHandler('stopped')">
        <span>Turn Node off</span>
        <img
          src="../../../../public/img/icon/node-journal-icons/power2.png"
          alt="icon"
        />
      </div>
      <div class="state-btn-log" @click="logToggle">
        <span>Open Logs...</span>
        <img
          src="../../../../public/img/icon/node-journal-icons/logs_icon.svg"
          alt="icon"
        />
      </div>
    </div>
    <div class="configBtn" v-else></div>
  </div>
</template>
<script>
import ControlService from "@/store/ControlService";
import UpdateTable from "./UpdateTable.vue";
import { mapState } from "pinia";
import { useControlStore } from "../../../store/theControl";
import { useServices } from "../../../store/services";

export default {
  components: { UpdateTable },
  data() {
    return {
      loading: false,
      updateTableIsOpen: false,
      openLog: false,
    };
  },
  computed: {
    logToggle() {
      this.openLog = !this.openLog;
    },

    isloading: {
      // getter
      get: function () {
        return this.loading ? true : false;
      },
      // setter
      set: function (newValue) {
        this.loading = newValue;
      },
    },
    ...mapState(useServices, {
      installedServices: "installedServices",
    }),
    ...mapState(useControlStore, {
      ServerName: "ServerName",
      ipAddress: "ipAddress",
    }),
  },
  methods: {
    checkStatus() {
      return !this.installedServices.some((s) => s.state == "running");
    },
    async stateButtonHandler(state) {
      this.loading = true;
      try {
        let promises = this.installedServices.map(async (service, index) => {
          new Promise((resolve) => setTimeout(resolve, index * 1000)).then(
            () => {
              ControlService.manageServiceState({
                id: service.config.serviceID,
                state: state,
              });
            }
          );
        });
        promises.push(
          new Promise((resolve) =>
            setTimeout(() => {
              this.loading = false;
              resolve();
            }, promises.length * (state == "running" ? 8000 : 4000))
          )
        );
        Promise.all(promises);
      } catch (err) {
        console.log(state.replace("ed", "ing") + " services failed:\n", err);
      }
    },
  },
};
</script>
<style scoped>
.config-node {
  grid-column: 1;
  width: 100%;
  height: 100%;
  padding: 5px;
  margin-top: 1px;
  display: grid;
  background: #33393e;
  grid-template-rows: repeat(9, 1fr);
  grid-template-columns: 1fr;
  justify-content: center;
  align-items: center;
}

.server {
  grid-column: 1;
  grid-row: 1/3;
  width: 100%;
  height: 100%;
  padding: 20px 5px 10px 5px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.serverBox {
  width: 100%;
  height: 95%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2d3134;
  border-radius: 10px;
}
.server .details {
  width: 95%;
  height: 85%;
  border-radius: 8px;
  display: grid;
  grid-template-columns: 40% 60%;
  grid-template-rows: repeat(6, 1fr);
}

.server .ipTitle {
  grid-column: 1/2;
  grid-row: 2/4;
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 0.6rem;
  font-weight: 500;
  color: #c4c4c4;
  text-transform: uppercase;
  border-radius: 5px;
  padding: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
  align-self: flex-end;
  text-align: left;
}
.server .nameTitle {
  grid-column: 1/2;
  grid-row: 4/6;
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 0.6rem;
  font-weight: 500;
  color: #c4c4c4;
  text-transform: uppercase;
  border-radius: 5px;
  padding: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
  align-self: flex-end;
  text-align: left;
}
.server .name {
  grid-column: 2/3;
  grid-row: 4/6;
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 0.6rem;
  font-weight: 700;
  color: #cfaf65;
  text-transform: uppercase;
  border-radius: 5px;
  padding: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
  align-self: center;
}
.server .ip {
  grid-column: 2/3;
  grid-row: 2/4;
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 0.7rem;
  font-weight: 700;
  color: #cfaf65;
  text-transform: uppercase;
  border-radius: 5px;
  padding: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
  align-self: center;
}
.configBtn {
  grid-column: 1;
  grid-row: 3/10;
  width: 95%;
  height: 96%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(8, 1fr);
  background-color: #606060;
  border-radius: 10px;
  margin: 0 auto;
}

.edit-btn {
  grid-column: 1;
  grid-row: 1/2;
  width: 95%;
  height: 80%;
  margin-top: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  justify-self: center;
}
.edit-btn a:hover {
  background-color: #18191c;
}
.edit-btn a:active {
  box-shadow: none;
  transform: scale(0.99);
}
.edit-btn a {
  width: 100%;
  height: 99%;
  background-color: #242529;
  font-size: 0.6rem;
  font-weight: 800;
  color: rgb(194, 194, 194);
  border: 1px solid #787878;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 1px 3px 1px #2c2c2c;
}
.edit-btn span {
  color: #cfaf65;
  font-size: 0.7rem;
  font-weight: 800;
  text-align: center;
  margin-left: 10px;
  text-transform: uppercase;
}
.edit-btn img {
  width: 30px;
  height: 30px;
  background-color: transparent;
  margin-right: 10px;
}

.btn-text {
  margin-left: 10px;
}
.router-box .btn-text {
  text-decoration: none;
  color: #4eb051;
}
.state-btn-on {
  grid-column: 1;
  grid-row: 2/3;
  width: 95%;
  height: 80%;
  padding: 0 10px;
  margin-top: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  justify-self: center;
  background-color: #242529;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  color: rgb(64, 238, 29);
  border: 1px solid #787878;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 1px 3px 1px #2c2c2c;
}
.state-btn-off {
  grid-column: 1;
  grid-row: 2/3;
  width: 95%;
  height: 80%;
  padding: 0 10px;
  margin-top: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  justify-self: center;
  background-color: #242529;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  color: rgb(220, 10, 3);
  border: 1px solid #787878;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 1px 3px 1px #2c2c2c;
}
.state-btn-log {
  grid-column: 1;
  grid-row: 3/4;
  width: 95%;
  height: 80%;
  padding: 0 10px;
  margin-top: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  justify-self: center;
  background-color: #242529;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #c1c1c1;
  border: 1px solid #787878;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 1px 3px 1px #2c2c2c;
}
.state-btn-loading {
  grid-column: 1;
  grid-row: 2/3;
  width: 95%;
  height: 80%;
  padding: 0 10px;
  margin-top: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  justify-self: center;
  background-color: #242529;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #9b9b9b;
  border: 1px solid #787878;
  border-radius: 8px;
  cursor: default;
  box-shadow: 0 1px 3px 1px #2c2c2c;
}
.state-btn-log img {
  width: 15%;
  margin-right: 3%;
}
.state-btn-loading img,
.state-btn-on img,
.state-btn-off img {
  width: 10%;
  margin-right: 5%;
}
.state-btn:hover {
  background-color: #18191c;
}
.state-btn:active {
  box-shadow: none;
  transform: scale(0.99);
}
</style>
