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
        <div class="delete-btn" @click="removeAllPlugins">
          <span class="btn-text">DELETE CONFIGS</span>
          <img
            src="../../../../public/Img/icon/manage-node-icons/bin.png"
            alt="icon"
          />
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
    removeAllPlugins() {
      this.servicePlugins.length = 0;
      this.consensusItems.length = 0;
      this.executionItems.length = 0;
      this.validatorItems.length = 0;
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
