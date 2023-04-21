<template>
  <installation-box :title="title" :back="back" :icon="configClients.icon" @execute-installation="runInstalltion">
    <div class="verify-parent">
      <div class="content-box">
        <div class="table-box">
          <div class="table">
            <div class="table-header">
              <span>{{ $t("verifyInstallation.name") }}</span>
              <span>{{ $t("verifyInstallation.cat") }}</span>
              <span>{{ $t("verifyInstallation.path") }}</span>
            </div>
            <div class="table-content">
              <div v-for="(plugin, index) in configClients" :key="index" class="table-row">
                <div class="pluginName">
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
    </div>
  </installation-box>
</template>
<script>
import InstallationBox from "./InstallationBox.vue";
export default {
  components: {
    InstallationBox,
  },
  data() {
    return {
    //   configClients: [
    //     {
    //       name: "Besu",
    //       icon: require("../../../../public/img/icon/plugin-icons/consensus/Teku.png"),
    //       category: "config",
    //       path: "/besu",
    //       installed: false,
    //     },
    //     {
    //       name: "Mevboos",
    //       icon: require("../../../../public/img/icon/plugin-icons/consensus/Teku.png"),
    //       category: "config",
    //       path: "/mevboos",
    //       installed: false,
    //     },
    //     {
    //       name: "Lighthouse",
    //       icon: require("../../../../public/img/icon/plugin-icons/consensus/Teku.png"),
    //       category: "config",
    //       path: "/lighthouse",
    //       installed: false,
    //     },
    //     {
    //       name: "Stereum",
    //       icon: require("../../../../public/img/icon/plugin-icons/consensus/Teku.png"),
    //       category: "config",
    //       path: "/stereum",
    //       installed: false,
    //     },
    //   ],
      installationPath: "/apt/Stereum",
      back: "upload",
      title: "verify & install",
      next: "play",
    };
  },
  computed: {},
  mounted() {},
  methods: {},
};
</script>
<style scoped>
.verify-parent {
  grid-column: 2/5;
  grid-row: 3/4;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.content-box {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 10px;
  background-color: #2d3134;
  border: 3px solid #b4b4b4;
  border-radius: 20px;
  position: relative;
  box-shadow: 0 1px 3px 1px rgb(25, 33, 32);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.table-box {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.table-box .table {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.table .table-header {
  width: 97%;
  height: 10%;
  margin-top: 2px;
  background-color: #336666;
  border-radius: 5px;
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
  width: 100%;
  height: 90%;
  margin-top: 5px;
  padding: 10px;
  /* background: #1f2328;
  border-radius: 15px;
  border: 1px solid #4c5962; */
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
  width: 100%;
  height: 39px;
  margin-top: 2px;
  border-radius: 5px;
  border: 1px solid rgb(86, 90, 95);
  background-color: #41464a;
  box-shadow: 0 1px 5px 1px rgb(21, 23, 23);
  justify-self: center;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  cursor: pointer;
}

.table-row .pluginName {
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pluginName img {
  width: 15%;
  height: 65%;
}

.pluginName span {
  width: 90%;
  height: 56%;
  color: #929292;
  font-size: 0.8rem;
  font-weight: 600;
  margin-left: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btnBox {
  width: 10%;
  height: fit-content;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  position: absolute;
  right: 11%;
  bottom: 6%;
  z-index: 1;
}

.install {
  height: 40px;
  min-width: 120px;
  border-radius: 40px;
  border: 3px solid #929292;
  background-color: #194747;
  font-size: 1.2rem;
  font-weight: 700;
  color: rgb(191, 191, 191);
  box-shadow: 0 1px 3px 1px rgb(41, 61, 51);
  outline-style: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
.install:hover {
  background-color: rgb(31, 48, 43);
  box-shadow: 0 1px 3px 0 rgb(21, 31, 26);
}
.install:active {
  box-shadow: inset 1px 1px 3px 1px rgb(14, 19, 17);
}
</style>
