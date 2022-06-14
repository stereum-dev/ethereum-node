<template>
  <div class="config-node">
    <div class="edit-btn">
      <router-link to="/node">
        <span>NODE</span>
        <img
          src="../../../../public/img/icon/manage-node-icons/undo1.png"
          alt="icon"
        />
      </router-link>
    </div>
    <div class="config-row">
      <div class="row-content" v-for="(item, index) in configData" :key="index">
        <div v-if="item.network == 'testNet'" class="testnet-icon">
          <img src="../../../../public/img/icon/mainnetIcon.png" alt="icon" />
        </div>
        <div v-else class="testnet-icon">
          <img src="../../../../public/img/icon/testnetIcon.png" alt="" />
        </div>
        <span>Ethereum-Mainnet</span>
      </div>
    </div>
    <div class="config-bg">
      <div class="config-btns">
        <div class="config-add" @click="$emit('modalPreset')">
          <span class="btn-text">ADD 1 CLICK PRESET</span>
          <span class="btn-icon"></span>
        </div>
        <div class="config-network">
          <span class="btn-text">CHANGE NETWORK</span>
          <span class="btn-icon"></span>
        </div>
        <div class="config-priority">
          <span class="btn-text">ADD PRIORITY</span>
          <span class="btn-icon"></span>
        </div>
      </div>
      <div class="delete-box">
        <div class="delete-btn" @click="openRemoveModal">
          <span class="btn-text">DELETE CONFIGS</span>
          <img
            src="../../../../public/img/icon/manage-node-icons/bin.png"
            alt="icon"
          />
        </div>
      </div>
      <div class="remove-modal-parent" v-if="removeModal">
        <div class="modal-opacity"></div>
        <div class="remove-modal-content">
          <div class="title-box">
            <img
              src="../../../../public/img/icon/manage-node-icons/stop-violence.png"
              alt=""
            />
          </div>
          <div class="remove-message">
            <span>All the plugins will be removed.</span>
            <span>Are you sure?</span>
          </div>
          <div class="remove-btn">
            <div class="yes-box" @click="removeConfirmation">
              <span>Yes</span>
            </div>
            <div class="cancel-box" @click="cancelRemove">
              <span>Cancel</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapWritableState } from "pinia";
