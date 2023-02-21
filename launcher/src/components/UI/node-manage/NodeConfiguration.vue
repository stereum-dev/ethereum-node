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
    <div class="config-bg">
      <div class="config-btns">
        <div class="edit-btn">
          <router-link to="/node">
            <span>{{ $t("modifyPanel.backNode") }}</span>
            <img
              src="../../../../public/img/icon/manage-node-icons/undo1.png"
              alt="icon"
            />
          </router-link>
        </div>
      </div>
      <div class="delete-box">
        <div class="delete-btn" @click.stop="openRemoveModal">
          <span class="btn-text">{{ $t("modifyPanel.nukeNode") }}</span>
          <img
            src="../../../../public/img/icon/manage-node-icons/nuke.png"
            alt="icon"
          />
        </div>
      </div>
      <remove-modal
        v-if="removeServicesModal"
        @close-me="closeRemoveModal"
        @remove-items="removeConfirmation"
      ></remove-modal>
    </div>
  </div>
</template>
<script>
import { mapWritableState, mapState } from "pinia";
import { useNodeHeader } from "@/store/nodeHeader";
import { useNodeStore } from "@/store/theNode";
import ControlService from "@/store/ControlService";
import { useServices } from "@/store/services";
import { useNodeManage } from "../../../store/nodeManage";
import { useControlStore } from "../../../store/theControl";
import { useStakingStore } from "../../../store/theStaking";
import RemoveModal from "./RemoveModal.vue";
export default {
  components: { RemoveModal },
  data() {
    return {
      modalActive: false,
      removeServicesModal: false,
      removeIsConfirmed: false,
      notSure: true,
    };
  },
  computed: {
    ...mapWritableState(useNodeHeader, {
      headerServices: "runningServices",
      refresh: "refresh",
    }),
    ...mapWritableState(useServices, {
      installedServices: "installedServices",
      runningServices: "runningServices",
      versions: "versions",
    }),
    ...mapWritableState(useNodeManage, {
      newConfiguration: "newConfiguration",
    }),
    ...mapState(useControlStore, {
      ServerName: "ServerName",
      ipAddress: "ipAddress",
    }),
    ...mapWritableState(useStakingStore, {
      keys: "keys",
      forceRefresh: "forceRefresh",
    }),
  },
  methods: {
    openModal() {
      this.modalActive = true;
    },
    closeModal() {
      this.modalActive = false;
    },
    openRemoveModal() {
      this.removeServicesModal = true;
    },
    closeRemoveModal() {
      this.removeServicesModal = false;
    },
    removeConfirmation() {
      // this.refresh = false; //stop refreshing
      // this.removeServicesModal = false;
      // this.removeIsConfirmed = true;
      // this.destroyNode();
      this.notSure = false;
    },
    removeAllPlugins() {
      if (this.removeIsConfirmed) {
        this.forceRefresh = true;
        this.keys = [];
        this.versions = {};
        this.headerServices = [];
        this.runningServices = [];
        this.installedServices = [];
        this.newConfiguration = [];
      }
      this.removeIsConfirmed = false;
    },
    destroyNode: async function () {
      console.log(await ControlService.destroy());
      this.refresh = true;
      this.removeAllPlugins();
      this.$router.push("/");
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
  border-right: 2px solid #242529b4;
  grid-template-rows: repeat(9, 1fr);
  grid-template-columns: 1fr;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  transition-duration: 500ms;
}
.config-bg {
  grid-column: 1;
  grid-row: 3/10;
  width: 95%;
  height: 96%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(9, 1fr);
  background-color: #606060;
  border-radius: 10px;
  margin: 0 auto;
  box-shadow: 1px 1px 3px 1px #282727;
  border: 1px solid #4c4848;
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
  box-shadow: 1px 1px 3px 1px #282727;
  border: 1px solid #4c4848;
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
.config-box .config-title {
  grid-column: 2/7;
  grid-row: 1;
  margin-left: 20px;
}
.config-title span {
  font-size: 8px;
  font-weight: bold;
  background-color: #334b3f;
  border: 1px solid rgb(169, 168, 168);
  padding: 4px 5px;
  border-radius: 8px;
  box-shadow: 1px 1px 5px 2px rgb(69, 68, 68);
}

.config-btns {
  grid-column: 1/6;
  grid-row: 1/5;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.edit-btn a:hover {
  background-color: #18191c;
}
.edit-btn a:active {
  box-shadow: none;
  transform: scale(0.99);
}
.edit-btn {
  width: 95%;
  height: 23.5%;
  margin-top: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
}
.edit-btn a {
  width: 100%;
  height: 100%;
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
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
}
.edit-btn span {
  color: #408886;
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
  pointer-events: none;
}
.delete-box {
  grid-column: 1/6;
  grid-row: 8/9;
  width: 95%;
  height: 100%;
  margin-top: 3%;
  display: flex;
  justify-content: center;
  align-items: center;
  justify-self: center;
}
.delete-box .delete-btn {
  width: 100%;
  height: 100%;
  border: 1px solid #828282;
  border-radius: 8px;
  box-shadow: 0 1px 4px #373737;
  background-color: #242529;
  cursor: pointer;
  outline-style: none;
  color: #c52e2e;
  font-size: 0.7rem;
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.btn-text {
  margin-left: 20px;
}
.router-box .btn-text {
  text-decoration: none;
  color: #4eb051;
}
.delete-box .delete-btn:hover {
  background-color: #2c2c2c;
  transform: scale(1.02);
}
.delete-box .delete-btn:active {
  transform: scale(1);
  border: 1px solid #f46969;
  color: #ff1f1f;
  box-shadow: none;
}
.delete-btn img {
  width: 24px;
  height: 24px;
  margin-right: 5px;
  pointer-events: none;
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
  pointer-events: none;
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
  pointer-events: none;
}

.title-box {
  width: 80%;
  height: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.title-box img {
  width: 70px;
  height: 70px;
  margin-top: 10px;
  pointer-events: none;
}

::-webkit-scrollbar {
  width: 1px;
}

::-webkit-scrollbar-thumb {
  background-color: rgb(160, 160, 160);
  border-radius: 50px;
}
::-webkit-scrollbar-track {
  background-color: transparent;
  margin: 10px;
}
</style>
