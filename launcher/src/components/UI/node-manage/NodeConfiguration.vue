<template>
  <div class="config-node">
    <div class="router-box">
      <router-link to="/node">
        <div class="home-btn">
          <span>NODE</span>
          <img
            class="home-icon"
            src="/img/icon/manage-node-icons/home1.png"
            alt="icon"
          />
        </div>
      </router-link>
    </div>
    <div class="config-row">
      <div class="row-content" v-for="(item, index) in configData" :key="index">
        <div v-if="item.network == 'testNet'" class="testnet-icon">
          <img src="../../../../public/Img/icon/mainnetIcon.png" alt="icon" />
        </div>
        <div v-else class="testnet-icon">
          <img src="../../../../public/Img/icon/testnetIcon.png" alt="" />
        </div>
        <span>{{ item.id }}#{{ item.name }}</span>
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
            src="../../../../public/Img/icon/manage-node-icons/bin.png"
            alt="icon"
          />
        </div>
      </div>
      <div class="remove-modal-parent" v-if="removeModal">
        <div class="modal-opacity"></div>
        <div class="remove-modal-content">
          <div class="title-box">
            <img
              src="../../../../public/Img/icon/manage-node-icons/stop-violence.png"
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
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      modalActive: false,
      removeModal: false,
      removeIsConfirmed: false,
    };
  },
  computed: {
    ...mapGetters({
      configData: "getConfigData",
      servicePlugins: "getServicePlugins",
      consensusItems: "getConsensusItems",
      executionItems: "getExecutionItems",
      validatorItems: "getValidatorItems",
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
    },
    removeAllPlugins() {
      if (this.removeIsConfirmed) {
        this.servicePlugins.length = 0;
        this.consensusItems.length = 0;
        this.executionItems.length = 0;
        this.validatorItems.length = 0;
      }
    },
  },
};
</script>
<style scoped>
.config-node {
  grid-column: 1;
  width: 93%;
  height: 98.2%;
  padding: 5px;
  background-color: #33393e;
  border-radius: 0 30px 30px 0;
  display: grid;
  grid-template-rows: repeat(12, 1fr);
  grid-template-columns: repeat(6, 1fr);
  justify-content: center;
  align-items: center;
}
.config-bg {
  grid-column: 1/7;
  grid-row: 3/13;
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
  background-color: #303030;
  font-size: 9px;
  font-weight: 900;
  color: rgb(235, 235, 235);
  border: 1px solid #656565;
  margin-top: 5px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  box-shadow: inset 1px 1px 10px 5px #181818, 0 1px 4px #373737;
}
.config-btns .config-add:hover,
.config-btns .config-network:hover,
.config-btns .config-priority:hover,
.router-box .home-btn:hover {
  background-color: #2c2c2c;
  box-shadow: none;
}
.config-btns .config-add:active,
.config-btns .config-network:active,
.config-btns .config-priority:active {
  box-shadow: inset 0 0 5px 1px rgb(82, 81, 81);
}
.delete-box {
  grid-column: 1/6;
  grid-row: 8;
  display: flex;
  justify-content: center;
  align-items: center;
}
.router-box {
  grid-column: 1/7;
  grid-row: 1;
  width: 85%;
  height: 27px;
  border: 1px solid rgb(38, 38, 38);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2c4030;
  margin: 2px auto 6px auto;
  box-shadow: inset 0 1px 5px 0 rgb(155, 155, 155);
}
.router-box:hover {
  box-shadow: none;
}
.router-box a {
  width: 100%;
  height: 100%;
  text-decoration: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1px;
}
.router-box .home-btn {
  width: 100%;
  text-decoration: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.router-box span {
  color: rgb(249, 187, 73);
  font-size: 12px;
  font-weight: 900;
  text-align: center;
  margin-left: 58px;
}
.router-box img {
  width: 16px;
  height: 16px;
  background-color: transparent;
  margin-right: 10px;
}
.delete-box .delete-btn {
  width: 90%;
  height: 32px;
  border: 1px solid #656565;
  border-radius: 8px;
  box-shadow: inset 1px 1px 10px 5px #181818, 0 1px 4px #373737;
  background-color: #303030;
  cursor: pointer;
  outline-style: none;
  color: #f46969;
  font-size: 10px;
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
  box-shadow: inset 0 0 5px 1px rgb(82, 81, 81);
}
.delete-box .delete-btn:active {
  border: 1px solid #f46969;
  color: #ef5252;
  box-shadow: inset 1px 1px 10px 5px #181818;
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
  height: 25px;
  border: 2px solid rgb(118, 194, 226);
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.1rem;
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
  font-size: 14px;
  font-weight: bold;
}
.testnet-icon {
  width: 25px;
  min-width: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.testnet-icon img {
  width: 25px;
  height: 25px;
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
  background-color: #263f3a;
  border: 4px solid rgb(96, 42, 42);
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
  color: rgb(172, 172, 172);
  font-size: 1.5rem;
  font-weight: 900;
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
  border: 2px solid #242622;
  background-color: #384131;
  box-shadow: inset 0 0 8px 2px #1c1f18, 1px 1px 2px 1px rgb(26, 26, 26);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 900;
  color: rgb(210, 210, 210);
}
.cancel-box {
  width: 20%;
  height: 50%;
  border: 2px solid #343434;
  border-radius: 30px;
  background-color: #e8e8e8;
  box-shadow: inset 0 0 8px 2px #525450, 1px 1px 3px 1px rgb(36, 36, 36);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 800;
  color: rgb(201, 97, 97);
}
.cancel-box:hover {
  color: rgb(240, 82, 82);
  box-shadow: inset 0 0 8px 2px #1c1f18;
}
.yes-box:hover {
  color: #fff;
  background-color: #384131;
  box-shadow: inset 0 0 8px 2px #1c1f18;
}
.cancel-box:active {
  color: #fff;
  font-size: 1rem;
  background-color: #802a2a;
  box-shadow: none;
}
.yes-box:active {
  font-size: 1rem;
  background-color: #384131;
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
  width: 50px;
  height: 50px;
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
