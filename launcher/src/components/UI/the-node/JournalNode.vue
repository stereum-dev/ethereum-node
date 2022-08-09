<template>
  <div class="config-node">
    <div class="server">
      <span class="title">Server</span>
      <div class="server-details">
        <span class="ip">{{ ipAddress }}</span>
        <span class="name">{{ ServerName }}</span>
      </div>
    </div>
    <div class="config-bg">
      <div class="edit-btn">
        <router-link to="/manage">
          <span>to edit node</span>
          <img
            src="../../../../public/img/icon/node-journal-icons/maintenance3.png"
            alt="icon"
          />
        </router-link>
      </div>
      <div class="config-btns">
        <div class="config-update" @click="openUpdateTableHandler">
          <span class="btn-text">UPDATES</span>
          <img
            alt="update-icon"
            src="/img/icon/header-icons/update-green.png"
          />
        </div>
        <update-table v-if="updateTableIsOpen">
          <div
            class="tableRow"
            v-for="(item, index) in newUpdates"
            :key="index"
          >
            <div class="serviceName">
              <span>{{ item.name }}</span>
            </div>
            <div class="version">
              <span>{{ item.version }}</span>
            </div>
            <div v-if="item.running" class="disabledDownloadIcon">
              <img
                src="/img/icon/node-journal-icons/download_disabled.png"
                alt="icon"
              />
            </div>
            <div v-else class="downloadIcon">
              <img
                src="/img/icon/node-journal-icons/download2.png"
                alt="icon"
                @click="runUpdate(item)"
              />
            </div>
          </div>
        </update-table>
      </div>
    </div>
  </div>