import { useNodeHeader } from "@/store/nodeHeader";
import ControlService from "@/store/ControlService";
import { useNodeManage } from "../../../store/nodeManage";
export default {
  data() {
    return {
      modalActive: false,
      removeModal: false,
      removeIsConfirmed: false,
    };
  },
  computed: {
    ...mapWritableState(useNodeHeader, {
      configData: "getConfigData",
      runningServices: "runningServices",
      configData_nodeSidebarVideo: "configData_nodeSidebarVideo",
    }),
    ...mapWritableState(useNodeManage, {
      consensusItems: "consensusItems",
      executionItems: "executionItems",
      validatorItems: "validatorItems",
      servicePlugins: "servicePlugins",
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
      this.removeModal = true;
    },
    cancelRemove() {
      this.removeModal = false;
    },
    removeConfirmation() {
      this.removeModal = false;
      this.removeIsConfirmed = true;
      this.removeAllPlugins();
      this.destroyNode();
      
    },
    removeAllPlugins() {
      if (this.removeIsConfirmed) {
        this.runningServices = [];
        this.servicePlugins = [];
        this.consensusItems = [];
        this.executionItems = [];
        this.validatorItems = [];
      }
      this.removeIsConfirmed = false;
    },
    destroyNode: async function () {
      console.log(await ControlService.destroy());
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
  grid-template-rows: 6% 9% 70%;
  grid-template-columns: repeat(6, 1fr);
  justify-content: center;
  align-items: center;
}
.config-bg {
  grid-column: 1/7;
  grid-row: 3/6;
  width: 95%;
  height: 98%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(9, 1fr);
  background-color: #606060;
  border-radius: 27px;
  margin: 0 auto;
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
  grid-row: 1/4;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 10px;
}
.config-btns .config-add,
.config-btns .config-network,
.config-btns .config-priority {
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
.config-btns .config-add:hover,
.config-btns .config-network:hover,
.config-btns .config-priority:hover {
  background-color: #2c2c2c;
  transform: scale(1.02);
}
.config-btns .config-add:active,
.config-btns .config-network:active,
.config-btns .config-priority:active {
  box-shadow: none;
  transform: scale(1);
}
.delete-box {
  grid-column: 1/6;
  grid-row: 8;
  display: flex;
  justify-content: center;
  align-items: center;
}
.edit-btn {
  grid-column: 3/7;
  grid-row: 1;
  width: 74%;
  height: 90%;
  border: 1px solid rgb(64, 89, 75);
  justify-self: end;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2c4030;
  box-shadow: 0 1px 2px 1px rgb(46, 45, 45);
}
.edit-btn:hover {
  box-shadow: none;
  background-color: #1e2920;
}
.edit-btn:active {
  box-shadow: none;
  border: 1px solid #131413;
}
.edit-btn a {
  width: 100%;
  height: 100%;
  text-decoration: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1px;
}
.edit-btn span {
  color: rgb(249, 187, 73);
  font-size: 0.7rem;
  font-weight: 800;
  text-align: center;
  margin-left: 10px;
}
.edit-btn img {
  width: 18px;
  height: 18px;
  background-color: transparent;
  margin-right: 10px;
}
.delete-box .delete-btn {
  width: 90%;
  height: 32px;
  border: 1px solid #656565;
  border-radius: 8px;
  box-shadow: 0 1px 4px #373737;
  background-color: #303030;
  cursor: pointer;
  outline-style: none;
  color: #d25353;
  font-size: 0.7rem;
  font-weight: 800;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.btn-text {
  margin-left: 10px;
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
  color: #ef5252;
  box-shadow: none;
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
.modal-opacity {
  width: 100%;
  height: 100%;
  background-color: black;
  position: fixed;
  left: 0;
  top: 0;
  opacity: 0.7;
  z-index: 98;
}
.remove-modal-content {
  width: 50%;
  height: 40%;
  border-radius: 1rem;
  background-color: #324844;
  border: 4px solid rgb(171, 170, 170);
  z-index: 99;
  opacity: 1;
  position: fixed;
  top: 30%;
  left: 25%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-shadow: 1px 1px 5px 1px rgb(6, 6, 6);
}
.remove-message {
  width: 90%;
  height: 40%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.remove-message span {
  color: rgb(195, 195, 195);
  font-size: 1.3rem;
  font-weight: 800;
}
.remove-btn {
  width: 80%;
  height: 30%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.yes-box {
  width: 20%;
  height: 50%;
  border-radius: 30px;
  border: 3px solid #8f8f8f;
  background-color: #32564d;
  box-shadow: 0 1px 3px 1px rgb(35, 59, 53);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;
  color: rgb(210, 210, 210);
}
.cancel-box {
  width: 20%;
  height: 50%;
  border-radius: 30px;
  border: 3px solid #8f8f8f;
  background-color: #32564d;
  box-shadow: 0 1px 3px 1px rgb(35, 59, 53);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  font-weight: 700;
  color: rgb(201, 97, 97);
}
.cancel-box:hover {
  color: rgb(240, 82, 82);
  background-color: #2c433d;
  transform: scale(1.1);
  transition: all 100ms;
}
.yes-box:hover {
  color: #dadada;
  background-color: #2c433d;
  transform: scale(1.1);
  transition: all 100ms;
}
.cancel-box:active {
  color: #dadada;
  font-size: 1rem;
  transform: scale(1);
  box-shadow: none;
}
.yes-box:active {
  font-size: 1rem;
  transform: scale(1);
  box-shadow: none;
}
.title-box {
  width: 80%;
  height: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.title-box img {
  width: 40px;
  height: 40px;
  margin-top: 10px;
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