</template>
<script>
import ControlService from "@/store/ControlService";
import UpdateTable from "./UpdateTable.vue";
import { mapState } from "pinia";
import { mapWritableState } from "pinia";
import { useServices } from "@/store/services.js";
import { useControlStore } from "../../../store/theControl";
import { useNodeHeader } from "../../../store/nodeHeader";
export default {
  components: { UpdateTable },
  data() {
    return {
      updateTableIsOpen: false,
    };
  },
  computed: {
    ...mapWritableState(useNodeHeader, {
      forceUpdateCheck: "forceUpdateCheck",
    }),
    ...mapWritableState(useServices, {
      newUpdates: "newUpdates",
    }),
    ...mapState(useControlStore, {
      ServerName: "ServerName",
      ipAddress: "ipAddress",
    }),
  },
  methods: {
    async runUpdate(item) {
        item.running = true
        if (item && item.id) {
          await ControlService.updateServices({ service: item.id });
          this.forceUpdateCheck = true
        } else if (item && item.commit) {
          await ControlService.updateStereum({ commit: item.commit });
          this.forceUpdateCheck = true
        }
    },
    openUpdateTableHandler() {
      this.updateTableIsOpen = !this.updateTableIsOpen;
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
  background-color: #3b3b3b;
  grid-template-rows: repeat(9, 1fr);
  grid-template-columns: 1fr;
  justify-content: center;
  align-items: center;
}
.config-bg {
  grid-column: 1;
  grid-row: 3/10;
  width: 95%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(9, 1fr);
  background-color: #606060;
  border-radius: 10px;
  margin: 0 auto;
}
.server {
  grid-column: 1;
  grid-row: 1/3;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.server .title {
  width: max-content;
  height: 15px;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: rgb(138, 138, 138);
  text-transform: uppercase;
  margin-left: 8px;
}
.server-details {
  width: 95%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.server-details span:first-child {
  width: 100%;
  height: 29%;
  text-align: center;
  font-size: 0.7rem;
  font-weight: 600;
  color: #8a8a8a;
  text-transform: uppercase;
  border: 1px solid #a1a1a1;
  margin-top: 2px;
  background-color: rgb(44, 44, 44);
  border-radius: 5px;
  padding: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
}
.server-details span:last-child {
  width: 100%;
  height: 29%;
  text-align: center;
  font-size: 0.7rem;
  font-weight: 600;
  color: #8a8a8a;
  text-transform: uppercase;
  border: 1px solid #a1a1a1;
  margin-top: 2px;
  background-color: rgb(44, 44, 44);
  border-radius: 5px;
  padding: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
}

.config-btns {
  grid-column: 1;
  grid-row: 2/10;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-top: 5px;
}

.config-btns .config-update {
  grid-column: 1;
  grid-row: 2/3;
  width: 90%;
  height: 32px;
  background-color: #292929;
  font-size: 0.7rem;
  font-weight: 700;
  color: rgb(196, 196, 196);
  border: 1px solid #787878;
  margin-top: 5px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 1px 3px 1px #2c2c2c;
}

.config-btns .config-update span {
  width: 50%;
  font-size: 0.8rem;
  font-weight: 700;
  color: rgb(196, 196, 196);
}
.config-btns .config-update img {
  width: 20px;
  height: 17px;
  margin-right: 10px;
}

.config-btns .config-update:hover {
  background-color: #2c2c2c;
  transform: scale(1.02);
}

.config-btns .config-update:active {
  box-shadow: none;
  transform: scale(1);
}

.edit-btn {
  grid-column: 1;
  grid-row: 1/2;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 5px;
}
.edit-btn a:hover {
  background-color: #2c2c2c;
  transform: scale(1.02);
}
.edit-btn a:active {
  box-shadow: none;
  transform: scale(1);
}
.edit-btn a {
  width: 90%;
  height: 32px;
  background-color: #292929;
  font-size: 0.6rem;
  font-weight: 800;
  color: rgb(194, 194, 194);
  border: 1px solid #787878;
  margin-top: 5px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 1px 3px 1px #2c2c2c;
}
.edit-btn span {
  color: rgb(249, 187, 73);
  font-size: 0.7rem;
  font-weight: 800;
  text-align: center;
  margin-left: 10px;
  text-transform: uppercase;
}
.edit-btn img {
  width: 18px;
  height: 18px;
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

.delete-btn img {
  width: 24px;
  height: 24px;
  margin-right: 5px;
}
.btn-icon {
  width: 21px;
  height: 21px;
  border-radius: 5px;
  margin-right: 5px;
}
.btn-icon img {
  width: 21px;
  height: 21px;
}

.config-row {
  grid-column: 1/7;
  grid-row: 2;
  width: 95%;
  height: 30px;
  border: 2px solid rgb(155, 212, 236);
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3px;
  margin: 0 auto;
}

.config-row .row-content {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 25px;
}
.config-row .row-content span {
  width: 80%;
  font-size: 0.7rem;
  font-weight: 700;
}
.testnet-icon {
  width: 20%;
  min-width: 23px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.testnet-icon img {
  width: 23px;
  height: 23px;
}
.remove-modal-parent {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 97;
}
.tableRow {
  width: 99%;
  height: 25px;
  background-color: rgb(36, 35, 35);
  border: 1px solid #787878;
  border-radius: 5px;
  padding: 3px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.serviceName {
  width: 40%;
  height: 25px;
  font-size: 0.7rem;
  font-weight: 600;
  color: #a5a5a5;
  margin-left: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
  text-transform: capitalize;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.version {
  width: 30%;
  height: 25px;
  font-size: 0.7rem;
  font-weight: 600;
  color: #c6ad51;
  margin-left: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
  text-transform: capitalize;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.downloadIcon {
  width: 15%;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.downloadIcon img {
  width: 15px;
  height: 18px;
  cursor: pointer;
}
.disabledDownloadIcon {
  width: 15%;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.disabledDownloadIcon img {
  width: 15px;
  height: 18px;
}
.downloadIcon img:hover {
  transform: scale(1.1);
}
.downloadIcon img:active {
  transform: scale(1);
}
</style>
